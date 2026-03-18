import { Language } from './i18n';

// 模板变量类型
export interface TemplateVariable {
  name: string;
  label: string;
  type: 'text' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

// 模板类型
export interface Template {
  id: string;
  category: string;
  name: string;
  description: string;
  icon: string;
  isPremium?: boolean;
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

// 模板列表
export const templates: Template[] = [
  // ==================== 社媒文案 ====================
  {
    id: 'x-post',
    category: 'social',
    name: 'X / Twitter Post',
    description: 'Generate viral tweets that engage and convert',
    icon: '🐦',
    variables: [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., AI tools, productivity, tech news' },
      { name: 'tone', label: 'Tone', type: 'select', required: true, options: [
        { value: 'professional', label: 'Professional' },
        { value: 'casual', label: 'Casual' },
        { value: 'humorous', label: 'Humorous' },
        { value: 'provocative', label: 'Provocative' },
        { value: 'inspirational', label: 'Inspirational' },
      ]},
      { name: 'goal', label: 'Goal', type: 'select', required: true, options: [
        { value: 'engagement', label: 'Engagement' },
        { value: 'awareness', label: 'Brand Awareness' },
        { value: 'traffic', label: 'Drive Traffic' },
        { value: 'thought-leadership', label: 'Thought Leadership' },
      ]},
      { name: 'keywords', label: 'Keywords/Hashtags', type: 'text', required: false, placeholder: 'e.g., #AI #Tech' },
    ],
    promptTemplate: `You are a viral Twitter/X content expert who writes like a real human, not a bot.

【Topic】{topic}
【Tone】{tone} (Must maintain this tone throughout all tweets)
【Goal】{goal}
【Keywords】{keywords}

【⚠️ HUMAN WRITING RULES - Avoid AI-sounding tweets】
1. Write like you're texting a friend, not writing an essay
2. Use lowercase intentionally, occasional typos are okay
3. Skip "Excited to share" or "Thrilled to announce" - nobody talks like that
4. Start mid-thought sometimes, like real people do
5. Use sentence fragments. Not everything needs a period
6. Add personal takes: "honestly" "imo" "ngl" "tbh"
7. Questions work: "anyone else?" "thoughts?"
8. Be specific with details, not generic statements
9. One emoji max usually, unless being unhinged on purpose
10. Threads > single tweets for storytelling

【Requirements】
1. Keep it under 280 characters (hard limit)
2. Use hooks that grab attention in the first 3 words
3. Include 1-2 relevant hashtags (no more)
4. Use line breaks for readability
5. End with a CTA that matches the goal
6. ALL 3 tweets must have the same 【{tone}】 tone
7. Sound like a human, not ChatGPT

【Output Format】
Generate 3 tweets, ALL with 【{tone}】 tone, but different content angles:

1️⃣ [Hook-focused tweet - {tone} tone]

2️⃣ [Story/insight tweet - {tone} tone]

3️⃣ [Question/engagement tweet - {tone} tone]

📊 Best posting time suggestion: [recommendation]`,
  },
  {
    id: 'facebook-post',
    category: 'social',
    name: 'Facebook Post',
    description: 'Create engaging Facebook posts for your audience',
    icon: '📘',
    variables: [
      { name: 'type', label: 'Post Type', type: 'select', required: true, options: [
        { value: 'product', label: 'Product Promotion' },
        { value: 'story', label: 'Brand Story' },
        { value: 'event', label: 'Event Announcement' },
        { value: 'educational', label: 'Educational Content' },
        { value: 'community', label: 'Community Engagement' },
      ]},
      { name: 'business', label: 'Business/Brand Name', type: 'text', required: true, placeholder: 'Your brand name' },
      { name: 'message', label: 'Key Message', type: 'text', required: true, placeholder: 'Main point you want to convey' },
      { name: 'audience', label: 'Target Audience', type: 'text', required: false, placeholder: 'e.g., young professionals, parents' },
    ],
    promptTemplate: `You are a Facebook marketing expert specializing in organic engagement.

【Post Type】{type}
【Business】{business}
【Key Message】{message}
【Target Audience】{audience}

【Requirements】
1. Length: 80-150 words for optimal reach
2. Include a clear hook in the first line
3. Use emojis sparingly (2-4 max)
4. End with a specific CTA
5. Suggest 3-5 relevant hashtags

【Output Format】
Generate a complete Facebook post with:
- Headline/Hook
- Body content
- CTA
- Hashtags

💡 Engagement tip: [specific suggestion for this post]`,
  },
  {
    id: 'instagram-caption',
    category: 'social',
    name: 'Instagram Caption',
    description: 'Write scroll-stopping Instagram captions',
    icon: '📸',
    variables: [
      { name: 'contentType', label: 'Content Type', type: 'select', required: true, options: [
        { value: 'lifestyle', label: 'Lifestyle' },
        { value: 'product', label: 'Product Showcase' },
        { value: 'behind-scenes', label: 'Behind the Scenes' },
        { value: 'quote', label: 'Quote/Motivation' },
        { value: 'tutorial', label: 'Tutorial/How-to' },
        { value: 'reel', label: 'Reel Content' },
      ]},
      { name: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'What is the post about?' },
      { name: 'vibe', label: 'Vibe/Aesthetic', type: 'select', required: true, options: [
        { value: 'minimalist', label: 'Minimalist' },
        { value: 'vibrant', label: 'Vibrant/Energetic' },
        { value: 'cozy', label: 'Cozy/Warm' },
        { value: 'professional', label: 'Professional' },
        { value: 'edgy', label: 'Edgy/Bold' },
      ]},
      { name: 'cta', label: 'Call to Action', type: 'select', required: false, options: [
        { value: 'save', label: 'Save for later' },
        { value: 'share', label: 'Share with friends' },
        { value: 'comment', label: 'Comment below' },
        { value: 'link-bio', label: 'Link in bio' },
        { value: 'follow', label: 'Follow for more' },
      ]},
    ],
    promptTemplate: `You are an Instagram content specialist who creates viral captions.

【Content Type】{contentType}
【Subject】{subject}
【Vibe】{vibe} (The entire caption must embody this aesthetic)
【CTA】{cta}

【Vibe Guidelines】
- Minimalist: Clean, simple, few words, sophisticated
- Vibrant: Energetic, colorful emojis, enthusiastic tone
- Cozy: Warm, intimate, comforting, soft language
- Professional: Polished, authoritative, business-appropriate
- Edgy: Bold, provocative, unconventional, daring

【Requirements】
1. Hook in the first line that stops the scroll
2. Use line breaks for easy reading
3. Include 15-25 relevant hashtags
4. Match the 【{vibe}】 vibe in tone and emoji usage
5. Strong CTA that drives engagement

【Output Format】
[{vibe} vibe caption]

[Hook/First Line]

[Body content with relevant emojis - maintaining {vibe} aesthetic]

[CTA]

.
.
.
[Hashtags - block format]

🎨 Visual suggestion: [{vibe} style photo/video recommendation]`,
  },
  {
    id: 'reddit-post',
    category: 'social',
    name: 'Reddit Post',
    description: 'Craft authentic Reddit posts that spark discussion',
    icon: '🤖',
    variables: [
      { name: 'subreddit', label: 'Subreddit', type: 'text', required: true, placeholder: 'e.g., r/technology, r/entrepreneur' },
      { name: 'type', label: 'Post Type', type: 'select', required: true, options: [
        { value: 'discussion', label: 'Discussion' },
        { value: 'question', label: 'Question' },
        { value: 'story', label: 'Story/Experience' },
        { value: 'guide', label: 'Guide/Tutorial' },
        { value: 'ama', label: 'AMA Style' },
      ]},
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'What do you want to discuss?' },
      { name: 'background', label: 'Background Context', type: 'textarea', required: false, placeholder: 'Any relevant context...' },
    ],
    promptTemplate: `You are a Reddit expert who understands different subreddit cultures.

【Subreddit】r/{subreddit}
【Post Type】{type}
【Topic】{topic}
【Background】{background}

【Requirements】
1. Title: Clear, specific, under 120 characters
2. First paragraph must hook readers
3. Be authentic - Redditors hate marketing speak
4. Include specific details for credibility
5. End with a question or discussion prompt

【Reddit Best Practices】
- No clickbait titles
- Show, don't tell
- Be humble and genuine
- Cite sources if making claims

【Output Format】
Title: [compelling title]

[Body content]

---
💡 Subreddit tips: [specific advice for r/{subreddit}]
⚠️ What to avoid: [common mistakes in this subreddit]`,
  },
  {
    id: 'linkedin-post',
    category: 'social',
    name: 'LinkedIn Post',
    description: 'Write professional LinkedIn content that builds authority',
    icon: '💼',
    variables: [
      { name: 'type', label: 'Content Type', type: 'select', required: true, options: [
        { value: 'insight', label: 'Industry Insight' },
        { value: 'story', label: 'Career Story' },
        { value: 'achievement', label: 'Achievement' },
        { value: 'advice', label: 'Career Advice' },
        { value: 'announcement', label: 'Company News' },
      ]},
      { name: 'industry', label: 'Industry', type: 'text', required: true, placeholder: 'e.g., Tech, Finance, Healthcare' },
      { name: 'keyPoint', label: 'Key Point', type: 'text', required: true, placeholder: 'Main message you want to share' },
      { name: 'role', label: 'Your Role', type: 'text', required: false, placeholder: 'e.g., CEO, Engineer, Consultant' },
    ],
    promptTemplate: `You are a LinkedIn thought leadership expert.

【Content Type】{type}
【Industry】{industry}
【Key Point】{keyPoint}
【Your Role】{role}

【Requirements】
1. Hook in first line (keep it under 10 words)
2. Use the "hook, insight, value" structure
3. Break into short paragraphs (2-3 lines max)
4. Include a relevant question to drive comments
5. Add 3-5 relevant hashtags at the end
6. NO hashtag spam or clickbait

【Tone】
Professional yet conversational. Like talking to a colleague.

【Output Format】
[Hook]

[Insight/Story - 3-4 short paragraphs]

[Key takeaway/Question]

[Hashtags]

📊 Best posting time: [recommendation]
🎯 Ideal audience: [who should see this]`,
  },
  {
    id: 'tiktok-script',
    category: 'social',
    name: 'TikTok Script',
    description: 'Create viral TikTok video scripts',
    icon: '🎵',
    variables: [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'What is the video about?' },
      { name: 'style', label: 'Video Style', type: 'select', required: true, options: [
        { value: 'storytelling', label: 'Storytelling' },
        { value: 'tutorial', label: 'Tutorial' },
        { value: 'reaction', label: 'Reaction' },
        { value: 'listicle', label: 'Listicle/Tips' },
        { value: 'trend', label: 'Trend Participation' },
      ]},
      { name: 'duration', label: 'Duration', type: 'select', required: true, options: [
        { value: '15', label: '15 seconds' },
        { value: '30', label: '30 seconds' },
        { value: '60', label: '60 seconds' },
        { value: '180', label: '3 minutes' },
      ]},
      { name: 'niche', label: 'Niche', type: 'text', required: false, placeholder: 'e.g., cooking, fitness, tech' },
    ],
    promptTemplate: `You are a TikTok content creator who knows what goes viral.

【Topic】{topic}
【Video Style】{style}
【Duration】{duration} seconds
【Niche】{niche}

【Requirements】
1. Hook MUST be in first 1-2 seconds
2. Use pattern interrupts every 3-5 seconds
3. End with a reason to watch again or share
4. Include on-screen text suggestions
5. Add trending sound recommendation

【Script Format】
⏱️ [0-3s] Hook: [attention-grabbing opening]
📱 On-screen text: "[text]"

⏱️ [3-{duration}s] Content: [script]
📱 On-screen text: "[text]"
🎬 Visual: [what to show]

⏱️ [End] CTA: [call to action]

🎵 Recommended sound: [specific sound suggestion]
🏷️ Hashtags: [5-8 relevant hashtags]
💡 Pro tip: [viral optimization tip]`,
  },
  {
    id: 'youtube-title',
    category: 'social',
    name: 'YouTube Title & Description',
    description: 'Optimize YouTube titles and descriptions for views',
    icon: '▶️',
    variables: [
      { name: 'videoTopic', label: 'Video Topic', type: 'text', required: true, placeholder: 'What is your video about?' },
      { name: 'type', label: 'Video Type', type: 'select', required: true, options: [
        { value: 'tutorial', label: 'Tutorial/How-to' },
        { value: 'review', label: 'Review' },
        { value: 'vlog', label: 'Vlog' },
        { value: 'listicle', label: 'Listicle' },
        { value: 'analysis', label: 'Analysis/Deep Dive' },
      ]},
      { name: 'channel', label: 'Channel Niche', type: 'text', required: false, placeholder: 'e.g., Gaming, Tech, Education' },
      { name: 'keywords', label: 'Target Keywords', type: 'text', required: false, placeholder: 'e.g., SEO, tutorial 2024' },
    ],
    promptTemplate: `You are a YouTube SEO expert and title optimizer.

【Video Topic】{videoTopic}
【Video Type】{type}
【Channel Niche】{channel}
【Target Keywords】{keywords}

【Requirements for Title】
1. 50-60 characters for optimal display
2. Include main keyword near the beginning
3. Use power words: Ultimate, Best, How to, Guide
4. Create curiosity or promise value

【Requirements for Description】
1. First 150 characters are crucial (above fold)
2. Include keywords naturally
3. Add timestamps for longer videos
4. End with CTA and links

【Output Format】

📹 TITLE OPTIONS:
1. [Option 1 - SEO focused]
2. [Option 2 - Click focused]
3. [Option 3 - Curiosity focused]

📝 DESCRIPTION:

[Hook - first 150 characters]

[Expanded description - 2-3 paragraphs]

⏱️ TIMESTAMPS:
0:00 - Introduction
[Add relevant timestamps]

📌 LINKS:
- [Placeholder for links]

#hashtags [5-8 relevant hashtags]

💡 SEO Score: [rate the optimization]`,
  },
  {
    id: 'threads-post',
    category: 'social',
    name: 'Threads Post',
    description: 'Create engaging Threads content',
    icon: '🧵',
    variables: [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'What do you want to post about?' },
      { name: 'style', label: 'Style', type: 'select', required: true, options: [
        { value: 'hot-take', label: 'Hot Take' },
        { value: 'story', label: 'Story Time' },
        { value: 'question', label: 'Question' },
        { value: 'tips', label: 'Tips Thread' },
        { value: 'relatable', label: 'Relatable Content' },
      ]},
      { name: 'tone', label: 'Tone', type: 'select', required: false, options: [
        { value: 'casual', label: 'Casual' },
        { value: 'professional', label: 'Professional' },
        { value: 'humorous', label: 'Humorous' },
        { value: 'thoughtful', label: 'Thoughtful' },
      ]},
    ],
    promptTemplate: `You are a Threads content creator who understands the platform's conversational nature.

【Topic】{topic}
【Style】{style}
【Tone】{tone}

【Requirements】
1. Keep it conversational and authentic
2. Threads audience prefers genuine content over polished
3. Can be longer than Twitter but keep it engaging
4. Use relevant hashtags (2-3 max)
5. Ask questions to drive engagement

【Output Format】
Generate 3 post options:

1️⃣ [Conversational approach]

2️⃣ [Story/narrative approach]

3️⃣ [Question/engagement approach]

💡 Threads tip: [specific advice for this platform]`,
  },
  {
    id: 'pinterest-pin',
    category: 'social',
    name: 'Pinterest Pin',
    description: 'Create Pinterest-optimized titles and descriptions',
    icon: '📌',
    variables: [
      { name: 'contentType', label: 'Content Type', type: 'select', required: true, options: [
        { value: 'diy', label: 'DIY/Craft' },
        { value: 'recipe', label: 'Recipe/Food' },
        { value: 'fashion', label: 'Fashion/Style' },
        { value: 'home', label: 'Home Decor' },
        { value: 'blog', label: 'Blog Post' },
        { value: 'product', label: 'Product' },
      ]},
      { name: 'title', label: 'Pin Topic', type: 'text', required: true, placeholder: 'What is the pin about?' },
      { name: 'keywords', label: 'Target Keywords', type: 'text', required: false, placeholder: 'e.g., easy recipe, home decor' },
    ],
    promptTemplate: `You are a Pinterest SEO expert.

【Content Type】{contentType}
【Pin Topic】{title}
【Target Keywords】{keywords}

【Requirements】
1. Title: 50-100 characters, include main keyword
2. Description: 200-500 characters
3. Use action words: Learn, Discover, Create
4. Include keywords naturally
5. End with CTA

【Output Format】

📌 PIN TITLE:
[SEO-optimized title - 2 options]

📝 PIN DESCRIPTION:
[Description with keywords and CTA]

🏷️ KEYWORDS:
[10-15 keyword suggestions]

📋 BOARD SUGGESTIONS:
- [Board name 1]
- [Board name 2]
- [Board name 3]

💡 Pinterest Tip: [specific optimization advice]`,
  },

  // ==================== 电商文案 ====================
  {
    id: 'product-description',
    category: 'ecommerce',
    name: 'Product Description',
    description: 'Write compelling product descriptions that convert',
    icon: '🛍️',
    variables: [
      { name: 'productName', label: 'Product Name', type: 'text', required: true, placeholder: 'e.g., Wireless Bluetooth Headphones' },
      { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g., Electronics, Fashion, Home' },
      { name: 'features', label: 'Key Features', type: 'textarea', required: true, placeholder: 'List 3-5 key features' },
      { name: 'targetAudience', label: 'Target Audience', type: 'text', required: false, placeholder: 'e.g., young professionals' },
      { name: 'priceRange', label: 'Price Range', type: 'select', required: false, options: [
        { value: 'budget', label: 'Budget-friendly' },
        { value: 'mid', label: 'Mid-range' },
        { value: 'premium', label: 'Premium/Luxury' },
      ]},
    ],
    promptTemplate: `You are an e-commerce copywriter specializing in conversion-optimized product descriptions.

【Product】{productName}
【Category】{category}
【Key Features】{features}
【Target Audience】{targetAudience}
【Price Range】{priceRange}

【Requirements】
1. Compelling headline with main benefit
2. Highlight unique selling points
3. Use sensory language
4. Address potential objections
5. Include clear CTA

【Output Format】
Generate a product description with:

📌 HEADLINE
[Attention-grabbing title]

✨ KEY BENEFITS
• [Benefit 1]
• [Benefit 2]
• [Benefit 3]

📝 DESCRIPTION
[2-3 paragraph product description]

🎯 PERFECT FOR
[Target audience and use cases]

💡 WHY CHOOSE THIS
[Unique selling proposition]`,
  },
  {
    id: 'amazon-listing',
    category: 'ecommerce',
    name: 'Amazon Listing',
    description: 'Create optimized Amazon product listings',
    icon: '📦',
    variables: [
      { name: 'product', label: 'Product Name', type: 'text', required: true, placeholder: 'Your product name' },
      { name: 'category', label: 'Amazon Category', type: 'text', required: true, placeholder: 'e.g., Electronics, Home & Kitchen' },
      { name: 'features', label: 'Key Features (5)', type: 'textarea', required: true, placeholder: 'List 5 key features' },
      { name: 'targetKeywords', label: 'Target Keywords', type: 'text', required: false, placeholder: 'Keywords to rank for' },
    ],
    promptTemplate: `You are an Amazon listing optimization expert.

【Product】{product}
【Category】{category}
【Key Features】{features}
【Target Keywords】{targetKeywords}

【Requirements】
1. Title: 150-200 characters, include main keywords
2. Bullet points: 5 features, start with benefit
3. Description: Use HTML formatting
4. Backend keywords: 249 bytes max

【Output Format】

📌 PRODUCT TITLE (max 200 chars)
[Optimized title with keywords]

🎯 BULLET POINTS
• [Feature 1 with benefit]
• [Feature 2 with benefit]
• [Feature 3 with benefit]
• [Feature 4 with benefit]
• [Feature 5 with benefit]

📝 PRODUCT DESCRIPTION
[HTML formatted description]

🔍 BACKEND KEYWORDS
[249 bytes of search terms]

💡 A+ Content Tip: [Enhanced brand content suggestion]`,
  },
  {
    id: 'email-marketing',
    category: 'ecommerce',
    name: 'Marketing Email',
    description: 'Write high-converting marketing emails',
    icon: '📧',
    variables: [
      { name: 'emailType', label: 'Email Type', type: 'select', required: true, options: [
        { value: 'welcome', label: 'Welcome Email' },
        { value: 'promotion', label: 'Promotion/Sale' },
        { value: 'newsletter', label: 'Newsletter' },
        { value: 'abandoned', label: 'Abandoned Cart' },
        { value: 're-engagement', label: 'Re-engagement' },
      ]},
      { name: 'brand', label: 'Brand Name', type: 'text', required: true, placeholder: 'Your brand' },
      { name: 'offer', label: 'Offer/Message', type: 'text', required: true, placeholder: 'What are you promoting?' },
      { name: 'audience', label: 'Target Audience', type: 'text', required: false, placeholder: 'Who are you emailing?' },
    ],
    promptTemplate: `You are an email marketing expert with high open and click rates.

【Email Type】{emailType}
【Brand】{brand}
【Offer/Message】{offer}
【Target Audience】{audience}

【Requirements】
1. Subject line: Under 50 characters, create urgency
2. Preview text: Complement subject, under 90 chars
3. Opening hook: Personal and engaging
4. Body: Scannable, benefit-focused
5. CTA: Clear and action-oriented

【Output Format】

📧 SUBJECT LINE OPTIONS:
1. [Option 1]
2. [Option 2]
3. [Option 3]

👀 PREVIEW TEXT:
[Preview text]

✉️ EMAIL BODY:

[Salutation]

[Opening hook]

[Main content - 2-3 short paragraphs]

[CTA Button]

[Closing]

[P.S. if applicable]

💡 Email Best Practice: [specific tip for this email type]`,
  },

  // ==================== 内容创作 ====================
  {
    id: 'blog-outline',
    category: 'content',
    name: 'Blog Post Outline',
    description: 'Create SEO-optimized blog post outlines',
    icon: '📝',
    variables: [
      { name: 'topic', label: 'Blog Topic', type: 'text', required: true, placeholder: 'What is the blog about?' },
      { name: 'type', label: 'Content Type', type: 'select', required: true, options: [
        { value: 'how-to', label: 'How-to Guide' },
        { value: 'listicle', label: 'Listicle' },
        { value: 'comparison', label: 'Comparison' },
        { value: 'review', label: 'Review' },
        { value: 'case-study', label: 'Case Study' },
      ]},
      { name: 'keywords', label: 'Target Keywords', type: 'text', required: true, placeholder: 'Main keyword to target' },
      { name: 'length', label: 'Target Length', type: 'select', required: false, options: [
        { value: '1000', label: '1,000 words' },
        { value: '2000', label: '2,000 words' },
        { value: '3000', label: '3,000+ words' },
      ]},
    ],
    promptTemplate: `You are an SEO content strategist.

【Blog Topic】{topic}
【Content Type】{type}
【Target Keywords】{keywords}
【Target Length】{length} words

【Requirements】
1. SEO-optimized title with keyword
2. Meta description (155 chars)
3. Logical H2/H3 structure
4. Include internal/external link suggestions
5. FAQ section for featured snippets

【Output Format】

📌 SEO TITLE:
[Optimized title]

📝 META DESCRIPTION:
[155 characters description]

📋 OUTLINE:

H1: [Title]

Introduction [100-150 words]
- Hook
- Problem statement
- What reader will learn

H2: [Section 1]
H3: [Subsection]
H3: [Subsection]

H2: [Section 2]
H3: [Subsection]
H3: [Subsection]

H2: [Section 3]
...

H2: FAQ
- Question 1
- Question 2
- Question 3

Conclusion
- Key takeaways
- CTA

💡 SEO Tips: [specific optimization advice]`,
  },
  {
    id: 'press-release',
    category: 'content',
    name: 'Press Release',
    description: 'Write professional press releases',
    icon: '📰',
    variables: [
      { name: 'company', label: 'Company Name', type: 'text', required: true, placeholder: 'Your company' },
      { name: 'announcement', label: 'Announcement Type', type: 'select', required: true, options: [
        { value: 'product-launch', label: 'Product Launch' },
        { value: 'partnership', label: 'Partnership' },
        { value: 'funding', label: 'Funding Round' },
        { value: 'award', label: 'Award/Recognition' },
        { value: 'event', label: 'Event/Conference' },
      ]},
      { name: 'details', label: 'Key Details', type: 'textarea', required: true, placeholder: 'What are you announcing?' },
      { name: 'contact', label: 'Media Contact', type: 'text', required: false, placeholder: 'Contact email/phone' },
    ],
    promptTemplate: `You are a PR professional who writes press releases that get picked up.

【Company】{company}
【Announcement Type】{announcement}
【Key Details】{details}
【Media Contact】{contact}

【Requirements】
1. Newsworthy headline
2. Strong lead paragraph (who, what, when, where, why)
3. Quotes from leadership
4. About section for company
5. Media contact info

【Output Format】

FOR IMMEDIATE RELEASE

📌 HEADLINE
[Compelling headline]

📍 [City, State] – [Date]

[Lead paragraph - most important info]

[Body paragraph 1 - details]

[Quote from executive]

[Body paragraph 2 - additional context]

[Quote from stakeholder if applicable]

### 

ABOUT {company}
[2-3 sentence company description]

MEDIA CONTACT:
[Contact information]

###`,
  },
  {
    id: 'ad-copy',
    category: 'content',
    name: 'Ad Copy',
    description: 'Create high-converting ad copy for any platform',
    icon: '📢',
    variables: [
      { name: 'platform', label: 'Platform', type: 'select', required: true, options: [
        { value: 'google', label: 'Google Ads' },
        { value: 'facebook', label: 'Facebook Ads' },
        { value: 'instagram', label: 'Instagram Ads' },
        { value: 'linkedin', label: 'LinkedIn Ads' },
        { value: 'twitter', label: 'X/Twitter Ads' },
      ]},
      { name: 'product', label: 'Product/Service', type: 'text', required: true, placeholder: 'What are you advertising?' },
      { name: 'offer', label: 'Offer/USP', type: 'text', required: true, placeholder: 'Unique selling proposition' },
      { name: 'audience', label: 'Target Audience', type: 'text', required: false, placeholder: 'Who is your target?' },
    ],
    promptTemplate: `You are a performance marketing copywriter.

【Platform】{platform}
【Product/Service】{product}
【Offer/USP】{offer}
【Target Audience】{audience}

【Requirements】
Platform-specific character limits and best practices

【Output Format】

📌 HEADLINE OPTIONS (3):
1. [Option 1]
2. [Option 2]
3. [Option 3]

📝 PRIMARY TEXT:
[Main ad copy]

💬 DESCRIPTION (if applicable):
[Supporting text]

🎯 CALL TO ACTION OPTIONS:
- [CTA 1]
- [CTA 2]
- [CTA 3]

💡 Platform Tip: [Specific advice for {platform}]`,
  },

  // ==================== 保留原有的中文模板 ====================
  {
    id: 'moments-caption',
    category: 'social',
    name: '朋友圈文案',
    description: '生成走心朋友圈文案，收获更多点赞',
    icon: '💬',
    isPremium: false,
    variables: [
      { name: 'scene', label: '场景', type: 'select', required: true, options: [
        { value: '日常生活', label: '日常生活' },
        { value: '美食探店', label: '美食探店' },
        { value: '旅行风景', label: '旅行风景' },
        { value: '工作感悟', label: '工作感悟' },
        { value: '健身运动', label: '健身运动' },
        { value: '节日祝福', label: '节日祝福' },
        { value: '深夜emo', label: '深夜emo' },
        { value: '晒娃晒宠', label: '晒娃晒宠' },
      ]},
      { name: 'mood', label: '心情/主题', type: 'text', required: true, placeholder: '如：周末放松、美食打卡、生日快乐' },
      { name: 'style', label: '风格', type: 'select', required: true, options: [
        { value: '文艺走心', label: '文艺走心' },
        { value: '幽默搞笑', label: '幽默搞笑' },
        { value: '高冷简约', label: '高冷简约' },
        { value: '元气满满', label: '元气满满' },
        { value: '沙雕可爱', label: '沙雕可爱' },
      ]},
      { name: 'keywords', label: '关键词', type: 'text', required: false, placeholder: '如：咖啡、阳光、治愈' },
    ],
    promptTemplate: `你是一位朋友圈文案高手，深谙社交媒体传播规律。

【场景】{scene}
【心情/主题】{mood}
【风格】{style}（必须严格遵守这个风格）
【关键词】{keywords}

【风格说明】
- 文艺走心：诗意语言，注重意境，用词优美
- 幽默搞笑：出其不意，自嘲式幽默，让人会心一笑
- 高冷简约：少即是多，言简意赅，留白艺术
- 元气满满：正能量，阳光向上，充满活力
- 沙雕可爱：童趣视角，软萌表达，活泼有趣

【⚠️ 去AI味指南】
1. 用真实口语，像发微信给朋友，别写作文
2. 可以有"啊""呢""吧"这类语气词
3. 不用"首先其次""总而言之"这种文章腔
4. 可以半句、断句，不用句句完整
5. 加入真实细节，比如时间、天气、具体动作
6. 表情用自然的，别每句都加
7. 偶尔可以"跑题"一下，更真实
8. 别用"让我来告诉你""你知道吗"这种开场

【写作要求】
1. 字数：50-150字，适合手机阅读
2. 排版：分行清晰，每行15-20字
3. 表情：适量使用，1-3个为宜
4. 语感：真实不做作，像朋友聊天
5. 风格：必须严格符合【{style}】风格，不要混搭其他风格

【输出格式】
生成3条都是【{style}】风格的朋友圈文案（内容角度不同，但风格统一）：

1️⃣ [第一条文案 - 这个风格]

2️⃣ [第二条文案 - 同样风格，不同角度]

3️⃣ [第三条文案 - 同样风格，另一角度]

🏷️ 推荐配图建议：[简短建议]`,
  },
  {
    id: 'moments-ad',
    category: 'social',
    name: '朋友圈广告文案',
    description: '高转化朋友圈广告，种草带货必备',
    icon: '📢',
    variables: [
      { name: 'product', label: '产品/服务', type: 'text', required: true, placeholder: '如：眼袋去除、减肥产品、课程' },
      { name: 'highlight', label: '核心卖点', type: 'text', required: true, placeholder: '如：不开刀、0恢复期、见效快' },
      { name: 'effect', label: '效果数据', type: 'text', required: true, placeholder: '如：20分钟、3天消肿、减重10斤' },
      { name: 'audience', label: '目标人群', type: 'text', required: false, placeholder: '如：熬夜党、宝妈、上班族' },
      { name: 'style', label: '文案风格', type: 'select', required: true, options: [
        { value: '直击痛点', label: '直击痛点' },
        { value: '效果导向', label: '效果导向' },
        { value: '场景代入', label: '场景代入' },
        { value: '疑问引发', label: '疑问引发' },
        { value: '对比震撼', label: '对比震撼' },
      ]},
    ],
    promptTemplate: `你是朋友圈广告文案高手，擅长写高转化的种草文案。

【产品/服务】{product}
【核心卖点】{highlight}
【效果数据】{effect}
【目标人群】{audience}
【文案风格】{style}

【高转化示例参考】
示例1:
【✨眼袋消失术｜不开刀的魔法】
熬夜星人速来！0创口告别"金鱼眼"
20分钟唤醒眼部年轻力
午休式变美 下午直接见客户

示例2:
【👀眼袋退退退！无痕狙击攻略】
不用动刀的眼周回春术
专利仪器+靶向溶脂
像给眼睛做SPA一样温柔
3天消肿 7天自带高光滤镜💡

示例3:
【🌙睡一觉眼袋就没了？】
当代打工人续命美学
无恢复期黑科技
午休时间搞定眼部衰老
第二天照常搬砖/约会/拍vlog

示例4:
【💉拒绝刀光剑影的眼周革命】
95后都在卷的轻医美
不开刀/不缝合/无疤痕
用科技把眼袋"溶解"掉
从此自拍不用疯狂P图🤳

示例5:
【👩⚕眼袋消失的N种方式】
聪明女孩的选择：
❌拒绝动刀风险 ✅选择科技抗衰
❌拒绝漫长恢复 ✅选择即刻上妆
❌拒绝假面僵硬 ✅选择妈生感美眼

【🔥 高转化朋友圈广告法则】
1. 标题公式：【emoji + 钩子词 | 利益点】
2. 第一行直击痛点或人群标签
3. 用斜杠分隔卖点：不开刀/无恢复/见效快
4. 数字说话：时间、效果、人数
5. 场景化：午休搞定/第二天照常上班
6. 降低门槛：不需要XX、只要XX
7. 对比手法：❌拒绝...✅选择...
8. 用"悄悄话"括号增加信任感
9. 每行别太长，方便手机阅读
10. emoji点睛，别刷屏

【风格说明】
- 直击痛点：开头戳痛点，标题带钩子
- 效果导向：用数据证明，具体时间效果
- 场景代入：午休/约会/上班，有画面感
- 疑问引发：用问句开头，引发好奇点击
- 对比震撼：❌✅对比，前后反差

【输出格式】
生成3条【{style}】风格的朋友圈广告文案：

1️⃣
【emoji + 钩子标题】
[第1行：人群/痛点]
[第2行：核心卖点]
[第3行：效果/场景]
[可选第4行]

2️⃣
【emoji + 钩子标题】
[第1行]
[第2行]
[第3行]

3️⃣
【emoji + 钩子标题】
[第1行]
[第2行]
[第3行]

💡 配图建议：[建议配什么类型的图]
🎯 最佳发布时间：[建议什么时间发]`,
  },
  {
    id: 'xiaohongshu',
    category: 'social',
    name: '小红书笔记',
    description: '生成爆款小红书笔记，提升种草转化',
    icon: '📕',
    variables: [
      { name: 'type', label: '笔记类型', type: 'select', required: true, options: [
        { value: '种草', label: '种草推荐' },
        { value: '测评', label: '产品测评' },
        { value: '教程', label: '教程攻略' },
        { value: '探店', label: '探店分享' },
        { value: '日常', label: '日常分享' },
        { value: '干货', label: '干货知识' },
      ]},
      { name: 'product', label: '产品/主题', type: 'text', required: true, placeholder: '如：口红、咖啡店、学习方法' },
      { name: 'highlight', label: '核心卖点', type: 'text', required: true, placeholder: '最吸引人的特点' },
      { name: 'audience', label: '目标人群', type: 'text', required: false, placeholder: '如：学生党、上班族' },
    ],
    promptTemplate: `你是一位小红书爆款笔记创作者，深谙种草文案技巧。

【笔记类型】{type}
【产品/主题】{product}
【核心卖点】{highlight}
【目标人群】{audience}

【⚠️ 去AI味指南 - 像真人写笔记】
1. 开头别用"今天给大家分享""安利一个"这种套路
2. 直接说感受："绝了""真的好用""踩雷了"
3. 用真实的语气词："啊啊啊""救命""笑死"
4. 可以有碎碎念，不用句句都在讲产品
5. 分享真实使用细节，比如什么时候用的、什么心情
6. 优缺点都要说，太完美的推荐不可信
7. 不用"首先其次最后"，顺着感觉写
8. 可以吐槽自己、自嘲，更真实
9. 真实的笔记会有生活感的细节
10. 用数字和具体描述，别用"非常好""很不错"

【写作要求】
1. 标题：带数字、emoji、感叹号，15字内吸引眼球
2. 开头：直接切入痛点或利益点，别客套
3. 正文：分段清晰，每段2-3句，口语化
4. 表情：每个段落1-2个相关emoji，自然使用
5. 关键词：自然植入，便于搜索
6. 结尾：引导互动，问真实问题

【输出格式】

📌 标题：
[爆款标题]

📝 正文：

[开头 - 直接上感受]

[核心内容 - 真实体验]

[使用感受 - 有细节]

[推荐理由 - 真诚建议]

💬 互动话术：
[问一个真实的问题]

🏷️ 话题标签：
#标签1 #标签2 #标签3 #标签4 #标签5`,
  },
  {
    id: 'douyin',
    category: 'social',
    name: '抖音文案',
    description: '创作抖音爆款文案，提升视频完播率',
    icon: '🎵',
    variables: [
      { name: 'type', label: '内容类型', type: 'select', required: true, options: [
        { value: '剧情', label: '剧情类' },
        { value: '科普', label: '知识科普' },
        { value: '好物', label: '好物推荐' },
        { value: 'vlog', label: '生活Vlog' },
        { value: '搞笑', label: '搞笑段子' },
        { value: '情感', label: '情感共鸣' },
      ]},
      { name: 'topic', label: '视频主题', type: 'text', required: true, placeholder: '视频主要内容' },
      { name: 'style', label: '风格', type: 'select', required: true, options: [
        { value: '幽默', label: '幽默搞笑' },
        { value: '走心', label: '走心治愈' },
        { value: '专业', label: '专业干货' },
        { value: '接地气', label: '接地气' },
        { value: '高冷', label: '高冷范' },
      ]},
      { name: 'duration', label: '视频时长', type: 'select', required: false, options: [
        { value: '15', label: '15秒以内' },
        { value: '30', label: '30秒左右' },
        { value: '60', label: '1分钟左右' },
        { value: '180', label: '3分钟以上' },
      ]},
    ],
    promptTemplate: `你是一位抖音爆款内容创作者，了解平台算法和用户喜好。

【内容类型】{type}
【视频主题】{topic}
【风格】{style}（整个视频必须保持这个风格）
【视频时长】{duration}秒

【风格说明】
- 幽默：搞笑语言、反转、夸张表达
- 走心：真诚情感、温暖治愈、引发共鸣
- 专业：权威感、数据支撑、干货满满
- 接地气：口语化、生活化、像邻居聊天
- 高冷：简洁有力、不废话、高级感

【⚠️ 去AI味指南 - 像真人拍抖音】
1. 别用"大家好我是XXX"，直接开始讲故事
2. 口语化表达：用"就是那个啥""我当时就"这种
3. 可以有"呃""然后"这种真实停顿
4. 别用书面语："进行""实现""提供"→说人话
5. 用真实的情绪词："绝了""我服了""真的假的"
6. 加入具体数字和细节，别模糊带过
7. 可以吐槽自己，更接地气
8. 别每句话都完整，口语本来就有断句
9. BGM和文案情绪要匹配
10. 结尾别生硬"记得点赞关注"，自然带过

【写作要求】
1. 黄金前3秒：必须有钩子，留人理由
2. 节奏感：每隔5-8秒一个信息点或转折
3. 文案要口语化，像在聊天
4. 结尾要引导互动（点赞关注评论）
5. 可加悬念或反转提升完播率
6. 风格必须统一为【{style}】

【输出格式】

🎬 视频脚本（{style}风格）：

⏱️ [0-3秒] 开场钩子
文案：[直接上，别客套]
画面建议：[画面描述]

⏱️ [3-{duration}秒] 正文内容
文案：[主要内容 - 口语化，{style}风格]
画面建议：[画面描述]

⏱️ [结尾] 引导互动
文案：[自然带过互动]

📝 视频标题：
[吸引点击的标题 - 20字内]

🏷️ 话题标签：
#标签1 #标签2 #标签3

💡 爆款Tips：
[针对这条视频的优化建议]`,
  },
  {
    id: 'wechat-article',
    category: 'content',
    name: '公众号文章',
    description: '撰写高阅读量的公众号文章',
    icon: '📰',
    variables: [
      { name: 'type', label: '文章类型', type: 'select', required: true, options: [
        { value: '干货', label: '干货教程' },
        { value: '观点', label: '观点评论' },
        { value: '故事', label: '故事叙述' },
        { value: '新闻', label: '新闻资讯' },
        { value: '推广', label: '产品推广' },
      ]},
      { name: 'topic', label: '文章主题', type: 'text', required: true, placeholder: '文章核心主题' },
      { name: 'keywords', label: '关键词', type: 'text', required: false, placeholder: '需要覆盖的关键词' },
      { name: 'length', label: '文章长度', type: 'select', required: false, options: [
        { value: '800', label: '800字左右' },
        { value: '1500', label: '1500字左右' },
        { value: '3000', label: '3000字以上' },
      ]},
    ],
    promptTemplate: `你是一位公众号运营专家，擅长创作10万+阅读量的文章。

【文章类型】{type}
【文章主题】{topic}
【关键词】{keywords}
【文章长度】{length}字

【写作要求】
1. 标题：引发好奇或共鸣，不超过20字
2. 开头：3行内抓住读者注意力
3. 结构：总分总，小标题清晰
4. 排版：每段不超过4行，留白充足
5. 金句：文中穿插可传播的金句
6. 结尾：引导关注、点赞、在看

【输出格式】

📌 文章标题：
[爆款标题选项 - 3个]

📝 文章大纲：

一、[小标题1]
[内容要点]

二、[小标题2]
[内容要点]

三、[小标题3]
[内容要点]

✍️ 文章正文：

[开头 - 100字左右]

一、[小标题1]
[段落内容]

二、[小标题2]
[段落内容]

三、[小标题3]
[段落内容]

[结尾 - 引导互动]

💡 传播建议：
[如何提升文章传播效果]`,
  },
  {
    id: 'product-detail',
    category: 'ecommerce',
    name: '商品详情页',
    description: '打造高转化商品详情页文案',
    icon: '🛒',
    variables: [
      { name: 'product', label: '商品名称', type: 'text', required: true, placeholder: '商品名称' },
      { name: 'category', label: '商品类目', type: 'text', required: true, placeholder: '如：女装、数码、家居' },
      { name: 'features', label: '核心卖点', type: 'textarea', required: true, placeholder: '商品的主要特点和优势' },
      { name: 'price', label: '价格定位', type: 'select', required: true, options: [
        { value: '平价', label: '平价亲民' },
        { value: '中端', label: '中端品质' },
        { value: '高端', label: '高端精品' },
      ]},
    ],
    promptTemplate: `你是一位电商详情页文案专家，擅长提升转化率。

【商品名称】{product}
【商品类目】{category}
【核心卖点】{features}
【价格定位】{price}

【写作要求】
1. 主标题：突出核心卖点，吸引点击
2. 副标题：补充说明，增加信任
3. 卖点：3-5个核心卖点，用数据说话
4. 场景：描绘使用场景，增强代入感
5. 信任背书：评价、认证、数据
6. 促销：制造紧迫感，促进下单

【输出格式】

📌 商品主标题：
[吸引眼球的主标题]

📌 商品副标题：
[补充说明的副标题]

✨ 核心卖点：

【卖点1】[标题]
[描述 - 用数据或对比说话]

【卖点2】[标题]
[描述]

【卖点3】[标题]
[描述]

🎬 使用场景：
[场景描述 - 让用户想象使用画面]

⭐ 推荐理由：
[3-5个推荐理由]

💬 用户评价：
[模拟3条真实用户评价]

🎁 促销信息：
[限时优惠描述]

💡 转化Tips：
[提升转化率的建议]`,
  },
];

