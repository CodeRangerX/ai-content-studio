// 完整的多语言翻译配置
import { Language } from './i18n';

// ============================================
// 模板名称翻译 (25个模板)
// ============================================
export const templateNames: Record<string, Record<Language, string>> = {
  // 社媒 - 国外平台
  'x-post': {
    zh: 'X / Twitter 发帖', en: 'X / Twitter Post',
    fr: 'Post X / Twitter', ru: 'Пост в X / Twitter',
    ja: 'X/Twitter投稿', ko: 'X/Twitter 게시물',
    de: 'X / Twitter Beitrag', es: 'Post de X / Twitter'
  },
  'facebook-post': {
    zh: 'Facebook 发帖', en: 'Facebook Post',
    fr: 'Post Facebook', ru: 'Пост в Facebook',
    ja: 'Facebook投稿', ko: 'Facebook 게시물',
    de: 'Facebook Beitrag', es: 'Post de Facebook'
  },
  'instagram-caption': {
    zh: 'Instagram 配文', en: 'Instagram Caption',
    fr: 'Légende Instagram', ru: 'Подпись Instagram',
    ja: 'Instagramキャプション', ko: 'Instagram 캡션',
    de: 'Instagram Bildunterschrift', es: 'Subtítulo de Instagram'
  },
  'reddit-post': {
    zh: 'Reddit 发帖', en: 'Reddit Post',
    fr: 'Post Reddit', ru: 'Пост в Reddit',
    ja: 'Reddit投稿', ko: 'Reddit 게시물',
    de: 'Reddit Beitrag', es: 'Post de Reddit'
  },
  'linkedin-post': {
    zh: 'LinkedIn 发帖', en: 'LinkedIn Post',
    fr: 'Post LinkedIn', ru: 'Пост в LinkedIn',
    ja: 'LinkedIn投稿', ko: 'LinkedIn 게시물',
    de: 'LinkedIn Beitrag', es: 'Post de LinkedIn'
  },
  'tiktok-script': {
    zh: 'TikTok 脚本', en: 'TikTok Script',
    fr: 'Script TikTok', ru: 'Сценарий TikTok',
    ja: 'TikTokスクリプト', ko: 'TikTok 스크립트',
    de: 'TikTok Skript', es: 'Guión de TikTok'
  },
  'youtube-title': {
    zh: 'YouTube 标题描述', en: 'YouTube Title & Description',
    fr: 'Titre YouTube', ru: 'Заголовок YouTube',
    ja: 'YouTubeタイトル', ko: 'YouTube 제목',
    de: 'YouTube Titel', es: 'Título de YouTube'
  },
  'threads-post': {
    zh: 'Threads 发帖', en: 'Threads Post',
    fr: 'Post Threads', ru: 'Пост в Threads',
    ja: 'Threads投稿', ko: 'Threads 게시물',
    de: 'Threads Beitrag', es: 'Post de Threads'
  },
  'pinterest-pin': {
    zh: 'Pinterest Pin', en: 'Pinterest Pin',
    fr: 'Pin Pinterest', ru: 'Пин Pinterest',
    ja: 'Pinterestピン', ko: 'Pinterest 핀',
    de: 'Pinterest Pin', es: 'Pin de Pinterest'
  },
  // 社媒 - 中文平台
  'moments-caption': {
    zh: '朋友圈文案', en: 'WeChat Moments',
    fr: 'Moments WeChat', ru: 'Моменты WeChat',
    ja: 'WeChat Moments', ko: '위챗 모멘츠',
    de: 'WeChat Moments', es: 'Moments de WeChat'
  },
  'moments-ad': {
    zh: '朋友圈广告文案', en: 'WeChat Ad Copy',
    fr: 'Publicité WeChat', ru: 'Реклама WeChat',
    ja: 'WeChat広告', ko: '위챗 광고',
    de: 'WeChat Werbung', es: 'Anuncio WeChat'
  },
  'xiaohongshu': {
    zh: '小红书笔记', en: 'Xiaohongshu Post',
    fr: 'Post Xiaohongshu', ru: 'Пост Xiaohongshu',
    ja: '小紅書投稿', ko: '샤오홍슈 게시물',
    de: 'Xiaohongshu Beitrag', es: 'Post de Xiaohongshu'
  },
  'douyin': {
    zh: '抖音文案', en: 'Douyin Content',
    fr: 'Contenu Douyin', ru: 'Контент Douyin',
    ja: '抖音コンテンツ', ko: '도우인 콘텐츠',
    de: 'Douyin Inhalt', es: 'Contenido Douyin'
  },
  // 电商
  'product-description': {
    zh: '商品描述', en: 'Product Description',
    fr: 'Description de produit', ru: 'Описание товара',
    ja: '商品説明', ko: '제품 설명',
    de: 'Produktbeschreibung', es: 'Descripción de producto'
  },
  'amazon-listing': {
    zh: '亚马逊商品', en: 'Amazon Listing',
    fr: 'Fiche Amazon', ru: 'Листинг Amazon',
    ja: 'Amazon リスティング', ko: 'Amazon 리스팅',
    de: 'Amazon Angebot', es: 'Ficha Amazon'
  },
  'email-marketing': {
    zh: '营销邮件', en: 'Marketing Email',
    fr: 'Email marketing', ru: 'Маркетинговое письмо',
    ja: 'マーケティングメール', ko: '마케팅 이메일',
    de: 'Marketing-E-Mail', es: 'Email de marketing'
  },
  'product-detail': {
    zh: '商品详情页', en: 'Product Detail Page',
    fr: 'Page produit', ru: 'Страница товара',
    ja: '商品詳細ページ', ko: '제품 상세 페이지',
    de: 'Produktseite', es: 'Página de producto'
  },
  // 内容
  'blog-outline': {
    zh: '博客大纲', en: 'Blog Post Outline',
    fr: "Plan d'article de blog", ru: 'План статьи',
    ja: 'ブログアウトライン', ko: '블로그 개요',
    de: 'Blog-Gliederung', es: 'Esquema de artículo'
  },
  'press-release': {
    zh: '新闻稿', en: 'Press Release',
    fr: 'Communiqué de presse', ru: 'Пресс-релиз',
    ja: 'プレスリリース', ko: '보도 자료',
    de: 'Pressemitteilung', es: 'Nota de prensa'
  },
  'ad-copy': {
    zh: '广告文案', en: 'Ad Copy',
    fr: 'Texte publicitaire', ru: 'Рекламный текст',
    ja: '広告コピー', ko: '광고 카피',
    de: 'Werbetext', es: 'Texto publicitario'
  },
  'wechat-article': {
    zh: '公众号文章', en: 'WeChat Article',
    fr: 'Article WeChat', ru: 'Статья WeChat',
    ja: 'WeChat記事', ko: '위챗 아티클',
    de: 'WeChat Artikel', es: 'Artículo de WeChat'
  },
};

