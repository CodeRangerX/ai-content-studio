import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Language, translations } from '../lib/i18n';
import { getApiUrl } from '../lib/auth';

interface PricingPageProps {
  lang: Language;
  onBack: () => void;
  onSuccess?: () => void;
}

interface SubscriptionStatus {
  isPro: boolean;
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: string;
  } | null;
}

const plans = {
  pro_monthly: {
    id: 'pro_monthly',
    price: 9,
    period: 'month',
    periodLabel: { zh: '月', en: 'month', fr: 'mois', ru: 'месяц', ja: '月', ko: '월', de: 'Monat', es: 'mes' },
  },
  pro_yearly: {
    id: 'pro_yearly',
    price: 79,
    period: 'year',
    periodLabel: { zh: '年', en: 'year', fr: 'an', ru: 'год', ja: '年', ko: '년', de: 'Jahr', es: 'año' },
    savings: { zh: '省 $29', en: 'Save $29', fr: 'Économisez $29', ru: 'Сэкономьте $29', ja: '$29お得', ko: '$29 절약', de: 'Sparen Sie $29', es: 'Ahorra $29' },
  },
};

const features = {
  zh: [
    { text: '无限内容生成', free: false, pro: true },
    { text: '全部 25+ 模板', free: '部分', pro: true },
    { text: '历史记录保存', free: false, pro: true },
    { text: '优先响应速度', free: false, pro: true },
    { text: '高级 AI 模型', free: false, pro: true },
    { text: 'API 访问', free: false, pro: '即将推出' },
  ],
  en: [
    { text: 'Unlimited content generation', free: false, pro: true },
    { text: 'All 25+ templates', free: 'Partial', pro: true },
    { text: 'History saved', free: false, pro: true },
    { text: 'Priority response speed', free: false, pro: true },
    { text: 'Advanced AI models', free: false, pro: true },
    { text: 'API access', free: false, pro: 'Coming soon' },
  ],
  fr: [
    { text: 'Génération de contenu illimitée', free: false, pro: true },
    { text: 'Tous les 25+ modèles', free: 'Partiel', pro: true },
    { text: 'Historique sauvegardé', free: false, pro: true },
    { text: 'Vitesse de réponse prioritaire', free: false, pro: true },
    { text: 'Modèles IA avancés', free: false, pro: true },
    { text: 'Accès API', free: false, pro: 'Bientôt' },
  ],
  ru: [
    { text: 'Безлимитная генерация контента', free: false, pro: true },
    { text: 'Все 25+ шаблонов', free: 'Частично', pro: true },
    { text: 'История сохранена', free: false, pro: true },
    { text: 'Приоритетная скорость ответа', free: false, pro: true },
    { text: 'Продвинутые ИИ модели', free: false, pro: true },
    { text: 'API доступ', free: false, pro: 'Скоро' },
  ],
  ja: [
    { text: '無制限コンテンツ生成', free: false, pro: true },
    { text: '全25+テンプレート', free: '一部', pro: true },
    { text: '履歴保存', free: false, pro: true },
    { text: '優先レスポンス速度', free: false, pro: true },
    { text: '高度なAIモデル', free: false, pro: true },
    { text: 'API アクセス', free: false, pro: '近日公開' },
  ],
  ko: [
    { text: '무제한 콘텐츠 생성', free: false, pro: true },
    { text: '모든 25+ 템플릿', free: '일부', pro: true },
    { text: '기록 저장', free: false, pro: true },
    { text: '우선 응답 속도', free: false, pro: true },
    { text: '고급 AI 모델', free: false, pro: true },
    { text: 'API 액세스', free: false, pro: '출시 예정' },
  ],
  de: [
    { text: 'Unbegrenzte Content-Erstellung', free: false, pro: true },
    { text: 'Alle 25+ Vorlagen', free: 'Teilweise', pro: true },
    { text: 'Verlauf gespeichert', free: false, pro: true },
    { text: 'Prioritäre Antwortgeschwindigkeit', free: false, pro: true },
    { text: 'Erweiterte KI-Modelle', free: false, pro: true },
    { text: 'API-Zugang', free: false, pro: 'Demnächst' },
  ],
  es: [
    { text: 'Generación de contenido ilimitada', free: false, pro: true },
    { text: 'Todas las 25+ plantillas', free: 'Parcial', pro: true },
    { text: 'Historial guardado', free: false, pro: true },
    { text: 'Velocidad de respuesta prioritaria', free: false, pro: true },
    { text: 'Modelos de IA avanzados', free: false, pro: true },
    { text: 'Acceso API', free: false, pro: 'Próximamente' },
  ],
};

