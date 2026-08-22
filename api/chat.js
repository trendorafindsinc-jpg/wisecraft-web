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

  /*
   * WISECRAFT intent-aware retrieval.
   *
   * Important distinction:
   * "income" can mean either:
   *   A) earning/income generation
   *   B) personal-finance budgeting
   *
   * We therefore classify the surrounding language instead of treating
   * the word "income" by itself as a finance trigger.
   */

  const financeIntent =
    /budget|monthly spending|spending plan|expense|expenses|save money|saving plan|savings plan|emergency fund|emergency savings|debt|loan|borrow|credit|invest|investment|compound interest|financial plan|manage my money|manage money|salary allocation|allocate my salary|living expenses/.test(combined);

  const businessIntent =
    /start a business|starting a business|business idea|business plan|small business|startup|start selling|sell products|selling products|product business|business customers|business customer|pricing|profit margin|break-even|break even|capital to start|launch a business|validate.*business|business validation/.test(combined);

  const earningIntent =
    /make money|earn money|make .*₦|earn .*₦|make .*naira|earn .*naira|income generation|increase my income|increase income|side hustle|side income|find clients|find customers|freelanc|remote work|online work|online income|digital work|sell online|selling online|earn online|make .*online|gig|gigs/.test(combined);

  const skillIntent =
    /learn .*skill|learn a skill|new skill|skill to earn|skill.*income|digital marketing|content creation|copywriting|graphic design|web design|video editing|programming|coding|virtual assistant|virtual assistance|social media management/.test(combined);

  /*
   * Priority:
   * 1. Explicit earning intent
   * 2. Business intent
   * 3. Personal-finance intent
   * 4. Skill intent
   *
   * This prevents a phrase like "I want to earn ₦100,000" from being
   * incorrectly routed to budgeting content merely because it contains
   * the word "income".
   */

  if (financeIntent) {
    add('budget Nigeria');
    add('emergency fund Nigeria');
    add('money income Nigeria');
  } else if (businessIntent) {
    add('business Nigeria');
    add('business customers pricing Nigeria');
    add('startup Nigeria');
  } else if (earningIntent) {
    add('income skills Nigeria');
    add('online work Nigeria');
    add('freelancing Nigeria');
  } else if (skillIntent) {
    add('skills Nigeria');
    add('digital skills Nigeria');
    add('online work Nigeria');
  }

  /*
   * Domain-specific additions.
   */
  if (/debt|loan|borrow|credit/.test(combined)) {
    add('debt management Nigeria');
  }

  if (/invest|investment|compound|interest/.test(combined)) {
    add('investment Nigeria');
    add('compound interest Nigeria');
  }

  /*
   * Generic fallback for questions outside the known domains.
   */
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

function buildResponseGuidance(messages) {
  const text = Array.isArray(messages)
    ? messages
        .filter((m) => m?.role === 'user')
        .map((m) => String(m.content || ''))
        .join(' ')
        .toLowerCase()
    : '';

  const instructions = [
    'Understand the user before prescribing a solution.',
    'Prefer one or two realistic strategies instead of listing many unrelated options.',
    'Use concrete numbers, estimates, targets, prices, or simple calculations when useful.',
    'Give measurable actions rather than generic motivational advice.',
    'Explain who the user should approach, what they should offer, and how they can measure progress when relevant.'
  ];

  if (/30 day|30-day|30 days|month/.test(text)) {
    instructions.push(
      'If a duration is requested, make the plan fit that duration exactly.'
    );
  }

  if (/no capital|zero capital|without capital|no money|without money/.test(text)) {
    instructions.push(
      'The user has little or no capital. Avoid paid advertising, expensive software, and unnecessary startup costs.'
    );
  }

  if (/earn|income|make money|online|money|₦|naira/.test(text)) {
    instructions.push(
      'For income goals, translate the target into realistic customer, sale, service, or pricing numbers.'
    );
  }

  if (/business|startup|customer|customers|profit|pricing|sell|selling/.test(text)) {
    instructions.push(
      'For business questions, consider the customer, offer, price, cost, margin, demand, and break-even point.'
    );
  }

  if (/skill|learn|freelanc|remote work|online work/.test(text)) {
    instructions.push(
      'Recommend skills based on the users actual goal and constraints instead of telling them to learn many skills at once.'
    );
  }

  return instructions.join('\n');
}