// ============================================
// 模板描述翻译
// ============================================
export const templateDescriptions: Record<string, Record<Language, string>> = {
  'x-post': {
    zh: '生成病毒式传播的推文', en: 'Generate viral tweets that engage and convert',
    fr: 'Générez des tweets viraux', ru: 'Создайте вирусные твиты',
    ja: 'バズるツイートを生成', ko: '바이럴 트윗 생성',
    de: 'Erstellen Sie virale Tweets', es: 'Genera tweets virales'
  },
  'facebook-post': {
    zh: '创建吸引人的Facebook帖子', en: 'Create engaging Facebook posts for your audience',
    fr: 'Créez des posts Facebook engageants', ru: 'Создайте вовлекающие посты',
    ja: '魅力的なFacebook投稿を作成', ko: '매력적인 Facebook 게시물 생성',
    de: 'Erstellen Sie ansprechende Facebook-Beiträge', es: 'Crea publicaciones atractivas de Facebook'
  },
  'instagram-caption': {
    zh: '撰写吸引人的Instagram配文', en: 'Write scroll-stopping Instagram captions',
    fr: 'Rédigez des légendes Instagram captivantes', ru: 'Напишите цепляющие подписи',
    ja: '魅力的なInstagramキャプションを作成', ko: '매력적인 Instagram 캡션 작성',
    de: 'Schreiben Sie aufmerksamkeitsstarke Instagram-Bildunterschriften', es: 'Escribe subtítulos atractivos de Instagram'
  },
  'reddit-post': {
    zh: '撰写真实的Reddit帖子引发讨论', en: 'Craft authentic Reddit posts that spark discussion',
    fr: 'Créez des posts Reddit authentiques', ru: 'Создайте аутентичные посты Reddit',
    ja: '本物のReddit投稿を作成', ko: '진정성 있는 Reddit 게시물 작성',
    de: 'Erstellen Sie authentische Reddit-Beiträge', es: 'Crea publicaciones auténticas de Reddit'
  },
  'linkedin-post': {
    zh: '撰写专业LinkedIn内容建立影响力', en: 'Write professional LinkedIn content that builds authority',
    fr: 'Rédigez du contenu LinkedIn professionnel', ru: 'Напишите профессиональный контент',
    ja: 'プロフェッショナルなLinkedInコンテンツを作成', ko: '전문적인 LinkedIn 콘텐츠 작성',
    de: 'Schreiben Sie professionelle LinkedIn-Inhalte', es: 'Escribe contenido profesional de LinkedIn'
  },
  'tiktok-script': {
    zh: '创作爆款TikTok视频脚本', en: 'Create viral TikTok video scripts',
    fr: 'Créez des scripts TikTok viraux', ru: 'Создайте вирусные сценарии TikTok',
    ja: 'バズるTikTokスクリプトを作成', ko: '바이럴 TikTok 스크립트 생성',
    de: 'Erstellen Sie virale TikTok-Skripte', es: 'Crea guiones virales de TikTok'
  },
  'youtube-title': {
    zh: '优化YouTube标题和描述提升观看量', en: 'Optimize YouTube titles and descriptions for views',
    fr: 'Optimisez les titres YouTube', ru: 'Оптимизируйте заголовки YouTube',
    ja: 'YouTubeタイトルと説明を最適化', ko: 'YouTube 제목 및 설명 최적화',
    de: 'Optimieren Sie YouTube-Titel', es: 'Optimiza títulos de YouTube'
  },
  'threads-post': {
    zh: '创作吸引人的Threads内容', en: 'Create engaging Threads content',
    fr: 'Créez du contenu Threads engageant', ru: 'Создайте вовлекающий контент Threads',
    ja: '魅力的なThreadsコンテンツを作成', ko: '매력적인 Threads 콘텐츠 생성',
    de: 'Erstellen Sie ansprechende Threads-Inhalte', es: 'Crea contenido atractivo de Threads'
  },
  'pinterest-pin': {
    zh: '创建Pinterest优化的标题和描述', en: 'Create Pinterest-optimized titles and descriptions',
    fr: 'Créez des titres Pinterest optimisés', ru: 'Создайте оптимизированные заголовки Pinterest',
    ja: 'Pinterest用のタイトルと説明を作成', ko: 'Pinterest 최적화 제목 및 설명 생성',
    de: 'Erstellen Sie optimierte Pinterest-Titel', es: 'Crea títulos optimizados de Pinterest'
  },
  'moments-caption': {
    zh: '生成走心朋友圈文案收获更多点赞', en: 'Generate heartfelt WeChat Moments posts',
    fr: 'Générez des posts WeChat sincères', ru: 'Создайте искренние посты WeChat',
    ja: '心に響くWeChat Momentsを作成', ko: '진심이 담긴 위챗 모멘츠 생성',
    de: 'Erstellen Sie herzliche WeChat Moments', es: 'Genera publicaciones sinceras de WeChat'
  },
  'moments-ad': {
    zh: '高转化朋友圈广告种草带货必备', en: 'High-converting WeChat ad copy for sales',
    fr: 'Publicité WeChat à forte conversion', ru: 'Конверсионная реклама WeChat',
    ja: '高コンバージョンWeChat広告', ko: '높은 전환율 위챗 광고',
    de: 'Konversionsstarke WeChat-Werbung', es: 'Publicidad de WeChat de alta conversión'
  },
  'xiaohongshu': {
    zh: '生成爆款小红书笔记提升种草转化', en: 'Create viral Xiaohongshu posts that convert',
    fr: 'Créez des posts Xiaohongshu viraux', ru: 'Создайте вирусные посты Xiaohongshu',
    ja: 'バズる小紅書投稿を生成', ko: '바이럴 샤오홍슈 게시물 생성',
    de: 'Erstellen Sie virale Xiaohongshu-Beiträge', es: 'Crea publicaciones virales de Xiaohongshu'
  },
  'douyin': {
    zh: '创作抖音爆款文案提升视频完播率', en: 'Create viral Douyin content that boosts completion rates',
    fr: 'Créez du contenu Douyin viral', ru: 'Создайте вирусный контент Douyin',
    ja: 'バズる抖音コンテンツを作成', ko: '바이럴 도우인 콘텐츠 생성',
    de: 'Erstellen Sie virale Douyin-Inhalte', es: 'Crea contenido viral de Douyin'
  },
  'product-description': {
    zh: '撰写高转化商品描述', en: 'Write compelling product descriptions that convert',
    fr: 'Rédigez des descriptions convaincantes', ru: 'Напишите убедительные описания',
    ja: 'コンバージョンの高い商品説明を作成', ko: '높은 전환율의 제품 설명 작성',
    de: 'Schreiben Sie überzeugende Produktbeschreibungen', es: 'Escribe descripciones de productos convincentes'
  },
  'amazon-listing': {
    zh: '创建优化亚马逊商品列表', en: 'Create optimized Amazon product listings',
    fr: 'Créez des fiches Amazon optimisées', ru: 'Создайте оптимизированные листинги Amazon',
    ja: '最適化されたAmazonリスティングを作成', ko: '최적화된 Amazon 리스팅 생성',
    de: 'Erstellen Sie optimierte Amazon-Angebote', es: 'Crea fichas de Amazon optimizadas'
  },
  'email-marketing': {
    zh: '撰写高转化营销邮件', en: 'Write high-converting marketing emails',
    fr: 'Rédigez des emails marketing performants', ru: 'Напишите конверсионные письма',
    ja: '高コンバージョンマーケティングメールを作成', ko: '높은 전환율 마케팅 이메일 작성',
    de: 'Schreiben Sie konversionsstarke Marketing-E-Mails', es: 'Escribe emails de marketing de alta conversión'
  },
  'product-detail': {
    zh: '打造高转化商品详情页文案', en: 'Create high-converting product detail pages',
    fr: 'Créez des pages produit performantes', ru: 'Создайте конверсионные страницы товаров',
    ja: '高コンバージョン商品詳細ページを作成', ko: '높은 전환율 제품 상세 페이지 생성',
    de: 'Erstellen Sie konversionsstarke Produktseiten', es: 'Crea páginas de producto de alta conversión'
  },
  'blog-outline': {
    zh: '创建SEO优化博客文章大纲', en: 'Create SEO-optimized blog post outlines',
    fr: "Créez des plans d'articles optimisés SEO", ru: 'Создайте SEO-оптимизированные планы',
    ja: 'SEO最適化されたブログアウトラインを作成', ko: 'SEO 최적화 블로그 개요 생성',
    de: 'Erstellen Sie SEO-optimierte Blog-Gliederungen', es: 'Crea esquemas de artículos optimizados SEO'
  },
  'press-release': {
    zh: '撰写专业新闻稿', en: 'Write professional press releases',
    fr: 'Rédigez des communiqués professionnels', ru: 'Напишите профессиональные пресс-релизы',
    ja: 'プロフェッショナルなプレスリリースを作成', ko: '전문적인 보도 자료 작성',
    de: 'Schreiben Sie professionelle Pressemitteilungen', es: 'Escribe notas de prensa profesionales'
  },
  'ad-copy': {
    zh: '创建高转化广告文案', en: 'Create high-converting ad copy for any platform',
    fr: 'Créez des textes publicitaires performants', ru: 'Создайте конверсионную рекламу',
    ja: '高コンバージョン広告コピーを作成', ko: '높은 전환율 광고 카피 생성',
    de: 'Erstellen Sie konversionsstarke Werbetexte', es: 'Crea textos publicitarios de alta conversión'
  },
  'wechat-article': {
    zh: '撰写高阅读量公众号文章', en: 'Write high-traffic WeChat articles',
    fr: 'Rédigez des articles WeChat populaires', ru: 'Напишите популярные статьи WeChat',
    ja: '読まれるWeChat記事を作成', ko: '높은 조회수 위챗 아티클 작성',
    de: 'Schreiben Sie beliebte WeChat-Artikel', es: 'Escribe artículos populares de WeChat'
  },
};

