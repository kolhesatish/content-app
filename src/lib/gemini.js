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
  let prompt = `Create engaging Instagram ${contentType} content about "${topic}".`;
  
  if (contentType === 'post') {
    prompt += ` Include a captivating caption (2-3 sentences), relevant hashtags (8-12), and content suggestions. `;
  } else if (contentType === 'reel') {
    prompt += ` Include a hook, script outline for 15-30 seconds, call-to-action, and trending hashtags. `;
  } else if (contentType === 'story') {
    prompt += ` Create engaging story content with text overlay suggestions and interactive elements. Do NOT include hashtags for stories. `;
  }

  if (options?.styles?.includes('emojis')) {
    prompt += ` Use relevant emojis to make it more engaging. `;
  }
  
  if (options?.styles?.includes('engaging')) {
    prompt += ` Make it highly engaging and shareable. `;
  }

  prompt += ` Return the response in JSON format with these keys: "caption", "hashtags" (array, empty for stories), "contentSuggestions" (array). Focus on quality and authenticity.`;

  return prompt;
}

export function createLinkedInPrompt(topic, style) {
  let prompt = `Create professional LinkedIn content about "${topic}" in ${style} style. `;
  
  prompt += `Include a compelling post (2-3 paragraphs), relevant professional hashtags (5-8), and engagement strategies. `;
  prompt += `Make it suitable for professional networking and industry discussions. `;
  prompt += `Return the response in JSON format with keys: "caption", "hashtags" (array), "engagementTips" (array).`;

  return prompt;
}