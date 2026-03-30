import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Language } from '../lib/i18n';
import { getCreditPackages, purchaseCredits, capturePurchase, type CreditPackage } from '../lib/credits';

interface CreditsPageProps {
  lang: Language;
  onBack: () => void;
  onSuccess?: () => void;
}

const labels = {
  zh: {
    title: '购买点数',
    back: '返回',
    subtitle: '选择适合您的点数包',
    points: '点',
    buy: '购买',
    processing: '处理中...',
    success: '购买成功！',
    error: '购买失败',
    loginRequired: '请先登录',
    permanent: '永久有效',
    popular: '最受欢迎',
    bestValue: '最划算',
  },
  en: {
    title: 'Buy Credits',
    back: 'Back',
    subtitle: 'Choose a credit package',
    points: 'pts',
    buy: 'Buy',
    processing: 'Processing...',
    success: 'Purchase successful!',
    error: 'Purchase failed',
    loginRequired: 'Please login first',
    permanent: 'Never expires',
    popular: 'Most Popular',
    bestValue: 'Best Value',
  },
};

// 按顺序排列的包 ID
const packageOrder = ['starter', 'standard', 'advanced', 'professional'];

export function CreditsPage({ lang, onBack, onSuccess }: CreditsPageProps) {
  const { isAuthenticated } = useAuth();
  const [packages, setPackages] = useState<Record<string, CreditPackage>>({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const t = labels[lang] || labels.en;

  useEffect(() => {
    loadPackages();
    
    // 检查是否有从 PayPal 返回的订单
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('token');
    if (orderId) {
      handleCapture(orderId);
    }
  }, []);

  const loadPackages = async () => {
    try {
      const res = await getCreditPackages();
      if (res.success && res.data) {
        setPackages(res.data);
      }
    } catch (err) {
      console.error('Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageId: string) => {
    if (!isAuthenticated) {
      setError(t.loginRequired);
      return;
    }

    setProcessing(packageId);
    setError(null);

    try {
      const res = await purchaseCredits(packageId);
      
      if (res.success && res.data?.approvalUrl) {
        // 跳转到 PayPal
        window.location.href = res.data.approvalUrl;
      } else {
        setError(res.error || t.error);
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError(t.error);
    } finally {
      setProcessing(null);
    }
  };

  const handleCapture = async (orderId: string) => {
    setProcessing('capture');
    try {
      const res = await capturePurchase(orderId);
      if (res.success) {
        // 清除 URL 参数
        window.history.replaceState({}, '', window.location.pathname);
        onSuccess?.();
      } else {
        setError(t.error);
      }
    } catch (err) {
      console.error('Capture error:', err);
      setError(t.error);
    } finally {
      setProcessing(null);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getPackageTag = (index: number) => {
    if (index === 1) return t.popular;
    if (index === 3) return t.bestValue;
    return null;
  };

  if (loading) {
    return (
      <div className="credits-page loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="credits-page"
    >
      <div className="credits-header">
        <button onClick={onBack} className="back-btn">
          ← {t.back}
        </button>
        <h1>{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="packages-grid">
        {packageOrder.map((id, index) => {
          const pkg = packages[id];
          if (!pkg) return null;

          const isProcessing = processing === id;
          const tag = getPackageTag(index);

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`package-card ${tag ? 'highlighted' : ''}`}
            >
              {tag && <div className="package-tag">{tag}</div>}
              
              <div className="package-points">
                <span className="points-number">{pkg.points.toLocaleString()}</span>
                <span className="points-label">{t.points}</span>
              </div>

              <div className="package-price">
                {formatPrice(pkg.price)}
              </div>

              <button
                onClick={() => handlePurchase(id)}
                disabled={!!processing || !isAuthenticated}
                className="buy-btn"
              >
                {isProcessing ? t.processing : t.buy}
              </button>

              <div className="package-note">
                {t.permanent}
              </div>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .credits-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 24px;
        }
        
        .credits-page.loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 300px;
        }
        
        .credits-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .credits-header h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .subtitle {
          color: #666;
          font-size: 16px;
        }
        
        .back-btn {
          position: absolute;
          left: 24px;
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          font-size: 14px;
        }
        
        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          text-align: center;
        }
        
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        
        .package-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          position: relative;
          transition: all 0.2s;
        }
        
        .package-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }
        
        .package-card.highlighted {
          border-color: #667eea;
          background: linear-gradient(to bottom, #f8faff, white);
        }
        
        .package-tag {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4px 16px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .package-points {
          margin-bottom: 16px;
        }
        
        .points-number {
          font-size: 48px;
          font-weight: 700;
          color: #333;
        }
        
        .points-label {
          font-size: 16px;
          color: #666;
          margin-left: 4px;
        }
        
        .package-price {
          font-size: 28px;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 8px;
        }
        
        .price-per-point {
          font-size: 13px;
          color: #999;
          margin-bottom: 16px;
        }
        
        .buy-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .buy-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .buy-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .package-note {
          margin-top: 12px;
          font-size: 12px;
          color: #999;
        }
      `}</style>
    </motion.div>
  );
}