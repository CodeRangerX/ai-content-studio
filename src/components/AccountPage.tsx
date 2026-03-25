import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Language } from '../lib/i18n';
import { getApiUrl } from '../lib/auth';
import { getUserStats, type UserStats } from '../lib/credits';

interface AccountPageProps {
  lang: Language;
  onBack: () => void;
  onBuyCredits: () => void;
}

// 购买记录（账单）
interface Purchase {
  id: string;
  package_id: string;
  points: number;
  price: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  completed_at: string | null;
}

// 订阅记录（账单）
interface SubscriptionRecord {
  id: string;
  plan: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

// 生成记录（使用明细）
interface Generation {
  id: string;
  template_id: string;
  template_name: string;
  input_data: string;
  output_content: string | null;
  credits_used: number;
  cost_type: 'subscription' | 'credits';
  status: 'success' | 'failed';
  tokens_input?: number;
  tokens_output?: number;
  generation_time_ms?: number;
  created_at: string;
}

const labels = {
  zh: {
    title: '我的账户', back: '返回', subscription: '订阅状态', credits: '点数余额',
    proPlan: 'Pro 套餐', freePlan: '免费版', active: '活跃', expired: '已过期',
    expiresAt: '到期时间', buyCredits: '购买点数', thisMonthStats: '本月统计',
    generations: '生成次数', creditsUsed: '消耗点数', subscriptionSaved: '节省',
    
    // Tab
    usageRecords: '使用记录',
    bills: '账单',
    
    // 使用记录
    usageTitle: '使用记录',
    costPoints: '消耗点数',
    genTime: '生成时间',
    genStatus: '状态',
    success: '成功',
    failed: '失败',
    template: '模板',
    input: '输入',
    output: '输出',
    copy: '复制',
    copied: '已复制',
    detail: '详情',
    close: '关闭',
    noData: '暂无数据',
    loading: '加载中...',
    
    // 筛选
    filter: '筛选', dateRange: '时间范围', status: '状态', allStatus: '全部状态',
    resetFilter: '重置', prevPage: '上一页', nextPage: '下一页', page: '第', of: '共',
    today: '今天', last7days: '最近7天', last30days: '最近30天', allTime: '全部时间',
    
    // 账单
    billsTitle: '账单',
    billType: '类型',
    billAmount: '金额',
    billTime: '时间',
    billStatus: '状态',
    billPending: '处理中',
    billCompleted: '已完成',
    billFailed: '失败',
    pointsPurchase: '点数购买',
    subscriptionPurchase: '订阅',
    points: '点',
    unlimited: '无限',
  },
  en: {
    title: 'My Account', back: 'Back', subscription: 'Subscription', credits: 'Credits',
    proPlan: 'Pro Plan', freePlan: 'Free', active: 'Active', expired: 'Expired',
    expiresAt: 'Expires', buyCredits: 'Buy Credits', thisMonthStats: 'This Month',
    generations: 'Generations', creditsUsed: 'Credits Used', subscriptionSaved: 'Saved',
    
    usageRecords: 'Usage Records',
    bills: 'Bills',
    
    usageTitle: 'Usage Records',
    costPoints: 'Credits Used',
    genTime: 'Time',
    genStatus: 'Status',
    success: 'Success',
    failed: 'Failed',
    template: 'Template',
    input: 'Input',
    output: 'Output',
    copy: 'Copy',
    copied: 'Copied',
    detail: 'Detail',
    close: 'Close',
    noData: 'No data',
    loading: 'Loading...',
    
    filter: 'Filter', dateRange: 'Date Range', status: 'Status', allStatus: 'All Status',
    resetFilter: 'Reset', prevPage: 'Previous', nextPage: 'Next', page: 'Page', of: 'of',
    today: 'Today', last7days: 'Last 7 days', last30days: 'Last 30 days', allTime: 'All time',
    
    billsTitle: 'Bills',
    billType: 'Type',
    billAmount: 'Amount',
    billTime: 'Time',
    billStatus: 'Status',
    billPending: 'Pending',
    billCompleted: 'Completed',
    billFailed: 'Failed',
    pointsPurchase: 'Points Purchase',
    subscriptionPurchase: 'Subscription',
    points: 'pts',
    unlimited: 'Unlimited',
  },
};

export function AccountPage({ lang, onBack, onBuyCredits }: AccountPageProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'usage' | 'bills'>('usage');
  
  const t = labels[lang] || labels.zh;

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await getUserStats();
      if (res.success && res.data) setStats(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
    } catch { return dateStr; }
  };

