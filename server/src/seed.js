// Seed: create a demo event and 8 test users with diverse profiles
import { randomUUID } from 'node:crypto';
import { getDb } from './db.js';

const SEED_USERS = [
  { nickname: '技术极客阿凯', role: 'builder', sub: 'code',       q1: 'AI agent框架才是真正的机会，应用层太卷了',                                           q4: 'demo能跑但用户不用，不知道是切错痛点还是交互太重',                                                                    domain: 'AI' },
  { nickname: '产品经理小思', role: 'builder', sub: 'product',    q1: '社交产品同质化太严重，真正理解用户心智的产品经理越来越少了',                      q4: '用户反馈说产品有用但不想付费——免费到付费的转化卡住了',                                                              domain: '社交' },
  { nickname: '出海创业者涛哥', role: 'builder', sub: 'business', q1: '东南亚SaaS市场还在蓝海，本地化是唯一的壁垒',                                       q4: '找到本地BD团队比融资还难，人不在当地根本推不动',                                                                        domain: '跨境' },
  { nickname: '投资人Amanda',  role: 'backer', sub: 'investor',   q1: '看了几十个项目，大部分都是套壳，真正有技术壁垒的太少了',                          q4: '好团队有技术没商业sense，有商业sense的团队技术又不行——两边语言对不上',                                                domain: 'AI' },
  { nickname: '财务顾问博文',  role: 'backer', sub: 'consulting', q1: '早期项目最大的问题是创业者不会算账——获客成本、LTV、复购率全凭感觉',                q4: '想帮创业者搭财务模型，但很多人觉得"先做再说"——等想做的时候数据已经乱成一团了',                                       domain: 'SaaS' },
  { nickname: '内容创作者浩然', role: 'builder', sub: 'content',  q1: '小而美社区才是有价值的，不用大，但要对味——用户不是为功能来的是为氛围来的',        q4: '社区冷启动太难了，前100个用户怎么来？没有好的叙事壳再好的产品也吸引不到对的人',                                        domain: '社交' },
  { nickname: '全栈工程师小鱼', role: 'builder', sub: 'code',     q1: 'Voice agent延迟是大问题，把VAD前置的方案还没人认真做过',                          q4: '技术做好了但获客是个谜——情感陪伴产品拼的不是模型是私域流量',                                                           domain: 'AI' },
  { nickname: '企业赞助方李总', role: 'backer', sub: 'corporate',  q1: '大厂有资源但找不到好团队——内部创新太慢，外部团队又不了解行业场景',                q4: '不知道怎么能有效地把资源对接给对的团队——直接投怕打水漂，不投又怕错过',                                                 domain: 'AI' },
];

export function seed() {
  const db = getDb();

  const existing = db.prepare('SELECT COUNT(*) as count FROM events').get();
  if (existing.count > 0) {
    console.log('[seed] already seeded, skipping');
    return;
  }

  const eventId = randomUUID();
  db.prepare('INSERT INTO events (id, name) VALUES (?, ?)').run(eventId, 'Anthropic 黑客松 · 深圳站');

  const seededIds = [];

  for (const su of SEED_USERS) {
    const uid = randomUUID();
    seededIds.push(uid);

    // Create user
    db.prepare('INSERT INTO users (id, nickname) VALUES (?, ?)').run(uid, su.nickname);

    // Create profile directly (skip onboarding for seed users)
    db.prepare(`
      INSERT INTO profiles (id, user_id, role, sub_role, q1, q4, domain, reasoning)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(randomUUID(), uid, su.role, su.sub, su.q1, su.q4, su.domain, 'seed data');

    // Join event
    db.prepare('INSERT INTO event_users (id, user_id, event_id) VALUES (?, ?, ?)')
      .run(randomUUID(), uid, eventId);
  }

  console.log(`[seed] event: ${eventId}`);
  console.log(`[seed] ${seededIds.length} users with diverse profiles`);
}
