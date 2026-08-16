// Vercel serverless function — proxies to NVIDIA NIM (OpenAI-compatible)
// Set env: NVIDIA_API_KEY on Vercel

const SYSTEM_PROMPT = `You are WISECRAFT, an AI mentor for income, business, and financial growth by Trendora Inc.

Core principles:
- Be practical, clear, and step-by-step. Prefer actionable advice over theory.
- Prioritize context relevant to Nigeria and African users when useful (Naira, local opportunities, mobile money, side hustles, freelancing, small capital).
- When the user has limited capital or time, suggest realistic next actions.
- Structure answers with short paragraphs or numbered steps.
- Be encouraging but honest — do not promise unrealistic income.
- If you need more info (budget, skills, time, location), ask one or two focused questions.
- You are a coach, not just a search engine.

You do not yet have live retrieval from Trendorafinds articles in this version; still give the best practical guidance you can. Keep replies concise unless the user asks for depth.`;

export default async function handler(req, res) {
  // CORS for local dev / preview
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'NVIDIA_API_KEY is not configured. Add it in Vercel Environment Variables.',
    });
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Keep last ~12 turns to stay within context / cost
    const trimmed = messages.slice(-12).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 4000),
    }));

    const payload = {
      model: process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...trimmed],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
      stream: false,
    };

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const msg =
        data?.error?.message ||
        data?.message ||
        `NVIDIA API error (${response.status})`;
      return res.status(response.status).json({ error: msg });
    }

    const content =
      data?.choices?.[0]?.message?.content?.trim() ||
      'I could not generate a reply. Please try again.';

    return res.status(200).json({ content });
  } catch (err) {
    console.error('chat api error', err);
    return res.status(500).json({ error: 'Failed to reach the mentor engine. Try again.' });
  }
}
