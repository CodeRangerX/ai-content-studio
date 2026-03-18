// 模板多语言配置
import { Language } from './i18n';

// 模板变量类型
export interface TemplateVariable {
  name: string;
  type: 'text' | 'select' | 'textarea';
  required: boolean;
  // 多语言标签和占位符
  labels: Record<Language, string>;
  placeholders?: Record<Language, string>;
  options?: { value: string; labels: Record<Language, string> }[];
}

// 模板类型
export interface Template {
  id: string;
  category: string;
  icon: string;
  isPremium?: boolean;
  // 多语言名称和描述
  names: Record<Language, string>;
  descriptions: Record<Language, string>;
  variables: TemplateVariable[];
  promptTemplate: string;
}

// 分类多语言
export const categoryNames: Record<string, Record<Language, string>> = {
  all: { zh: '全部', en: 'All', fr: 'Tout', ru: 'Все', ja: 'すべて', ko: '전체', de: 'Alle', es: 'Todo' },
  ecommerce: { zh: '电商', en: 'E-commerce', fr: 'E-commerce', ru: 'Электронная коммерция', ja: 'EC', ko: '이커머스', de: 'E-Commerce', es: 'E-commerce' },
  social: { zh: '社媒', en: 'Social Media', fr: 'Réseaux Sociaux', ru: 'Социальные сети', ja: 'SNS', ko: '소셜미디어', de: 'Soziale Medien', es: 'Redes Sociales' },
  content: { zh: '内容', en: 'Content', fr: 'Contenu', ru: 'Контент', ja: 'コンテンツ', ko: '콘텐츠', de: 'Inhalte', es: 'Contenido' }
};

// 分类列表
export const categories = [
  { id: 'all', name: '全部' },
  { id: 'ecommerce', name: '电商' },
  { id: 'social', name: '社媒' },
  { id: 'content', name: '内容' }
];

// 辅助函数：根据语言获取模板信息
export function getTemplateName(template: Template, lang: Language): string {
  return template.names[lang] || template.names.en;
}

export function getTemplateDescription(template: Template, lang: Language): string {
  return template.descriptions[lang] || template.descriptions.en;
}

export function getVariableLabel(variable: TemplateVariable, lang: Language): string {
  return variable.labels[lang] || variable.labels.en;
}

export function getVariablePlaceholder(variable: TemplateVariable, lang: Language): string | undefined {
  return variable.placeholders?.[lang] || variable.placeholders?.en;
}

export function getOptionLabel(option: { value: string; labels: Record<Language, string> }, lang: Language): string {
  return option.labels[lang] || option.labels.en;
}

// 语言指令映射
export const languageInstructions: Record<Language, string> = {
  zh: '请用中文输出所有内容。',
  en: 'Please output all content in English.',
  fr: 'Veuillez produire tout le contenu en français.',
  ru: 'Пожалуйста, выводите весь контент на русском языке.',
  ja: 'すべてのコンテンツを日本語で出力してください。',
  ko: '모든 콘텐츠를 한국어로 출력해 주세요.',
  de: 'Bitte geben Sie alle Inhalte auf Deutsch aus.',
  es: 'Por favor, produce todo el contenido en español.'
};

