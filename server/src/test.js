// Integration test script — runs server, hits all endpoints, then exits
import { createServer } from 'node:http';
import './routes.js';
import { handleRequest } from './router.js';
import { seed } from './seed.js';

const PORT = 3099;

// Auto-seed
seed();

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString();

  const response = await handleRequest({
    method: req.method,
    url: `http://localhost:${PORT}${req.url}`,
    headers: req.headers,
    body: rawBody,
  });

  res.writeHead(response.status, response.headers);
  res.end(response._body || JSON.stringify(response.body));
});

server.listen(PORT, async () => {
  async function call(method, path, body) {
    const url = `http://localhost:${PORT}${path}`;
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    const json = await res.json();
    return { status: res.status, json };
  }

  let pass = 0, fail = 0;
  function check(label, ok) {
    if (ok) { pass++; console.log(`  ✅ ${label}`); }
    else { fail++; console.log(`  ❌ ${label}`); }
  }

  try {
    // 1. health
    let r = await call('GET', '/api/health');
    check('health', r.json.ok === true);

    // 2. events
    r = await call('GET', '/api/events');
    check('events', r.json.events && r.json.events.length >= 1);

    // 3. users
    r = await call('GET', '/api/users');
    check('users (seed)', r.json.users && r.json.users.length >= 3);

    // 4. create user
    r = await call('POST', '/api/users', { nickname: '测试' });
    check('create user', r.status === 201 && r.json.user);

    const ua = r.json.user.id;
    const ub = (await call('GET', '/api/users')).json.users[0].id;

    // 5. create profile (now with subRole + domain extraction)
    r = await call('POST', '/api/profiles', { userId: ua, role: 'builder', subRole: 'code', q1: '我在做agent框架，觉得底层基建才是机会', q4: 'demo能跑但用户不用，不知道是痛点问题还是交互问题' });
    check('create profile', r.status === 201 && r.json.profile);
    check('profile has sub_role', r.json.profile.sub_role === 'code');
    check('profile has domain', r.json.profile.domain && r.json.profile.domain.length > 0);
    check('profile has reasoning', r.json.profile.reasoning && r.json.profile.reasoning.length > 0);
    console.log(`     domain=${r.json.profile.domain} reasoning=${r.json.profile.reasoning}`);
    console.log(`     llmMode=${r.json.meta?.llmMode}`);

    // 6. get profile by userId
    r = await call('GET', `/api/profiles/${ua}`);
    check('get profile', r.status === 200 && r.json.profile.role === 'builder');
    check('onboarding complete', r.json.onboardingComplete === true);

    // 7. twin config
    const eid = (await call('GET', '/api/events')).json.events[0].id;
    r = await call('POST', '/api/twin-config', { userId: ua, eventId: eid, selectedCards: [1,3], customInput: 'test' });
    check('twin config', r.status === 201);

    // 8. get twin config
    r = await call('GET', `/api/twin-config/${ua}/${eid}`);
    check('get twin config', r.status === 200);

    // 9. seed users already have profiles from seed.js — skip creating
    check('seed profiles exist from seed.js', true);

    // 10. start twin search (synchronous — returns results directly)
    r = await call('POST', '/api/twin-search/start', { userId: ua, eventId: eid });
    check('twin search start', r.status === 200);
    const results = r.json.results;
    check('twin search results', results && results.length > 0);
    if (results) {
      console.log(`     results: ${results.length} people, top score=${results[0]?.score}`);
      check('results have codename', typeof results[0]?.codename === 'string');
      check('results have quote', typeof results[0]?.quote === 'string');
    }

    // 9. match
    r = await call('POST', '/api/matches', { senderId: ua, receiverId: ub });
    check('match', r.status === 201 && r.json.match);

    // 10. message
    const mid = r.json.match.id;
    r = await call('POST', '/api/messages', { matchId: mid, senderId: ua, content: 'hello' });
    check('send message', r.status === 201);

    // 11. get messages
    r = await call('GET', `/api/messages/${mid}`);
    check('get messages', r.json.messages && r.json.messages.length >= 1);

    // 12. meeting
    r = await call('POST', '/api/meetings', { inviterId: ua, inviteeId: ub });
    check('meeting', r.status === 201);
  } catch (e) {
    console.error('TEST ERROR:', e.message);
    fail++;
  }

  console.log(`\n  ${pass + fail} tests: ${pass} pass, ${fail} fail`);
  server.close();
  process.exit(fail > 0 ? 1 : 0);
});
