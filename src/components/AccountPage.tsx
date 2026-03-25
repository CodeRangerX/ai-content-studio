import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Language } from '../lib/i18n';
import { getApiUrl } from '../lib/auth';
import { getUserStats, type UserStats } from '../lib/credits';

interface AccountPageProps {
  lang: Language;
  onBack: () => void;
  onBuyCredits: () => void;
}

// Types
interface Transaction {
  id: string;
  user_id: string;
  type: 'purchase' | 'consume' | 'gift' | 'refund';
  points: number;
  balance_after: number;
  description: string | null;
  related_id: string | null;
  created_at: string;
}

interface Generation {
  id: string;
  user_id: string;
  template_id: string;
  template_name: string;
  input_data: string;
  output_content: string | null;
  credits_used: number;
  cost_type: 'subscription' | 'credits';
  status: 'success' | 'failed';
  created_at: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
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
    
    // 列表页
    allTransactions: '全部交易',
    allGenerations: '全部生成',
    filter: '筛选',
    dateRange: '时间范围',
    type: '类型',
    allTypes: '全部类型',
    template: '模板',
    allTemplates: '全部模板',
    status: '状态',
    allStatus: '全部状态',
    success: '成功',
    failed: '失败',
    prevPage: '上一页',
    nextPage: '下一页',
    page: '第',
    of: '共',
    items: '条',
    detail: '详情',
    close: '关闭',
    copy: '复制',
    copied: '已复制',
    input: '输入',
    output: '输出',
    search: '搜索',
    resetFilter: '重置',
    
    // 时间范围选项
    today: '今天',
    last7days: '最近7天',
    last30days: '最近30天',
    last3months: '最近3个月',
    allTime: '全部时间',
    
    // 详情
    generationDetail: '生成详情',
    transactionDetail: '交易详情',
    time: '时间',
    amount: '金额',
    balanceAfter: '变动后余额',
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
    
    // List page
    allTransactions: 'All Transactions',
    allGenerations: 'All Generations',
    filter: 'Filter',
    dateRange: 'Date Range',
    type: 'Type',
    allTypes: 'All Types',
    template: 'Template',
    allTemplates: 'All Templates',
    status: 'Status',
    allStatus: 'All Status',
    success: 'Success',
    failed: 'Failed',
    prevPage: 'Previous',
    nextPage: 'Next',
    page: 'Page',
    of: 'of',
    items: 'items',
    detail: 'Detail',
    close: 'Close',
    copy: 'Copy',
    copied: 'Copied',
    input: 'Input',
    output: 'Output',
    search: 'Search',
    resetFilter: 'Reset',
    
    // Date range options
    today: 'Today',
    last7days: 'Last 7 days',
    last30days: 'Last 30 days',
    last3months: 'Last 3 months',
    allTime: 'All time',
    
    // Detail
    generationDetail: 'Generation Detail',
    transactionDetail: 'Transaction Detail',
    time: 'Time',
    amount: 'Amount',
    balanceAfter: 'Balance After',
  },
};

// 日期范围工具函数
function getDateRange(range: string): { start: Date | null; end: Date } {
  const end = new Date();
  let start: Date | null = null;
  
  switch (range) {
    case 'today':
      start = new Date();
      start.setHours(0, 0, 0, 0);
      break;
    case 'last7days':
      start = new Date();
      start.setDate(start.getDate() - 7);
      break;
    case 'last30days':
      start = new Date();
      start.setDate(start.getDate() - 30);
      break;
    case 'last3months':
      start = new Date();
      start.setMonth(start.getMonth() - 3);
      break;
    case 'allTime':
    default:
      start = null;
  }
  
  return { start, end };
}