// Updated: 1774187866
const labels = {
  zh: {
    title: '选择您的计划',
    subtitle: '解锁全部功能，提升创作效率',
    free: '免费版',
    pro: 'Pro',
    month: '月',
    year: '年',
    currentPlan: '当前计划',
    upgrade: '升级',
    downgrade: '降级',
    subscribe: '订阅',
    manage: '管理订阅',
    cancel: '取消订阅',
    active: '活跃',
    cancelled: '已取消',
    expires: '到期时间',
    loading: '加载中...',
    loginRequired: '请先登录',
    login: '登录',
    back: '返回',
    processing: '处理中...',
    success: '订阅成功！',
    error: '操作失败，请重试',
  },
  en: {
    title: 'Choose Your Plan',
    subtitle: 'Unlock all features and boost your productivity',
    free: 'Free',
    pro: 'Pro',
    month: 'month',
    year: 'year',
    currentPlan: 'Current Plan',
    upgrade: 'Upgrade',
    downgrade: 'Downgrade',
    subscribe: 'Subscribe',
    manage: 'Manage Subscription',
    cancel: 'Cancel Subscription',
    active: 'Active',
    cancelled: 'Cancelled',
    expires: 'Expires',
    loading: 'Loading...',
    loginRequired: 'Please login first',
    login: 'Login',
    back: 'Back',
    processing: 'Processing...',
    success: 'Subscription successful!',
    error: 'Operation failed, please try again',
  },
  fr: {
    title: 'Choisissez votre plan',
    subtitle: 'Débloquez toutes les fonctionnalités et augmentez votre productivité',
    free: 'Gratuit',
    pro: 'Pro',
    month: 'mois',
    year: 'an',
    currentPlan: 'Plan actuel',
    upgrade: 'Mettre à niveau',
    downgrade: 'Rétrograder',
    subscribe: "S'abonner",
    manage: 'Gérer l\'abonnement',
    cancel: 'Annuler l\'abonnement',
    active: 'Actif',
    cancelled: 'Annulé',
    expires: 'Expire',
    loading: 'Chargement...',
    loginRequired: 'Veuillez vous connecter',
    login: 'Connexion',
    back: 'Retour',
    processing: 'Traitement...',
    success: 'Abonnement réussi!',
    error: 'Échec de l\'opération, veuillez réessayer',
  },
  ru: {
    title: 'Выберите план',
    subtitle: 'Разблокируйте все функции и повысьте продуктивность',
    free: 'Бесплатно',
    pro: 'Pro',
    month: 'месяц',
    year: 'год',
    currentPlan: 'Текущий план',
    upgrade: 'Повысить',
    downgrade: 'Понизить',
    subscribe: 'Подписаться',
    manage: 'Управлять подпиской',
    cancel: 'Отменить подписку',
    active: 'Активен',
    cancelled: 'Отменён',
    expires: 'Истекает',
    loading: 'Загрузка...',
    loginRequired: 'Пожалуйста, войдите',
    login: 'Войти',
    back: 'Назад',
    processing: 'Обработка...',
    success: 'Подписка успешна!',
    error: 'Ошибка, попробуйте снова',
  },
  ja: {
    title: 'プランを選択',
    subtitle: 'すべての機能をアンロックして生産性を向上',
    free: '無料',
    pro: 'Pro',
    month: '月',
    year: '年',
    currentPlan: '現在のプラン',
    upgrade: 'アップグレード',
    downgrade: 'ダウングレード',
    subscribe: '購読',
    manage: '購読管理',
    cancel: '購読をキャンセル',
    active: '有効',
    cancelled: 'キャンセル済み',
    expires: '有効期限',
    loading: '読み込み中...',
    loginRequired: 'ログインしてください',
    login: 'ログイン',
    back: '戻る',
    processing: '処理中...',
    success: '購読成功！',
    error: '操作に失敗しました',
  },
  ko: {
    title: '플랜 선택',
    subtitle: '모든 기능을 잠금 해제하고 생산성을 높이세요',
    free: '무료',
    pro: 'Pro',
    month: '월',
    year: '년',
    currentPlan: '현재 플랜',
    upgrade: '업그레이드',
    downgrade: '다운그레이드',
    subscribe: '구독',
    manage: '구독 관리',
    cancel: '구독 취소',
    active: '활성',
    cancelled: '취소됨',
    expires: '만료',
    loading: '로딩 중...',
    loginRequired: '로그인이 필요합니다',
    login: '로그인',
    back: '뒤로',
    processing: '처리 중...',
    success: '구독 성공!',
    error: '작업 실패, 다시 시도하세요',
  },
  de: {
    title: 'Wählen Sie Ihren Plan',
    subtitle: 'Schalten Sie alle Funktionen frei und steigern Sie Ihre Produktivität',
    free: 'Kostenlos',
    pro: 'Pro',
    month: 'Monat',
    year: 'Jahr',
    currentPlan: 'Aktueller Plan',
    upgrade: 'Upgrade',
    downgrade: 'Downgrade',
    subscribe: 'Abonnieren',
    manage: 'Abo verwalten',
    cancel: 'Abo kündigen',
    active: 'Aktiv',
    cancelled: 'Storniert',
    expires: 'Läuft ab',
    loading: 'Laden...',
    loginRequired: 'Bitte anmelden',
    login: 'Anmelden',
    back: 'Zurück',
    processing: 'Verarbeitung...',
    success: 'Abonnement erfolgreich!',
    error: 'Vorgang fehlgeschlagen, bitte erneut versuchen',
  },
  es: {
    title: 'Elige tu plan',
    subtitle: 'Desbloquea todas las funciones y aumenta tu productividad',
    free: 'Gratis',
    pro: 'Pro',
    month: 'mes',
    year: 'año',
    currentPlan: 'Plan actual',
    upgrade: 'Actualizar',
    downgrade: 'Degradar',
    subscribe: 'Suscribirse',
    manage: 'Gestionar suscripción',
    cancel: 'Cancelar suscripción',
    active: 'Activo',
    cancelled: 'Cancelado',
    expires: 'Expira',
    loading: 'Cargando...',
    loginRequired: 'Por favor inicie sesión',
    login: 'Iniciar sesión',
    back: 'Volver',
    processing: 'Procesando...',
    success: '¡Suscripción exitosa!',
    error: 'Operación fallida, intente de nuevo',
  },
};

