import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey, baseUrl, model } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: '请输入内容' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: '请配置API Key' }, { status: 400 });
    }

    // 支持自定义baseUrl（用于DeepSeek等兼容API）
    const openaiProvider = createOpenAI({
      apiKey,
      baseURL: baseUrl || 'https://api.openai.com/v1',
    });

    const { text } = await generateText({
      model: openaiProvider(model || 'gpt-3.5-turbo'),
      prompt,
    });

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error('生成错误:', error);
    return NextResponse.json(
      { error: error.message || '生成失败，请重试' },
      { status: 500 }
    );
  }
}