// 精选模板列表（重新设计）
export const templates: Template[] = [
  // ==================== 社媒文案 ====================
  {
    id: 'x-post',
    category: 'social',
    icon: '𝕏',
    names: {
      zh: '推特文案',
      en: 'X / Twitter Post',
      fr: 'Post X / Twitter',
      ru: 'Пост в X / Twitter',
      ja: 'X/Twitter投稿',
      ko: 'X/Twitter 게시물',
      de: 'X / Twitter Beitrag',
      es: 'Post de X / Twitter'
    },
    descriptions: {
      zh: '生成病毒式传播的推文',
      en: 'Generate viral tweets that engage and convert',
      fr: 'Générez des tweets viraux',
      ru: 'Создайте вирусные твиты',
      ja: 'バズるツイートを生成',
      ko: '바이럴 트윗 생성',
      de: 'Erstellen Sie virale Tweets',
      es: 'Genera tweets virales'
    },
    variables: [
      { 
        name: 'topic', 
        type: 'text', 
        required: true,
        labels: {
          zh: '主题',
          en: 'Topic',
          fr: 'Sujet',
          ru: 'Тема',
          ja: 'トピック',
          ko: '주제',
          de: 'Thema',
          es: 'Tema'
        },
        placeholders: {
          zh: '例如：AI工具、生产力、科技新闻',
          en: 'e.g., AI tools, productivity, tech news',
          fr: 'ex: outils IA, productivité',
          ru: 'напр.: AI инструменты',
          ja: '例：AIツール、生産性',
          ko: '예: AI 도구, 생산성',
          de: 'z.B. AI-Tools, Produktivität',
          es: 'ej: herramientas IA'
        }
      },
      { 
        name: 'tone', 
        type: 'select', 
        required: true,
        labels: {
          zh: '语气',
          en: 'Tone',
          fr: 'Ton',
          ru: 'Тон',
          ja: 'トーン',
          ko: '어조',
          de: 'Ton',
          es: 'Tono'
        },
        options: [
          { value: 'professional', labels: { zh: '专业', en: 'Professional', fr: 'Professionnel', ru: 'Профессиональный', ja: 'プロフェッショナル', ko: '전문적', de: 'Professionell', es: 'Profesional' } },
          { value: 'casual', labels: { zh: '随意', en: 'Casual', fr: 'Décontracté', ru: 'Небрежный', ja: 'カジュアル', ko: '캐주얼', de: 'Locker', es: 'Casual' } },
          { value: 'humorous', labels: { zh: '幽默', en: 'Humorous', fr: 'Humoristique', ru: 'Юмористический', ja: 'ユーモラス', ko: '유머러스', de: 'Humorvoll', es: 'Humorístico' } },
          { value: 'provocative', labels: { zh: '挑衅', en: 'Provocative', fr: 'Provocant', ru: 'Провокационный', ja: '挑発的', ko: '도발적', de: 'Provokant', es: 'Provocador' } },
          { value: 'inspirational', labels: { zh: '励志', en: 'Inspirational', fr: 'Inspirant', ru: 'Вдохновляющий', ja: 'インスピレーショナル', ko: '영감을 주는', de: 'Inspirierend', es: 'Inspirador' } },
        ]
      },
      { 
        name: 'goal', 
        type: 'select', 
        required: true,
        labels: {
          zh: '目标',
          en: 'Goal',
          fr: 'Objectif',
          ru: 'Цель',
          ja: '目的',
          ko: '목표',
          de: 'Ziel',
          es: 'Objetivo'
        },
        options: [
          { value: 'engagement', labels: { zh: '互动', en: 'Engagement', fr: 'Engagement', ru: 'Вовлечённость', ja: 'エンゲージメント', ko: '참여', de: 'Engagement', es: 'Compromiso' } },
          { value: 'awareness', labels: { zh: '品牌认知', en: 'Brand Awareness', fr: 'Notoriété', ru: 'Узнаваемость', ja: 'ブランド認知', ko: '브랜드 인지도', de: 'Markenbekanntheit', es: 'Conocimiento de marca' } },
          { value: 'traffic', labels: { zh: '引流', en: 'Drive Traffic', fr: 'Trafic', ru: 'Трафик', ja: 'トラフィック', ko: '트래픽 유도', de: 'Traffic generieren', es: 'Generar tráfico' } },
          { value: 'thought-leadership', labels: { zh: '思想领导', en: 'Thought Leadership', fr: 'Leadership', ru: 'Лидерство мнений', ja: '思想リーダーシップ', ko: '사상 리더십', de: 'Thought Leadership', es: 'Liderazgo de pensamiento' } },
        ]
      },
      { 
        name: 'keywords', 
        type: 'text', 
        required: false,
        labels: {
          zh: '关键词/标签',
          en: 'Keywords/Hashtags',
          fr: 'Mots-clés/Hashtags',
          ru: 'Ключевые слова',
          ja: 'キーワード/ハッシュタグ',
          ko: '키워드/해시태그',
          de: 'Schlüsselwörter/Hashtags',
          es: 'Palabras clave/Hashtags'
        },
        placeholders: {
          zh: '例如：#AI #科技',
          en: 'e.g., #AI #Tech',
          fr: 'ex: #IA #Tech',
          ru: 'напр.: #AI #Технологии',
          ja: '例：#AI #テック',
          ko: '예: #AI #테크',
          de: 'z.B. #AI #Tech',
          es: 'ej: #IA #Tech'
        }
      },
    ],
    promptTemplate: `You are a viral Twitter/X content expert who writes like a real human, not a bot.

【Topic】{topic}
【Tone】{tone}
【Goal】{goal}
【Keywords】{keywords}

【Requirements】
1. Keep it under 280 characters (hard limit)
2. Use hooks that grab attention in the first 3 words
3. Include 1-2 relevant hashtags (no more)
4. Use line breaks for readability
5. End with a CTA that matches the goal
6. Write like a human, not ChatGPT

【Output Format】
Generate 3 different tweets:

1️⃣ [Hook-focused tweet]

2️⃣ [Story/insight tweet]

3️⃣ [CTA-focused tweet]`
  },
  
  // ==================== 电商文案 ====================
  {
    id: 'product-description',
    category: 'ecommerce',
    icon: '🛍️',
    names: {
      zh: '商品描述',
      en: 'Product Description',
      fr: 'Description de Produit',
      ru: 'Описание товара',
      ja: '商品説明',
      ko: '제품 설명',
      de: 'Produktbeschreibung',
      es: 'Descripción de Producto'
    },
    descriptions: {
      zh: '生成吸引人的商品描述',
      en: 'Create compelling product descriptions that sell',
      fr: 'Créez des descriptions de produits convaincantes',
      ru: 'Создайте убедительные описания товаров',
      ja: '魅力的な商品説明を作成',
      ko: '매력적인 제품 설명 생성',
      de: 'Erstellen Sie überzeugende Produktbeschreibungen',
      es: 'Crea descripciones de productos convincentes'
    },
    variables: [
      { 
        name: 'product', 
        type: 'text', 
        required: true,
        labels: {
          zh: '商品名称',
          en: 'Product Name',
          fr: 'Nom du Produit',
          ru: 'Название товара',
          ja: '商品名',
          ko: '제품명',
          de: 'Produktname',
          es: 'Nombre del Producto'
        },
        placeholders: {
          zh: '例如：无线蓝牙耳机',
          en: 'e.g., Wireless Bluetooth Headphones',
          fr: 'ex: Écouteurs Bluetooth sans fil',
          ru: 'напр.: Беспроводные наушники',
          ja: '例：ワイヤレスBluetoothヘッドフォン',
          ko: '예: 무선 블루투스 헤드폰',
          de: 'z.B. Kabellose Bluetooth-Kopfhörer',
          es: 'ej: Auriculares Bluetooth inalámbricos'
        }
      },
      { 
        name: 'features', 
        type: 'textarea', 
        required: true,
        labels: {
          zh: '主要特点',
          en: 'Key Features',
          fr: 'Caractéristiques',
          ru: 'Ключевые особенности',
          ja: '主な特徴',
          ko: '주요 특징',
          de: 'Hauptmerkmale',
          es: 'Características Principales'
        },
        placeholders: {
          zh: '例如：降噪、长续航、舒适佩戴',
          en: 'e.g., Noise cancelling, long battery, comfortable fit',
          fr: 'ex: Réduction de bruit, longue autonomie',
          ru: 'напр.: Шумоподавление, долгая батарея',
          ja: '例：ノイズキャンセリング、長時間バッテリー',
          ko: '예: 노이즈 캔슬링, 긴 배터리 수명',
          de: 'z.B. Geräuschunterdrückung, lange Akkulaufzeit',
          es: 'ej: Cancelación de ruido, batería duradera'
        }
      },
      { 
        name: 'audience', 
        type: 'text', 
        required: false,
        labels: {
          zh: '目标人群',
          en: 'Target Audience',
          fr: 'Public Cible',
          ru: 'Целевая аудитория',
          ja: 'ターゲット層',
          ko: '타겟 오디언스',
          de: 'Zielgruppe',
          es: 'Público Objetivo'
        },
        placeholders: {
          zh: '例如：音乐爱好者、通勤族',
          en: 'e.g., Music lovers, commuters',
          fr: 'ex: Mélomanes, navetteurs',
          ru: 'напр.: Меломаны, пассажиры',
          ja: '例：音楽好き、通勤者',
          ko: '예: 음악 애호가, 통근자',
          de: 'z.B. Musikliebhaber, Pendler',
          es: 'ej: Amantes de la música, viajeros'
        }
      },
    ],
    promptTemplate: `You are an expert e-commerce copywriter.

【Product】{product}
【Features】{features}
【Target Audience】{audience}

【Requirements】
1. Write compelling, benefit-focused copy
2. Use sensory language and emotional triggers
3. Include a clear call-to-action
4. Format with bullet points for readability
5. Highlight unique selling propositions

【Output Format】
Generate a product description with:
- Attention-grabbing headline
- 2-3 key benefits with explanations
- Feature-to-benefit translations
- Strong closing with CTA`
  },
  
  // ==================== 内容创作 ====================
  {
    id: 'blog-outline',
    category: 'content',
    icon: '📝',
    names: {
      zh: '博客大纲',
      en: 'Blog Post Outline',
      fr: 'Plan d\'Article de Blog',
      ru: 'План статьи',
      ja: 'ブログアウトライン',
      ko: '블로그 글 개요',
      de: 'Blog-Post-Gliederung',
      es: 'Esquema de Artículo de Blog'
    },
    descriptions: {
      zh: '生成结构化的博客文章大纲',
      en: 'Generate structured blog post outlines',
      fr: 'Générez des plans d\'articles structurés',
      ru: 'Создайте структурированный план статьи',
      ja: '構造化されたブログ記事のアウトラインを生成',
      ko: '구조화된 블로그 글 개요 생성',
      de: 'Erstellen Sie strukturierte Blog-Post-Gliederungen',
      es: 'Genera esquemas estructurados de artículos'
    },
    variables: [
      { 
        name: 'topic', 
        type: 'text', 
        required: true,
        labels: {
          zh: '主题',
          en: 'Topic',
          fr: 'Sujet',
          ru: 'Тема',
          ja: 'トピック',
          ko: '주제',
          de: 'Thema',
          es: 'Tema'
        },
        placeholders: {
          zh: '例如：如何提高工作效率',
          en: 'e.g., How to boost productivity',
          fr: 'ex: Comment améliorer la productivité',
          ru: 'напр.: Как повысить продуктивность',
          ja: '例：生産性を高める方法',
          ko: '예: 생산성 향상 방법',
          de: 'z.B. Wie man die Produktivität steigert',
          es: 'ej: Cómo aumentar la productividad'
        }
      },
      { 
        name: 'style', 
        type: 'select', 
        required: true,
        labels: {
          zh: '风格',
          en: 'Style',
          fr: 'Style',
          ru: 'Стиль',
          ja: 'スタイル',
          ko: '스타일',
          de: 'Stil',
          es: 'Estilo'
        },
        options: [
          { value: 'informative', labels: { zh: '信息型', en: 'Informative', fr: 'Informatif', ru: 'Информативный', ja: '情報提供型', ko: '정보 제공형', de: 'Informativ', es: 'Informativo' } },
          { value: 'how-to', labels: { zh: '教程型', en: 'How-to Guide', fr: 'Guide Pratique', ru: 'Инструкция', ja: 'ハウツー', ko: '가이드형', de: 'Anleitung', es: 'Guía Práctica' } },
          { value: 'listicle', labels: { zh: '列表型', en: 'Listicle', fr: 'Liste', ru: 'Список', ja: 'リスト形式', ko: '리스트형', de: 'Liste', es: 'Lista' } },
          { value: 'opinion', labels: { zh: '观点型', en: 'Opinion Piece', fr: 'Opinion', ru: 'Мнение', ja: 'オピニオン', ko: '의견형', de: 'Meinungsartikel', es: 'Artículo de Opinión' } },
        ]
      },
      { 
        name: 'length', 
        type: 'select', 
        required: false,
        labels: {
          zh: '篇幅',
          en: 'Length',
          fr: 'Longueur',
          ru: 'Длина',
          ja: '長さ',
          ko: '길이',
          de: 'Länge',
          es: 'Longitud'
        },
        options: [
          { value: 'short', labels: { zh: '短文 (800字)', en: 'Short (800 words)', fr: 'Court (800 mots)', ru: 'Короткий', ja: '短文', ko: '짧음', de: 'Kurz', es: 'Corto' } },
          { value: 'medium', labels: { zh: '中等 (1500字)', en: 'Medium (1500 words)', fr: 'Moyen (1500 mots)', ru: 'Средний', ja: '中程度', ko: '보통', de: 'Mittel', es: 'Medio' } },
          { value: 'long', labels: { zh: '长文 (3000字)', en: 'Long (3000 words)', fr: 'Long (3000 mots)', ru: 'Длинный', ja: '長文', ko: '김', de: 'Lang', es: 'Largo' } },
        ]
      },
    ],
    promptTemplate: `You are an expert content strategist.

【Topic】{topic}
【Style】{style}
【Length】{length}

【Requirements】
1. Create a comprehensive, SEO-friendly outline
2. Include engaging section headers
3. Add key points for each section
4. Suggest internal linking opportunities
5. Include a compelling introduction hook

【Output Format】
Generate a blog post outline:
- Catchy title options (3)
- Meta description
- Introduction hook
- Main sections with subsections
- Key points for each section
- Conclusion with CTA`
  },
  
  // ==================== 社媒文案 ====================
  {
    id: 'instagram-caption',
    category: 'social',
    icon: '📸',
    names: {
      zh: 'Instagram文案',
      en: 'Instagram Caption',
      fr: 'Légende Instagram',
      ru: 'Подпись для Instagram',
      ja: 'Instagramキャプション',
      ko: 'Instagram 캡션',
      de: 'Instagram-Bildunterschrift',
      es: 'Subtítulo de Instagram'
    },
    descriptions: {
      zh: '生成吸引人的Instagram配文',
      en: 'Create engaging Instagram captions',
      fr: 'Créez des légendes Instagram engageantes',
      ru: 'Создайте вовлекающие подписи для Instagram',
      ja: '魅力的なInstagramキャプションを作成',
      ko: '매력적인 Instagram 캡션 생성',
      de: 'Erstellen Sie ansprechende Instagram-Bildunterschriften',
      es: 'Crea subtítulos atractivos para Instagram'
    },
    variables: [
      { 
        name: 'content', 
        type: 'textarea', 
        required: true,
        labels: {
          zh: '内容描述',
          en: 'Content Description',
          fr: 'Description du Contenu',
          ru: 'Описание контента',
          ja: 'コンテンツの説明',
          ko: '콘텐츠 설명',
          de: 'Inhaltsbeschreibung',
          es: 'Descripción del Contenido'
        },
        placeholders: {
          zh: '描述你的图片或视频内容...',
          en: 'Describe your image or video content...',
          fr: 'Décrivez votre image ou vidéo...',
          ru: 'Опишите ваш контент...',
          ja: '画像や動画の内容を説明...',
          ko: '이미지나 동영상 내용을 설명...',
          de: 'Beschreiben Sie Ihren Inhalt...',
          es: 'Describe tu imagen o video...'
        }
      },
      { 
        name: 'vibe', 
        type: 'select', 
        required: true,
        labels: {
          zh: '氛围',
          en: 'Vibe',
          fr: 'Ambiance',
          ru: 'Вайб',
          ja: '雰囲気',
          ko: '분위기',
          de: 'Stimmung',
          es: 'Vibra'
        },
        options: [
          { value: 'aesthetic', labels: { zh: '唯美', en: 'Aesthetic', fr: 'Esthétique', ru: 'Эстетичный', ja: 'エステティック', ko: '심미적', de: 'Ästhetisch', es: 'Estético' } },
          { value: 'funny', labels: { zh: '搞笑', en: 'Funny', fr: 'Drôle', ru: 'Смешной', ja: '面白い', ko: '재미있는', de: 'Lustig', es: 'Divertido' } },
          { value: 'inspirational', labels: { zh: '励志', en: 'Inspirational', fr: 'Inspirant', ru: 'Вдохновляющий', ja: 'インスピレーショナル', ko: '영감을 주는', de: 'Inspirierend', es: 'Inspirador' } },
          { value: 'minimalist', labels: { zh: '极简', en: 'Minimalist', fr: 'Minimaliste', ru: 'Минималистичный', ja: 'ミニマル', ko: '미니멀', de: 'Minimalistisch', es: 'Minimalista' } },
        ]
      },
    ],
    promptTemplate: `You are an Instagram content expert.

【Content】{content}
【Vibe】{vibe}

【Requirements】
1. Write engaging, scroll-stopping captions
2. Use line breaks for readability
3. Include relevant hashtags (15-20)
4. Add a CTA that drives engagement
5. Keep it authentic and relatable

【Output Format】
Generate 3 caption options:
1️⃣ [Short & punchy]
2️⃣ [Story-driven]
3️⃣ [Question/CTA focused]

Plus relevant hashtags.`
  },
  
  // ==================== 电商文案 ====================
  {
    id: 'ad-copy',
    category: 'ecommerce',
    icon: '📢',
    names: {
      zh: '广告文案',
      en: 'Ad Copy',
      fr: 'Copie Publicitaire',
      ru: 'Рекламный текст',
      ja: '広告コピー',
      ko: '광고 카피',
      de: 'Werbetext',
      es: 'Texto Publicitario'
    },
    descriptions: {
      zh: '生成高转化率的广告文案',
      en: 'Create high-converting ad copy',
      fr: 'Créez des textes publicitaires convertissants',
      ru: 'Создайте конверсионный рекламный текст',
      ja: 'コンバージョンの高い広告コピーを作成',
      ko: '높은 전환율의 광고 카피 생성',
      de: 'Erstellen Sie konversionsstarke Werbetexte',
      es: 'Crea textos publicitarios de alta conversión'
    },
    variables: [
      { 
        name: 'product', 
        type: 'text', 
        required: true,
        labels: {
          zh: '产品/服务',
          en: 'Product/Service',
          fr: 'Produit/Service',
          ru: 'Продукт/Услуга',
          ja: '製品/サービス',
          ko: '제품/서비스',
          de: 'Produkt/Service',
          es: 'Producto/Servicio'
        },
        placeholders: {
          zh: '例如：在线课程、SaaS软件',
          en: 'e.g., Online course, SaaS software',
          fr: 'ex: Cours en ligne, logiciel SaaS',
          ru: 'напр.: Онлайн-курс, SaaS',
          ja: '例：オンラインコース、SaaSソフト',
          ko: '예: 온라인 강좌, SaaS 소프트웨어',
          de: 'z.B. Online-Kurs, SaaS-Software',
          es: 'ej: Curso online, software SaaS'
        }
      },
      { 
        name: 'platform', 
        type: 'select', 
        required: true,
        labels: {
          zh: '平台',
          en: 'Platform',
          fr: 'Plateforme',
          ru: 'Платформа',
          ja: 'プラットフォーム',
          ko: '플랫폼',
          de: 'Plattform',
          es: 'Plataforma'
        },
        options: [
          { value: 'facebook', labels: { zh: 'Facebook', en: 'Facebook', fr: 'Facebook', ru: 'Facebook', ja: 'Facebook', ko: 'Facebook', de: 'Facebook', es: 'Facebook' } },
          { value: 'google', labels: { zh: 'Google Ads', en: 'Google Ads', fr: 'Google Ads', ru: 'Google Ads', ja: 'Google Ads', ko: 'Google Ads', de: 'Google Ads', es: 'Google Ads' } },
          { value: 'instagram', labels: { zh: 'Instagram', en: 'Instagram', fr: 'Instagram', ru: 'Instagram', ja: 'Instagram', ko: 'Instagram', de: 'Instagram', es: 'Instagram' } },
          { value: 'tiktok', labels: { zh: 'TikTok', en: 'TikTok', fr: 'TikTok', ru: 'TikTok', ja: 'TikTok', ko: 'TikTok', de: 'TikTok', es: 'TikTok' } },
        ]
      },
      { 
        name: 'offer', 
        type: 'text', 
        required: false,
        labels: {
          zh: '优惠/卖点',
          en: 'Offer/USP',
          fr: 'Offre/USP',
          ru: 'Предложение',
          ja: 'オファー/独自の強み',
          ko: '오퍼/USP',
          de: 'Angebot/USP',
          es: 'Oferta/USP'
        },
        placeholders: {
          zh: '例如：首月免费、限时8折',
          en: 'e.g., Free trial, 20% off limited time',
          fr: 'ex: Essai gratuit, -20% temps limité',
          ru: 'напр.: Бесплатный пробный период',
          ja: '例：初月無料、期間限定20%OFF',
          ko: '예: 무료 체험, 한정 20% 할인',
          de: 'z.B. Kostenlose Testversion, 20% Rabatt',
          es: 'ej: Prueba gratis, 20% descuento limitado'
        }
      },
    ],
    promptTemplate: `You are a direct response copywriting expert.

【Product/Service】{product}
【Platform】{platform}
【Offer】{offer}

【Requirements】
1. Follow platform-specific character limits
2. Use power words that drive action
3. Include social proof elements
4. Create urgency without being pushy
5. Strong call-to-action

【Output Format】
Generate 3 ad variations:

**Variation 1: Problem-Agitate-Solution**
- Headline
- Body copy
- CTA

**Variation 2: Benefit-focused**
- Headline
- Body copy
- CTA

**Variation 3: Social proof-driven**
- Headline
- Body copy
- CTA`
  },
];

export default templates;