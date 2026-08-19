/**
 * CANDIDATE WISECRAFT /api/chat handler for Vercel.
 * Do NOT auto-replace production api without comparing implementations.
 * Env: NVIDIA_API_KEY (required), NVIDIA_MODEL (optional)
 */
const WP_SITE = 'trendorafinds.wordpress.com';
const WP_API = `https://public-api.wordpress.com/wp/v2/sites/${WP_SITE}`;

const BASE_SYSTEM = `You are WISECRAFT — a real human-style mentor for income, skills, business, and financial growth (by Trendora Inc).

WHO YOU ARE
You speak like an experienced person who has helped ordinary people improve their money situation and see results. Warm, direct, practical.

WHAT YOU HELP WITH
1) Digital / online — freelancing, content, remote work, AI tools, online selling.
2) Hands-on / trade skills — mechanics, electrical, electronics, phone repair, carpentry, welding, plumbing, tailoring, agriculture, local services.

Never assume everyone wants a laptop hustle. Coach what fits their tools, location, capital, and skills.

HOW YOU COACH
- Focus on results: what to do this week, what to charge, who to sell to.
- Realistic capital including small Naira budgets when relevant.
- Nigeria / African context when helpful.
- Be honest. No fake get-rich promises.

STYLE
- Sound human. Short paragraphs or numbered steps.
- Keep replies focused unless the user asks for depth.

KNOWLEDGE PRIORITY
1. Use Retrieved from Trendorafinds when relevant.
2. Add general practical knowledge when needed.
3. Mention Trendorafinds only when natural.`;

function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function retrieveFromTrendorafinds(userQuery) {
  const q = String(userQuery || '').trim().slice(0, 120);
  if (!q) return [];
  const url = `${WP_API}/posts?search=${encodeURIComponent(q)}&per_page=4&_fields=id,title,link,excerpt,content,date`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return [];
    const posts = await res.json();
    if (!Array.isArray(posts)) return [];
    return posts
      .map((p) => {
        const title = stripHtml(p?.title?.rendered || '');
        const excerpt = stripHtml(p?.excerpt?.rendered || '');
        const body = stripHtml(p?.content?.rendered || '').slice(0, 1200);
        const link = p?.link || '';
        return {
          title,
          link,
          text: [title, excerpt, body].filter(Boolean).join('\n').slice(0, 1500),
        };
      })
      .filter((p) => p.text.length > 40);
  } catch (err) {
    console.error('RAG fetch failed', err);
    return [];
  }
}

function buildSystemWithContext(docs) {
  if (!docs.length) {
    return BASE_SYSTEM + '\n\nRetrieved from Trendorafinds: (none matched — use general practical guidance.)';
  }
  const block = docs
    .map((d, i) => `[${i + 1}] ${d.title}\nURL: ${d.link}\n${d.text}`)
    .join('\n\n---\n\n');
  return BASE_SYSTEM + `\n\nRetrieved from Trendorafinds (use when relevant):\n\n${block}`;
}

export default async function handler(req, res) {
  console.error('[WISECRAFT DEBUG] handler invoked');
  console.error('[WISECRAFT DEBUG] method:', req.method);
  console.error('[WISECRAFT DEBUG] NVIDIA_API_KEY configured:', Boolean(process.env.NVIDIA_API_KEY));
  console.error('[WISECRAFT DEBUG] NVIDIA_MODEL configured:', Boolean(process.env.NVIDIA_MODEL));
  // Same-origin by default (frontend and API share Vercel host).
  // Do not use Access-Control-Allow-Origin: * in production.
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY is not configured.' });
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const trimmed = messages.slice(-10).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 3000),
    }));

    const lastUser = [...trimmed].reverse().find((m) => m.role === 'user');
    console.error('[WISECRAFT DEBUG] before Trendorafinds');
    const docs = await retrieveFromTrendorafinds(lastUser?.content || '');
    console.error('[WISECRAFT DEBUG] after Trendorafinds, docs:', docs.length);
    const system = buildSystemWithContext(docs);
    const model = process.env.NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct';

    console.error('[WISECRAFT DEBUG] before NVIDIA request, model:', model);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    let response;

    try {
      response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: system }, ...trimmed],
          temperature: 0.65,
          max_tokens: 700,
          top_p: 0.9,
          stream: false,
        }),
        signal: controller.signal,
      });
    } catch (err) {
      if (err?.name === 'AbortError') {
        console.error('[WISECRAFT DEBUG] NVIDIA request timed out');
        return res.status(504).json({
          error: 'NVIDIA AI request timed out.',
        });
      }

      console.error('[WISECRAFT DEBUG] NVIDIA request failed');
      throw err;
    } finally {
      clearTimeout(timeout);
    }

    console.error('[WISECRAFT DEBUG] NVIDIA response received, status:', response.status);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg = data?.error?.message || data?.message || `NVIDIA API error (${response.status})`;
      return res.status(response.status).json({ error: msg });
    }

    const content =
      data?.choices?.[0]?.message?.content?.trim() ||
      'I could not generate a reply. Please try again.';

    return res.status(200).json({
      content,
      meta: {
        model,
        retrieved: docs.length,
        sources: docs.map((d) => ({ title: d.title, link: d.link })),
      },
    });
  } catch (err) {
    console.error('chat api error', err);
    return res.status(500).json({ error: 'Failed to reach the mentor engine. Try again.' });
  }
};