// ============================================
// 字段标签翻译
// ============================================
export const variableLabels: Record<string, Record<Language, string>> = {
  // 英文字段
  'Topic': { zh: '主题', en: 'Topic', fr: 'Sujet', ru: 'Тема', ja: 'トピック', ko: '주제', de: 'Thema', es: 'Tema' },
  'Tone': { zh: '语气', en: 'Tone', fr: 'Ton', ru: 'Тон', ja: 'トーン', ko: '어조', de: 'Ton', es: 'Tono' },
  'Goal': { zh: '目标', en: 'Goal', fr: 'Objectif', ru: 'Цель', ja: '目的', ko: '목표', de: 'Ziel', es: 'Objetivo' },
  'Keywords/Hashtags': { zh: '关键词/标签', en: 'Keywords/Hashtags', fr: 'Mots-clés', ru: 'Ключевые слова', ja: 'キーワード', ko: '키워드', de: 'Schlüsselwörter', es: 'Palabras clave' },
  'Post Type': { zh: '帖子类型', en: 'Post Type', fr: 'Type de post', ru: 'Тип поста', ja: '投稿タイプ', ko: '게시물 유형', de: 'Beitragstyp', es: 'Tipo de post' },
  'Business/Brand Name': { zh: '品牌名称', en: 'Business/Brand Name', fr: 'Nom de marque', ru: 'Название бренда', ja: 'ブランド名', ko: '브랜드명', de: 'Markenname', es: 'Nombre de marca' },
  'Key Message': { zh: '核心信息', en: 'Key Message', fr: 'Message clé', ru: 'Ключевое сообщение', ja: 'メインメッセージ', ko: '핵심 메시지', de: 'Kernbotschaft', es: 'Mensaje clave' },
  'Target Audience': { zh: '目标人群', en: 'Target Audience', fr: 'Public cible', ru: 'Целевая аудитория', ja: 'ターゲット層', ko: '타겟 오디언스', de: 'Zielgruppe', es: 'Público objetivo' },
  'Content Type': { zh: '内容类型', en: 'Content Type', fr: 'Type de contenu', ru: 'Тип контента', ja: 'コンテンツタイプ', ko: '콘텐츠 유형', de: 'Inhaltstyp', es: 'Tipo de contenido' },
  'Subject': { zh: '主题', en: 'Subject', fr: 'Sujet', ru: 'Тема', ja: '主題', ko: '주제', de: 'Betreff', es: 'Asunto' },
  'Vibe/Aesthetic': { zh: '氛围/风格', en: 'Vibe/Aesthetic', fr: 'Ambiance', ru: 'Вайб', ja: '雰囲気', ko: '분위기', de: 'Stimmung', es: 'Vibra' },
  'Call to Action': { zh: '行动号召', en: 'Call to Action', fr: 'Appel à l\'action', ru: 'Призыв к действию', ja: 'CTA', ko: 'CTA', de: 'Handlungsaufforderung', es: 'Llamada a la acción' },
  'Subreddit': { zh: '子版块', en: 'Subreddit', fr: 'Subreddit', ru: 'Сабреддит', ja: 'サブレディット', ko: '서브레딧', de: 'Subreddit', es: 'Subreddit' },
  'Post Type': { zh: '帖子类型', en: 'Post Type', fr: 'Type de post', ru: 'Тип поста', ja: '投稿タイプ', ko: '게시물 유형', de: 'Beitragstyp', es: 'Tipo de post' },
  'Background Context': { zh: '背景信息', en: 'Background Context', fr: 'Contexte', ru: 'Контекст', ja: '背景', ko: '배경', de: 'Hintergrund', es: 'Contexto' },
  'Industry': { zh: '行业', en: 'Industry', fr: 'Industrie', ru: 'Индустрия', ja: '業界', ko: '산업', de: 'Branche', es: 'Industria' },
  'Key Point': { zh: '关键点', en: 'Key Point', fr: 'Point clé', ru: 'Ключевой момент', ja: '要点', ko: '핵심 포인트', de: 'Kernpunkt', es: 'Punto clave' },
  'Your Role': { zh: '你的角色', en: 'Your Role', fr: 'Votre rôle', ru: 'Ваша роль', ja: '役割', ko: '역할', de: 'Ihre Rolle', es: 'Su rol' },
  'Video Style': { zh: '视频风格', en: 'Video Style', fr: 'Style vidéo', ru: 'Стиль видео', ja: '動画スタイル', ko: '동영상 스타일', de: 'Videostil', es: 'Estilo de video' },
  'Duration': { zh: '时长', en: 'Duration', fr: 'Durée', ru: 'Длительность', ja: '長さ', ko: '길이', de: 'Dauer', es: 'Duración' },
  'Niche': { zh: '领域', en: 'Niche', fr: 'Créneau', ru: 'Ниша', ja: 'ニッチ', ko: '틈새시장', de: 'Nische', es: 'Nicho' },
  'Video Topic': { zh: '视频主题', en: 'Video Topic', fr: 'Sujet vidéo', ru: 'Тема видео', ja: '動画トピック', ko: '동영상 주제', de: 'Videothema', es: 'Tema del video' },
  'Video Type': { zh: '视频类型', en: 'Video Type', fr: 'Type de vidéo', ru: 'Тип видео', ja: '動画タイプ', ko: '동영상 유형', de: 'Videotyp', es: 'Tipo de video' },
  'Channel Niche': { zh: '频道领域', en: 'Channel Niche', fr: 'Créneau de chaîne', ru: 'Ниша канала', ja: 'チャンネルのニッチ', ko: '채널 틈새시장', de: 'Kanalnische', es: 'Nicho del canal' },
  'Target Keywords': { zh: '目标关键词', en: 'Target Keywords', fr: 'Mots-clés cibles', ru: 'Целевые ключевые слова', ja: 'ターゲットキーワード', ko: '타겟 키워드', de: 'Zielkeywords', es: 'Palabras clave objetivo' },
  'Style': { zh: '风格', en: 'Style', fr: 'Style', ru: 'Стиль', ja: 'スタイル', ko: '스타일', de: 'Stil', es: 'Estilo' },
  'Product Name': { zh: '商品名称', en: 'Product Name', fr: 'Nom du produit', ru: 'Название товара', ja: '商品名', ko: '제품명', de: 'Produktname', es: 'Nombre del producto' },
  'Category': { zh: '分类', en: 'Category', fr: 'Catégorie', ru: 'Категория', ja: 'カテゴリ', ko: '카테고리', de: 'Kategorie', es: 'Categoría' },
  'Key Features': { zh: '核心特点', en: 'Key Features', fr: 'Caractéristiques', ru: 'Ключевые особенности', ja: '主な特徴', ko: '핵심 특징', de: 'Hauptmerkmale', es: 'Características principales' },
  'Price Range': { zh: '价格区间', en: 'Price Range', fr: 'Gamme de prix', ru: 'Ценовой диапазон', ja: '価格帯', ko: '가격대', de: 'Preisspanne', es: 'Rango de precio' },
  'Amazon Category': { zh: '亚马逊分类', en: 'Amazon Category', fr: 'Catégorie Amazon', ru: 'Категория Amazon', ja: 'Amazonカテゴリ', ko: 'Amazon 카테고리', de: 'Amazon-Kategorie', es: 'Categoría de Amazon' },
  'Key Features (5)': { zh: '核心特点(5个)', en: 'Key Features (5)', fr: 'Caractéristiques (5)', ru: 'Особенности (5)', ja: '主な特徴(5つ)', ko: '핵심 특징(5개)', de: 'Hauptmerkmale (5)', es: 'Características (5)' },
  'Email Type': { zh: '邮件类型', en: 'Email Type', fr: 'Type d\'email', ru: 'Тип письма', ja: 'メールタイプ', ko: '이메일 유형', de: 'E-Mail-Typ', es: 'Tipo de email' },
  'Brand': { zh: '品牌', en: 'Brand', fr: 'Marque', ru: 'Бренд', ja: 'ブランド', ko: '브랜드', de: 'Marke', es: 'Marca' },
  'Offer/Message': { zh: '优惠/信息', en: 'Offer/Message', fr: 'Offre/Message', ru: 'Предложение', ja: 'オファー/メッセージ', ko: '오퍼/메시지', de: 'Angebot/Nachricht', es: 'Oferta/Mensaje' },
  'Blog Topic': { zh: '博客主题', en: 'Blog Topic', fr: 'Sujet de blog', ru: 'Тема блога', ja: 'ブログトピック', ko: '블로그 주제', de: 'Blog-Thema', es: 'Tema de blog' },
  'Content Type': { zh: '内容类型', en: 'Content Type', fr: 'Type de contenu', ru: 'Тип контента', ja: 'コンテンツタイプ', ko: '콘텐츠 유형', de: 'Inhaltstyp', es: 'Tipo de contenido' },
  'Target Keywords': { zh: '目标关键词', en: 'Target Keywords', fr: 'Mots-clés cibles', ru: 'Целевые слова', ja: 'ターゲットキーワード', ko: '타겟 키워드', de: 'Zielkeywords', es: 'Palabras clave objetivo' },
  'Target Length': { zh: '目标长度', en: 'Target Length', fr: 'Longueur cible', ru: 'Целевая длина', ja: '目標の長さ', ko: '목표 길이', de: 'Ziellänge', es: 'Longitud objetivo' },
  'Company Name': { zh: '公司名称', en: 'Company Name', fr: 'Nom de l\'entreprise', ru: 'Название компании', ja: '会社名', ko: '회사명', de: 'Firmenname', es: 'Nombre de empresa' },
  'Announcement Type': { zh: '公告类型', en: 'Announcement Type', fr: 'Type d\'annonce', ru: 'Тип объявления', ja: '発表タイプ', ko: '공지 유형', de: 'Ankündigungstyp', es: 'Tipo de anuncio' },
  'Key Details': { zh: '关键信息', en: 'Key Details', fr: 'Détails clés', ru: 'Ключевые детали', ja: '重要な詳細', ko: '핵심 세부정보', de: 'Kerndetails', es: 'Detalles clave' },
  'Media Contact': { zh: '媒体联系人', en: 'Media Contact', fr: 'Contact média', ru: 'Медиа-контакт', ja: 'メディア連絡先', ko: '미디어 연락처', de: 'Medienkontakt', es: 'Contacto de prensa' },
  'Platform': { zh: '平台', en: 'Platform', fr: 'Plateforme', ru: 'Платформа', ja: 'プラットフォーム', ko: '플랫폼', de: 'Plattform', es: 'Plataforma' },
  'Product/Service': { zh: '产品/服务', en: 'Product/Service', fr: 'Produit/Service', ru: 'Продукт/Услуга', ja: '製品/サービス', ko: '제품/서비스', de: 'Produkt/Service', es: 'Producto/Servicio' },
  'Offer/USP': { zh: '优惠/卖点', en: 'Offer/USP', fr: 'Offre/USP', ru: 'Предложение/USP', ja: 'オファー/USP', ko: '오퍼/USP', de: 'Angebot/USP', es: 'Oferta/USP' },
  // 中文字段
  '场景': { en: 'Scene', zh: '场景', fr: 'Scène', ru: 'Сцена', ja: 'シーン', ko: '장면', de: 'Szene', es: 'Escena' },
  '心情/主题': { en: 'Mood/Theme', zh: '心情/主题', fr: 'Humeur/Thème', ru: 'Настроение/Тема', ja: '気分/テーマ', ko: '분위기/주제', de: 'Stimmung/Thema', es: 'Estado de ánimo/Tema' },
  '风格': { en: 'Style', zh: '风格', fr: 'Style', ru: 'Стиль', ja: 'スタイル', ko: '스타일', de: 'Stil', es: 'Estilo' },
  '关键词': { en: 'Keywords', zh: '关键词', fr: 'Mots-clés', ru: 'Ключевые слова', ja: 'キーワード', ko: '키워드', de: 'Schlüsselwörter', es: 'Palabras clave' },
  '产品/服务': { en: 'Product/Service', zh: '产品/服务', fr: 'Produit/Service', ru: 'Продукт/Услуга', ja: '製品/サービス', ko: '제품/서비스', de: 'Produkt/Service', es: 'Producto/Servicio' },
  '核心卖点': { en: 'Key Selling Points', zh: '核心卖点', fr: 'Points de vente', ru: 'Ключевые преимущества', ja: '販売ポイント', ko: '핵심 판매 포인트', de: 'Verkaufspunkte', es: 'Puntos de venta' },
  '效果数据': { en: 'Results/Data', zh: '效果数据', fr: 'Résultats', ru: 'Результаты', ja: '効果データ', ko: '효과 데이터', de: 'Ergebnisse', es: 'Resultados' },
  '目标人群': { en: 'Target Audience', zh: '目标人群', fr: 'Public cible', ru: 'Целевая аудитория', ja: 'ターゲット層', ko: '타겟 오디언스', de: 'Zielgruppe', es: 'Público objetivo' },
  '文案风格': { en: 'Copy Style', zh: '文案风格', fr: 'Style de texte', ru: 'Стиль текста', ja: 'コピーのスタイル', ko: '카피 스타일', de: 'Textstil', es: 'Estilo de texto' },
  '笔记类型': { en: 'Note Type', zh: '笔记类型', fr: 'Type de note', ru: 'Тип заметки', ja: 'ノートタイプ', ko: '노트 유형', de: 'Notiztyp', es: 'Tipo de nota' },
  '产品/主题': { en: 'Product/Topic', zh: '产品/主题', fr: 'Produit/Sujet', ru: 'Продукт/Тема', ja: '製品/トピック', ko: '제품/주제', de: 'Produkt/Thema', es: 'Producto/Tema' },
  '内容类型': { en: 'Content Type', zh: '内容类型', fr: 'Type de contenu', ru: 'Тип контента', ja: 'コンテンツタイプ', ko: '콘텐츠 유형', de: 'Inhaltstyp', es: 'Tipo de contenido' },
  '视频主题': { en: 'Video Topic', zh: '视频主题', fr: 'Sujet vidéo', ru: 'Тема видео', ja: '動画トピック', ko: '동영상 주제', de: 'Videothema', es: 'Tema del video' },
  '视频时长': { en: 'Video Length', zh: '视频时长', fr: 'Durée vidéo', ru: 'Длительность видео', ja: '動画の長さ', ko: '동영상 길이', de: 'Videolänge', es: 'Duración del video' },
  '文章类型': { en: 'Article Type', zh: '文章类型', fr: 'Type d\'article', ru: 'Тип статьи', ja: '記事タイプ', ko: '아티클 유형', de: 'Artikeltyp', es: 'Tipo de artículo' },
  '文章主题': { en: 'Article Topic', zh: '文章主题', fr: 'Sujet d\'article', ru: 'Тема статьи', ja: '記事トピック', ko: '아티클 주제', de: 'Artikelthema', es: 'Tema del artículo' },
  '关键词': { en: 'Keywords', zh: '关键词', fr: 'Mots-clés', ru: 'Ключевые слова', ja: 'キーワード', ko: '키워드', de: 'Schlüsselwörter', es: 'Palabras clave' },
  '文章长度': { en: 'Article Length', zh: '文章长度', fr: 'Longueur d\'article', ru: 'Длина статьи', ja: '記事の長さ', ko: '아티클 길이', de: 'Artikellänge', es: 'Longitud del artículo' },
  '商品名称': { en: 'Product Name', zh: '商品名称', fr: 'Nom du produit', ru: 'Название товара', ja: '商品名', ko: '제품명', de: 'Produktname', es: 'Nombre del producto' },
  '商品类目': { en: 'Product Category', zh: '商品类目', fr: 'Catégorie de produit', ru: 'Категория товара', ja: '商品カテゴリ', ko: '제품 카테고리', de: 'Produktkategorie', es: 'Categoría de producto' },
  '价格定位': { en: 'Price Position', zh: '价格定位', fr: 'Positionnement prix', ru: 'Ценовое позиционирование', ja: '価格帯', ko: '가격 포지션', de: 'Preispositionierung', es: 'Posicionamiento de precio' },
};

