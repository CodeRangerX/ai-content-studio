'use client';

import { useState, useEffect } from 'react';
import { templates, categories, Template } from '@/lib/templates';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.deepseek.com/v1');
  const [model, setModel] = useState('deepseek-chat');
  const [showConfig, setShowConfig] = useState(false);

  // 从 localStorage 加载配置
  useEffect(() => {
    setApiKey(localStorage.getItem('apiKey') || '');
    setBaseUrl(localStorage.getItem('baseUrl') || 'https://api.deepseek.com/v1');
    setModel(localStorage.getItem('model') || 'deepseek-chat');
  }, []);

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({});
    setResult('');
    setError('');
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
      .filter(v => v.required && !formData[v.name])
      .map(v => v.label);
    
    if (missingFields.length > 0) {
      setError(`请填写: ${missingFields.join(', ')}`);
      return;
    }

    if (!apiKey) {
      setError('请先配置API Key');
      setShowConfig(true);
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      // 客户端直接调用 API（需要 API 支持 CORS）
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: generatePrompt() }],
          max_tokens: 2000,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error.message || '生成失败');
      } else {
        setResult(data.choices[0]?.message?.content || '无结果');
      }
    } catch (err: any) {
      setError(err.message || '请求失败，请检查网络或API配置');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = () => {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('baseUrl', baseUrl);
    localStorage.setItem('model', model);
    setShowConfig(false);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✨</span>
            <div>
              <h1 className="text-xl font-bold text-white">AI内容工坊</h1>
              <p className="text-xs text-gray-400">一键生成专业文案</p>
            </div>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition"
          >
            ⚙️ API配置
          </button>
        </div>
      </header>

      {showConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4">API配置</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">API Key *</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">API地址</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={e => setBaseUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">模型</label>
                <input
                  type="text"
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-gray-500"
                />
              </div>
              <p className="text-xs text-gray-500">
                推荐 <a href="https://platform.deepseek.com" target="_blank" className="text-purple-400 hover:underline">DeepSeek</a>，便宜好用
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowConfig(false)} className="px-4 py-2 text-gray-300 hover:text-white">取消</button>
              <button onClick={saveConfig} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">保存</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === cat.id ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {filteredTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 rounded-xl text-left transition border ${
                    selectedTemplate?.id === template.id ? 'bg-purple-600/30 border-purple-500' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{template.icon}</span>
                    <span className="font-medium text-white">{template.name}</span>
                    {template.isPremium && <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">PRO</span>}
                  </div>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </button>
              ))}
            </div>

            {selectedTemplate && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>{selectedTemplate.icon}</span>
                  {selectedTemplate.name}
                </h2>
                <div className="space-y-4">
                  {selectedTemplate.variables.map(variable => (
                    <div key={variable.name}>
                      <label className="block text-sm text-gray-300 mb-1">
                        {variable.label}
                        {variable.required && <span className="text-red-400 ml-1">*</span>}
                      </label>
                      {variable.type === 'select' ? (
                        <select
                          value={formData[variable.name] || ''}
                          onChange={e => handleInputChange(variable.name, e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
                        >
                          <option value="">请选择</option>
                          {variable.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      ) : variable.type === 'textarea' ? (
                        <textarea
                          value={formData[variable.name] || ''}
                          onChange={e => handleInputChange(variable.name, e.target.value)}
                          placeholder={variable.placeholder}
                          rows={3}
                          className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-gray-500"
                        />
                      ) : (
                        <input
                          type="text"
                          value={formData[variable.name] || ''}
                          onChange={e => handleInputChange(variable.name, e.target.value)}
                          placeholder={variable.placeholder}
                          className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-gray-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                {error && <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">{error}</div>}

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      生成中...
                    </>
                  ) : '✨ 生成内容'}
                </button>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-medium text-white">生成结果</h3>
                {result && <button onClick={copyResult} className="text-sm text-purple-400 hover:text-purple-300">📋 复制</button>}
              </div>
              <div className="p-4 min-h-[400px] max-h-[600px] overflow-auto">
                {result ? (
                  <pre className="whitespace-pre-wrap text-gray-200 text-sm leading-relaxed font-sans">{result}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">✍️</span>
                      <p>选择模板并填写信息</p>
                      <p className="text-sm">AI将为你生成专业内容</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}