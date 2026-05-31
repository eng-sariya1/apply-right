import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

// Dev-only equivalent of netlify/functions/gemini.mts so `npm run dev` keeps
// working without the Netlify CLI. The key is read from GEMINI_API_KEY on the
// dev server process and never exposed to the browser bundle.
function geminiDevProxy(apiKey: string): Plugin {
  return {
    name: 'gemini-dev-proxy',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/.netlify/functions/gemini', async (req, res) => {
        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        };

        if (req.method !== 'POST') {
          return send(405, { error: { message: 'Method not allowed' } });
        }
        if (!apiKey) {
          return send(500, {
            error: { message: 'Dev server is missing GEMINI_API_KEY (set it in .env)' },
          });
        }

        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);

        let payload: { contents?: unknown; generationConfig?: unknown };
        try {
          payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        } catch {
          return send(400, { error: { message: 'Invalid JSON request body' } });
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
          const text = await upstream.text();
          res.statusCode = upstream.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(text);
        } catch (err) {
          send(502, {
            error: {
              message: err instanceof Error ? err.message : 'Failed to reach Gemini API',
            },
          });
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Empty prefix loads all vars (incl. non-VITE GEMINI_API_KEY) for server-side
  // use only — this is NOT injected into import.meta.env / the client bundle.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      geminiDevProxy(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''),
    ],
    optimizeDeps: {
      include: ['@react-pdf/renderer'],
      force: true
    },
    build: {
      target: 'esnext',
      minify: false,
      cssCodeSplit: true,
      rollupOptions: {
        external: [],
      },
    }
  }
})
