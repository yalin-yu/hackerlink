// Hackerlink server — zero dependencies, Node 22 built-in HTTP + SQLite
import { createServer } from 'node:http';
import './routes.js';        // loads all route registrations
import { handleRequest } from './router.js';
import { seed } from './seed.js';

const PORT = parseInt(process.env.PORT || '3001');

// Auto-seed on first run
seed();

const server = createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Read body
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const rawBody = Buffer.concat(chunks).toString();

  // Build a Request-like object manually (avoid Node 22 Web Request duplex issues)
  const request = {
    method: req.method,
    url: `http://localhost:${PORT}${req.url}`,
    headers: req.headers,
    body: rawBody,
  };

  const response = await handleRequest(request);

  res.writeHead(response.status, response.headers);
  res.end(response._body || JSON.stringify(response.body));
});

server.listen(PORT, () => {
  console.log(`[hackerlink] http://localhost:${PORT}`);
  console.log(`[hackerlink] health: http://localhost:${PORT}/api/health`);
});
