import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  templates,
  categoryNames,
  languageInstructions,
  type Template,
  getTemplateName,
  getTemplateDescription,
  getVariableLabel,
  getVariablePlaceholder,
  getOptionLabel
} from './lib/templates';
import { Language, languageNames, translations } from './lib/i18n';
import { getApiUrl } from './lib/auth';

// Page types
type PageType = 'home' | 'workspace';

// ============================================
// Header - 免费版本，无登录
// ============================================
function Header({ 
  lang, 
  onLangChange, 
  onBack, 
  page
}: { 
  lang: Language; 
  onLangChange: (lang: Language) => void;
  onBack?: () => void;
  page: PageType;
}) {
  const t = translations[lang];
  
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-wrap">
          {page !== 'home' && onBack && (
            <button onClick={onBack} className="back-btn">
              ←
            </button>
          )}
          <div className="logo-icon">
            <div className="logo-inner">
              <span className="logo-text">文</span>
            </div>
          </div>
          <div>
            <h1 className="logo-title">{t.title}</h1>
            <p className="logo-subtitle">{t.subtitle}</p>
          </div>
        </div>
        
        <div className="header-right">
          <select 
            value={lang} 
            onChange={(e) => onLangChange(e.target.value as Language)}
            className="lang-select"
          >
            {Object.entries(languageNames).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

// ============================================
// TemplateGrid - 首页模板网格
// ============================================
function TemplateGrid({ lang, onSelect }: { lang: Language; onSelect: (t: Template) => void }) {
  const t = translations[lang];
  
  // 按分类分组
  const groupedTemplates = {
    social: templates.filter(t => t.category === 'social'),
    ecommerce: templates.filter(t => t.category === 'ecommerce'),
    content: templates.filter(t => t.category === 'content'),
  };
  
  const categoryIcons: Record<string, string> = {
    social: '📱',
    ecommerce: '🛒',
    content: '📝'
  };

  return (
    <div className="template-grid-page">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-section"
      >
        <h1 className="hero-main-title">
          {t.heroTitle1}
          <span className="hero-highlight">{t.heroTitle2}</span>
        </h1>
        <p className="hero-description">
          {lang === 'zh' 
            ? '选择一个模板，开始创作你的专业内容'
            : 'Select a template to start creating professional content'}
        </p>
      </motion.div>
      
      {/* Template Sections */}
      {Object.entries(groupedTemplates).map(([category, items]) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="template-section"
        >
          <div className="section-header">
            <span className="section-icon">{categoryIcons[category]}</span>
            <h2 className="section-title">{categoryNames[category]?.[lang] || category}</h2>
          </div>
          
          <div className="template-cards-grid">
            {items.map((template) => (
              <motion.button
                key={template.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(template)}
                className="template-card-new"
              >
                <div className="card-icon">{template.icon}</div>
                <div className="card-content">
                  <h3 className="card-title">{getTemplateName(template, lang)}</h3>
                  <p className="card-desc">{getTemplateDescription(template, lang)}</p>
                </div>
                <div className="card-arrow">→</div>
                {template.isPremium && <span className="card-badge">PRO</span>}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// Workspace - 工作台（免费版本）
// ============================================
function Workspace({ 
  template, 
  lang, 
  onBack
}: { 
  template: Template; 
  lang: Language;
  onBack: () => void;
}) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLPreElement>(null);
  
  const t = translations[lang];

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [result]);

  const handleFormChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generatePrompt = () => {
    let prompt = template.promptTemplate;
    Object.entries(formData).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value || '');
    });
    prompt = `${languageInstructions[lang]}\n\n${prompt}`;
    return prompt;
  };

  const handleGenerate = async () => {
    // 免费版本：直接生成，不需要登录
    const missingFields = template.variables
      .filter((v) => v.required && !formData[v.name])
      .map((v) => getVariableLabel(v, lang));
    
    if (missingFields.length > 0) {
      setError(`${lang === 'zh' ? '请填写' : 'Please fill in'}: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch(getApiUrl('/api/generate'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: generatePrompt() }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.message || data.error);
      } else {
        setResult(data.content || (lang === 'zh' ? '生成失败，请重试' : 'Generation failed, please try again'));
      }
    } catch {
      setError(lang === 'zh' ? '网络错误，请稍后重试' : 'Network error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="workspace">
      <div className="workspace-container">
        {/* Left: Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="workspace-form"
        >
          <div className="form-header">
            <span className="form-icon">{template.icon}</span>
            <h2 className="form-title">{getTemplateName(template, lang)}</h2>
          </div>
          
          <div className="form-body">
            {template.variables.map((field) => (
              <div key={field.name} className="form-field">
                <label className="form-label">
                  {getVariableLabel(field, lang)}
                  {field.required && <span className="form-required">*</span>}
                </label>
                
                {field.type === 'select' ? (
                  <select 
                    value={formData[field.name] || ''} 
                    onChange={(e) => handleFormChange(field.name, e.target.value)} 
                    className="form-select"
                  >
                    <option value="">{t.selectPlaceholder}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>{getOptionLabel(opt, lang)}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFormChange(field.name, e.target.value)}
                    placeholder={getVariablePlaceholder(field, lang) || ''}
                    rows={3}
                    className="form-textarea"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFormChange(field.name, e.target.value)}
                    placeholder={getVariablePlaceholder(field, lang) || ''}
                    className="form-input"
                  />
                )}
              </div>
            ))}
            
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="form-error"
              >
                {error}
              </motion.div>
            )}
            
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="generate-btn"
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  {t.generating}
                </>
              ) : t.generate}
            </button>
          </div>
        </motion.div>
        
        {/* Right: Result */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="workspace-result"
        >
          <div className="result-header">
            <div className="result-label">
              <div className="result-dot" />
              <span className="result-title">{t.output}</span>
            </div>
            {result && (
              <button 
                onClick={handleCopy}
                className={`result-copy ${copied ? 'copied' : ''}`}
              >
                {copied ? t.copied : t.copy}
              </button>
            )}
          </div>
          
          <div className="result-body">
            {loading ? (
              <div className="result-loading">
                <div className="loading-spinner" />
                <p className="loading-title">{t.creating}</p>
                <p className="loading-sub">DeepSeek Reasoner</p>
              </div>
            ) : result ? (
              <pre ref={resultRef} className="result-content">
                {result}
              </pre>
            ) : (
              <div className="result-empty">
                <div className="empty-icon">✍</div>
                <p className="empty-title">{t.selectTemplate}</p>
                <p className="empty-sub">SELECT A TEMPLATE</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// Particles Background
// ============================================
function Particles() {
  return (
    <div className="particles">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      <div className="glow-1" />
      <div className="glow-2" />
    </div>
  );
}

// ============================================
// Main App Content - 免费版本，无需登录
// ============================================
function AppContent() {
  const [lang, setLang] = useState<Language>('en');
  const [page, setPage] = useState<PageType>('home');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setPage('workspace');
  };

  const handleBack = () => {
    setPage('home');
    setSelectedTemplate(null);
  };

  return (
    <>
      <Particles />
      <Header 
        lang={lang} 
        onLangChange={setLang} 
        onBack={handleBack}
        page={page}
      />
      
      <main className="main">
        <div className="main-inner">
          <AnimatePresence mode="wait">
            {page === 'workspace' && selectedTemplate ? (
              <motion.div
                key="workspace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Workspace 
                  template={selectedTemplate} 
                  lang={lang}
                  onBack={handleBack}
                />
              </motion.div>
            ) : (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TemplateGrid lang={lang} onSelect={handleSelectTemplate} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}

// ============================================
// App - 免费版本
// ============================================
function App() {
  return <AppContent />;
}

function AppWrapper() {
  return <App />;
}

export default AppWrapper;