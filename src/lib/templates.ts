// 内容生成模板配置

export interface TemplateVariable {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface Template {
  id: string;
  category: string;
  name: string;
  description: string;
  icon: string;
  promptTemplate: string;
  variables: TemplateVariable[];
  isPremium: boolean;
}

export const templates: Template[] = [
  {
    id: 'product-description',
    category: '电商',
    name: '商品描述生成',
    description: '一键生成高转化率的商品描述文案',
    icon: '🛍️',
    isPremium: false,
    variables: [
      { name: 'product_name', label: '商品名称', type: 'text', required: true, placeholder: '如：无线蓝牙耳机' },
      { name: 'category', label: '商品类别', type: 'text', required: true, placeholder: '如：数码产品' },
      { name: 'selling_points', label: '核心卖点', type: 'textarea', required: true, placeholder: '如：降噪、续航长、佩戴舒适' },
      { name: 'target_audience', label: '目标人群', type: 'text', required: false, placeholder: '如：年轻人、上班族' },
      { name: 'price_range', label: '价格区间', type: 'text', required: false, placeholder: '如：100-200元' },
    ],
    promptTemplate: `你是一位资深电商文案专家，擅长撰写高转化率的商品描述。

【商品信息】
- 商品名称：{product_name}
- 商品类别：{category}
- 核心卖点：{selling_points}
- 目标人群：{target_audience}
- 价格区间：{price_range}

【要求】
1. 提炼3-5个核心卖点，用emoji标注
2. 突出产品优势和用户利益
3. 语言简洁有力，有感染力
4. 字数200-300字

【输出格式】
📌 核心卖点
[卖点列表]

✨ 商品亮点
[详细描述]

🎯 适用人群
[人群画像]

💡 推荐理由
[一句话推荐]`,
  },
  {
    id: 'xiaohongshu-note',
    category: '社媒',
    name: '小红书笔记',
    description: '生成爆款小红书笔记内容',
    icon: '📕',
    isPremium: false,
    variables: [
      { name: 'topic', label: '主题', type: 'text', required: true, placeholder: '如：护肤心得' },
      { name: 'keywords', label: '关键词', type: 'text', required: false, placeholder: '如：美白、保湿' },
      { name: 'style', label: '风格', type: 'select', required: true, options: [
        { value: '种草', label: '种草' },
        { value: '测评', label: '测评' },
        { value: '教程', label: '教程' },
        { value: '分享', label: '分享' },
      ]},
      { name: 'product', label: '产品/服务', type: 'text', required: false, placeholder: '如：某某精华液' },
    ],
    promptTemplate: `你是一位小红书博主，擅长写出爆款笔记。

【主题】{topic}
【关键词】{keywords}
【风格】{style}
【产品/服务】{product}

【写作要求】
1. 标题：吸引眼球，可用emoji，15-25字
2. 正文：
   - 开头：制造悬念/痛点共鸣
   - 中间：详细内容，分点陈述
   - 结尾：引导互动/收藏
3. 语气：亲切自然，像朋友聊天
4. 字数：300-500字
5. emoji：适当使用，不堆砌

【输出格式】
📝 标题
[标题内容]

📄 正文
[正文内容]

🏷️ 话题标签
#标签1 #标签2 #标签3`,
  },
  {
    id: 'douyin-script',
    category: '社媒',
    name: '抖音短视频脚本',
    description: '创作高完播率的抖音视频脚本',
    icon: '🎬',
    isPremium: true,
    variables: [
      { name: 'topic', label: '主题', type: 'text', required: true, placeholder: '如：美食探店' },
      { name: 'duration', label: '视频时长', type: 'select', required: true, options: [
        { value: '30秒', label: '30秒' },
        { value: '60秒', label: '60秒' },
        { value: '90秒', label: '90秒' },
      ]},
      { name: 'style', label: '风格', type: 'select', required: true, options: [
        { value: '剧情型', label: '剧情型' },
        { value: '口播型', label: '口播型' },
        { value: '展示型', label: '展示型' },
      ]},
      { name: 'product', label: '产品/推广', type: 'text', required: false, placeholder: '如：某某餐厅' },
    ],
    promptTemplate: `你是一位短视频脚本编剧，擅长创作高完播率的抖音脚本。

【主题】{topic}
【视频时长】{duration}
【风格】{style}
【产品/推广】{product}

【脚本要求】
1. 黄金3秒：开头必须抓眼球
2. 节奏把控：每10秒一个高潮点
3. 结尾引导：点赞/关注/评论
4. 口播词：口语化，接地气

【输出格式】
🎬 视频标题：[标题]

⏱️ 时长：[预估时长]

📝 分镜脚本：

【0-3秒】
画面：[画面描述]
口播：[台词]

【3-15秒】
画面：[画面描述]
口播：[台词]

继续按时间分段...`,
  },
  {
    id: 'marketing-copy',
    category: '营销',
    name: '营销活动文案',
    description: '撰写高转化的营销活动文案',
    icon: '🔥',
    isPremium: false,
    variables: [
      { name: 'event_name', label: '活动名称', type: 'text', required: true, placeholder: '如：双十一大促' },
      { name: 'type', label: '活动类型', type: 'select', required: true, options: [
        { value: '促销', label: '促销' },
        { value: '节日', label: '节日' },
        { value: '新品', label: '新品' },
        { value: '会员', label: '会员' },
      ]},
      { name: 'discount', label: '优惠力度', type: 'text', required: true, placeholder: '如：全场5折起' },
      { name: 'time', label: '活动时间', type: 'text', required: false, placeholder: '如：11.1-11.11' },
      { name: 'audience', label: '目标人群', type: 'text', required: false, placeholder: '如：新用户、老客户' },
    ],
    promptTemplate: `你是一位活动策划专家，擅长撰写高转化营销文案。

【活动名称】{event_name}
【活动类型】{type}
【优惠力度】{discount}
【活动时间】{time}
【目标人群】{audience}

【文案要求】
1. 标题：紧迫感 + 利益点
2. 卖点：限时/限量/独家
3. 引导：明确行动指令
4. 字数：100-200字

【输出格式】
🔥 活动标题
[标题]

💥 活动亮点
[亮点列表]

🎁 优惠详情
[优惠内容]

⏰ 活动时间
[时间]

👉 参与方式
[行动指令]`,
  },
  {
    id: 'wechat-article',
    category: '文章',
    name: '公众号文章',
    description: '生成10万+爆款公众号文章',
    icon: '📰',
    isPremium: true,
    variables: [
      { name: 'topic', label: '主题', type: 'text', required: true, placeholder: '如：职场成长' },
      { name: 'audience', label: '目标读者', type: 'text', required: false, placeholder: '如：职场新人' },
      { name: 'type', label: '文章类型', type: 'select', required: true, options: [
        { value: '干货', label: '干货' },
        { value: '观点', label: '观点' },
        { value: '故事', label: '故事' },
        { value: '资讯', label: '资讯' },
      ]},
      { name: 'keywords', label: '关键词', type: 'text', required: false, placeholder: '如：升职、加薪' },
    ],
    promptTemplate: `你是一位资深公众号运营者，擅长创作10万+爆款文章。

【主题】{topic}
【目标读者】{audience}
【文章类型】{type}
【关键词】{keywords}

【写作要求】
1. 标题：制造好奇心/痛点/利益点
2. 开头：300字内抓住读者
3. 正文：
   - 小标题分段
   - 金句点缀
   - 案例支撑
4. 结尾：升华主题 + 引导互动
5. 字数：1500-2500字

【输出格式】
📌 标题：[标题]

📄 正文：

[开头段落]

## 一、[小标题]
[内容]

## 二、[小标题]
[内容]

...

💡 写在最后
[结尾升华]`,
  },
];

export const categories = [
  { id: 'all', name: '全部', icon: '📋' },
  { id: '电商', name: '电商', icon: '🛒' },
  { id: '社媒', name: '社媒', icon: '📱' },
  { id: '营销', name: '营销', icon: '📢' },
  { id: '文章', name: '文章', icon: '📝' },
];