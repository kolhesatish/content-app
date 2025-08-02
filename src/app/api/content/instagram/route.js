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
      // Clean the response - remove markdown formatting
      const cleanResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanResponse);
      
      content = {
        variations: parsed.variations || []
      };
      
      // Ensure we have variations
      if (!content.variations.length) {
        throw new Error('No variations generated');
      }
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError, 'Raw response:', aiResponse);
      // Fallback to creating structured response
      content = {
        variations: [
          {
            caption: `Amazing content about ${topic}! Let's explore this exciting topic together.`,
            hashtags: contentType === 'story' ? [] : ['#inspiration', '#content', '#social'],
            style: 'engaging'
          },
          {
            caption: `Here's my take on ${topic}. What are your thoughts on this?`,
            hashtags: contentType === 'story' ? [] : ['#discussion', '#thoughts', '#community'],
            style: 'conversational'
          }
        ]
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