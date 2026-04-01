import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Language } from '../lib/i18n';
import { getApiUrl } from '../lib/auth';

interface BillsPageProps {
  lang: Language;
  onBack: () => void;
  onBuyCredits: () => void;
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

const labels = {
  zh: {
    title: '账单记录',
    back: '返回',
    buyCredits: '购买点数',
    
    // 表格字段
    orderId: '订单号',
    package: '点数包',
    points: '点数',
    amount: '金额',
    status: '状态',
    createTime: '创建时间',
    completeTime: '完成时间',
    
    // 状态
    pending: '处理中',
    completed: '已完成',
    failed: '失败',
    
    // 其他
    noData: '暂无账单记录',
    loading: '加载中...',
    buyNow: '立即购买',
    totalSpent: '累计消费',
    totalPoints: '累计获得',
    recordsCount: '记录数',
    
    // 点数包名称
    starter: '入门包',
    standard: '标准包',
    advanced: '进阶包',
    professional: '专业包',
  },
  en: {
    title: 'Billing Records',
    back: 'Back',
    buyCredits: 'Buy Credits',
    
    // Table fields
    orderId: 'Order ID',
    package: 'Package',
    points: 'Points',
    amount: 'Amount',
    status: 'Status',
    createTime: 'Created',
    completeTime: 'Completed',
    
    // Status
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    
    // Other
    noData: 'No billing records',
    loading: 'Loading...',
    buyNow: 'Buy Now',
    totalSpent: 'Total Spent',
    totalPoints: 'Total Points',
    recordsCount: 'Records',
    
    // Package names
    starter: 'Starter',
    standard: 'Standard',
    advanced: 'Advanced',
    professional: 'Professional',
  },
};

export function BillsPage({ lang, onBack, onBuyCredits }: BillsPageProps) {
  const { isAuthenticated } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  
  const t = labels[lang] || labels.zh;

  useEffect(() => {
    if (isAuthenticated) {
      loadBills();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadBills = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const res = await fetch(getApiUrl('/api/credits/purchases'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPurchases(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => `$${(cents/100).toFixed(2)}`;

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      default: return 'status-failed';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return t.completed;
      case 'pending': return t.pending;
      default: return t.failed;
    }
  };

  const getPackageLabel = (packageId: string) => {
    const pkgNames: Record<string, string> = {
      starter: t.starter,
      standard: t.standard,
      advanced: t.advanced,
      professional: t.professional,
    };
    return pkgNames[packageId] || packageId;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateId = (id: string) => {
    // 显示前8位和后4位
    if (id.length > 16) {
      return `${id.slice(0, 8)}...${id.slice(-4)}`;
    }
    return id;
  };

  // 统计数据
  const stats = {
    totalSpent: purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.price, 0),
    totalPoints: purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.points, 0),
    count: purchases.length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bills-page"
    >
      {/* Header */}
      <div className="bills-page-header">
        <button onClick={onBack} className="back-btn-v2">← {t.back}</button>
        <h1>{t.title}</h1>
      </div>

      {/* 统计卡片 */}
      <div className="bills-stats-card">
        <div className="stat-item">
          <span className="stat-label">{t.totalSpent}</span>
          <span className="stat-value spent">{formatPrice(stats.totalSpent)}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-label">{t.totalPoints}</span>
          <span className="stat-value points">{stats.totalPoints.toLocaleString()}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-label">{t.recordsCount}</span>
          <span className="stat-value count">{stats.count}</span>
        </div>
      </div>

      {/* 账单表格 */}
      <div className="bills-table-container">
        {loading ? (
          <div className="bills-loading">{t.loading}</div>
        ) : purchases.length === 0 ? (
          <div className="bills-empty">
            <span className="empty-icon">💳</span>
            <span className="empty-text">{t.noData}</span>
            <button className="empty-action-btn" onClick={onBuyCredits}>{t.buyNow}</button>
          </div>
        ) : (
          <table className="bills-table">
            <thead>
              <tr>
                <th className="col-order-id">{t.orderId}</th>
                <th className="col-package">{t.package}</th>
                <th className="col-points">{t.points}</th>
                <th className="col-amount">{t.amount}</th>
                <th className="col-status">{t.status}</th>
                <th className="col-create-time">{t.createTime}</th>
                <th className="col-complete-time">{t.completeTime}</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className={p.status}>
                  <td className="col-order-id" title={p.id}>{truncateId(p.id)}</td>
                  <td className="col-package">
                    <span className="package-badge">{getPackageLabel(p.package_id)}</span>
                  </td>
                  <td className="col-points">
                    <span className="points-number">{p.points.toLocaleString()}</span>
                    <span className="points-unit">{lang === 'zh' ? '点' : 'pts'}</span>
                  </td>
                  <td className="col-amount">{formatPrice(p.price)}</td>
                  <td className="col-status">
                    <span className={`status-badge ${getStatusClass(p.status)}`}>
                      {getStatusLabel(p.status)}
                    </span>
                  </td>
                  <td className="col-create-time">{formatDate(p.created_at)}</td>
                  <td className="col-complete-time">{formatDate(p.completed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 购买按钮 */}
      <button className="bills-buy-btn" onClick={onBuyCredits}>
        <span>💎</span>
        <span>{t.buyCredits}</span>
      </button>

      <style>{`
        .bills-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 100px 24px 60px;
        }

        .bills-page-header {
          margin-bottom: 32px;
        }

        .bills-page-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #f5f3ef;
          margin-top: 8px;
        }

        /* 统计卡片 */
        .bills-stats-card {
          background: linear-gradient(135deg, rgba(196, 160, 82, 0.1) 0%, rgba(26, 26, 30, 0.8) 100%);
          border: 1px solid rgba(196, 160, 82, 0.2);
          border-radius: 16px;
          padding: 20px 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-label {
          font-size: 13px;
          color: rgba(245, 243, 239, 0.6);
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
        }

        .stat-value.spent { color: #c4a052; }
        .stat-value.points { color: #22c55e; }
        .stat-value.count { color: #f5f3ef; }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(196, 160, 82, 0.2);
        }

        /* 表格容器 */
        .bills-table-container {
          background: rgba(26, 26, 30, 0.6);
          border: 1px solid rgba(196, 160, 82, 0.08);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .bills-loading, .bills-empty {
          padding: 60px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .bills-loading {
          color: rgba(245, 243, 239, 0.5);
        }

        .empty-icon {
          font-size: 48px;
          opacity: 0.5;
        }

        .empty-text {
          color: rgba(245, 243, 239, 0.5);
        }

        .empty-action-btn {
          background: linear-gradient(135deg, #c4a052 0%, #a08040 100%);
          border: none;
          color: #0d0d0f;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 16px;
        }

        /* 表格样式 */
        .bills-table {
          width: 100%;
          border-collapse: collapse;
        }

        .bills-table th {
          background: rgba(196, 160, 82, 0.1);
          padding: 14px 16px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: rgba(245, 243, 239, 0.7);
          border-bottom: 1px solid rgba(196, 160, 82, 0.12);
        }

        .bills-table td {
          padding: 16px;
          font-size: 14px;
          color: #f5f3ef;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .bills-table tr:hover td {
          background: rgba(255, 255, 255, 0.03);
        }

        .bills-table tr.completed td { border-left: 3px solid #22c55e; }
        .bills-table tr.pending td { border-left: 3px solid #eab308; }
        .bills-table tr.failed td { border-left: 3px solid #ef4444; }

        /* 列样式 */
        .col-order-id {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(245, 243, 239, 0.6);
        }

        .package-badge {
          background: rgba(102, 126, 234, 0.15);
          border: 1px solid rgba(102, 126, 234, 0.3);
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 13px;
          color: #a5b4fc;
        }

        .points-number {
          font-weight: 600;
          color: #22c55e;
        }

        .points-unit {
          font-size: 12px;
          color: rgba(245, 243, 239, 0.5);
          margin-left: 4px;
        }

        .col-amount {
          font-weight: 600;
          color: #c4a052;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-completed {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .status-pending {
          background: rgba(234, 179, 8, 0.15);
          color: #eab308;
        }

        .status-failed {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .col-create-time, .col-complete-time {
          font-size: 13px;
          color: rgba(245, 243, 239, 0.6);
        }

        /* 购买按钮 */
        .bills-buy-btn {
          width: 100%;
          background: linear-gradient(135deg, #c4a052 0%, #a08040 100%);
          border: none;
          color: #0d0d0f;
          padding: 16px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .bills-buy-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(196, 160, 82, 0.3);
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
          .bills-page {
            padding: 100px 16px 40px;
          }

          .bills-stats-card {
            padding: 16px 20px;
            gap: 16px;
            flex-wrap: wrap;
          }

          .stat-value {
            font-size: 18px;
          }

          .stat-divider {
            display: none;
          }

          /* 移动端表格使用卡片式布局 */
          .bills-table-container {
            overflow-x: auto;
          }

          .bills-table th, .bills-table td {
            padding: 12px 10px;
            font-size: 12px;
          }

          .col-complete-time {
            display: none;
          }
        }
      `}</style>
    </motion.div>
  );
}