// ============================================
// 选项标签翻译
// ============================================
export const optionLabels: Record<string, Record<Language, string>> = {
  // 语气风格
  'Professional': { zh: '专业', en: 'Professional', fr: 'Professionnel', ru: 'Профессиональный', ja: 'プロフェッショナル', ko: '전문적', de: 'Professionell', es: 'Profesional' },
  'Casual': { zh: '随意', en: 'Casual', fr: 'Décontracté', ru: 'Небрежный', ja: 'カジュアル', ko: '캐주얼', de: 'Locker', es: 'Casual' },
  'Humorous': { zh: '幽默', en: 'Humorous', fr: 'Humoristique', ru: 'Юмористический', ja: 'ユーモラス', ko: '유머러스', de: 'Humorvoll', es: 'Humorístico' },
  'Provocative': { zh: '挑衅', en: 'Provocative', fr: 'Provocant', ru: 'Провокационный', ja: '挑発的', ko: '도발적', de: 'Provokant', es: 'Provocador' },
  'Inspirational': { zh: '励志', en: 'Inspirational', fr: 'Inspirant', ru: 'Вдохновляющий', ja: 'インスピレーショナル', ko: '영감을 주는', de: 'Inspirierend', es: 'Inspirador' },
  // 目标
  'Engagement': { zh: '互动', en: 'Engagement', fr: 'Engagement', ru: 'Вовлечённость', ja: 'エンゲージメント', ko: '참여', de: 'Engagement', es: 'Compromiso' },
  'Brand Awareness': { zh: '品牌认知', en: 'Brand Awareness', fr: 'Notoriété', ru: 'Узнаваемость', ja: 'ブランド認知', ko: '브랜드 인지도', de: 'Markenbekanntheit', es: 'Conocimiento de marca' },
  'Drive Traffic': { zh: '引流', en: 'Drive Traffic', fr: 'Trafic', ru: 'Трафик', ja: 'トラフィック', ko: '트래픽 유도', de: 'Traffic generieren', es: 'Generar tráfico' },
  'Thought Leadership': { zh: '思想领导', en: 'Thought Leadership', fr: 'Leadership', ru: 'Лидерство мнений', ja: '思想リーダーシップ', ko: '사상 리더십', de: 'Thought Leadership', es: 'Liderazgo de pensamiento' },
  // 帖子类型
  'Product Promotion': { zh: '产品推广', en: 'Product Promotion', fr: 'Promotion produit', ru: 'Продвижение продукта', ja: '製品プロモーション', ko: '제품 프로모션', de: 'Produktförderung', es: 'Promoción de producto' },
  'Brand Story': { zh: '品牌故事', en: 'Brand Story', fr: 'Histoire de marque', ru: 'История бренда', ja: 'ブランドストーリー', ko: '브랜드 스토리', de: 'Markengeschichte', es: 'Historia de marca' },
  'Event Announcement': { zh: '活动公告', en: 'Event Announcement', fr: 'Annonce d\'événement', ru: 'Анонс события', ja: 'イベント発表', ko: '이벤트 공지', de: 'Veranstaltungsankündigung', es: 'Anuncio de evento' },
  'Educational Content': { zh: '教育内容', en: 'Educational Content', fr: 'Contenu éducatif', ru: 'Образовательный контент', ja: '教育コンテンツ', ko: '교육 콘텐츠', de: 'Bildungsinhalt', es: 'Contenido educativo' },
  'Community Engagement': { zh: '社区互动', en: 'Community Engagement', fr: 'Engagement communautaire', ru: 'Вовлечённость сообщества', ja: 'コミュニティエンゲージメント', ko: '커뮤니티 참여', de: 'Community-Engagement', es: 'Compromiso comunitario' },
  // 内容风格
  'Lifestyle': { zh: '生活方式', en: 'Lifestyle', fr: 'Mode de vie', ru: 'Образ жизни', ja: 'ライフスタイル', ko: '라이프스타일', de: 'Lifestyle', es: 'Estilo de vida' },
  'Product Showcase': { zh: '产品展示', en: 'Product Showcase', fr: 'Vitrine produit', ru: 'Демонстрация продукта', ja: '製品紹介', ko: '제품 쇼케이스', de: 'Produktvorstellung', es: 'Escaparate de producto' },
  'Behind the Scenes': { zh: '幕后花絮', en: 'Behind the Scenes', fr: 'En coulisses', ru: 'За кулисами', ja: '舞台裏', ko: '비하인드', de: 'Hinter den Kulissen', es: 'Detrás de escena' },
  'Quote/Motivation': { zh: '名言励志', en: 'Quote/Motivation', fr: 'Citation/Motivation', ru: 'Цитата/Мотивация', ja: '引用/モチベーション', ko: '인용/동기부여', de: 'Zitat/Motivation', es: 'Cita/Motivación' },
  'Tutorial/How-to': { zh: '教程指南', en: 'Tutorial/How-to', fr: 'Tutoriel', ru: 'Руководство', ja: 'チュートリアル', ko: '튜토리얼', de: 'Tutorial', es: 'Tutorial' },
  'Reel Content': { zh: 'Reel内容', en: 'Reel Content', fr: 'Contenu Reel', ru: 'Reel контент', ja: 'Reelコンテンツ', ko: '릴스 콘텐츠', de: 'Reel-Inhalt', es: 'Contenido Reel' },
  // 氛围
  'Minimalist': { zh: '极简', en: 'Minimalist', fr: 'Minimaliste', ru: 'Минималистичный', ja: 'ミニマル', ko: '미니멀', de: 'Minimalistisch', es: 'Minimalista' },
  'Vibrant/Energetic': { zh: '活力四射', en: 'Vibrant/Energetic', fr: 'Vibrant/Énergique', ru: 'Яркий/Энергичный', ja: 'バイブラント', ko: '활기찬', de: 'Lebhaft/Energetisch', es: 'Vibrante/Energético' },
  'Cozy/Warm': { zh: '温馨舒适', en: 'Cozy/Warm', fr: 'Confortable/Chaleureux', ru: 'Уютный/Тёплый', ja: '居心地よい', ko: '아늑한', de: 'Gemütlich/Warm', es: 'Acogedor/Cálido' },
  'Edgy/Bold': { zh: '前卫大胆', en: 'Edgy/Bold', fr: 'Audacieux', ru: 'Смелый/Дерзкий', ja: 'エッジー', ko: '에지', de: 'Kühn/Gewagt', es: 'Atrevido/Audaz' },
  // CTA
  'Save for later': { zh: '稍后保存', en: 'Save for later', fr: 'Enregistrer', ru: 'Сохранить', ja: '後で保存', ko: '나중에 저장', de: 'Für später speichern', es: 'Guardar para después' },
  'Share with friends': { zh: '分享朋友', en: 'Share with friends', fr: 'Partager', ru: 'Поделиться', ja: '友達と共有', ko: '친구와 공유', de: 'Mit Freunden teilen', es: 'Compartir con amigos' },
  'Comment below': { zh: '评论互动', en: 'Comment below', fr: 'Commentez', ru: 'Комментируйте', ja: 'コメント', ko: '댓글 남기기', de: 'Kommentieren', es: 'Comenta abajo' },
  'Link in bio': { zh: '链接在简介', en: 'Link in bio', fr: 'Lien en bio', ru: 'Ссылка в профиле', ja: 'リンクはバイオに', ko: '바이오에 링크', de: 'Link in Bio', es: 'Enlace en bio' },
  'Follow for more': { zh: '关注更多', en: 'Follow for more', fr: 'Suivre', ru: 'Подпишитесь', ja: 'フォロー', ko: '팔로우', de: 'Folgen für mehr', es: 'Sigue para más' },
  // 视频风格
  'Storytelling': { zh: '故事叙述', en: 'Storytelling', fr: 'Narration', ru: 'Повествование', ja: 'ストーリーテリング', ko: '스토리텔링', de: 'Storytelling', es: 'Narración' },
  'Tutorial': { zh: '教程', en: 'Tutorial', fr: 'Tutoriel', ru: 'Руководство', ja: 'チュートリアル', ko: '튜토리얼', de: 'Tutorial', es: 'Tutorial' },
  'Reaction': { zh: '反应', en: 'Reaction', fr: 'Réaction', ru: 'Реакция', ja: 'リアクション', ko: '반응', de: 'Reaktion', es: 'Reacción' },
  'Listicle/Tips': { zh: '清单/技巧', en: 'Listicle/Tips', fr: 'Liste/Conseils', ru: 'Список/Советы', ja: 'リスト/ヒント', ko: '리스트/팁', de: 'Liste/Tipps', es: 'Lista/Consejos' },
  'Trend Participation': { zh: '跟风参与', en: 'Trend Participation', fr: 'Participation aux tendances', ru: 'Участие в тренде', ja: 'トレンド参加', ko: '트렌드 참여', de: 'Trend-Teilnahme', es: 'Participación en tendencias' },
  // 时长
  '15 seconds': { zh: '15秒', en: '15 seconds', fr: '15 secondes', ru: '15 секунд', ja: '15秒', ko: '15초', de: '15 Sekunden', es: '15 segundos' },
  '30 seconds': { zh: '30秒', en: '30 seconds', fr: '30 secondes', ru: '30 секунд', ja: '30秒', ko: '30초', de: '30 Sekunden', es: '30 segundos' },
  '60 seconds': { zh: '60秒', en: '60 seconds', fr: '60 secondes', ru: '60 секунд', ja: '60秒', ko: '60초', de: '60 Sekunden', es: '60 segundos' },
  '3 minutes': { zh: '3分钟', en: '3 minutes', fr: '3 minutes', ru: '3 минуты', ja: '3分', ko: '3분', de: '3 Minuten', es: '3 minutos' },
  // 文章类型
  'How-to Guide': { zh: '教程指南', en: 'How-to Guide', fr: 'Guide pratique', ru: 'Руководство', ja: 'ハウツーガイド', ko: '가이드', de: 'Anleitung', es: 'Guía práctica' },
  'Listicle': { zh: '清单体', en: 'Listicle', fr: 'Liste', ru: 'Список', ja: 'リスト形式', ko: '리스트형', de: 'Liste', es: 'Lista' },
  'Comparison': { zh: '对比评测', en: 'Comparison', fr: 'Comparaison', ru: 'Сравнение', ja: '比較', ko: '비교', de: 'Vergleich', es: 'Comparación' },
  'Review': { zh: '评测', en: 'Review', fr: 'Critique', ru: 'Обзор', ja: 'レビュー', ko: '리뷰', de: 'Rezension', es: 'Reseña' },
  'Case Study': { zh: '案例研究', en: 'Case Study', fr: 'Étude de cas', ru: 'Кейс', ja: 'ケーススタディ', ko: '사례 연구', de: 'Fallstudie', es: 'Caso de estudio' },
  // 文章长度
  '1,000 words': { zh: '1000字', en: '1,000 words', fr: '1 000 mots', ru: '1 000 слов', ja: '1000語', ko: '1000단어', de: '1.000 Wörter', es: '1.000 palabras' },
  '2,000 words': { zh: '2000字', en: '2,000 words', fr: '2 000 mots', ru: '2 000 слов', ja: '2000語', ko: '2000단어', de: '2.000 Wörter', es: '2.000 palabras' },
  '3,000+ words': { zh: '3000字以上', en: '3,000+ words', fr: '3 000+ mots', ru: '3 000+ слов', ja: '3000語以上', ko: '3000단어 이상', de: '3.000+ Wörter', es: '3.000+ palabras' },
  // 公告类型
  'Product Launch': { zh: '产品发布', en: 'Product Launch', fr: 'Lancement produit', ru: 'Запуск продукта', ja: '製品ローンチ', ko: '제품 출시', de: 'Produkteinführung', es: 'Lanzamiento de producto' },
  'Partnership': { zh: '合作伙伴', en: 'Partnership', fr: 'Partenariat', ru: 'Партнёрство', ja: 'パートナーシップ', ko: '파트너십', de: 'Partnerschaft', es: 'Asociación' },
  'Funding Round': { zh: '融资', en: 'Funding Round', fr: 'Tour de table', ru: 'Раунд финансирования', ja: '資金調達', ko: '펀딩 라운드', de: 'Finanzierungsrunde', es: 'Ronda de financiación' },
  'Award/Recognition': { zh: '获奖认可', en: 'Award/Recognition', fr: 'Prix/Reconnaissance', ru: 'Награда', ja: '受賞', ko: '수상', de: 'Auszeichnung', es: 'Premio/Reconocimiento' },
  'Event/Conference': { zh: '活动会议', en: 'Event/Conference', fr: 'Événement/Conférence', ru: 'Событие/Конференция', ja: 'イベント', ko: '이벤트', de: 'Veranstaltung', es: 'Evento/Conferencia' },
  // 价格定位
  'Budget-friendly': { zh: '平价亲民', en: 'Budget-friendly', fr: 'Économique', ru: 'Бюджетный', ja: 'お手頃価格', ko: '저렴한', de: 'Budgetfreundlich', es: 'Económico' },
  'Mid-range': { zh: '中端品质', en: 'Mid-range', fr: 'Moyen de gamme', ru: 'Средний класс', ja: 'ミドルレンジ', ko: '중간 가격대', de: 'Mittelpreisig', es: 'Gama media' },
  'Premium/Luxury': { zh: '高端精品', en: 'Premium/Luxury', fr: 'Premium/Luxe', ru: 'Премиум', ja: 'プレミアム', ko: '프리미엄', de: 'Premium/Luxus', es: 'Premium/Lujo' },
  // 邮件类型
  'Welcome Email': { zh: '欢迎邮件', en: 'Welcome Email', fr: 'Email de bienvenue', ru: 'Приветственное письмо', ja: 'ウェルカムメール', ko: '환영 이메일', de: 'Willkommens-E-Mail', es: 'Email de bienvenida' },
  'Promotion/Sale': { zh: '促销活动', en: 'Promotion/Sale', fr: 'Promotion/Solde', ru: 'Акция/Распродажа', ja: 'プロモーション', ko: '프로모션', de: 'Aktion/Verkauf', es: 'Promoción/Rebaja' },
  'Newsletter': { zh: '通讯', en: 'Newsletter', fr: 'Newsletter', ru: 'Рассылка', ja: 'ニュースレター', ko: '뉴스레터', de: 'Newsletter', es: 'Boletín' },
  'Abandoned Cart': { zh: '购物车挽回', en: 'Abandoned Cart', fr: 'Panier abandonné', ru: 'Брошенная корзина', ja: 'カゴ落ち', ko: '장바구니 포기', de: 'Verlassener Warenkorb', es: 'Carrito abandonado' },
  'Re-engagement': { zh: '重新激活', en: 'Re-engagement', fr: 'Réengagement', ru: 'Реактивация', ja: 'リエンゲージメント', ko: '재참여', de: 'Reaktivierung', es: 'Reengagement' },
  // 平台
  'Google Ads': { zh: 'Google广告', en: 'Google Ads', fr: 'Google Ads', ru: 'Google Ads', ja: 'Google広告', ko: 'Google 광고', de: 'Google Ads', es: 'Google Ads' },
  'Facebook Ads': { zh: 'Facebook广告', en: 'Facebook Ads', fr: 'Facebook Ads', ru: 'Facebook Ads', ja: 'Facebook広告', ko: 'Facebook 광고', de: 'Facebook Ads', es: 'Facebook Ads' },
  'Instagram Ads': { zh: 'Instagram广告', en: 'Instagram Ads', fr: 'Instagram Ads', ru: 'Instagram Ads', ja: 'Instagram広告', ko: 'Instagram 광고', de: 'Instagram Ads', es: 'Instagram Ads' },
  'X/Twitter Ads': { zh: 'X/Twitter广告', en: 'X/Twitter Ads', fr: 'X/Twitter Ads', ru: 'X/Twitter Ads', ja: 'X/Twitter広告', ko: 'X/Twitter 광고', de: 'X/Twitter Ads', es: 'X/Twitter Ads' },
  
  // ========== 中文模板的选项 ==========
  // 场景
  '日常生活': { en: 'Daily Life', zh: '日常生活', fr: 'Vie quotidienne', ru: 'Повседневная жизнь', ja: '日常生活', ko: '일상생활', de: 'Alltag', es: 'Vida diaria' },
  '美食探店': { en: 'Food & Dining', zh: '美食探店', fr: 'Gastronomie', ru: 'Еда и рестораны', ja: 'グルメ', ko: '맛집 탐방', de: 'Essen & Trinken', es: 'Gastronomía' },
  '旅行风景': { en: 'Travel & Scenery', zh: '旅行风景', fr: 'Voyage', ru: 'Путешествия', ja: '旅行', ko: '여행', de: 'Reisen', es: 'Viajes' },
  '工作感悟': { en: 'Work Insights', zh: '工作感悟', fr: 'Réflexions professionnelles', ru: 'Рабочие мысли', ja: '仕事の感想', ko: '업무 소감', de: 'Arbeitsgedanken', es: 'Reflexiones de trabajo' },
  '健身运动': { en: 'Fitness & Sports', zh: '健身运动', fr: 'Fitness', ru: 'Фитнес', ja: 'フィットネス', ko: '피트니스', de: 'Fitness', es: 'Fitness' },
  '节日祝福': { en: 'Holiday Greetings', zh: '节日祝福', fr: 'Vœux', ru: 'Праздничные поздравления', ja: '祝日', ko: '명절 인사', de: 'Feiertagsgrüße', es: 'Saludos festivos' },
  '深夜emo': { en: 'Late Night Thoughts', zh: '深夜emo', fr: 'Pensées nocturnes', ru: 'Ночные мысли', ja: '深夜のエモ', ko: '심야 감성', de: 'Gedanken in der Nacht', es: 'Pensamientos nocturnos' },
  '晒娃晒宠': { en: 'Kids & Pets', zh: '晒娃晒宠', fr: 'Enfants & Animaux', ru: 'Дети и питомцы', ja: '子供・ペット', ko: '아이/반려동물', de: 'Kinder & Haustiere', es: 'Niños y mascotas' },
  // 风格
  '文艺走心': { en: 'Poetic', zh: '文艺走心', fr: 'Poétique', ru: 'Поэтичный', ja: '文学的', ko: '문학적', de: 'Poetisch', es: 'Poético' },
  '幽默搞笑': { en: 'Humorous', zh: '幽默搞笑', fr: 'Humoristique', ru: 'Юмористический', ja: 'ユーモラス', ko: '유머러스', de: 'Humorvoll', es: 'Humorístico' },
  '高冷简约': { en: 'Minimalist', zh: '高冷简约', fr: 'Minimaliste', ru: 'Минималистичный', ja: 'ミニマル', ko: '미니멀', de: 'Minimalistisch', es: 'Minimalista' },
  '元气满满': { en: 'Energetic', zh: '元气满满', fr: 'Énergique', ru: 'Энергичный', ja: '元気いっぱい', ko: '에너지 넘치는', de: 'Energetisch', es: 'Energético' },
  '沙雕可爱': { en: 'Cute & Quirky', zh: '沙雕可爱', fr: 'Mignon et excentrique', ru: 'Милый и забавный', ja: 'カワイイ', ko: '귀엽고 엉뚱한', de: 'Süß und skurril', es: 'Lindo y peculiar' },
  // 文案风格
  '直击痛点': { en: 'Pain Point', zh: '直击痛点', fr: 'Point de douleur', ru: 'Болевая точка', ja: '痛みのポイント', ko: '통점 직격', de: 'Schmerzpunkt', es: 'Punto de dolor' },
  '效果导向': { en: 'Result-Oriented', zh: '效果导向', fr: 'Orienté résultats', ru: 'Ориентированный на результат', ja: '結果重視', ko: '효과 중심', de: 'Ergebnisorientiert', es: 'Orientado a resultados' },
  '场景代入': { en: 'Scenario-Based', zh: '场景代入', fr: 'Basé sur scénario', ru: 'Сценарный подход', ja: 'シナリオベース', ko: '시나리오 기반', de: 'Szenariobasiert', es: 'Basado en escenarios' },
  '疑问引发': { en: 'Question-Led', zh: '疑问引发', fr: 'Basé sur questions', ru: 'Вопросительный подход', ja: '質問リード', ko: '질문 유도', de: 'Fragegeführt', es: 'Basado en preguntas' },
  '对比震撼': { en: 'Contrast', zh: '对比震撼', fr: 'Contraste', ru: 'Контраст', ja: 'コントラスト', ko: '대비 효과', de: 'Kontrast', es: 'Contraste' },
  // 笔记类型
  '种草推荐': { en: 'Recommendation', zh: '种草推荐', fr: 'Recommandation', ru: 'Рекомендация', ja: 'おすすめ', ko: '추천', de: 'Empfehlung', es: 'Recomendación' },
  '产品测评': { en: 'Product Review', zh: '产品测评', fr: 'Test produit', ru: 'Обзор продукта', ja: '製品レビュー', ko: '제품 리뷰', de: 'Produkttest', es: 'Reseña de producto' },
  '教程攻略': { en: 'Tutorial', zh: '教程攻略', fr: 'Tutoriel', ru: 'Руководство', ja: 'チュートリアル', ko: '튜토리얼', de: 'Tutorial', es: 'Tutorial' },
  '探店分享': { en: 'Store Visit', zh: '探店分享', fr: 'Visite de magasin', ru: 'Визит в магазин', ja: 'お店訪問', ko: '맛집 방문', de: 'Geschäftsbesuch', es: 'Visita a tienda' },
  '日常分享': { en: 'Daily Share', zh: '日常分享', fr: 'Partage quotidien', ru: 'Ежедневный пост', ja: '日常シェア', ko: '일상 공유', de: 'Täglicher Beitrag', es: 'Compartir diario' },
  '干货知识': { en: 'Knowledge', zh: '干货知识', fr: 'Connaissances', ru: 'Знания', ja: '知識', ko: '지식', de: 'Wissen', es: 'Conocimiento' },
  // 内容类型
  '剧情类': { en: 'Drama', zh: '剧情类', fr: 'Drame', ru: 'Драма', ja: 'ドラマ', ko: '드라마', de: 'Drama', es: 'Drama' },
  '知识科普': { en: 'Education', zh: '知识科普', fr: 'Éducation', ru: 'Образование', ja: '教育', ko: '교육', de: 'Bildung', es: 'Educación' },
  '好物推荐': { en: 'Product Recs', zh: '好物推荐', fr: 'Recommandations', ru: 'Рекомендации', ja: 'おすすめ商品', ko: '제품 추천', de: 'Produktempfehlungen', es: 'Recomendaciones' },
  '生活Vlog': { en: 'Life Vlog', zh: '生活Vlog', fr: 'Vlog de vie', ru: 'Лайф-блог', ja: '生活ブログ', ko: '일상 브이로그', de: 'Lebens-Vlog', es: 'Vlog de vida' },
  '搞笑段子': { en: 'Comedy', zh: '搞笑段子', fr: 'Comédie', ru: 'Комедия', ja: 'コメディ', ko: '코미디', de: 'Komödie', es: 'Comedia' },
  '情感共鸣': { en: 'Emotional', zh: '情感共鸣', fr: 'Émotionnel', ru: 'Эмоциональный', ja: 'エモーショナル', ko: '감성', de: 'Emotional', es: 'Emocional' },
  // 抖音风格
  '幽默': { en: 'Humorous', zh: '幽默', fr: 'Humoristique', ru: 'Юмористический', ja: 'ユーモラス', ko: '유머러스', de: 'Humorvoll', es: 'Humorístico' },
  '走心': { en: 'Heartfelt', zh: '走心', fr: 'Sincère', ru: 'Искренний', ja: '心に響く', ko: '진심 어린', de: 'Herzlich', es: 'Sincero' },
  '专业': { en: 'Professional', zh: '专业', fr: 'Professionnel', ru: 'Профессиональный', ja: 'プロフェッショナル', ko: '전문적', de: 'Professionell', es: 'Profesional' },
  '接地气': { en: 'Down-to-earth', zh: '接地气', fr: 'Accessible', ru: 'Доступный', ja: '庶民的', ko: '친근한', de: 'Bodenständig', es: 'Accesible' },
  '高冷范': { en: 'Cool & Chic', zh: '高冷范', fr: 'Cool et chic', ru: 'Крутой', ja: 'クール', ko: '쿨한', de: 'Cool', es: 'Cool y chic' },
  // 文章类型
  '干货教程': { en: 'Tutorial', zh: '干货教程', fr: 'Tutoriel', ru: 'Руководство', ja: 'チュートリアル', ko: '튜토리얼', de: 'Tutorial', es: 'Tutorial' },
  '观点评论': { en: 'Opinion', zh: '观点评论', fr: 'Opinion', ru: 'Мнение', ja: '意見', ko: '의견', de: 'Meinung', es: 'Opinión' },
  '故事叙述': { en: 'Storytelling', zh: '故事叙述', fr: 'Narration', ru: 'Повествование', ja: 'ストーリーテリング', ko: '스토리텔링', de: 'Storytelling', es: 'Narración' },
  '新闻资讯': { en: 'News', zh: '新闻资讯', fr: 'Actualités', ru: 'Новости', ja: 'ニュース', ko: '뉴스', de: 'Nachrichten', es: 'Noticias' },
  '产品推广': { en: 'Promotion', zh: '产品推广', fr: 'Promotion', ru: 'Продвижение', ja: 'プロモーション', ko: '프로모션', de: 'Förderung', es: 'Promoción' },
  // 价格区间
  '平价亲民': { en: 'Budget-friendly', zh: '平价亲民', fr: 'Économique', ru: 'Бюджетный', ja: 'お手頃価格', ko: '저렴한', de: 'Budgetfreundlich', es: 'Económico' },
  '中端品质': { en: 'Mid-range', zh: '中端品质', fr: 'Moyen de gamme', ru: 'Средний класс', ja: 'ミドルレンジ', ko: '중간 가격대', de: 'Mittelpreisig', es: 'Gama media' },
  '高端精品': { en: 'Premium', zh: '高端精品', fr: 'Premium', ru: 'Премиум', ja: 'プレミアム', ko: '프리미엄', de: 'Premium', es: 'Premium' },
};

