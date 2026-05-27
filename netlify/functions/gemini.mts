// Server-side proxy for the Gemini API.
//
// The API key lives only in the Netlify environment (GEMINI_API_KEY) and is
// never shipped to the browser. The frontend hooks POST the exact same body
// they used to send to Gemini ({ contents, generationConfig }); this function
// forwards it and returns Gemini's JSON response and status verbatim, so the
// existing client-side `response.ok` / `errorData.error?.message` handling
// keeps working unchanged.

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return json(405, { error: { message: 'Method not allowed' } });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json(500, {
      error: { message: 'Server is missing GEMINI_API_KEY configuration' },
    });
  }

  let payload: { contents?: unknown; generationConfig?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: { message: 'Invalid JSON request body' } });
  }

  try {
    const upstream = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: payload.contents,
        generationConfig: payload.generationConfig,
      }),
    });

    // Pass Gemini's body and status straight through.
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return json(502, {
      error: {
        message:
          err instanceof Error ? err.message : 'Failed to reach Gemini API',
      },
    });
  }
};
