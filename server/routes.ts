import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContentGenerationSchema } from "@shared/schema";
import { z } from "zod";

// Mock content generation functions
function generateInstagramContent(topic: string, contentType: string, options: any) {
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
  };

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
  ];

  return {
    caption: captions[contentType] || captions.post,
    hashtags,
    contentType
  };
}

function generateLinkedInContent(topic: string, style?: string) {
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
  };

  const content = posts[style] || posts.professional;
  
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
  ];

  return {
    post: content,
    hashtags
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate Instagram content
  app.post("/api/content/instagram", async (req, res) => {
    try {
      const { topic, contentType, options } = req.body;
      
      if (!topic || !contentType) {
        return res.status(400).json({ message: "Topic and content type are required" });
      }

      const generatedContent = generateInstagramContent(topic, contentType, options);
      
      // Save to storage
      const contentRecord = await storage.createContentGeneration({
        platform: "instagram",
        contentType,
        topic,
        generatedContent
      });

      res.json(generatedContent);
    } catch (error) {
      console.error("Error generating Instagram content:", error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

  // Generate LinkedIn content
  app.post("/api/content/linkedin", async (req, res) => {
    try {
      const { topic, style } = req.body;
      
      if (!topic) {
        return res.status(400).json({ message: "Topic is required" });
      }

      const generatedContent = generateLinkedInContent(topic, style);
      
      // Save to storage
      const contentRecord = await storage.createContentGeneration({
        platform: "linkedin",
        contentType: "post",
        topic,
        generatedContent
      });

      res.json(generatedContent);
    } catch (error) {
      console.error("Error generating LinkedIn content:", error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