// ============================================
// 辅助函数
// ============================================
export function getTemplateName(template: { id: string; name: string }, lang: Language): string {
  return templateNames[template.id]?.[lang] || template.name;
}

export function getTemplateDescription(template: { id: string; description: string }, lang: Language): string {
  return templateDescriptions[template.id]?.[lang] || template.description;
}

export function getVariableLabel(variable: { label: string }, lang: Language): string {
  return variableLabels[variable.label]?.[lang] || variable.label;
}

// ============================================
// 占位符翻译
// ============================================
export const placeholderTranslations: Record<string, Record<Language, string>> = {
  // 英文占位符
  'e.g., AI tools, productivity, tech news': {
    zh: '例如：AI工具、生产力、科技新闻',
    en: 'e.g., AI tools, productivity, tech news',
    fr: 'ex: outils IA, productivité',
    ru: 'напр.: AI инструменты',
    ja: '例：AIツール、生産性',
    ko: '예: AI 도구, 생산성',
    de: 'z.B. AI-Tools, Produktivität',
    es: 'ej: herramientas IA'
  },
  'e.g., #AI #Tech': {
    zh: '例如：#AI #科技',
    en: 'e.g., #AI #Tech',
    fr: 'ex: #IA #Tech',
    ru: 'напр.: #AI #Технологии',
    ja: '例：#AI #テック',
    ko: '예: #AI #테크',
    de: 'z.B. #AI #Tech',
    es: 'ej: #IA #Tech'
  },
  'Your brand name': {
    zh: '你的品牌名称',
    en: 'Your brand name',
    fr: 'Nom de votre marque',
    ru: 'Название бренда',
    ja: 'ブランド名',
    ko: '브랜드명',
    de: 'Ihr Markenname',
    es: 'Nombre de su marca'
  },
  'Main point you want to convey': {
    zh: '你想传达的核心信息',
    en: 'Main point you want to convey',
    fr: 'Point principal à transmettre',
    ru: 'Главный посыл',
    ja: '伝えたいポイント',
    ko: '전달하고 싶은 핵심',
    de: 'Hauptbotschaft',
    es: 'Punto principal a transmitir'
  },
  'e.g., young professionals, parents': {
    zh: '例如：年轻职场人、父母',
    en: 'e.g., young professionals, parents',
    fr: 'ex: jeunes professionnels',
    ru: 'напр.: молодые профессионалы',
    ja: '例：若いプロフェッショナル',
    ko: '예: 젊은 전문가',
    de: 'z.B. junge Berufstätige',
    es: 'ej: jóvenes profesionales'
  },
  'What is the post about?': {
    zh: '帖子是关于什么的？',
    en: 'What is the post about?',
    fr: 'De quoi parle le post?',
    ru: 'О чем пост?',
    ja: '投稿について',
    ko: '게시물 내용',
    de: 'Worum geht es?',
    es: '¿De qué trata el post?'
  },
  'Describe your image or video content...': {
    zh: '描述你的图片或视频内容...',
    en: 'Describe your image or video content...',
    fr: 'Décrivez votre image ou vidéo...',
    ru: 'Опишите ваш контент...',
    ja: '画像や動画を説明...',
    ko: '이미지나 동영상 내용 설명...',
    de: 'Beschreiben Sie Ihren Inhalt...',
    es: 'Describa su imagen o video...'
  },
  'e.g., r/technology, r/entrepreneur': {
    zh: '例如：r/technology, r/entrepreneur',
    en: 'e.g., r/technology, r/entrepreneur',
    fr: 'ex: r/technology',
    ru: 'напр.: r/technology',
    ja: '例：r/technology',
    ko: '예: r/technology',
    de: 'z.B. r/technology',
    es: 'ej: r/technology'
  },
  'What do you want to discuss?': {
    zh: '你想讨论什么？',
    en: 'What do you want to discuss?',
    fr: 'Que voulez-vous discuter?',
    ru: 'Что хотите обсудить?',
    ja: '議論したいこと',
    ko: '토론하고 싶은 주제',
    de: 'Was möchten Sie diskutieren?',
    es: '¿Qué quiere discutir?'
  },
  'Any relevant context...': {
    zh: '相关背景信息...',
    en: 'Any relevant context...',
    fr: 'Contexte pertinent...',
    ru: 'Любой контекст...',
    ja: '関連する背景...',
    ko: '관련 배경...',
    de: 'Relevanter Kontext...',
    es: 'Contexto relevante...'
  },
  'e.g., Tech, Finance, Healthcare': {
    zh: '例如：科技、金融、医疗',
    en: 'e.g., Tech, Finance, Healthcare',
    fr: 'ex: Tech, Finance',
    ru: 'напр.: Технологии',
    ja: '例：テクノロジー',
    ko: '예: 테크, 금융',
    de: 'z.B. Tech, Finanzen',
    es: 'ej: Tecnología'
  },
  'Main message you want to share': {
    zh: '你想分享的核心信息',
    en: 'Main message you want to share',
    fr: 'Message principal à partager',
    ru: 'Главное сообщение',
    ja: '共有したいメッセージ',
    ko: '공유하고 싶은 메시지',
    de: 'Hauptbotschaft zum Teilen',
    es: 'Mensaje principal a compartir'
  },
  'e.g., CEO, Engineer, Consultant': {
    zh: '例如：CEO、工程师、顾问',
    en: 'e.g., CEO, Engineer, Consultant',
    fr: 'ex: CEO, Ingénieur',
    ru: 'напр.: CEO, Инженер',
    ja: '例：CEO、エンジニア',
    ko: '예: CEO, 엔지니어',
    de: 'z.B. CEO, Ingenieur',
    es: 'ej: CEO, Ingeniero'
  },
  'What is the video about?': {
    zh: '视频是关于什么的？',
    en: 'What is the video about?',
    fr: 'De quoi traite la vidéo?',
    ru: 'О чем видео?',
    ja: '動画の内容',
    ko: '동영상 주제',
    de: 'Worum geht es im Video?',
    es: '¿De qué trata el video?'
  },
  'e.g., cooking, fitness, tech': {
    zh: '例如：烹饪、健身、科技',
    en: 'e.g., cooking, fitness, tech',
    fr: 'ex: cuisine, fitness',
    ru: 'напр.: кулинария',
    ja: '例：料理、フィットネス',
    ko: '예: 요리, 피트니스',
    de: 'z.B. Kochen, Fitness',
    es: 'ej: cocina, fitness'
  },
  'e.g., Online course, SaaS software': {
    zh: '例如：在线课程、SaaS软件',
    en: 'e.g., Online course, SaaS software',
    fr: 'ex: Cours en ligne',
    ru: 'напр.: Онлайн-курс',
    ja: '例：オンラインコース',
    ko: '예: 온라인 강좌',
    de: 'z.B. Online-Kurs',
    es: 'ej: Curso online'
  },
  'e.g., Free trial, 20% off limited time': {
    zh: '例如：免费试用、限时8折',
    en: 'e.g., Free trial, 20% off limited time',
    fr: 'ex: Essai gratuit',
    ru: 'напр.: Бесплатный пробный период',
    ja: '例：無料トライアル',
    ko: '예: 무료 체험',
    de: 'z.B. Kostenlose Testversion',
    es: 'ej: Prueba gratis'
  },
  'e.g., Wireless Bluetooth Headphones': {
    zh: '例如：无线蓝牙耳机',
    en: 'e.g., Wireless Bluetooth Headphones',
    fr: 'ex: Écouteurs Bluetooth',
    ru: 'напр.: Беспроводные наушники',
    ja: '例：ワイヤレスヘッドフォン',
    ko: '예: 무선 블루투스 헤드폰',
    de: 'z.B. Kabellose Kopfhörer',
    es: 'ej: Auriculares Bluetooth'
  },
  'List 3-5 key features': {
    zh: '列出3-5个核心特点',
    en: 'List 3-5 key features',
    fr: 'Listez 3-5 caractéristiques',
    ru: 'Перечислите 3-5 особенностей',
    ja: '3-5つの主な特徴を記入',
    ko: '3-5개 핵심 특징 입력',
    de: '3-5 Hauptmerkmale auflisten',
    es: 'Lista 3-5 características'
  },
  'e.g., Electronics, Fashion, Home': {
    zh: '例如：电子产品、时尚、家居',
    en: 'e.g., Electronics, Fashion, Home',
    fr: 'ex: Électronique, Mode',
    ru: 'напр.: Электроника',
    ja: '例：電子機器',
    ko: '예: 전자제품',
    de: 'z.B. Elektronik',
    es: 'ej: Electrónica'
  },
  'e.g., young professionals': {
    zh: '例如：年轻职场人',
    en: 'e.g., young professionals',
    fr: 'ex: jeunes professionnels',
    ru: 'напр.: молодые профессионалы',
    ja: '例：若いプロフェッショナル',
    ko: '예: 젊은 전문가',
    de: 'z.B. junge Berufstätige',
    es: 'ej: jóvenes profesionales'
  },
  'Keywords to rank for': {
    zh: '要排名的关键词',
    en: 'Keywords to rank for',
    fr: 'Mots-clés pour le classement',
    ru: 'Ключевые слова',
    ja: 'ランクしたいキーワード',
    ko: '순위 올릴 키워드',
    de: 'Keywords für das Ranking',
    es: 'Palabras clave para posicionar'
  },
  'What is your video about?': {
    zh: '你的视频是关于什么的？',
    en: 'What is your video about?',
    fr: 'De quoi parle votre vidéo?',
    ru: 'О чем ваше видео?',
    ja: '動画について',
    ko: '동영상 주제',
    de: 'Worum geht es in Ihrem Video?',
    es: '¿De qué trata su video?'
  },
  'What is the blog about?': {
    zh: '博客是关于什么的？',
    en: 'What is the blog about?',
    fr: 'De quoi parle le blog?',
    ru: 'О чем блог?',
    ja: 'ブログのテーマ',
    ko: '블로그 주제',
    de: 'Worum geht es im Blog?',
    es: '¿De qué trata el blog?'
  },
  'Main keyword to target': {
    zh: '要定位的主要关键词',
    en: 'Main keyword to target',
    fr: 'Mot-clé principal',
    ru: 'Основное ключевое слово',
    ja: 'ターゲットキーワード',
    ko: '타겟 키워드',
    de: 'Hauptkeyword',
    es: 'Palabra clave principal'
  },
  'Your company': {
    zh: '你的公司',
    en: 'Your company',
    fr: 'Votre entreprise',
    ru: 'Ваша компания',
    ja: 'あなたの会社',
    ko: '회사명',
    de: 'Ihr Unternehmen',
    es: 'Su empresa'
  },
  'What are you announcing?': {
    zh: '你要发布什么？',
    en: 'What are you announcing?',
    fr: 'Qu\'annoncez-vous?',
    ru: 'Что вы объявляете?',
    ja: '発表内容',
    ko: '공지 내용',
    de: 'Was kündigen Sie an?',
    es: '¿Qué está anunciando?'
  },
  'Contact email/phone': {
    zh: '联系邮箱/电话',
    en: 'Contact email/phone',
    fr: 'Email/téléphone de contact',
    ru: 'Контактный email/телефон',
    ja: '連絡先',
    ko: '연락처',
    de: 'Kontakt-E-Mail/Telefon',
    es: 'Email/teléfono de contacto'
  },
  'What are you advertising?': {
    zh: '你在推广什么？',
    en: 'What are you advertising?',
    fr: 'Que faites-vous la promotion?',
    ru: 'Что вы рекламируете?',
    ja: '広告内容',
    ko: '광고 내용',
    de: 'Was bewerben Sie?',
    es: '¿Qué está anunciando?'
  },
  'Unique selling proposition': {
    zh: '独特卖点',
    en: 'Unique selling proposition',
    fr: 'Proposition de vente unique',
    ru: 'Уникальное торговое предложение',
    ja: '独自の販売提案',
    ko: '고유 판매 제안',
    de: 'Alleinstellungsmerkmal',
    es: 'Propuesta de valor única'
  },
  'Who is your target?': {
    zh: '你的目标人群是谁？',
    en: 'Who is your target?',
    fr: 'Qui est votre cible?',
    ru: 'Кто ваша цель?',
    ja: 'ターゲットは誰？',
    ko: '타겟은 누구?',
    de: 'Wer ist Ihre Zielgruppe?',
    es: '¿Quién es su objetivo?'
  },
  // 中文占位符
  '例如：AI工具、生产力、科技新闻': {
    en: 'e.g., AI tools, productivity, tech news',
    zh: '例如：AI工具、生产力、科技新闻',
    fr: 'ex: outils IA, productivité',
    ru: 'напр.: AI инструменты',
    ja: '例：AIツール、生産性',
    ko: '예: AI 도구, 생산성',
  },
  '如：周末放松、美食打卡、生日快乐': {
    en: 'e.g., weekend chill, food check-in, birthday',
    zh: '如：周末放松、美食打卡、生日快乐',
    fr: 'ex: week-end détente',
    ru: 'напр.: выходные, еда',
    ja: '例：週末リラックス',
    ko: '예: 주말 휴식',
  },
  '如：咖啡、阳光、治愈': {
    en: 'e.g., coffee, sunshine, healing',
    zh: '如：咖啡、阳光、治愈',
    fr: 'ex: café, soleil',
    ru: 'напр.: кофе, солнце',
    ja: '例：コーヒー、日差し',
    ko: '예: 커피, 햇살',
  },
  '如：眼袋去除、减肥产品、课程': {
    en: 'e.g., eye bag removal, weight loss, course',
    zh: '如：眼袋去除、减肥产品、课程',
    fr: 'ex: produits amincissants',
    ru: 'напр.: курс похудения',
    ja: '例：アイバッグ除去',
    ko: '예: 다이어트 제품',
  },
  '如：不开刀、0恢复期、见效快': {
    en: 'e.g., no surgery, zero downtime, fast results',
    zh: '如：不开刀、0恢复期、见效快',
    fr: 'ex: sans chirurgie',
    ru: 'напр.: без операции',
    ja: '例：メス不要',
    ko: '예: 수술 없음',
  },
  '如：20分钟、3天消肿、减重10斤': {
    en: 'e.g., 20 mins, 3-day recovery, 5kg weight loss',
    zh: '如：20分钟、3天消肿、减重10斤',
    fr: 'ex: 20 min, 3 jours',
    ru: 'напр.: 20 минут',
    ja: '例：20分',
    ko: '예: 20분',
  },
  '如：熬夜党、宝妈、上班族': {
    en: 'e.g., night owls, moms, office workers',
    zh: '如：熬夜党、宝妈、上班族',
    fr: 'ex: noctambules',
    ru: 'напр.: совы',
    ja: '例：夜型人',
    ko: '예: 올빼미족',
  },
  '如：口红、咖啡店、学习方法': {
    en: 'e.g., lipstick, cafe, study methods',
    zh: '如：口红、咖啡店、学习方法',
    fr: 'ex: rouge à lèvres',
    ru: 'напр.: помада',
    ja: '例：口紅',
    ko: '예: 립스틱',
  },
  '最吸引人的特点': {
    en: 'Most attractive features',
    zh: '最吸引人的特点',
    fr: 'Caractéristiques les plus attractives',
    ru: 'Самые привлекательные особенности',
    ja: '最も魅力的な特徴',
    ko: '가장 매력적인 특징',
  },
  '如：学生党、上班族': {
    en: 'e.g., students, office workers',
    zh: '如：学生党、上班族',
    fr: 'ex: étudiants',
    ru: 'напр.: студенты',
    ja: '例：学生',
    ko: '예: 학생',
  },
  '视频主要内容': {
    en: 'Main video content',
    zh: '视频主要内容',
    fr: 'Contenu principal',
    ru: 'Основной контент',
    ja: '動画の主な内容',
    ko: '동영상 주요 내용',
  },
  '文章核心主题': {
    en: 'Core article topic',
    zh: '文章核心主题',
    fr: 'Sujet principal',
    ru: 'Основная тема',
    ja: '記事の核心テーマ',
    ko: '아티클 핵심 주제',
  },
  '需要覆盖的关键词': {
    en: 'Keywords to cover',
    zh: '需要覆盖的关键词',
    fr: 'Mots-clés à couvrir',
    ru: 'Ключевые слова',
    ja: 'カバーするキーワード',
    ko: '포함할 키워드',
  },
  '商品名称': {
    en: 'Product name',
    zh: '商品名称',
    fr: 'Nom du produit',
    ru: 'Название товара',
    ja: '商品名',
    ko: '제품명',
  },
  '如：女装、数码、家居': {
    en: 'e.g., womenswear, digital, home',
    zh: '如：女装、数码、家居',
    fr: 'ex: mode femme',
    ru: 'напр.: женская одежда',
    ja: '例：レディース',
    ko: '예: 여성복',
  },
  '商品的主要特点和优势': {
    en: 'Main features and advantages',
    zh: '商品的主要特点和优势',
    fr: 'Principales caractéristiques',
    ru: 'Основные особенности',
    ja: '主な特徴と利点',
    ko: '주요 특징과 장점',
  },
};

export function getVariablePlaceholder(variable: { placeholder?: string }, lang: Language): string | undefined {
  if (!variable.placeholder) return undefined;
  return placeholderTranslations[variable.placeholder]?.[lang] || variable.placeholder;
}

export function getOptionLabel(option: { value: string; label: string }, lang: Language): string {
  return optionLabels[option.label]?.[lang] || option.label;
}

// 语言指令映射
export const languageInstructions: Record<Language, string> = {
  zh: '【重要】请用中文输出所有内容。',
  en: '【Important】Please output all content in English.',
  fr: '【Important】Veuillez produire tout le contenu en français.',
  ru: '【Важно】Пожалуйста, выводите весь контент на русском языке.',
  ja: '【重要】すべてのコンテンツを日本語で出力してください。',
  ko: '【중요】모든 콘텐츠를 한국어로 출력해 주세요.',
  de: '【Wichtig】Bitte geben Sie alle Inhalte auf Deutsch aus.',
  es: '【Importante】Por favor, produce todo el contenido en español.'
};