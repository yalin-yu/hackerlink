// API client — all requests go through here
// [API] 基础 fetch 封装
// 后端地址通过 VITE_API_URL 环境变量配置，默认 localhost:3001
// 部署时设 VITE_API_URL=https://your-backend.com 指向生产后端

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request<T>(method: string, path: string, body?: object): Promise<T> {
  const opts: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: object) => request<T>('POST', path, body),
  put: <T>(path: string, body: object) => request<T>('PUT', path, body),
};
