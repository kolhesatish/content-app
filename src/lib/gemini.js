const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function generateWithGemini(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ 
          parts: [{ text: prompt }] 
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate content with Gemini AI');
  }
}

export function createInstagramPrompt(topic, contentType, options) {
  const numVariations = options?.variations || 5;
  let prompt = `Generate ${numVariations} different variations of Instagram ${contentType} content about "${topic}".`;
  
  // Add context about what Instagram content is for
  prompt += ` This content will be used for Instagram ${contentType}s to engage with followers and grow audience. `;
  
  if (contentType === 'post') {
    prompt += ` Create Instagram post captions that users can copy and paste directly. Each variation should include a captivating caption (2-3 sentences) that encourages engagement, relevant hashtags (8-12) for better reach, and a specific content style approach. Make the captions ready to use for Instagram posts. `;
  } else if (contentType === 'reel') {
    prompt += ` Create Instagram reel content that users can use to create engaging videos. Each variation should include an attention-grabbing hook for the first 3 seconds, a detailed script outline for 15-30 seconds of video content, a clear call-to-action to boost engagement, and trending hashtags for maximum reach. `;
  } else if (contentType === 'story') {
    prompt += ` Create Instagram story content that users can use for their 24-hour stories. Each variation should include engaging story text that works well as overlay text, interactive elements suggestions, and creative ideas. Do NOT include hashtags for stories as they're not commonly used. `;
  }

  if (options?.styles?.includes('emojis')) {
    prompt += ` Use relevant emojis to make it more engaging. `;
  }
  
  if (options?.styles?.includes('engaging')) {
    prompt += ` Make it highly engaging and shareable. `;
  }

  prompt += ` Return ONLY valid JSON without any markdown formatting. Use this exact structure:
{
  "variations": [
    {
      "caption": "Your caption text here",
      "hashtags": ${contentType === 'story' ? '[]' : '["#hashtag1", "#hashtag2"]'},
      "style": "describe the style used"
    }
  ]
}`;

  return prompt;
}

export function createLinkedInPrompt(topic, style, options) {
  const numVariations = options?.variations || 5;
  let prompt = `Generate ${numVariations} different variations of professional LinkedIn content about "${topic}" in ${style} style. `;
  
  // Add context about what LinkedIn content is for
  prompt += ` This content will be used for LinkedIn posts to build professional network and establish thought leadership. `;
  
  prompt += `Create LinkedIn posts that users can copy and paste to build their professional presence. Each variation should include a compelling post (2-3 paragraphs) that establishes thought leadership, relevant professional hashtags (5-8) for networking reach, and an engagement approach that encourages meaningful discussions. `;
  prompt += `Make the content suitable for professional networking, career development, and industry discussions. The posts should help users build their personal brand and connect with their professional network. `;
  
  prompt += ` Return ONLY valid JSON without any markdown formatting. Use this exact structure:
{
  "variations": [
    {
      "caption": "Your professional post content here",
      "hashtags": ["#professional", "#industry"],
      "tone": "describe the tone/approach used"
    }
  ]
}`;

  return prompt;
}