function buildExecutionGuidance(messages) {
  const text = Array.isArray(messages)
    ? messages
        .filter((m) => m?.role === 'user')
        .map((m) => String(m.content || ''))
        .join(' ')
        .toLowerCase()
    : '';

  const instructions = [
    'Turn advice into an executable next step whenever possible.',
    'For plans, prioritize actions the user can actually perform with their available resources.',
    'For income goals, show a simple path from activity to customer to payment.',
    'For business goals, distinguish assumptions from facts and identify what should be validated first.',
    'For learning goals, connect the skill directly to a practical outcome or service the user can sell.',
    'Do not recommend unnecessary tools, subscriptions, paid advertising, or complicated systems.',
    'When the user asks for a plan, make the sequence clear: first action, next action, measurement, and adjustment.'
  ];

  if (/no capital|zero capital|without capital|no money|without money/.test(text)) {
    instructions.push(
      'With no capital, prioritize free outreach, free tools, direct selling, samples, and service-based work.'
    );
  }

  if (/100,000|₦100|naira|income|earn|make money|make.*online/.test(text)) {
    instructions.push(
      'Do not treat the target income as guaranteed. Calculate how many customers, sales, or jobs would be needed to approach the target.'
    );
  }

  if (/30 day|30-day|30 days/.test(text)) {
    instructions.push(
      'For a 30-day plan, organize actions across all 30 days or clearly group the days without extending beyond day 30.'
    );
  }

  return instructions.join('\n');
}

function buildDecisionGuidance(messages) {
  const text = Array.isArray(messages)
    ? messages
        .filter((m) => m?.role === 'user')
        .map((m) => String(m.content || ''))
        .join(' ')
        .toLowerCase()
    : '';

  const instructions = [
    'Before recommending a strategy, evaluate whether it is feasible for the users stated goal and constraints.',
    'Separate the users goal, known constraints, unknown information, assumptions, and proposed strategy.',
    'When multiple strategies could work, compare them briefly using startup cost, learning time, customer access, earning potential, difficulty, and time to first payment.',
    'Do not choose an option merely because retrieved content mentions it. Retrieved knowledge is evidence, not an automatic recommendation.',
    'Prefer the strategy that best fits the users actual constraints and time horizon.',
    'For income targets, calculate the basic economics: target income, price or revenue per sale/client, number of sales or clients required, and a reasonable prospect-to-client funnel when assumptions can be stated.',
    'Clearly label estimates and assumptions. Never present estimated conversion rates, prices, demand, or earnings as guaranteed facts.',
    'If a critical fact is missing, either ask a targeted question or provide a conditional recommendation using an explicit assumption.',
    'After choosing a strategy, explain why it was selected and what evidence would cause WISECRAFT to change the recommendation.',
    'Prefer one strong recommendation with a backup option over a long list of unrelated possibilities.'
  ];

  if (/no capital|zero capital|without capital|no money|without money/.test(text)) {
    instructions.push(
      'For zero-capital situations, prioritize service businesses, direct outreach, free tools, existing skills, and activities that can produce a first sale without upfront spending.'
    );
  }

  if (/100,000|₦100|naira|income|earn|make money|make.*online/.test(text)) {
    instructions.push(
      'For an income target, explicitly show the arithmetic connecting the offer price to the target. Then distinguish clients needed from prospects that may need to be contacted.'
    );
  }

  if (/30 day|30-day|30 days/.test(text)) {
    instructions.push(
      'For a 30-day target, consider whether learning time, portfolio creation, outreach, sales, delivery, and payment collection can realistically fit inside the same 30 days.'
    );
  }

  if (/business|startup|customer|customers|profit|pricing|sell|selling/.test(text)) {
    instructions.push(
      'For business decisions, evaluate customer demand, offer clarity, price, direct costs, margin, competition, customer acquisition difficulty, and break-even when relevant.'
    );
  }

  return instructions.join('\n');
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
    const guidance = buildResponseGuidance(trimmed);
    const executionGuidance = buildExecutionGuidance(trimmed);
    const decisionGuidance = buildDecisionGuidance(trimmed);
    const system =
      buildSystemWithContext(docs) +
      '\n\nResponse Guidance:\n' +
      guidance +
      '\n\nExecution Guidance:\n' +
      executionGuidance +
      '\n\nDecision and Feasibility Guidance:\n' +
      decisionGuidance;
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
