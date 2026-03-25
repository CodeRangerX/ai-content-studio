import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Language } from '../lib/i18n';
import { getApiUrl } from '../lib/auth';
import {
  getUserStats,
  getTransactions,
  getGenerations,
  type UserStats,
  type Transaction,
  type Generation,
} from '../lib/credits';

interface AccountPageProps {
  lang: Language;
  onBack: () => void;
  onBuyCredits: () => void;
}

const labels = {
  zh: {
    title: '我的账户',
    back: '返回',
    subscription: '订阅状态',
    credits: '点数余额',
    proPlan: 'Pro 套餐',
    freePlan: '免费版',
    active: '活跃',
    expired: '已过期',
    expiresAt: '到期时间',
    buyCredits: '购买点数',
    viewHistory: '查看历史',
    thisMonthStats: '本月统计',
    generations: '生成次数',
    creditsUsed: '消耗点数',
    subscriptionSaved: '订阅节省',
    recentTransactions: '最近交易',
    recentGenerations: '最近生成',
    purchase: '购买',
    consume: '消耗',
    gift: '赠送',
    refund: '退款',
    points: '点',
    unlimited: '无限',
    loading: '加载中...',
    noData: '暂无数据',
    viewAll: '查看全部',
    creditsValue: '价值',
  },
  en: {
    title: 'My Account',
    back: 'Back',
    subscription: 'Subscription',
    credits: 'Credits',
    proPlan: 'Pro Plan',
    freePlan: 'Free',
    active: 'Active',
    expired: 'Expired',
    expiresAt: 'Expires',
    buyCredits: 'Buy Credits',
    viewHistory: 'View History',
    thisMonthStats: 'This Month',
    generations: 'Generations',
    creditsUsed: 'Credits Used',
    subscriptionSaved: 'Subscription Saved',
    recentTransactions: 'Recent Transactions',
    recentGenerations: 'Recent Generations',
    purchase: 'Purchase',
    consume: 'Consume',
    gift: 'Gift',
    refund: 'Refund',
    points: 'pts',
    unlimited: 'Unlimited',
    loading: 'Loading...',
    noData: 'No data',
    viewAll: 'View All',
    creditsValue: 'Value',
  },
};

