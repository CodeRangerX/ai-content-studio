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

// ============================================
// Header
// ============================================
function Header({ 
  lang, 
  onLangChange, 
  onBack, 
  page,
  onConfig
}: { 
  lang: Language; 
  onLangChange: (lang: Language) => void;
  onBack?: () => void;
  page: 'home' | 'workspace';
  onConfig: () => void;
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
          
          <button onClick={onConfig} className="config-btn">
            ⚙️ API
          </button>
        </div>
      </div>
    </header>
  );
}

// ============================================
// Config Modal - API 配置
// ============================================
function ConfigModal({ 
  lang, 
  onClose,
  onSave
}: { 
  lang: Language;
  onClose: () => void;
  onSave: () => void;
}) {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.deepseek.com/v1');
  const [model, setModel] = useState('deepseek-chat');

  useEffect(() => {
    setApiKey(localStorage.getItem('apiKey') || '');
    setBaseUrl(localStorage.getItem('baseUrl') || 'https://api.deepseek.com/v1');
    setModel(localStorage.getItem('model') || 'deepseek-chat');
  }, []);

  const handleSave = () => {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('baseUrl', baseUrl);
    localStorage.setItem('model', model);
    onSave();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">
          {lang === 'zh' ? 'API 配置' : 'API Configuration'}
        </h2>
        
        <div className="modal-body">
          <div className="form-field">
            <label className="form-label">
              API Key *
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="form-input"
            />
          </div>
          
          <div className="form-field">
            <label className="form-label">
              {lang === 'zh' ? 'API 地址' : 'API Base URL'}
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="form-field">
            <label className="form-label">
              {lang === 'zh' ? '模型' : 'Model'}
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="form-select"
            >
              <option value="deepseek-chat">deepseek-chat</option>
              <option value="deepseek-reasoner">deepseek-reasoner</option>
            </select>
          </div>
          
          <p className="config-hint">
            {lang === 'zh' 
              ? '推荐使用 DeepSeek API，便宜好用'
              : 'Recommended: DeepSeek API - affordable and powerful'}
            <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="config-link">
              platform.deepseek.com
            </a>
          </p>
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            {lang === 'zh' ? '取消' : 'Cancel'}
          </button>
          <button onClick={handleSave} className="btn-primary">
            {lang === 'zh' ? '保存' : 'Save'}
          </button>
        </div>
      </motion.div>
    </motion.div>
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
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// Workspace - 工作台
// ============================================
function Workspace({ 
  template, 
  lang, 
  onBack,
  onConfig 
}: { 
  template: Template; 
  lang: Language;
  onBack: () => void;
  onConfig: () => void;
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
    const apiKey = localStorage.getItem('apiKey');
    const baseUrl = localStorage.getItem('baseUrl') || 'https://api.deepseek.com/v1';
    const model = localStorage.getItem('model') || 'deepseek-chat';
    
    if (!apiKey) {
      setError(lang === 'zh' ? '请先配置 API Key' : 'Please configure your API Key first');
      setTimeout(() => onConfig(), 1500);
      return;
    }

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
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: generatePrompt() }],
          max_tokens: 2000,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error.message || (lang === 'zh' ? '生成失败' : 'Generation failed'));
      } else {
        setResult(data.choices[0]?.message?.content || (lang === 'zh' ? '无结果' : 'No result'));
      }
    } catch (err: any) {
      setError(lang === 'zh' ? '网络错误，请检查 API 配置' : 'Network error, please check API config');
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
                <p className="loading-sub">DeepSeek</p>
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
// Main App
// ============================================
function App() {
  const [lang, setLang] = useState<Language>('en');
  const [page, setPage] = useState<'home' | 'workspace'>('home');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setPage('workspace');
  };

  const handleBack = () => {
    setPage('home');
    setSelectedTemplate(null);
  };

  const handleConfigSave = () => {
    setConfigSaved(true);
  };

  return (
    <>
      <Particles />
      <Header 
        lang={lang} 
        onLangChange={setLang} 
        onBack={handleBack}
        page={page}
        onConfig={() => setShowConfig(true)}
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
                  onConfig={() => setShowConfig(true)}
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
      
      <AnimatePresence>
        {showConfig && (
          <ConfigModal 
            lang={lang}
            onClose={() => setShowConfig(false)}
            onSave={handleConfigSave}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;