import { generateWithGemini } from './gemini'

export function buildSummaryPrompt(text, mode = 'eli5') {
  const trimmed = String(text || '').slice(0, 6000)
  const audience = mode === 'pro' ? 'experienced professional' : 'beginner with no prior knowledge'
  const depth = mode === 'pro' ? 'technical depth, assumptions explicit, key tradeoffs' : 'simple language, analogies, avoid jargon'

  return `Summarize the following content for a ${audience}. Provide:
- 5 bullet key takeaways
- 1 actionable next step
- A concise 2-3 sentence summary
Style: ${depth}. Output valid JSON with keys: summary, bullets (array of strings), action.

CONTENT START
${trimmed}
CONTENT END`
}

export async function getSummaryFor(text, mode = 'eli5') {
  const prompt = buildSummaryPrompt(text, mode)
  const raw = await generateWithGemini(prompt)
  const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  try {
    const parsed = JSON.parse(clean)
    return {
      summary: parsed.summary || '',
      bullets: Array.isArray(parsed.bullets) ? parsed.bullets : [],
      action: parsed.action || '',
      mode,
    }
  } catch {
    return { summary: clean, bullets: [], action: '', mode }
  }
}


