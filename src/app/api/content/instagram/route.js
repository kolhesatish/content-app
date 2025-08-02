import { NextResponse } from 'next/server';
import { getUserFromToken, useCredit } from '@/lib/auth';
import { generateWithGemini, createInstagramPrompt } from '@/lib/gemini';

export async function POST(request) {
  try {
    const { topic, contentType, options } = await request.json();
    
    // Check authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Check and use credit
    const creditUsed = await useCredit(user._id);
    if (!creditUsed) {
      return NextResponse.json(
        { error: 'Insufficient credits. You get 2 free credits daily!' },
        { status: 402 }
      );
    }

    // Generate content with Gemini AI
    const prompt = createInstagramPrompt(topic, contentType || 'post', options);
    const aiResponse = await generateWithGemini(prompt);
    
    let content;
    try {
      // Try to parse as JSON first
      content = JSON.parse(aiResponse);
    } catch (parseError) {
      // If JSON parsing fails, create structured response from text
      const lines = aiResponse.split('\n').filter(line => line.trim());
      content = {
        caption: lines.slice(0, 3).join('\n'),
        hashtags: contentType === 'story' ? [] : ['#inspiration', '#content', '#social'],
        contentSuggestions: lines.slice(-2) || ['Engage with your audience', 'Share authentic content']
      };
    }

    return NextResponse.json({
      success: true,
      content,
      platform: 'instagram',
      contentType: contentType || 'post',
      topic,
      creditsRemaining: user.credits - 1
    });
  } catch (error) {
    console.error('Error generating Instagram content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}