export function PricingPage({ lang, onBack, onSuccess }: PricingPageProps) {
  const { isAuthenticated, user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const t = labels[lang];
  const featureList = features[lang];

  // 获取订阅状态
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        const res = await fetch(getApiUrl('/api/subscription/status'), {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setStatus(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch subscription status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [isAuthenticated]);

  // 创建订阅
  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) return;
    
    setProcessing(planId);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const res = await fetch(getApiUrl('/api/subscription/create'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planId }),
      });
      
      const data = await res.json();
      
      if (data.success && data.data.approvalUrl) {
        // 跳转到 PayPal 授权页面
        window.location.href = data.data.approvalUrl;
      } else {
        setError(data.message || t.error);
      }
    } catch (err) {
      console.error('Subscribe error:', err);
      setError(t.error);
    } finally {
      setProcessing(null);
    }
  };

  // 取消订阅
  const handleCancel = async () => {
    if (!isAuthenticated || !status?.subscription) return;
    
    if (!confirm(lang === 'zh' ? '确定要取消订阅吗？' : 'Are you sure you want to cancel?')) {
      return;
    }
    
    setProcessing('cancel');
    setError(null);

    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const res = await fetch(getApiUrl('/api/subscription/cancel'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      
      if (data.success) {
        // 刷新状态
        setStatus(prev => prev ? {
          ...prev,
          subscription: prev.subscription ? {
            ...prev.subscription,
            status: 'cancelled',
          } : null,
        } : null);
      } else {
        setError(data.message || t.error);
      }
    } catch (err) {
      console.error('Cancel error:', err);
      setError(t.error);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pricing-page"
    >
      {/* Header */}
      <div className="pricing-header">
        <button onClick={onBack} className="pricing-back">
          ← {t.back}
        </button>
        <h1 className="pricing-title">{t.title}</h1>
        <p className="pricing-subtitle">{t.subtitle}</p>
      </div>

      {/* Login Prompt */}
      {!isAuthenticated && (
        <div className="pricing-login-prompt">
          <p>{t.loginRequired}</p>
          <button className="pricing-login-btn">
            {t.login}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && isAuthenticated && (
        <div className="pricing-loading">
          <div className="loading-spinner" />
          <p>{t.loading}</p>
        </div>
      )}

      {/* Plans */}
      {!loading && (
        <div className="pricing-plans">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`pricing-card ${status?.isPro === false ? 'current' : ''}`}
          >
            <div className="pricing-card-header">
              <h3 className="pricing-card-name">{t.free}</h3>
              <div className="pricing-card-price">
                <span className="price-amount">$0</span>
                <span className="price-period">/{t.month}</span>
              </div>
            </div>
            
            <ul className="pricing-features">
              {featureList.map((feature, idx) => (
                <li key={idx} className={`pricing-feature ${feature.free ? '' : 'disabled'}`}>
                  <span className="feature-icon">
                    {feature.free ? '✓' : '✕'}
                  </span>
                  <span>{feature.text}</span>
                  {feature.free && feature.free !== true && (
                    <span className="feature-note">({feature.free})</span>
                  )}
                </li>
              ))}
            </ul>
            
            {status?.isPro === false && (
              <div className="pricing-current-badge">
                {t.currentPlan}
              </div>
            )}
          </motion.div>

          {/* Pro Plans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`pricing-card pro ${status?.isPro ? 'current' : ''}`}
          >
            <div className="pricing-card-popular">
              {lang === 'zh' ? '最受欢迎' : 'Most Popular'}
            </div>
            
            <div className="pricing-card-header">
              <h3 className="pricing-card-name">{t.pro}</h3>
              <div className="pricing-card-price">
                <span className="price-amount">${plans.pro_monthly.price}</span>
                <span className="price-period">/{t.month}</span>
              </div>
            </div>
            
            <ul className="pricing-features">
              {featureList.map((feature, idx) => (
                <li key={idx} className="pricing-feature">
                  <span className="feature-icon">✓</span>
                  <span>{feature.text}</span>
                  {feature.pro !== true && (
                    <span className="feature-note">({feature.pro})</span>
                  )}
                </li>
              ))}
            </ul>
            
            {/* Subscription Status */}
            {status?.isPro && status.subscription && (
              <div className="pricing-status">
                <div className="status-badge">
                  {status.subscription.status === 'active' ? t.active : t.cancelled}
                </div>
                {status.subscription.currentPeriodEnd && (
                  <p className="status-expires">
                    {t.expires}: {new Date(status.subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
            
            {/* Action Button */}
            <div className="pricing-action">
              {status?.isPro ? (
                status.subscription?.status === 'active' ? (
                  <button
                    onClick={handleCancel}
                    disabled={processing === 'cancel'}
                    className="pricing-btn secondary"
                  >
                    {processing === 'cancel' ? t.processing : t.cancel}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe('pro_monthly')}
                    disabled={!!processing}
                    className="pricing-btn"
                  >
                    {processing ? t.processing : t.subscribe}
                  </button>
                )
              ) : (
                <button
                  onClick={() => handleSubscribe('pro_monthly')}
                  disabled={!!processing || !isAuthenticated}
                  className="pricing-btn"
                >
                  {processing ? t.processing : t.subscribe}
                </button>
              )}
            </div>
          </motion.div>

          {/* Yearly Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`pricing-card yearly ${status?.subscription?.plan === 'pro_yearly' ? 'current' : ''}`}
          >
            <div className="pricing-card-savings">
              {plans.pro_yearly.savings[lang]}
            </div>
            
            <div className="pricing-card-header">
              <h3 className="pricing-card-name">{t.pro} ({t.year})</h3>
              <div className="pricing-card-price">
                <span className="price-amount">${plans.pro_yearly.price}</span>
                <span className="price-period">/{t.year}</span>
              </div>
              <div className="price-monthly">
                ${Math.round(plans.pro_yearly.price / 12)}/{t.month}
              </div>
            </div>
            
            <ul className="pricing-features">
              {featureList.map((feature, idx) => (
                <li key={idx} className="pricing-feature">
                  <span className="feature-icon">✓</span>
                  <span>{feature.text}</span>
                  {feature.pro !== true && (
                    <span className="feature-note">({feature.pro})</span>
                  )}
                </li>
              ))}
            </ul>
            
            {/* Subscription Status for Yearly */}
            {status?.subscription?.plan === 'pro_yearly' && (
              <div className="pricing-status">
                <div className="status-badge">
                  {status.subscription.status === 'active' ? t.active : t.cancelled}
                </div>
                {status.subscription.currentPeriodEnd && (
                  <p className="status-expires">
                    {t.expires}: {new Date(status.subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
            
            {/* Action Button */}
            <div className="pricing-action">
              {status?.subscription?.plan === 'pro_yearly' ? (
                status.subscription.status === 'active' ? (
                  <button
                    onClick={handleCancel}
                    disabled={processing === 'cancel'}
                    className="pricing-btn secondary"
                  >
                    {processing === 'cancel' ? t.processing : t.cancel}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe('pro_yearly')}
                    disabled={!!processing}
                    className="pricing-btn"
                  >
                    {processing ? t.processing : t.subscribe}
                  </button>
                )
              ) : (
                <button
                  onClick={() => handleSubscribe('pro_yearly')}
                  disabled={!!processing || !isAuthenticated}
                  className="pricing-btn"
                >
                  {processing ? t.processing : t.subscribe}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pricing-error"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}// cache bust: 1774187701
