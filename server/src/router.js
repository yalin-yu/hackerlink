// Minimal router — match URL patterns, no dependencies

/** @typedef {{method: string, url: string, headers: object, body: string}} CustomRequest */
/** @typedef {(req: CustomRequest, params: Record<string,string>, body: any) => Promise<{status: number, body: any}>} Handler */

/** @type {{method: string, path: string, regex: RegExp, paramNames: string[], handler: Handler}[]} */
const routes = [];

/**
 * @param {string} method
 * @param {string} path   — e.g. '/api/profiles/:userId'
 * @param {Handler} handler
 */
export function addRoute(method, path, handler) {
  const paramNames = [];
  const regexStr = path.replace(/:(\w+)/g, (_, name) => {
    paramNames.push(name);
    return '([^/]+)';
  });
  routes.push({
    method: method.toUpperCase(),
    path,
    regex: new RegExp('^' + regexStr + '$'),
    paramNames,
    handler,
  });
}

export function GET(path, handler)    { addRoute('GET', path, handler); }
export function POST(path, handler)   { addRoute('POST', path, handler); }
export function PUT(path, handler)    { addRoute('PUT', path, handler); }
export function DELETE(path, handler) { addRoute('DELETE', path, handler); }

/**
 * @param {CustomRequest} req
 * @returns {Promise<{status: number, headers: HeadersInit, body: any, _body?: string}>}
 */
export async function handleRequest(req) {
  const url = new URL(req.url);
  const urlPath = url.pathname;

  for (const route of routes) {
    if (route.method !== req.method) continue;

    const match = urlPath.match(route.regex);
    if (!match) continue;

    const params = {};
    route.paramNames.forEach((name, i) => {
      params[name] = match[i + 1];
    });

    return await callHandler(req, route.handler, params);
  }

  return jsonResponse(404, { error: 'not found' });
}

async function callHandler(req, handler, params) {
  let bodyData = {};
  if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
    try {
      bodyData = JSON.parse(req.body);
    } catch {
      bodyData = {};
    }
  }

  try {
    const result = await handler(req, params, bodyData);
    return jsonResponse(result.status, result.body);
  } catch (err) {
    console.error('[router] error:', err);
    return jsonResponse(500, { error: err.message });
  }
}

function jsonResponse(status, body) {
  const bodyStr = JSON.stringify(body);
  return {
    status,
    headers: { 'content-type': 'application/json' },
    body,
    _body: bodyStr,
  };
}
