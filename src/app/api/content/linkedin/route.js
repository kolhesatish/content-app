import { NextResponse } from 'next/server';
import { getUserFromToken, useCredit } from '@/lib/auth';
import { generateWithGemini, createLinkedInPrompt } from '@/lib/gemini';
import { getDb } from '@/lib/api';

export async function POST(request) {
  try {
    const { topic, style, variations, wordCount } = await request.json();
    
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
    const prompt = createLinkedInPrompt(topic, style || 'professional', { variations, wordCount: wordCount || 200 });
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
            caption: `Excited to share my thoughts on ${topic}. In today's professional landscape, this topic has become increasingly important for career growth and industry innovation.`,
            hashtags: ['#professional', '#linkedin', '#career', '#industry'],
            tone: 'professional'
          },
          {
            caption: `Let's discuss ${topic}. I've been reflecting on how this impacts our work and wanted to share some insights with my network.`,
            hashtags: ['#networking', '#insights', '#professional', '#discussion'],
            tone: 'conversational'
          }
        ]
      };
    }

    // Persist generated variations for search/feed
    try {
      const db = await getDb();
      const now = new Date();
      const items = Array.isArray(content?.variations) ? content.variations : [];
      if (items.length > 0) {
        const docs = items.map((v) => ({
          userId: user._id,
          creatorId: user._id,
          creatorName: user.username || 'User',
          platform: 'linkedin',
          type: 'post',
          topic,
          caption: v.caption || '',
          hashtags: Array.isArray(v.hashtags) ? v.hashtags : [],
          style: v.style || v.tone || '',
          createdAt: now,
          length: (v.caption || '').length,
        }));
        if (docs.length) {
          await db.collection('generations').insertMany(docs);
        }
      }
    } catch (e) {
      console.warn('Persist generation failed (non-blocking):', e);
    }

    return NextResponse.json({
      success: true,
      content,
      platform: 'linkedin',
      style: style || 'professional',
      topic,
      creditsRemaining: user.credits - 1
    });
  } catch (error) {
    console.error('Error generating LinkedIn content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}