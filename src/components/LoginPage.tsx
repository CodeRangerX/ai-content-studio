import { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { authConfig } from '../lib/auth';

interface LoginPageProps {
  onSuccess: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('登录失败，请重试');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 发送 Google credential 到后端验证
      const response = await fetch('/api/auth/google', {
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
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google 登录失败，请重试');
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
            <p className="login-subtitle">登录以使用完整功能</p>
          </div>

          <div className="login-content">
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <div className="login-divider">
              <span>选择登录方式</span>
            </div>

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

            <p className="login-terms">
              登录即表示您同意我们的<a href="#">服务条款</a>和<a href="#">隐私政策</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}