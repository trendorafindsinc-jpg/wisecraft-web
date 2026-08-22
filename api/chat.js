/**
 * WISECRAFT /api/chat handler.
 * Server-side AI gateway with optional Trendorafinds retrieval.
 * Provider credentials remain server-side.
 */
const WP_SITE = 'trendorafinds.wordpress.com';
const WP_API = `https://public-api.wordpress.com/wp/v2/sites/${WP_SITE}`;

const BASE_SYSTEM = `You are WISECRAFT — a practical growth mentor by Trendora Inc. Your job is to help the user make better decisions and take realistic action, not merely generate generic chatbot answers.

CORE MISSION
Help users understand their situation, clarify goals, learn useful skills, improve income, plan businesses, manage money, execute plans, track progress, and adapt when circumstances change.

COACHING RULES
1. Understand before prescribing. Identify the user's goal, current situation, resources, constraints, location, available time, skills, capital, preferences, previous attempts, and deadline when those facts are available.
2. Never invent important personal facts. If a missing fact would materially change the recommendation, ask a small number of targeted questions before committing to a specific plan. If it is not critical, state a reasonable assumption.
3. Personalize recommendations using facts already provided in the conversation. Do not restart with generic advice when the user provides new information.
4. Treat the conversation as continuous coaching. Remember relevant facts from earlier messages and use them when adapting a plan.
5. Respect explicit constraints. Never recommend spending beyond stated capital, ignore device/location/time limitations, or continue a strategy the user explicitly rejected.
6. For financial questions, make the numbers add up. Separate income, fixed costs, variable spending, savings, emergency-fund contributions, and discretionary spending. Never invent expenses and present them as facts.
7. For business plans, consider customer, location, competition, startup cost, selling price, unit economics, margin, demand, and break-even when relevant. Clearly label estimates.
8. For timed plans, obey the requested duration exactly. A 30-day plan must fit 30 days. A 90-day plan must fit 90 days. Never create contradictory weeks or dates.
9. Prefer concrete execution: what to do, who to approach, what to offer, what to charge, what evidence to collect, and what result to measure.
10. Never promise easy money, guaranteed customers, guaranteed income, or unrealistic outcomes.
11. When the user reports failure or new information, diagnose what changed and adapt the strategy instead of repeating the original plan.

DOMAIN COVERAGE
- Digital / online: freelancing, content, remote work, AI tools, online selling.
- Hands-on / trade skills: mechanics, electrical, electronics, phone repair, carpentry, welding, plumbing, tailoring, agriculture, local services.
- Personal finance: budgeting, savings, emergency funds, spending controls, debt and income planning.
- Business: idea selection, validation, pricing, customer acquisition, unit economics, launch plans.

CONTEXT AND REASONING
Before answering, silently determine:
- What is the user actually trying to achieve?
- What facts and constraints are known?
- What critical information is missing?
- Which advice depends on assumptions?
- Does the request require knowledge retrieval, calculation, or both?
- What is the smallest useful next step?

Do not expose hidden chain-of-thought. Give the user the useful conclusions, assumptions, calculations, questions, and actions.

QUALITY CONTROL
Before finalizing, check that:
- the answer respects the user's constraints
- important numbers reconcile
- the timeline matches the requested duration
- recommendations do not contradict earlier conversation facts
- assumptions are clearly identified
- the response is actionable rather than generic

If exact information is unavailable, say so and use clearly labeled estimates rather than pretending certainty.

KNOWLEDGE PRIORITY
1. Use Retrieved from Trendorafinds when relevant.
2. Combine retrieved knowledge with general practical knowledge when needed.
3. Do not force retrieved material into an answer when it is irrelevant.
4. Mention Trendorafinds only when natural.

STYLE
- Warm, direct, practical, and human.
- Use short paragraphs, bullets, or numbered steps.
- Prefer useful specificity over long explanations.
- A short answer that correctly understands the user is better than a long generic essay.
- Consider Nigeria / African context when relevant without assuming every user has the same circumstances.`;


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

