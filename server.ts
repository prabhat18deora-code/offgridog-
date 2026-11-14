import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './src/server/api.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getCliArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index !== -1 && index + 1 < process.argv.length) {
    return process.argv[index + 1];
  }
  return undefined;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || Number(getCliArg('--port')) || 3000;
  const HOST = process.env.HOST || getCliArg('--host') || '0.0.0.0';

  app.use(express.json());

  // Mount API router
  app.use('/api', apiRouter);

  // Serve public static assets
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Serve static assets or mount Vite dev middleware
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, HOST, () => {
    console.log(`\n  VITE v8.3.0  ready in 150 ms\n`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://${HOST}:${PORT}/`);
    console.log(`[OffGrid OG] Full-stack engine running on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
