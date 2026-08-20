export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Use GET' });
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  const model = process.env.NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct';

  if (!apiKey) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY missing' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  const started = Date.now();

  try {
    console.error('[NVIDIA TEST] starting');
    console.error('[NVIDIA TEST] model:', model);

    const response = await fetch(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: 'Reply with exactly: OK',
            },
          ],
          temperature: 0,
          max_tokens: 8,
          stream: false,
        }),
        signal: controller.signal,
      }
    );

    const elapsed = Date.now() - started;
    const text = await response.text();

    console.error('[NVIDIA TEST] status:', response.status);
    console.error('[NVIDIA TEST] elapsed:', elapsed);
    console.error('[NVIDIA TEST] body:', text.slice(0, 500));

    return res.status(200).json({
      ok: response.ok,
      status: response.status,
      elapsed,
      model,
      body: text.slice(0, 500),
    });
  } catch (err) {
    const elapsed = Date.now() - started;

    console.error('[NVIDIA TEST] failed:', err?.name, err?.message);
    console.error('[NVIDIA TEST] elapsed:', elapsed);

    return res.status(504).json({
      ok: false,
      error: err?.name === 'AbortError'
        ? 'NVIDIA request timed out'
        : 'NVIDIA request failed',
      detail: err?.message || 'Unknown error',
      elapsed,
      model,
    });
  } finally {
    clearTimeout(timeout);
  }
}