// 获取翻译后的模板名称
export function getTemplateName(template: Template, lang: Language): string {
  // 国外社媒模板 - 始终使用英文名称
  const westernPlatforms = ['x-post', 'facebook-post', 'instagram-caption', 'reddit-post', 'linkedin-post', 'tiktok-script', 'youtube-title', 'threads-post', 'pinterest-pin'];
  if (westernPlatforms.includes(template.id)) {
    return template.name;
  }
  
  // 中文名称映射
  const nameMap: Record<string, Record<Language, string>> = {
    'product-description': {
      zh: '商品描述', en: 'Product Description', fr: 'Description de produit', ru: 'Описание товара',
      ja: '商品説明', ko: '제품 설명', de: 'Produktbeschreibung', es: 'Descripción de producto'
    },
    'amazon-listing': {
      zh: '亚马逊商品', en: 'Amazon Listing', fr: 'Fiche Amazon', ru: 'Листинг Amazon',
      ja: 'Amazon リスティング', ko: 'Amazon 리스팅', de: 'Amazon Angebot', es: 'Ficha Amazon'
    },
    'email-marketing': {
      zh: '营销邮件', en: 'Marketing Email', fr: 'Email marketing', ru: 'Маркетинговое письмо',
      ja: 'マーケティングメール', ko: '마케팅 이메일', de: 'Marketing-E-Mail', es: 'Email de marketing'
    },
    'blog-outline': {
      zh: '博客大纲', en: 'Blog Post Outline', fr: "Plan d'article de blog", ru: 'План статьи блога',
      ja: 'ブログ記事のアウトライン', ko: '블로그 게시물 개요', de: 'Blog-Artikel-Gliederung', es: 'Esquema de artículo'
    },
    'press-release': {
      zh: '新闻稿', en: 'Press Release', fr: 'Communiqué de presse', ru: 'Пресс-релиз',
      ja: 'プレスリリース', ko: '보도 자료', de: 'Pressemitteilung', es: 'Nota de prensa'
    },
    'ad-copy': {
      zh: '广告文案', en: 'Ad Copy', fr: 'Texte publicitaire', ru: 'Рекламный текст',
      ja: '広告コピー', ko: '광고 문구', de: 'Werbetext', es: 'Texto publicitario'
    },
    'moments-caption': {
      zh: '朋友圈文案', en: 'WeChat Moments', fr: 'Moments WeChat', ru: 'Пост в WeChat',
      ja: 'WeChat Moments', ko: 'WeChat 모멘츠', de: 'WeChat Moments', es: 'Moments de WeChat'
    },
    'moments-ad': {
      zh: '朋友圈广告文案', en: 'WeChat Ad Copy', fr: 'Publicité WeChat', ru: 'Реклама WeChat',
      ja: 'WeChat広告', ko: '위챗 광고', de: 'WeChat Werbung', es: 'Anuncio WeChat'
    },
    'xiaohongshu': {
      zh: '小红书笔记', en: 'Xiaohongshu Post', fr: 'Post Xiaohongshu', ru: 'Пост в Xiaohongshu',
      ja: '小紅書投稿', ko: '샤오홍슈 게시물', de: 'Xiaohongshu Beitrag', es: 'Post en Xiaohongshu'
    },
    'douyin': {
      zh: '抖音文案', en: 'Douyin Content', fr: 'Contenu Douyin', ru: 'Контент Douyin',
      ja: '抖音コンテンツ', ko: '도우인 콘텐츠', de: 'Douyin Inhalt', es: 'Contenido Douyin'
    },
    'wechat-article': {
      zh: '公众号文章', en: 'WeChat Article', fr: 'Article WeChat', ru: 'Статья WeChat',
      ja: 'WeChat記事', ko: '위챗 아티클', de: 'WeChat Artikel', es: 'Artículo WeChat'
    },
    'product-detail': {
      zh: '商品详情页', en: 'Product Detail Page', fr: 'Page produit', ru: 'Страница товара',
      ja: '商品詳細ページ', ko: '제품 상세 페이지', de: 'Produktseite', es: 'Página de producto'
    },
  };
  
  return nameMap[template.id]?.[lang] || template.name;
}