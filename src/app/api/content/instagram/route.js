import { NextResponse } from 'next/server'

// Mock content generation function
function generateInstagramContent(topic, contentType, options) {
  const captions = {
    post: `✨ ${topic} is such an important topic! Here are some key insights:

📍 First key point about ${topic}
📍 Second important aspect  
📍 Third valuable insight

What are your thoughts on this? Share in the comments! 👇

#${topic.toLowerCase().replace(/\s+/g, '')} #contentcreator #inspiration #motivation #lifestyle #growth`,
    
    reel: `🎬 Quick tips about ${topic}! 

🔥 Save this for later and follow for more!

Tip 1: [Related to ${topic}]
Tip 2: [Key insight]  
Tip 3: [Actionable advice]

Try this and let me know how it goes! 💪

#${topic.toLowerCase().replace(/\s+/g, '')} #reels #tips #viral #fyp #trending`,
    
    story: `📖 Quick story about ${topic}...

This changed my perspective completely! 

What's your experience with ${topic}? 🤔

#${topic.toLowerCase().replace(/\s+/g, '')} #storytime`
  }

  const hashtags = contentType === 'story' ? [] : [
    `#${topic.toLowerCase().replace(/\s+/g, '')}`,
    '#contentcreator',
    '#inspiration', 
    '#motivation',
    '#lifestyle',
    '#growth',
    '#success',
    '#mindset',
    '#tips',
    '#advice'
  ]

  return {
    caption: captions[contentType] || captions.post,
    hashtags,
    contentType
  }
}

export async function POST(request) {
  try {
    const { topic, contentType, options } = await request.json()
    
    if (!topic || !contentType) {
      return NextResponse.json(
        { message: 'Topic and content type are required' },
        { status: 400 }
      )
    }

    const generatedContent = generateInstagramContent(topic, contentType, options)
    
    return NextResponse.json(generatedContent)
  } catch (error) {
    console.error('Error generating Instagram content:', error)
    return NextResponse.json(
      { message: 'Failed to generate content' },
      { status: 500 }
    )
  }
}