  if (loading) {
    return (
      <div className="account-page-loading">
        <div className="loading-spinner" />
        <p>{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="account-page">
      {/* Header */}
      <div className="account-header">
        <button onClick={onBack} className="account-back-btn">← {t.back}</button>
        <h1>{t.title}</h1>
      </div>

      {/* Overview Cards */}
      <div className="account-cards">
        <div className="account-card sub">
          <div className="card-label">{t.subscription}</div>
          <div className="card-value">{stats?.isPro ? t.proPlan : t.freePlan}</div>
          {stats?.subscription && (
            <div className="card-detail">
              <span className={stats.subscription.status === 'active' ? 'status-active' : 'status-expired'}>
                {stats.subscription.status === 'active' ? t.active : t.expired}
              </span>
              {stats.subscription.currentPeriodEnd && (
                <span>{t.expiresAt}: {formatDate(stats.subscription.currentPeriodEnd)}</span>
              )}
            </div>
          )}
        </div>

        <div className="account-card credits">
          <div className="card-label">{t.credits}</div>
          <div className="card-value">
            {stats?.isPro ? `∞ ${t.unlimited}` : `${stats?.credits?.balance || 0} ${t.points}`}
          </div>
          {!stats?.isPro && (
            <button onClick={onBuyCredits} className="buy-credits-btn">{t.buyCredits}</button>
          )}
        </div>
      </div>

      {/* Monthly Stats */}
      {stats && (
        <div className="monthly-stats">
          <h3>{t.thisMonthStats}</h3>
          <div className="stats-row">
            <div className="stat"><span className="v">{stats.generations?.totalThisMonth || 0}</span><span className="l">{t.generations}</span></div>
            <div className="stat"><span className="v">{stats.generations?.creditsUsed || 0}</span><span className="l">{t.creditsUsed}</span></div>
            {stats.isPro && <div className="stat highlight"><span className="v">{stats.generations?.subscriptionSaved || 0}</span><span className="l">{t.subscriptionSaved}</span></div>}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="account-tabs">
        <button className={activeTab === 'usage' ? 'active' : ''} onClick={() => setActiveTab('usage')}>
          {t.usageRecords}
        </button>
        <button className={activeTab === 'bills' ? 'active' : ''} onClick={() => setActiveTab('bills')}>
          {t.bills}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'usage' && <UsageRecordsList lang={lang} />}
      {activeTab === 'bills' && <BillsList lang={lang} />}
    </div>
  );
}

// ============================================
// 使用记录列表（消耗明细）
// ============================================
function UsageRecordsList({ lang }: { lang: Language }) {
  const t = labels[lang] || labels.zh;
  const [records, setRecords] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFilter, setDateFilter] = useState('allTime');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Generation | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { loadRecords(); }, [page]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const res = await fetch(getApiUrl(`/api/generations?limit=20&offset=${(page-1)*20}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRecords(data.data || []);
        setTotalPages(Math.ceil((data.data?.length || 0) / 20) + 1);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms/1000).toFixed(1)}s`;
  };

  // 客户端筛选
  let filtered = records;
  if (statusFilter !== 'all') {
    filtered = filtered.filter(r => r.status === statusFilter);
  }
  if (dateFilter !== 'allTime') {
    const now = new Date();
    let start: Date;
    switch (dateFilter) {
      case 'today': start = new Date(now.setHours(0,0,0,0)); break;
      case 'last7days': start = new Date(now.setDate(now.getDate()-7)); break;
      case 'last30days': start = new Date(now.setDate(now.getDate()-30)); break;
      default: start = new Date(0);
    }
    if (dateFilter !== 'allTime') {
      filtered = filtered.filter(r => new Date(r.created_at) >= start);
    }
  }

  return (
    <div className="usage-container">
      {/* Filters */}
      <div className="usage-filters">
        <select value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
          <option value="allTime">{t.allTime}</option>
          <option value="today">{t.today}</option>
          <option value="last7days">{t.last7days}</option>
          <option value="last30days">{t.last30days}</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">{t.allStatus}</option>
          <option value="success">{t.success}</option>
          <option value="failed">{t.failed}</option>
        </select>
        <button onClick={() => { setDateFilter('allTime'); setStatusFilter('all'); }}>{t.resetFilter}</button>
      </div>

      {/* Table */}
      <div className="usage-table">
        <div className="usage-header-row">
          <span className="col-time">{t.genTime}</span>
          <span className="col-template">{t.template}</span>
          <span className="col-cost">{t.costPoints}</span>
          <span className="col-status">{t.genStatus}</span>
          <span className="col-action"></span>
        </div>
        
        {loading ? (
          <div className="usage-loading">{t.loading}</div>
        ) : filtered.length === 0 ? (
          <div className="usage-empty">{t.noData}</div>
        ) : (
          filtered.map(r => (
            <div key={r.id} className={`usage-row ${r.status}`}>
              <span className="col-time">{new Date(r.created_at).toLocaleString()}</span>
              <span className="col-template">{r.template_name}</span>
              <span className="col-cost">
                {r.cost_type === 'subscription' ? (
                  <span className="cost-sub">订阅</span>
                ) : (
                  <span className="cost-pts">{r.credits_used} {t.points}</span>
                )}
              </span>
              <span className="col-status">
                <span className={r.status === 'success' ? 'badge-success' : 'badge-failed'}>
                  {r.status === 'success' ? t.success : t.failed}
                </span>
              </span>
              <span className="col-action">
                <button onClick={() => setSelected(r)}>{t.detail}</button>
              </span>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>{t.prevPage}</button>
          <span>{t.page} {page} {t.of} {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>{t.nextPage}</button>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t.usageTitle}</h3>
              <button onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>{t.genTime}</label>
                  <span>{new Date(selected.created_at).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <label>{t.template}</label>
                  <span>{selected.template_name}</span>
                </div>
                <div className="detail-item">
                  <label>{t.costPoints}</label>
                  <span>{selected.cost_type === 'subscription' ? '订阅用户' : `${selected.credits_used} ${t.points}`}</span>
                </div>
                <div className="detail-item">
                  <label>{t.genStatus}</label>
                  <span className={selected.status === 'success' ? 'badge-success' : 'badge-failed'}>
                    {selected.status === 'success' ? t.success : t.failed}
                  </span>
                </div>
                {selected.generation_time_ms && (
                  <div className="detail-item">
                    <label>耗时</label>
                    <span>{formatDuration(selected.generation_time_ms)}</span>
                  </div>
                )}
                {selected.tokens_input && selected.tokens_output && (
                  <div className="detail-item">
                    <label>Tokens</label>
                    <span>输入 {selected.tokens_input} / 输出 {selected.tokens_output}</span>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="detail-section">
                <label>{t.input}</label>
                <div className="input-box">
                  {(() => {
                    try {
                      const data = JSON.parse(selected.input_data);
                      return Object.entries(data).map(([k, v]) => (
                        <div key={k} className="input-item"><span className="k">{k}:</span> <span className="v">{String(v)}</span></div>
                      ));
                    } catch { return selected.input_data; }
                  })()}
                </div>
              </div>

              {/* Output */}
              {selected.output_content && (
                <div className="detail-section">
                  <div className="section-header">
                    <label>{t.output}</label>
                    <button onClick={() => handleCopy(selected.output_content || '')}>
                      {copied ? t.copied : t.copy}
                    </button>
                  </div>
                  <pre className="output-box">{selected.output_content}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// 账单列表（订阅+购买记录）
// ============================================
function BillsList({ lang }: { lang: Language }) {
  const t = labels[lang] || labels.zh;
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBills(); }, []);

  const loadBills = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      
      // 获取购买记录
      const purchaseRes = await fetch(getApiUrl('/api/credits/purchases'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const purchaseData = await purchaseRes.json();
      if (purchaseData.success) setPurchases(purchaseData.data || []);

      // 获取订阅状态
      const subRes = await fetch(getApiUrl('/api/subscription/status'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const subData = await subRes.json();
      if (subData.success && subData.data?.subscription) {
        setSubscription(subData.data.subscription);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const formatPrice = (cents: number) => `$${(cents/100).toFixed(2)}`;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return t.billCompleted;
      case 'pending': return t.billPending;
      case 'failed': return t.billFailed;
      default: return status;
    }
  };

  return (
    <div className="bills-container">
      {loading ? (
        <div className="bills-loading">{t.loading}</div>
      ) : (
        <>
          {/* 订阅记录 */}
          {subscription && (
            <div className="bills-section">
              <h3>{t.subscriptionPurchase}</h3>
              <div className="bills-table">
                <div className="bills-header-row">
                  <span>{t.billType}</span>
                  <span>{t.billAmount}</span>
                  <span>{t.billTime}</span>
                  <span>{t.billStatus}</span>
                </div>
                <div className="bills-row">
                  <span>{subscription.plan === 'pro_monthly' ? 'Pro 月付' : subscription.plan === 'pro_yearly' ? 'Pro 年付' : subscription.plan}</span>
                  <span>{subscription.plan === 'pro_monthly' ? '$9.00' : subscription.plan === 'pro_yearly' ? '$79.00' : '-'}</span>
                  <span>{new Date(subscription.created_at).toLocaleDateString()}</span>
                  <span className={subscription.status === 'active' ? 'badge-success' : 'badge-failed'}>{subscription.status === 'active' ? t.active : t.expired}</span>
                </div>
              </div>
            </div>
          )}

          {/* 点数购买记录 */}
          <div className="bills-section">
            <h3>{t.pointsPurchase}</h3>
            <div className="bills-table">
              <div className="bills-header-row">
                <span>{t.billType}</span>
                <span>{t.points}</span>
                <span>{t.billAmount}</span>
                <span>{t.billTime}</span>
                <span>{t.billStatus}</span>
              </div>
              {purchases.length === 0 ? (
                <div className="bills-empty">{t.noData}</div>
              ) : (
                purchases.map(p => (
                  <div key={p.id} className="bills-row">
                    <span>{p.package_id}</span>
                    <span>{p.points} {t.points}</span>
                    <span>{formatPrice(p.price)}</span>
                    <span>{new Date(p.created_at).toLocaleDateString()}</span>
                    <span className={`badge-${p.status}`}>{getStatusLabel(p.status)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
