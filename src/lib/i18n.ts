// 国际化配置
export type Language = 'zh' | 'en' | 'fr' | 'ru' | 'ja' | 'ko' | 'de' | 'es';

export const languageNames: Record<Language, string> = {
  zh: '中文',
  en: 'English',
  fr: 'Français',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  de: 'Deutsch',
  es: 'Español'
};

export const translations: Record<Language, {
  title: string;
  subtitle: string;
  free: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSub: string;
  all: string;
  ecommerce: string;
  social: string;
  content: string;
  selectPlaceholder: string;
  generate: string;
  generating: string;
  output: string;
  copy: string;
  copied: string;
  selectTemplate: string;
  creating: string;
  poweredBy: string;
}> = {
  zh: {
    title: '内容工坊',
    subtitle: 'CONTENT STUDIO',
    free: '免费使用',
    heroTitle1: '一键生成',
    heroTitle2: '专业文案',
    heroSub: 'POWERED BY DEEPSEEK REASONER',
    all: '全部',
    ecommerce: '电商',
    social: '社媒',
    content: '内容',
    selectPlaceholder: '请选择...',
    generate: '✨ 开始生成',
    generating: '创作中...',
    output: 'OUTPUT',
    copy: '复制',
    copied: '已复制',
    selectTemplate: '选择模板开始创作',
    creating: '正在创作...',
    poweredBy: 'POWERED BY DEEPSEEK'
  },
  en: {
    title: 'Content Studio',
    subtitle: 'CONTENT STUDIO',
    free: 'Free',
    heroTitle1: 'Generate',
    heroTitle2: 'Professional Content',
    heroSub: 'POWERED BY DEEPSEEK REASONER',
    all: 'All',
    ecommerce: 'E-commerce',
    social: 'Social Media',
    content: 'Content',
    selectPlaceholder: 'Select...',
    generate: '✨ Generate',
    generating: 'Generating...',
    output: 'OUTPUT',
    copy: 'Copy',
    copied: 'Copied',
    selectTemplate: 'Select a template to start',
    creating: 'Creating...',
    poweredBy: 'POWERED BY DEEPSEEK'
  },
  fr: {
    title: 'Studio de Contenu',
    subtitle: 'CONTENT STUDIO',
    free: 'Gratuit',
    heroTitle1: 'Générez',
    heroTitle2: 'Contenu Professionnel',
    heroSub: 'POWERED BY DEEPSEEK REASONER',
    all: 'Tout',
    ecommerce: 'E-commerce',
    social: 'Réseaux Sociaux',
    content: 'Contenu',
    selectPlaceholder: 'Sélectionner...',
    generate: '✨ Générer',
    generating: 'Génération...',
    output: 'SORTIE',
    copy: 'Copier',
    copied: 'Copié',
    selectTemplate: 'Sélectionnez un modèle',
    creating: 'Création...',
    poweredBy: 'POWERED BY DEEPSEEK'
  },
  ru: {
    title: 'Контент-студия',
    subtitle: 'CONTENT STUDIO',
    free: 'Бесплатно',
    heroTitle1: 'Создавайте',
    heroTitle2: 'Профессиональный контент',
    heroSub: 'POWERED BY DEEPSEEK REASONER',
    all: 'Все',
    ecommerce: 'Электронная коммерция',
    social: 'Социальные сети',
    content: 'Контент',
    selectPlaceholder: 'Выбрать...',
    generate: '✨ Создать',
    generating: 'Создание...',
    output: 'РЕЗУЛЬТАТ',
    copy: 'Копировать',
    copied: 'Скопировано',
    selectTemplate: 'Выберите шаблон',
    creating: 'Создание...',
    poweredBy: 'POWERED BY DEEPSEEK'
  },
  ja: {
    title: 'コンテンツスタジオ',
    subtitle: 'CONTENT STUDIO',
    free: '無料',
    heroTitle1: 'ワンクリックで生成',
    heroTitle2: 'プロフェッショナルなコピー',
    heroSub: 'POWERED BY DEEPSEEK REASONER',
    all: 'すべて',
    ecommerce: 'EC',
    social: 'SNS',
    content: 'コンテンツ',
    selectPlaceholder: '選択...',
    generate: '✨ 生成開始',
    generating: '生成中...',
    output: '出力',
    copy: 'コピー',
    copied: 'コピー完了',
    selectTemplate: 'テンプレートを選択',
    creating: '作成中...',
    poweredBy: 'POWERED BY DEEPSEEK'
  },
  ko: {
    title: '콘텐츠 스튜디오',
    subtitle: 'CONTENT STUDIO',
    free: '무료',
    heroTitle1: '원클릭 생성',
    heroTitle2: '전문 카피',
    heroSub: 'POWERED BY DEEPSEEK REASONER',
    all: '전체',
    ecommerce: '이커머스',
    social: '소셜미디어',
    content: '콘텐츠',
    selectPlaceholder: '선택...',
    generate: '✨ 생성하기',
    generating: '생성 중...',
    output: '출력',
    copy: '복사',
    copied: '복사됨',
    selectTemplate: '템플릿 선택',
    creating: '생성 중...',
    poweredBy: 'POWERED BY DEEPSEEK'
  },
  de: {
    title: 'Content Studio',
    subtitle: 'CONTENT STUDIO',
    free: 'Kostenlos',
    heroTitle1: 'Erstellen Sie',
    heroTitle2: 'Professionelle Inhalte',
    heroSub: 'POWERED BY DEEPSEEK REASONER',
    all: 'Alle',
    ecommerce: 'E-Commerce',
    social: 'Soziale Medien',
    content: 'Inhalte',
    selectPlaceholder: 'Auswählen...',
    generate: '✨ Generieren',
    generating: 'Generierung...',
    output: 'AUSGABE',
    copy: 'Kopieren',
    copied: 'Kopiert',
    selectTemplate: 'Vorlage auswählen',
    creating: 'Erstellung...',
    poweredBy: 'POWERED BY DEEPSEEK'
  },
  es: {
    title: 'Estudio de Contenido',
    subtitle: 'CONTENT STUDIO',
    free: 'Gratis',
    heroTitle1: 'Genera',
    heroTitle2: 'Contenido Profesional',
    heroSub: 'POWERED BY DEEPSEEK REASONER',
    all: 'Todo',
    ecommerce: 'E-commerce',
    social: 'Redes Sociales',
    content: 'Contenido',
    selectPlaceholder: 'Seleccionar...',
    generate: '✨ Generar',
    generating: 'Generando...',
    output: 'SALIDA',
    copy: 'Copiar',
    copied: 'Copiado',
    selectTemplate: 'Selecciona una plantilla',
    creating: 'Creando...',
    poweredBy: 'POWERED BY DEEPSEEK'
  }
};