export function AccountPage({ lang, onBack, onBuyCredits }: AccountPageProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'generations'>('overview');
  
  const t = labels[lang] || labels.en;

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const statsRes = await getUserStats();
      if (statsRes.success) setStats(statsRes.data || null);
    } catch (err) {
      console.error('Failed to load account data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          className={activeTab === 'transactions' ? 'active' : ''}
          onClick={() => setActiveTab('transactions')}
        >
          {t.allTransactions}
        </button>
        <button
          className={activeTab === 'generations' ? 'active' : ''}
          onClick={() => setActiveTab('generations')}
        >
          {t.allGenerations}
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <TransactionList 
              lang={lang} 
              mode="preview" 
              onViewAll={() => setActiveTab('transactions')} 
            />
          </motion.div>
        )}
        
        {activeTab === 'transactions' && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <TransactionList lang={lang} mode="full" onBack={() => setActiveTab('overview')} />
          </motion.div>
        )}
        
        {activeTab === 'generations' && (
          <motion.div
            key="generations"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <GenerationList lang={lang} mode="full" onBack={() => setActiveTab('overview')} />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .account-page {
          max-width: 900px;
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
      `}</style>
    </motion.div>
  );
}

// ============================================
// Transaction List Component
// ============================================
interface TransactionListProps {
  lang: Language;
  mode: 'preview' | 'full';
  onViewAll?: () => void;
  onBack?: () => void;
}

function TransactionList({ lang, mode, onViewAll, onBack }: TransactionListProps) {
  const t = labels[lang] || labels.en;
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = mode === 'preview' ? 5 : 15;
  
  // Filters
  const [dateRange, setDateRange] = useState('allTime');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Detail modal
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    loadTransactions();
  }, [page, dateRange, typeFilter, mode]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const offset = (page - 1) * pageSize;
      
      const params = new URLSearchParams({
        limit: String(pageSize),
        offset: String(offset),
      });
      
      const res = await fetch(getApiUrl(`/api/credits/history?${params}`), {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const data = await res.json();
      if (data.success) {
        let items = data.data?.transactions || [];
        const totalCount = items.length + offset; // 估算总数
        
        // 客户端筛选（如果 API 不支持）
        if (typeFilter !== 'all') {
          items = items.filter((tx: Transaction) => tx.type === typeFilter);
        }
        if (dateRange !== 'allTime') {
          const { start } = getDateRange(dateRange);
          if (start) {
            items = items.filter((tx: Transaction) => new Date(tx.created_at) >= start);
          }
        }
        
        setTransactions(items);
        setTotal(totalCount);
        setTotalPages(Math.ceil(totalCount / pageSize) || 1);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
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

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="list-container">
      {/* Filters (only in full mode) */}
      {mode === 'full' && (
        <div className="filters-bar">
          <div className="filter-group">
            <label>{t.dateRange}</label>
            <select value={dateRange} onChange={e => { setDateRange(e.target.value); setPage(1); }}>
              <option value="allTime">{t.allTime}</option>
              <option value="today">{t.today}</option>
              <option value="last7days">{t.last7days}</option>
              <option value="last30days">{t.last30days}</option>
              <option value="last3months">{t.last3months}</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>{t.type}</label>
            <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}>
              <option value="all">{t.allTypes}</option>
              <option value="purchase">{t.purchase}</option>
              <option value="consume">{t.consume}</option>
              <option value="gift">{t.gift}</option>
              <option value="refund">{t.refund}</option>
            </select>
          </div>
          
          <button className="reset-btn" onClick={() => { setDateRange('allTime'); setTypeFilter('all'); setPage(1); }}>
            {t.resetFilter}
          </button>
        </div>
      )}

      {/* List */}
      <div className="list-items">
        {loading ? (
          <div className="loading-inline">{t.loading}</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">{t.noData}</div>
        ) : (
          transactions.map(tx => (
            <div 
              key={tx.id} 
              className={`list-item ${mode === 'full' ? 'clickable' : ''}`}
              onClick={() => mode === 'full' && setSelectedTransaction(tx)}
            >
              <div className="item-main">
                <span className={`type-badge ${tx.type}`}>{getTypeLabel(tx.type)}</span>
                <span className="item-desc">{tx.description || '-'}</span>
              </div>
              <div className="item-meta">
                <span className={`points ${tx.points > 0 ? 'positive' : 'negative'}`}>
                  {tx.points > 0 ? '+' : ''}{tx.points} {t.points}
                </span>
                <span className="item-date">{formatDateShort(tx.created_at)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Button (preview mode) */}
      {mode === 'preview' && transactions.length > 0 && onViewAll && (
        <button className="view-all-btn" onClick={onViewAll}>
          {t.viewAll} →
        </button>
      )}

      {/* Pagination (full mode) */}
      {mode === 'full' && totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={page <= 1} 
            onClick={() => setPage(p => p - 1)}
          >
            {t.prevPage}
          </button>
          <span className="page-info">
            {t.page} {page} {t.of} {totalPages} {t.items}
          </span>
          <button 
            disabled={page >= totalPages} 
            onClick={() => setPage(p => p + 1)}
          >
            {t.nextPage}
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{t.transactionDetail}</h3>
                <button onClick={() => setSelectedTransaction(null)}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="detail-row">
                  <label>{t.type}</label>
                  <span className={`type-badge ${selectedTransaction.type}`}>
                    {getTypeLabel(selectedTransaction.type)}
                  </span>
                </div>
                <div className="detail-row">
                  <label>{t.amount}</label>
                  <span className={selectedTransaction.points > 0 ? 'positive' : 'negative'}>
                    {selectedTransaction.points > 0 ? '+' : ''}{selectedTransaction.points} {t.points}
                  </span>
                </div>
                <div className="detail-row">
                  <label>{t.balanceAfter}</label>
                  <span>{selectedTransaction.balance_after} {t.points}</span>
                </div>
                <div className="detail-row">
                  <label>{t.time}</label>
                  <span>{new Date(selectedTransaction.created_at).toLocaleString()}</span>
                </div>
                {selectedTransaction.description && (
                  <div className="detail-row">
                    <label>{t.detail}</label>
                    <span>{selectedTransaction.description}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{{...styles}}</style>
    </div>
  );
}

// ============================================
// Generation List Component
// ============================================
interface GenerationListProps {
  lang: Language;
  mode: 'preview' | 'full';
  onBack?: () => void;
}

function GenerationList({ lang, mode, onBack }: GenerationListProps) {
  const t = labels[lang] || labels.en;
  
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = mode === 'preview' ? 5 : 10;
  
  // Filters
  const [dateRange, setDateRange] = useState('allTime');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Detail modal
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadGenerations();
  }, [page, dateRange, statusFilter, mode]);

  const loadGenerations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const offset = (page - 1) * pageSize;
      
      const params = new URLSearchParams({
        limit: String(pageSize),
        offset: String(offset),
      });
      
      const res = await fetch(getApiUrl(`/api/generations?${params}`), {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const data = await res.json();
      if (data.success) {
        let items = data.data || [];
        const totalCount = items.length + offset;
        
        // Client-side filtering
        if (statusFilter !== 'all') {
          items = items.filter((g: Generation) => g.status === statusFilter);
        }
        if (dateRange !== 'allTime') {
          const { start } = getDateRange(dateRange);
          if (start) {
            items = items.filter((g: Generation) => new Date(g.created_at) >= start);
          }
        }
        
        setGenerations(items);
        setTotal(totalCount);
        setTotalPages(Math.ceil(totalCount / pageSize) || 1);
      }
    } catch (err) {
      console.error('Failed to load generations:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseInputData = (inputStr: string) => {
    try {
      return JSON.parse(inputStr);
    } catch {
      return { raw: inputStr };
    }
  };

  return (
    <div className="list-container">
      {/* Filters (only in full mode) */}
      {mode === 'full' && (
        <div className="filters-bar">
          <div className="filter-group">
            <label>{t.dateRange}</label>
            <select value={dateRange} onChange={e => { setDateRange(e.target.value); setPage(1); }}>
              <option value="allTime">{t.allTime}</option>
              <option value="today">{t.today}</option>
              <option value="last7days">{t.last7days}</option>
              <option value="last30days">{t.last30days}</option>
              <option value="last3months">{t.last3months}</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>{t.status}</label>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="all">{t.allStatus}</option>
              <option value="success">{t.success}</option>
              <option value="failed">{t.failed}</option>
            </select>
          </div>
          
          <button className="reset-btn" onClick={() => { setDateRange('allTime'); setStatusFilter('all'); setPage(1); }}>
            {t.resetFilter}
          </button>
        </div>
      )}

      {/* List */}
      <div className="list-items">
        {loading ? (
          <div className="loading-inline">{t.loading}</div>
        ) : generations.length === 0 ? (
          <div className="empty-state">{t.noData}</div>
        ) : (
          generations.map(gen => (
            <div 
              key={gen.id} 
              className={`list-item generation-item ${mode === 'full' ? 'clickable' : ''}`}
              onClick={() => mode === 'full' && setSelectedGeneration(gen)}
            >
              <div className="gen-header">
                <span className="gen-template">{gen.template_name}</span>
                <span className={`status-badge ${gen.status}`}>
                  {gen.status === 'success' ? '✓' : '✕'}
                </span>
              </div>
              <div className="gen-preview">
                {gen.output_content?.slice(0, 80) || '...'}
              </div>
              <div className="gen-footer">
                <span className={`cost-badge ${gen.cost_type}`}>
                  {gen.cost_type === 'subscription' ? '🎫' : `-${gen.credits_used}${t.points}`}
                </span>
                <span className="item-date">{formatDateShort(gen.created_at)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination (full mode) */}
      {mode === 'full' && totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={page <= 1} 
            onClick={() => setPage(p => p - 1)}
          >
            {t.prevPage}
          </button>
          <span className="page-info">
            {t.page} {page} {t.of} {totalPages} {t.items}
          </span>
          <button 
            disabled={page >= totalPages} 
            onClick={() => setPage(p => p + 1)}
          >
            {t.nextPage}
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedGeneration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setSelectedGeneration(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content large"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{t.generationDetail}</h3>
                <button onClick={() => setSelectedGeneration(null)}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="detail-row">
                  <label>{t.template}</label>
                  <span>{selectedGeneration.template_name}</span>
                </div>
                <div className="detail-row">
                  <label>{t.time}</label>
                  <span>{new Date(selectedGeneration.created_at).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <label>{t.status}</label>
                  <span className={`status-badge ${selectedGeneration.status}`}>
                    {selectedGeneration.status === 'success' ? t.success : t.failed}
                  </span>
                </div>
                
                <div className="detail-section">
                  <label>{t.input}</label>
                  <div className="input-data">
                    {Object.entries(parseInputData(selectedGeneration.input_data)).map(([key, value]) => (
                      <div key={key} className="input-item">
                        <span className="input-key">{key}:</span>
                        <span className="input-value">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedGeneration.output_content && (
                  <div className="detail-section">
                    <div className="section-header">
                      <label>{t.output}</label>
                      <button 
                        className="copy-btn"
                        onClick={() => handleCopy(selectedGeneration.output_content || '')}
                      >
                        {copied ? t.copied : t.copy}
                      </button>
                    </div>
                    <div className="output-content">
                      {selectedGeneration.output_content}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{styles}</style>
    </div>
  );
}

// Shared Styles
const styles = `
  .list-container {
    background: white;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }
  
  .filters-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 16px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .filter-group label {
    font-size: 12px;
    color: #666;
  }
  
  .filter-group select {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
    background: white;
    cursor: pointer;
  }
  
  .reset-btn {
    align-self: flex-end;
    padding: 8px 16px;
    background: #f1f5f9;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #666;
  }
  
  .reset-btn:hover {
    background: #e2e8f0;
  }
  
  .list-items {
    min-height: 200px;
  }
  
  .loading-inline,
  .empty-state {
    padding: 40px;
    text-align: center;
    color: #999;
  }
  
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .list-item:last-child {
    border-bottom: none;
  }
  
  .list-item.clickable {
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .list-item.clickable:hover {
    background: #f8fafc;
  }
  
  .item-main {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .type-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .type-badge.purchase {
    background: #dcfce7;
    color: #16a34a;
  }
  
  .type-badge.consume {
    background: #fef3c7;
    color: #d97706;
  }
  
  .type-badge.gift {
    background: #dbeafe;
    color: #2563eb;
  }
  
  .type-badge.refund {
    background: #fce7f3;
    color: #db2777;
  }
  
  .item-desc {
    font-size: 14px;
    color: #333;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .item-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }
  
  .points {
    font-weight: 600;
    font-size: 14px;
  }
  
  .points.positive {
    color: #16a34a;
  }
  
  .points.negative {
    color: #dc2626;
  }
  
  .item-date {
    font-size: 12px;
    color: #999;
  }
  
  .view-all-btn {
    width: 100%;
    padding: 12px;
    background: #f8fafc;
    border: none;
    border-top: 1px solid #e2e8f0;
    cursor: pointer;
    font-size: 14px;
    color: #667eea;
    font-weight: 500;
  }
  
  .view-all-btn:hover {
    background: #f1f5f9;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-top: 1px solid #e2e8f0;
  }
  
  .pagination button {
    padding: 8px 16px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .pagination button:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
  
  .page-info {
    font-size: 14px;
    color: #666;
  }
  
  /* Generation items */
  .generation-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .gen-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  .gen-template {
    font-weight: 500;
    font-size: 14px;
  }
  
  .status-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
  
  .status-badge.success {
    background: #dcfce7;
    color: #16a34a;
  }
  
  .status-badge.failed {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .gen-preview {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
    line-height: 1.5;
  }
  
  .gen-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .cost-badge {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
  }
  
  .cost-badge.subscription {
    background: #dbeafe;
    color: #2563eb;
  }
  
  .cost-badge.credits {
    background: #fef3c7;
    color: #d97706;
  }
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }
  
  .modal-content {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 480px;
    max-height: 80vh;
    overflow: auto;
  }
  
  .modal-content.large {
    max-width: 640px;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .modal-header h3 {
    font-size: 18px;
    font-weight: 600;
  }
  
  .modal-header button {
    background: none;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    line-height: 1;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .detail-row label {
    font-size: 14px;
    color: #666;
  }
  
  .detail-section {
    margin-top: 16px;
  }
  
  .detail-section label {
    display: block;
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .section-header label {
    margin-bottom: 0;
  }
  
  .copy-btn {
    padding: 4px 12px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
  }
  
  .input-data {
    background: #f8fafc;
    border-radius: 8px;
    padding: 12px;
  }
  
  .input-item {
    display: flex;
    gap: 8px;
    padding: 4px 0;
  }
  
  .input-key {
    font-weight: 500;
    color: #666;
    min-width: 100px;
  }
  
  .input-value {
    color: #333;
  }
  
  .output-content {
    background: #f8fafc;
    border-radius: 8px;
    padding: 16px;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    max-height: 300px;
    overflow: auto;
  }
`;