function buildRetrievalQueries(messages) {
  const recent = Array.isArray(messages)
    ? messages
        .filter((m) => m?.role === 'user')
        .slice(-4)
        .map((m) => String(m?.content || '').trim())
        .filter(Boolean)
    : [];

  if (!recent.length) return [];

  const combined = recent.join(' ').toLowerCase();

  const queries = [];

  const add = (query) => {
    const q = query.trim();
    if (q && !queries.includes(q)) queries.push(q);
  };

  // Search the knowledge base using focused concepts rather than one
  // long multi-term query, because WordPress search is lexical.
  if (/budget|spend|salary|income|saving|savings|emergency|debt|finance|money|expense|₦|naira/.test(combined)) {
    add('budget Nigeria');
    add('emergency fund Nigeria');
    add('money income Nigeria');
  }

  if (/business|startup|sell|selling|customer|customers|product|profit|pricing|capital|shop|launch/.test(combined)) {
    add('business Nigeria');
    add('business customers pricing Nigeria');
    add('startup Nigeria');
  }

  if (/skill|freelanc|remote|online|digital|job|work|client|clients|service|earn|income|dollar/.test(combined)) {
    add('income skills Nigeria');
    add('online work Nigeria');
    add('freelancing Nigeria');
  }

  if (/debt|loan|borrow|credit/.test(combined)) {
    add('debt management Nigeria');
  }

  if (/invest|investment|compound|interest/.test(combined)) {
    add('investment Nigeria');
    add('compound interest Nigeria');
  }

  // Always retain a compact fallback based on meaningful terms.
  if (!queries.length) {
    const stopWords = new Set([
      'the', 'and', 'for', 'with', 'that', 'this', 'have', 'want',
      'help', 'please', 'give', 'make', 'need', 'from', 'into',
      'what', 'how', 'can', 'could', 'would', 'should', 'you',
      'your', 'my', 'me', 'i', 'a', 'an', 'to', 'of', 'in', 'on',
      'is', 'it', 'be', 'do', 'just', 'also', 'about', 'tell'
    ]);

    const words = combined
      .replace(/[^\p{L}\p{N}₦%.-]+/gu, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .filter((word) => word.length > 2)
      .filter((word) => !stopWords.has(word));

    add(words.slice(0, 5).join(' '));
  }

  return queries.slice(0, 3);
}

async function searchTrendorafinds(query) {
  const q = String(query || '').trim();
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
          id: p?.id,
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

async function retrieveFromTrendorafinds(queries) {
  const searchQueries = Array.isArray(queries) ? queries : [];

  const results = await Promise.all(
    searchQueries.map((query) => searchTrendorafinds(query))
  );

  const seen = new Set();
  const docs = [];

  for (const group of results) {
    for (const doc of group) {
      const key = doc.id || doc.link || doc.title;
      if (seen.has(key)) continue;

      seen.add(key);
      docs.push(doc);

      if (docs.length >= 6) return docs;
    }
  }

  return docs;
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
  // Same-origin by default (frontend and API share Vercel host).
  // Do not use Access-Control-Allow-Origin: * in production.
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'WISECRAFT is temporarily unavailable. Please try again later.',
    });
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

    const retrievalQueries = buildRetrievalQueries(trimmed);
    const docs = await retrieveFromTrendorafinds(retrievalQueries);
    const system = buildSystemWithContext(docs);
    const model = process.env.NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct';


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
        return res.status(504).json({
          error: 'WISECRAFT is taking longer than expected. Please try again.',
        });
      }

      return res.status(502).json({
        error: 'WISECRAFT could not complete the request. Please try again.',
      });
    } finally {
      clearTimeout(timeout);
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('AI provider request failed:', response.status);
      return res.status(502).json({
        error: 'WISECRAFT could not complete the request. Please try again.',
      });
    }

    const content =
      data?.choices?.[0]?.message?.content?.trim() ||
      'I could not generate a reply. Please try again.';

    return res.status(200).json({
      content,
      meta: {
        retrieved: docs.length,
        sources: docs.map((d) => ({ title: d.title, link: d.link })),
        retrievalQueries,
      },
    });
  } catch (err) {
    console.error('chat api error', err);
    return res.status(500).json({ error: 'Failed to reach the mentor engine. Try again.' });
  }
};
