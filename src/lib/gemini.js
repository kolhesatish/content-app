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
  let prompt = `Generate 5 different variations of Instagram ${contentType} content about "${topic}".`;
  
  if (contentType === 'post') {
    prompt += ` Each variation should include a captivating caption (2-3 sentences), relevant hashtags (8-12), and content style. `;
  } else if (contentType === 'reel') {
    prompt += ` Each variation should include a hook, script outline for 15-30 seconds, call-to-action, and trending hashtags. `;
  } else if (contentType === 'story') {
    prompt += ` Each variation should include engaging story content with text overlay suggestions. Do NOT include hashtags for stories. `;
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

export function createLinkedInPrompt(topic, style) {
  let prompt = `Generate 5 different variations of professional LinkedIn content about "${topic}" in ${style} style. `;
  
  prompt += `Each variation should include a compelling post (2-3 paragraphs), relevant professional hashtags (5-8), and engagement approach. `;
  prompt += `Make it suitable for professional networking and industry discussions. `;
  
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