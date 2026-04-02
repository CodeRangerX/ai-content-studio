import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Language } from '../lib/i18n';
import { getApiUrl } from '../lib/auth';

interface AccountPageProps {
  lang: Language;
  onBack: () => void;
  onBuyCredits: () => void;
  onViewBills: () => void;
  creditBalance?: number | null;
  onBalanceUpdate?: () => void;
}

// 购买记录
interface Purchase {
  id: string;
  package_id: string;
  points: number;
  price: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  completed_at: string | null;
}

// 生成记录（使用明细）
interface Generation {
  id: string;
  template_id: string;
  template_name: string;
  input_data: string;
  output_content: string | null;
  credits_used: number;
  status: 'success' | 'failed';
  tokens_input?: number;
  tokens_output?: number;
  generation_time_ms?: number;
  created_at: string;
}

const labels = {
  zh: {
    title: '我的账户',
    back: '返回',
    credits: '点数余额',
    buyCredits: '购买点数',
    viewBills: '查看账单',
    
    // 使用记录
    usageRecords: '使用记录',
    costPoints: '消耗',
    genTime: '时间',
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
    noData: '暂无记录',
    loading: '加载中...',
    
    // 其他
    points: '点',
    totalUsed: '累计消耗',
    usageTip: '每次生成消耗 1 点',
  },
  en: {
    title: 'My Account',
    back: 'Back',
    credits: 'Credits',
    buyCredits: 'Buy Credits',
    viewBills: 'View Bills',
    
    usageRecords: 'Usage Records',
    costPoints: 'Used',
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
    noData: 'No records',
    loading: 'Loading...',
    
    points: 'pts',
    totalUsed: 'Total Used',
    usageTip: '1 credit per generation',
  },
};

export function AccountPage({ lang, onBack, onBuyCredits, onViewBills, creditBalance, onBalanceUpdate }: AccountPageProps) {
  const t = labels[lang] || labels.zh;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="account-page-v2"
    >
      {/* Header */}
      <div className="account-header-v2">
        <button onClick={onBack} className="back-btn-v2">← {t.back}</button>
        <h1>{t.title}</h1>
      </div>

      {/* 点数卡片 - 醒目展示 */}
      <div className="credits-card-main">
        <div className="credits-info">
          <span className="credits-label">{t.credits}</span>
          <span className="credits-value">{creditBalance ?? 0}</span>
          <span className="credits-unit">{t.points}</span>
        </div>
        <div className="credits-actions">
          <button onClick={onBuyCredits} className="buy-credits-main-btn">
            <span>💎</span>
            <span>{t.buyCredits}</span>
          </button>
          <button onClick={onViewBills} className="view-bills-btn">
            <span>💳</span>
            <span>{t.viewBills}</span>
          </button>
        </div>
      </div>

      {/* 使用提示 */}
      <div className="usage-tip-card">
        <span className="tip-icon">💡</span>
        <span className="tip-text">{t.usageTip}</span>
      </div>

      {/* 使用记录 */}
      <div className="usage-section">
        <h2 className="section-title">
          <span className="section-icon">📝</span>
          {t.usageRecords}
        </h2>
        <UsageRecordsList lang={lang} />
      </div>
    </motion.div>
  );
}

// ============================================
// 使用记录列表
// ============================================
function UsageRecordsList({ lang }: { lang: Language }) {
  const t = labels[lang] || labels.zh;
  const [records, setRecords] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selected, setSelected] = useState<Generation | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { loadRecords(); }, []);

  const loadRecords = async (pageNum = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const res = await fetch(getApiUrl(`/api/generations?limit=20&offset=${(pageNum-1)*20}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const newRecords = data.data || [];
        if (pageNum === 1) {
          setRecords(newRecords);
        } else {
          setRecords(prev => [...prev, ...newRecords]);
        }
        setHasMore(newRecords.length === 20);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return lang === 'zh' ? '刚刚' : 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}${lang === 'zh' ? '分钟前' : 'm ago'}`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}${lang === 'zh' ? '小时前' : 'h ago'}`;
    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' });
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms/1000).toFixed(1)}s`;
  };

  return (
    <div className="usage-list">
      {loading && records.length === 0 ? (
        <div className="list-loading">{t.loading}</div>
      ) : records.length === 0 ? (
        <div className="list-empty">
          <span className="empty-icon">📝</span>
          <span>{t.noData}</span>
        </div>
      ) : (
        <>
          {records.map(r => (
            <div key={r.id} className={`usage-item ${r.status}`} onClick={() => setSelected(r)}>
              <div className="usage-item-main">
                <span className="usage-template">{r.template_name}</span>
                <span className={`usage-status ${r.status}`}>
                  {r.status === 'success' ? '✓' : '✕'}
                </span>
              </div>
              <div className="usage-item-meta">
                <span className="usage-time">{formatTime(r.created_at)}</span>
                <span className="usage-cost">-{r.credits_used} {t.points}</span>
              </div>
            </div>
          ))}
          
          {hasMore && (
            <button 
              className="load-more-btn" 
              onClick={() => { setPage(p => p + 1); loadRecords(page + 1); }}
              disabled={loading}
            >
              {loading ? t.loading : (lang === 'zh' ? '加载更多' : 'Load More')}
            </button>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selected.template_name}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">{t.genTime}</span>
                <span>{new Date(selected.created_at).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t.costPoints}</span>
                <span>-{selected.credits_used} {t.points}</span>
              </div>
              {selected.generation_time_ms && (
                <div className="detail-row">
                  <span className="detail-label">{lang === 'zh' ? '耗时' : 'Duration'}</span>
                  <span>{formatDuration(selected.generation_time_ms)}</span>
                </div>
              )}
              {selected.tokens_input && selected.tokens_output && (
                <div className="detail-row">
                  <span className="detail-label">Tokens</span>
                  <span>{selected.tokens_input} → {selected.tokens_output}</span>
                </div>
              )}

              {selected.output_content && (
                <div className="output-section">
                  <div className="output-header">
                    <span>{t.output}</span>
                    <button onClick={() => handleCopy(selected.output_content || '')}>
                      {copied ? t.copied : t.copy}
                    </button>
                  </div>
                  <pre className="output-text">{selected.output_content}</pre>
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
// 使用统计组件
// ============================================
function UsageStats({ lang }: { lang: Language }) {
  const t = labels[lang] || labels.zh;
  const [stats, setStats] = useState({ totalUsed: 0, thisMonth: 0 });
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const res = await fetch(getApiUrl('/api/stats'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats({
          totalUsed: data.data?.credits?.totalUsed || 0,
          thisMonth: data.data?.generations?.creditsUsed || 0
        });
      }
    } catch (e) { console.error(e); }
  };
  
  return (
    <div className="usage-stats-mini">
      <div className="stat-mini">
        <span className="stat-mini-label">{t.totalUsed}</span>
        <span className="stat-mini-value">{stats.totalUsed} {t.points}</span>
      </div>
    </div>
  );
}