import { NextResponse } from 'next/server'

// Mock content generation function
function generateLinkedInContent(topic, style = 'professional') {
  const posts = {
    professional: `I've been thinking about ${topic} lately, and here's what I've learned:

🔹 First important insight about ${topic}
🔹 How it impacts our daily work
🔹 Practical applications we can implement

The key is to stay curious and keep learning.

What's your experience with ${topic}? I'd love to hear your thoughts in the comments.

#${topic.toLowerCase().replace(/\s+/g, '')} #ProfessionalDevelopment #Leadership #Growth`,

    story: `Last week, something happened that completely changed my perspective on ${topic}.

Here's the story:

It started when [context about ${topic}]. I realized that my approach was completely wrong.

The turning point came when [key insight about ${topic}].

Now I understand that [lesson learned].

Three key takeaways:
1. [First lesson]
2. [Second insight] 
3. [Action item]

${topic} isn't just about the technical aspects - it's about [deeper meaning].

What's been your experience with ${topic}? Share your story below.

#${topic.toLowerCase().replace(/\s+/g, '')} #Lessons #Growth #Experience`,

    insights: `Here are 5 key insights about ${topic} that every professional should know:

1️⃣ [First insight about ${topic}]
Understanding this changes everything.

2️⃣ [Second key point]  
This is often overlooked but crucial.

3️⃣ [Third important aspect]
The data supports this approach.

4️⃣ [Fourth insight]
Most people get this wrong.

5️⃣ [Fifth key takeaway]
This is the game-changer.

${topic} continues to evolve rapidly. Staying informed is essential.

Which insight resonates most with you?

#${topic.toLowerCase().replace(/\s+/g, '')} #Insights #Industry #Knowledge`,

    question: `I'm curious about your thoughts on ${topic}.

Here's what I've been wondering:

${topic} seems to be evolving rapidly, and I've noticed [observation about the topic].

Some questions I have:
• How has ${topic} impacted your work?
• What changes have you seen recently?
• Where do you think this is heading?

From my experience, [personal insight about ${topic}].

But I know there are many different perspectives out there.

What's your take on ${topic}? Drop your thoughts below - I read every comment!

#${topic.toLowerCase().replace(/\s+/g, '')} #Discussion #Community #Insights`
  }

  const content = posts[style] || posts.professional
  
  const hashtags = [
    `#${topic.toLowerCase().replace(/\s+/g, '')}`,
    '#LinkedIn',
    '#ProfessionalDevelopment',
    '#Leadership',
    '#Growth',
    '#Innovation',
    '#Insights',
    '#Business',
    '#Career',
    '#Networking'
  ]

  return {
    post: content,
    hashtags
  }
}

export async function POST(request) {
  try {
    const { topic, style } = await request.json()
    
    if (!topic) {
      return NextResponse.json(
        { message: 'Topic is required' },
        { status: 400 }
      )
    }

    const generatedContent = generateLinkedInContent(topic, style)
    
    return NextResponse.json(generatedContent)
  } catch (error) {
    console.error('Error generating LinkedIn content:', error)
    return NextResponse.json(
      { message: 'Failed to generate content' },
      { status: 500 }
    )
  }
}