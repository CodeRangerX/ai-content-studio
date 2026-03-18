import { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { authConfig } from '../lib/auth';

// 获取 API URL
const getApiUrl = (path: string) => {
  const baseUrl = authConfig.apiBaseUrl;
  if (baseUrl) {
    return `${baseUrl}${path}`;
  }
  return path; // 开发环境使用 Vite 代理
};

type AuthMode = 'login' | 'register' | 'reset-password';

interface LoginPageProps {
  onSuccess: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // 表单数据
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // 验证码倒计时
  const [countdown, setCountdown] = useState(0);
  
  // 发送验证码
  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }
    
    if (countdown > 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const type = mode === 'register' ? 'register' : 'reset_password';
      const response = await fetch(getApiUrl('/api/auth/send-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(data.devCode ? `验证码: ${data.devCode} (开发模式)` : '验证码已发送');
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.message || '发送失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 邮箱登录/注册
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    // 验证
    if (!email || !email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }
    
    if (!password || password.length < 8) {
      setError('密码至少8位');
      return;
    }
    
    if (mode === 'register' && password !== confirmPassword) {
      setError('两次密码不一致');
      return;
    }
    
    if ((mode === 'register' || mode === 'reset-password') && !code) {
      setError('请输入验证码');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const endpoint = mode === 'reset-password' ? '/api/auth/reset-password' :
                       mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      
      const body = mode === 'reset-password' 
        ? { email, code, newPassword: password }
        : mode === 'register'
        ? { email, password, code }
        : { email, password, rememberMe };
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (mode === 'reset-password') {
          setMessage('密码重置成功，请登录');
          setMode('login');
          setPassword('');
          setCode('');
        } else {
          login(data.data.user, data.data.token, rememberMe);
          onSuccess();
        }
      } else {
        setError(data.message || '操作失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Google 登录
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('登录失败');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(getApiUrl('/api/auth/google'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.data.user, data.data.token, true);
        onSuccess();
      } else {
        setError(data.message || '登录失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google 登录失败');
  };
  
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setMessage('');
    setCode('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="login-card"
        >
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">文</span>
            </div>
            <h1 className="login-title">内容工坊</h1>
            <p className="login-subtitle">
              {mode === 'login' && '登录以使用完整功能'}
              {mode === 'register' && '创建您的账号'}
              {mode === 'reset-password' && '重置您的密码'}
            </p>
          </div>

          {/* Tab 切换 */}
          <div className="login-tabs">
            <button 
              className={`login-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >
              登录
            </button>
            <button 
              className={`login-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
            >
              注册
            </button>
          </div>

          <form className="login-form" onSubmit={handleEmailAuth}>
            <AnimatePresence mode="wait">
              {/* 错误提示 */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="login-error"
                >
                  {error}
                </motion.div>
              )}
              
              {/* 成功提示 */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="login-message"
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 邮箱 */}
            <div className="login-field">
              <label className="login-label">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="login-input"
                disabled={isLoading}
              />
            </div>
            
            {/* 验证码（注册/重置密码时显示） */}
            {(mode === 'register' || mode === 'reset-password') && (
              <div className="login-field">
                <label className="login-label">验证码</label>
                <div className="login-code-row">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6位验证码"
                    className="login-input login-code-input"
                    maxLength={6}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isLoading || countdown > 0}
                    className="login-code-btn"
                  >
                    {countdown > 0 ? `${countdown}s` : '发送验证码'}
                  </button>
                </div>
              </div>
            )}
            
            {/* 密码 */}
            {mode !== 'reset-password' && (
              <div className="login-field">
                <label className="login-label">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少8位"
                  className="login-input"
                  disabled={isLoading}
                />
              </div>
            )}
            
            {/* 确认密码（注册时显示） */}
            {mode === 'register' && (
              <div className="login-field">
                <label className="login-label">确认密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  className="login-input"
                  disabled={isLoading}
                />
              </div>
            )}
            
            {/* 记住我 & 忘记密码 */}
            {mode === 'login' && (
              <div className="login-options">
                <label className="login-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>记住我</span>
                </label>
                <button
                  type="button"
                  onClick={() => switchMode('reset-password')}
                  className="login-link"
                >
                  忘记密码？
                </button>
              </div>
            )}
            
            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="login-submit"
            >
              {isLoading ? '处理中...' : 
               mode === 'login' ? '登录' :
               mode === 'register' ? '注册' : '重置密码'}
            </button>
          </form>

          {/* 分割线 */}
          <div className="login-divider">
            <span>或</span>
          </div>

          {/* Google 登录 */}
          <div className="login-buttons">
            {authConfig.googleClientId ? (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_black"
                shape="rectangular"
                width="100%"
                disabled={isLoading}
              />
            ) : (
              <button 
                type="button"
                className="login-button google"
                onClick={() => setError('Google OAuth 未配置')}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                使用 Google 登录
              </button>
            )}
          </div>

          {/* 切换登录/注册 */}
          <p className="login-switch">
            {mode === 'login' && (
              <>
                还没有账号？
                <button onClick={() => switchMode('register')} className="login-link">
                  立即注册
                </button>
              </>
            )}
            {mode === 'register' && (
              <>
                已有账号？
                <button onClick={() => switchMode('login')} className="login-link">
                  立即登录
                </button>
              </>
            )}
            {mode === 'reset-password' && (
              <button onClick={() => switchMode('login')} className="login-link">
                返回登录
              </button>
            )}
          </p>

          <p className="login-terms">
            登录即表示您同意我们的<a href="#">服务条款</a>和<a href="#">隐私政策</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}