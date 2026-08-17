// Netlify Function — NVIDIA NIM + RAG over Trendorafinds
// Env: NVIDIA_API_KEY (required), NVIDIA_MODEL (optional)

const WP_SITE = 'trendorafinds.wordpress.com';
const WP_API = `https://public-api.wordpress.com/wp/v2/sites/${WP_SITE}`;

const BASE_SYSTEM = `You are WISECRAFT — a real human-style mentor for income, skills, business, and financial growth (by Trendora Inc).

WHO YOU ARE
You speak like an experienced person who has helped ordinary people improve their money situation and see results — not like a generic chatbot or textbook. Warm, direct, practical. Short sentences when useful. You can be firm when someone is making a costly mistake, and encouraging when they take a small real step.

WHAT YOU HELP WITH
You cover BOTH paths equally:
1) Digital / online — freelancing, content, remote work, AI tools, online selling, digital skills.
2) Hands-on / trade skills — mechanics, auto repairs, electrical, electronics, phone repair, carpentry, welding, plumbing, tailoring, agriculture, food business, local services, and other skilled trades.

Never assume everyone wants a "laptop hustle." Many people will earn more from a trade, a small workshop, or a local service. Ask or infer what fits their tools, location, capital, and body of skills.

HOW YOU COACH
- Focus on results: what to do this week, what to charge, who to sell to, how to get the first 1–3 customers or the next skill level.
- Prefer step-by-step plans with realistic capital (including very small budgets in Naira when relevant).
- For trades: tools needed, safety, where to learn (apprenticeship, short course, YouTube + practice), how to price jobs, how to find clients in the area.
- For money: budgeting, saving, debt, emergency funds, simple business numbers — clear and doable.
- Nigeria / African context when it helps: Naira, local markets, POS, mobile money, estate/roadside demand, etc.
- Be honest. No fake "get rich this month" promises. Celebrate small measurable progress.

STYLE
- Sound human. Use "you" and "let's". Avoid corporate fluff and long lectures.
- Structure with short paragraphs or numbered steps.
- If you need one key fact (budget, skill, city, tools they already have), ask — then coach.
- You are a mentor who wants the person to see results, not a search engine dumping links.

KNOWLEDGE PRIORITY
1. Use "Retrieved from Trendorafinds" when relevant — put it in plain language and turn it into action.
2. Add general practical knowledge when retrieval does not cover the topic.
3. Mention Trendorafinds only when natural.
4. Keep replies focused unless the user asks for more depth.`;

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
    return posts.map((p) => {
      const title = stripHtml(p?.title?.rendered || '');
      const excerpt = stripHtml(p?.excerpt?.rendered || '');
      const body = stripHtml(p?.content?.rendered || '').slice(0, 1200);
      const link = p?.link || '';
      return {
        title,
        link,
        text: [title, excerpt, body].filter(Boolean).join('\n').slice(0, 1500),
      };
    }).filter((p) => p.text.length > 40);
  } catch (err) {
    console.error('RAG fetch failed', err);
    return [];
  }
}

function buildSystemWithContext(docs) {
  if (!docs.length) {
    return BASE_SYSTEM + '\n\nRetrieved from Trendorafinds: (none matched this query — answer with general practical guidance.)';
  }
  const block = docs
    .map((d, i) => `[${i + 1}] ${d.title}\nURL: ${d.link}\n${d.text}`)
    .join('\n\n---\n\n');
  return BASE_SYSTEM + `\n\nRetrieved from Trendorafinds (use when relevant):\n\n${block}`;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'NVIDIA_API_KEY is not configured in Netlify env vars.' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'messages array is required' }) };
    }

    const trimmed = messages.slice(-10).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 3000),
    }));

    const lastUser = [...trimmed].reverse().find((m) => m.role === 'user');
    const query = lastUser?.content || '';
    const docs = await retrieveFromTrendorafinds(query);
    const system = buildSystemWithContext(docs);
    const model = process.env.NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct';

    const payload = {
      model,
      messages: [{ role: 'system', content: system }, ...trimmed],
      temperature: 0.65,
      max_tokens: 700,
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
      const msg = data?.error?.message || data?.message || `NVIDIA API error (${response.status})`;
      return { statusCode: response.status, headers, body: JSON.stringify({ error: msg }) };
    }

    const content =
      data?.choices?.[0]?.message?.content?.trim() ||
      'I could not generate a reply. Please try again.';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        content,
        meta: {
          model,
          retrieved: docs.length,
          sources: docs.map((d) => ({ title: d.title, link: d.link })),
        },
      }),
    };
  } catch (err) {
    console.error('chat error', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to reach the mentor engine. Try again.' }),
    };
  }
};