export function AccountPage({ lang, onBack, onBuyCredits }: AccountPageProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'generations'>('overview');
  
  const t = labels[lang] || labels.en;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, txRes, genRes] = await Promise.all([
        getUserStats(),
        getTransactions(10, 0),
        getGenerations(10, 0),
      ]);
      
      if (statsRes.success) setStats(statsRes.data || null);
      if (txRes.success) setTransactions(txRes.data?.transactions || []);
      if (genRes.success) setGenerations(genRes.data || []);
    } catch (err) {
      console.error('Failed to load account data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      purchase: t.purchase,
      consume: t.consume,
      gift: t.gift,
      refund: t.refund,
    };
    return typeLabels[type] || type;
  };

  if (loading) {
    return (
      <div className="account-page loading">
        <div className="loading-spinner" />
        <p>{t.loading}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="account-page"
    >
      <div className="account-header">
        <button onClick={onBack} className="back-btn">
          ← {t.back}
        </button>
        <h1>{t.title}</h1>
      </div>

      {/* Overview Cards */}
      <div className="account-cards">
        {/* Subscription Card */}
        <div className="account-card">
          <div className="card-label">{t.subscription}</div>
          <div className="card-value">
            {stats?.isPro ? t.proPlan : t.freePlan}
          </div>
          {stats?.subscription && (
            <div className="card-detail">
              <span className={`status ${stats.subscription.status}`}>
                {stats.subscription.status === 'active' ? t.active : t.expired}
              </span>
              {stats.subscription.currentPeriodEnd && (
                <span className="expires">
                  {t.expiresAt}: {formatDate(stats.subscription.currentPeriodEnd)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Credits Card */}
        <div className="account-card">
          <div className="card-label">{t.credits}</div>
          <div className="card-value credits-value">
            {stats?.isPro ? (
              <span className="unlimited">∞ {t.unlimited}</span>
            ) : (
              <>
                <span className="balance">{stats?.credits.balance || 0}</span>
                <span className="unit">{t.points}</span>
              </>
            )}
          </div>
          {!stats?.isPro && (
            <button onClick={onBuyCredits} className="buy-credits-btn">
              {t.buyCredits}
            </button>
          )}
        </div>
      </div>

      {/* Monthly Stats */}
      {stats && (
        <div className="monthly-stats">
          <h3>{t.thisMonthStats}</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.generations.totalThisMonth}</span>
              <span className="stat-label">{t.generations}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.generations.creditsUsed}</span>
              <span className="stat-label">{t.creditsUsed}</span>
            </div>
            {stats.isPro && (
              <div className="stat-item highlight">
                <span className="stat-value">{stats.generations.subscriptionSaved}</span>
                <span className="stat-label">{t.subscriptionSaved}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="account-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          {t.recentTransactions}
        </button>
        <button
          className={activeTab === 'generations' ? 'active' : ''}
          onClick={() => setActiveTab('generations')}
        >
          {t.recentGenerations}
        </button>
      </div>

      {/* Transactions Tab */}
      {activeTab === 'overview' && (
        <div className="transactions-list">
          {transactions.length === 0 ? (
            <div className="empty-state">{t.noData}</div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="tx-info">
                  <span className="tx-type">{getTypeLabel(tx.type)}</span>
                  <span className="tx-desc">{tx.description || '-'}</span>
                </div>
                <div className="tx-amount">
                  <span className={tx.points > 0 ? 'positive' : 'negative'}>
                    {tx.points > 0 ? '+' : ''}{tx.points} {t.points}
                  </span>
                  <span className="tx-balance">→ {tx.balance_after}</span>
                </div>
                <div className="tx-date">{formatDate(tx.created_at)}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Generations Tab */}
      {activeTab === 'generations' && (
        <div className="generations-list">
          {generations.length === 0 ? (
            <div className="empty-state">{t.noData}</div>
          ) : (
            generations.map((gen) => (
              <div key={gen.id} className="generation-item">
                <div className="gen-header">
                  <span className="gen-template">{gen.template_name}</span>
                  <span className={`gen-cost ${gen.cost_type}`}>
                    {gen.cost_type === 'subscription' ? '🎫' : `-${gen.credits_used}${t.points}`}
                  </span>
                </div>
                <div className="gen-preview">
                  {gen.output_content?.slice(0, 100) || '...'}
                </div>
                <div className="gen-footer">
                  <span className="gen-date">{formatDate(gen.created_at)}</span>
                  <span className={`gen-status ${gen.status}`}>
                    {gen.status === 'success' ? '✓' : '✕'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <style>{`
        .account-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px;
        }
        
        .account-page.loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          color: #666;
        }
        
        .account-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .account-header h1 {
          font-size: 24px;
          font-weight: 600;
        }
        
        .back-btn {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          font-size: 14px;
        }
        
        .back-btn:hover {
          color: #333;
        }
        
        .account-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .account-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 20px;
          color: white;
        }
        
        .account-card:nth-child(2) {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        .card-label {
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 8px;
        }
        
        .card-value {
          font-size: 28px;
          font-weight: 700;
        }
        
        .card-value .unlimited {
          font-size: 20px;
        }
        
        .card-detail {
          margin-top: 12px;
          font-size: 12px;
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .status.active {
          color: #4ade80;
        }
        
        .status.expired {
          color: #f87171;
        }
        
        .expires {
          opacity: 0.8;
        }
        
        .buy-credits-btn {
          margin-top: 12px;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .buy-credits-btn:hover {
          background: rgba(255,255,255,0.3);
        }
        
        .monthly-stats {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }
        
        .monthly-stats h3 {
          font-size: 14px;
          color: #666;
          margin-bottom: 16px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-item.highlight {
          background: #dcfce7;
          padding: 12px;
          border-radius: 8px;
        }
        
        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #333;
        }
        
        .stat-label {
          font-size: 12px;
          color: #666;
        }
        
        .account-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .account-tabs button {
          flex: 1;
          padding: 12px;
          border: none;
          background: #f1f5f9;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #666;
          transition: all 0.2s;
        }
        
        .account-tabs button.active {
          background: #667eea;
          color: white;
        }
        
        .transactions-list,
        .generations-list {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        
        .empty-state {
          padding: 40px;
          text-align: center;
          color: #999;
        }
        
        .transaction-item {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 16px;
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          align-items: center;
        }
        
        .transaction-item:last-child {
          border-bottom: none;
        }
        
        .tx-type {
          font-weight: 500;
        }
        
        .tx-desc {
          display: block;
          font-size: 12px;
          color: #999;
        }
        
        .tx-amount .positive {
          color: #22c55e;
          font-weight: 600;
        }
        
        .tx-amount .negative {
          color: #ef4444;
        }
        
        .tx-balance {
          display: block;
          font-size: 12px;
          color: #999;
        }
        
        .tx-date {
          font-size: 12px;
          color: #999;
        }
        
        .generation-item {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .gen-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .gen-template {
          font-weight: 500;
        }
        
        .gen-cost {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 4px;
        }
        
        .gen-cost.subscription {
          background: #dbeafe;
          color: #3b82f6;
        }
        
        .gen-cost.credits {
          background: #fef3c7;
          color: #d97706;
        }
        
        .gen-preview {
          font-size: 13px;
          color: #666;
          margin-bottom: 8px;
        }
        
        .gen-footer {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #999;
        }
        
        .gen-status.success {
          color: #22c55e;
        }
        
        .gen-status.failed {
          color: #ef4444;
        }
      `}</style>
    </motion.div>
  );
}