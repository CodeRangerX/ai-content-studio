import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey, baseUrl, model } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: '请输入内容' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: '请配置API Key' }, { status: 400 });
    }

    // 服务端代理调用 API（解决 CORS）
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message || '生成失败' }, { status: 400 });
    }

    return NextResponse.json({ result: data.choices[0]?.message?.content || '无结果' });
  } catch (error: any) {
    console.error('生成错误:', error);
    return NextResponse.json(
      { error: error.message || '生成失败，请重试' },
      { status: 500 }
    );
  }
}