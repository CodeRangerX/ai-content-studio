import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { UserMenu } from './components/UserMenu';
import { templates, categories, type Template, getTemplateName } from './lib/templates';
import { Language, languageNames, translations } from './lib/i18n';
import { authConfig } from './lib/auth';

// ============================================
// Header
// ============================================
function Header({ lang, onLangChange }: { lang: Language; onLangChange: (lang: Language) => void }) {
  const { user, isAuthenticated, logout } = useAuth();
  const t = translations[lang];
  
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-wrap">
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
          {/* Language Selector */}
          <select 
            value={lang} 
            onChange={(e) => onLangChange(e.target.value as Language)}
            className="lang-select"
          >
            {Object.entries(languageNames).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
          
          <div className="status-badge">
            <div className="status-dot" />
            <span className="status-text">DEEPSEEK</span>
          </div>
          
          {isAuthenticated ? (
            <UserMenu onLogout={logout} />
          ) : (
            <div className="free-badge">{t.free}</div>
          )}
        </div>
      </div>
    </header>
  );
}

// ============================================
// CategoryTabs
// ============================================
function CategoryTabs({ active, onChange, lang }: { active: string; onChange: (id: string) => void; lang: Language }) {
  const t = translations[lang];
  const categoryLabels: Record<string, string> = {
    all: t.all,
    ecommerce: t.ecommerce,
    social: t.social,
    content: t.content
  };
  
  return (
    <div className="categories">
      <div className="categories-inner">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`category-btn ${active === cat.id ? 'active' : ''}`}
          >
            {categoryLabels[cat.id] || cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// TemplateCard
// ============================================
function TemplateCard({ 
  template, 
  isSelected, 
  onClick,
  lang
}: { 
  template: Template; 
  isSelected: boolean; 
  onClick: () => void;
  lang: Language;
}) {
  return (
    <button
      onClick={onClick}
      className={`template-card ${isSelected ? 'selected' : ''}`}
    >
      <div className="template-inner">
        <div className="template-icon">
          {template.icon}
        </div>
        <div className="template-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="template-name">{getTemplateName(template, lang)}</span>
            {template.isPremium && <span className="pro-badge">PRO</span>}
          </div>
          <p className="template-desc">{template.description}</p>
        </div>
        <span className="template-arrow">→</span>
      </div>
    </button>
  );
}

// ============================================
// FormField
// ============================================
function FormField({ 
  field, 
  value, 
  onChange,
  lang
}: { 
  field: Template['variables'][0]; 
  value: string; 
  onChange: (value: string) => void;
  lang: Language;
}) {
  const t = translations[lang];
  
  return (
    <div className="form-field">
      <label className="form-label">
        {field.label}
        {field.required && <span className="form-required">*</span>}
      </label>
      
      {field.type === 'select' ? (
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="form-select"
        >
          <option value="">{t.selectPlaceholder}</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="form-textarea"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="form-input"
        />
      )}
    </div>
  );
}

// ============================================
// ResultPanel
// ============================================
function ResultPanel({ 
  result, 
  loading,
  onCopy,
  copied,
  lang
}: { 
  result: string; 
  loading: boolean;
  onCopy: () => void;
  copied: boolean;
  lang: Language;
}) {
  const t = translations[lang];
  const resultRef = useRef<HTMLPreElement>(null);
  
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [result]);

  return (
    <div className="result-panel">
      <div className="result-header">
        <div className="result-label">
          <div className="result-dot" />
          <span className="result-title">{t.output}</span>
        </div>
        {result && (
          <button 
            onClick={onCopy}
            className={`result-copy ${copied ? 'copied' : ''}`}
          >
            {copied ? t.copied : t.copy}
          </button>
        )}
      </div>
      
      <div className="result-body">
        {loading ? (
          <div className="result-loading">
            <div style={{ textAlign: 'center' }}>
              <div className="loading-spinner" />
              <div className="loading-inner">
                <p className="loading-title">{t.creating}</p>
                <p className="loading-sub">DeepSeek Reasoner</p>
              </div>
            </div>
          </div>
        ) : result ? (
          <pre ref={resultRef} className="result-content">
            {result}
          </pre>
        ) : (
          <div className="result-empty">
            <div>
              <div className="empty-icon">✍</div>
              <p className="empty-title">{t.selectTemplate}</p>
              <p className="empty-sub">SELECT A TEMPLATE</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Particles
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
// Main App Content (after login)
// ============================================
function AppContent() {
  const [lang, setLang] = useState<Language>('en');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const t = translations[lang];
  
  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter((t) => t.category === selectedCategory);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({});
    setResult('');
    setError('');
  };

  const handleFormChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generatePrompt = () => {
    if (!selectedTemplate) return '';
    let prompt = selectedTemplate.promptTemplate;
    Object.entries(formData).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value || '');
    });
    return prompt;
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    
    const missingFields = selectedTemplate.variables
      .filter((v) => v.required && !formData[v.name])
      .map((v) => v.label);
    
    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: generatePrompt() }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.content || 'Generation failed, please try again');
      }
    } catch {
      setError('Network error, please try again later');
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
    <>
      <Particles />
      <Header lang={lang} onLangChange={setLang} />
      
      <main className="main">
        <div className="main-inner">
          {/* Hero */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hero"
          >
            <h1 className="hero-title">
              {t.heroTitle1}
              <br />
              <span className="hero-gold">{t.heroTitle2}</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="hero-sub"
            >
              {t.heroSub}
            </motion.p>
          </motion.div>
          
          {/* Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CategoryTabs active={selectedCategory} onChange={setSelectedCategory} lang={lang} />
          </motion.div>
          
          {/* Content Grid */}
          <div className="content-grid">
            {/* Left Column */}
            <div className="content-left">
              {/* Templates */}
              <div className="templates-grid">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate?.id === template.id}
                    onClick={() => handleTemplateSelect(template)}
                    lang={lang}
                  />
                ))}
              </div>
              
              {/* Form */}
              <AnimatePresence>
                {selectedTemplate && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="form-panel"
                  >
                    <div className="form-header">
                      <div className="form-icon">
                        {selectedTemplate.icon}
                      </div>
                      <div>
                        <span className="form-title">{getTemplateName(selectedTemplate, lang)}</span>
                        <p className="form-category">{selectedTemplate.category.toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className="form-body">
                      {selectedTemplate.variables.map((field) => (
                        <FormField
                          key={field.name}
                          field={field}
                          value={formData[field.name] || ''}
                          onChange={(value) => handleFormChange(field.name, value)}
                          lang={lang}
                        />
                      ))}
                    </div>
                    
                    {error && (
                      <div className="form-error">
                        {error}
                      </div>
                    )}
                    
                    <button
                      onClick={handleGenerate}
                      disabled={loading}
                      className="form-submit"
                    >
                      {loading ? t.generating : t.generate}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Right Column */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="content-right"
            >
              <ResultPanel 
                result={result} 
                loading={loading}
                onCopy={handleCopy}
                copied={copied}
                lang={lang}
              />
            </motion.div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-text">{t.title}</span>
          <span className="footer-text">{t.poweredBy}</span>
        </div>
      </footer>
    </>
  );
}

// ============================================
// App with Auth Gate
// ============================================
function AppWithAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowLogin(true);
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!isAuthenticated || showLogin) {
    return <LoginPage onSuccess={() => setShowLogin(false)} />;
  }

  return <AppContent />;
}

// ============================================
// Main App (with providers)
// ============================================
export default function App() {
  return (
    <GoogleOAuthProvider clientId={authConfig.googleClientId}>
      <AuthProvider>
        <AppWithAuth />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}