# 文章阅读次数统计（Cloudflare Worker + KV）

**日期**：2026-05-20
**作者**：sunfei + Claude
**状态**：待审批，未实施

## 目标

为每篇文章统计独立访问次数，并在文章页（以及可选的列表页）展示"阅读 N 次"。

约束：

- 站点是 GH Pages 静态部署，没有自有后端
- 不引入第三方分析平台，数据归属在自己掌握的 Cloudflare 账号
- 免费层够用，零运维成本
- 计数掉一两次没关系，但要抗刷（同一访客 24h 内只算 1 次）

## 架构

```
浏览器              counter.beatai.org (CF Worker)        KV (namespace: VIEWS)
  │                       │                                 │
  │  POST /hit?slug=...   │                                 │
  │──────────────────────▶│  GET view:<slug>                │
  │                       │  GET dedupe:<ip>:<slug>         │
  │                       │  PUT view:<slug>   (+1)         │
  │                       │  PUT dedupe:<ip>:<slug> TTL 24h │
  │◀────── { count }──────│                                 │
  │                       │                                 │
  │  GET /views?slugs=a,b │                                 │
  │──────────────────────▶│  批量 GET view:<a>, view:<b>... │
  │◀── { a: 12, b: 5 }────│                                 │
```

两个端点：

- `POST /hit?slug=<path>` —— 文章页打开时调用；自增并返回新计数。同访客 24h 内重复调用只读不写
- `GET /views?slugs=<csv>` —— 列表页/侧栏批量读取，不写

KV 里两类 key：

| Key | 值 | TTL | 用途 |
|---|---|---|---|
| `view:<slug>` | 整数字符串 | 永久 | 累计计数 |
| `dedupe:<ip-hash>:<slug>` | `"1"` | 86400s | 去重标记 |

## 关键设计点

| 决策 | 选择 | 理由 |
|---|---|---|
| Slug 来源 | 文章相对路径，如 `docs/ai-insights/2026-05/19/anthropics-engineer-said-kill-markdown...` | 已经全站唯一，不用再造 ID；KV 里直接可读 |
| 增量触发时机 | `DocContent.js` 在文章 markdown 加载完成后的 `useEffect`，而不是路由挂载时 | 避免 404 / 加载失败也计数 |
| 去重维度 | 服务端用 `cf-connecting-ip` 哈希 + slug，24h TTL | 比 localStorage 抗清缓存，且不信任客户端 |
| IP 哈希 | SHA-256(IP + 固定盐) 截断前 16 字符 | 不存原始 IP，符合隐私最小化 |
| CORS | 允许 `https://beatai.org` 和 `http://localhost:3000` | 防止别人远程刷计数 |
| Origin 校验 | 校验 `Origin` header 是否在白名单 | 二次保护 |
| 写入失败 | React 侧 `catch` 静默忽略，不阻塞渲染 | 计数服务挂了不能影响阅读 |
| 写一致性 | KV 单 key 写入上限 1/s，对博客流量足够 | 真有爆款再上 Durable Object |
| Worker 域名 | 绑定 `counter.beatai.org`（前提：beatai.org 已经在 CF DNS 下） | 否则用 `<name>.workers.dev`，被广告拦截器命中的概率更高 |
| 错误响应 | 任何异常都返回 `{ count: null }` 而非 5xx | 客户端只 hide 数字，不弹错 |

## Worker 代码骨架

`worker.js`（约 60 行）：

```js
const ALLOWED_ORIGINS = new Set([
  'https://beatai.org',
  'http://localhost:3000',
]);
const SALT = 'beatai-counter-v1'; // 也可以放 secret

function cors(origin) {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : 'https://beatai.org';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
  };
}

async function hashIp(ip) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(SALT + ip),
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const origin = req.headers.get('Origin') ?? '';
    const headers = cors(origin);

    if (req.method === 'OPTIONS') return new Response(null, { headers });

    if (url.pathname === '/hit' && req.method === 'POST') {
      const slug = url.searchParams.get('slug');
      if (!slug) return Response.json({ error: 'missing slug' }, { status: 400, headers });

      const ipHash = await hashIp(req.headers.get('cf-connecting-ip') ?? 'unknown');
      const dedupeKey = `dedupe:${ipHash}:${slug}`;
      const viewKey = `view:${slug}`;

      const [seen, currentRaw] = await Promise.all([
        env.VIEWS.get(dedupeKey),
        env.VIEWS.get(viewKey),
      ]);
      const current = parseInt(currentRaw ?? '0', 10);

      if (seen) return Response.json({ count: current }, { headers });

      const next = current + 1;
      await Promise.all([
        env.VIEWS.put(viewKey, String(next)),
        env.VIEWS.put(dedupeKey, '1', { expirationTtl: 86400 }),
      ]);
      return Response.json({ count: next }, { headers });
    }

    if (url.pathname === '/views' && req.method === 'GET') {
      const slugs = (url.searchParams.get('slugs') ?? '').split(',').filter(Boolean);
      if (slugs.length === 0) return Response.json({}, { headers });
      if (slugs.length > 50) return Response.json({ error: 'too many' }, { status: 400, headers });
      const entries = await Promise.all(
        slugs.map(async s => [s, parseInt(await env.VIEWS.get(`view:${s}`) ?? '0', 10)]),
      );
      return Response.json(Object.fromEntries(entries), { headers });
    }

    return new Response('not found', { status: 404, headers });
  },
};
```

`wrangler.toml`：

```toml
name = "beatai-counter"
main = "worker.js"
compatibility_date = "2026-05-20"

[[kv_namespaces]]
binding = "VIEWS"
id = "<填 wrangler kv namespace create VIEWS 后给出的 id>"

[vars]
# SALT 不放这里，用 wrangler secret put SALT 设置
```

## React 侧改动

### 1. 新增 `src/utils/viewCounter.js`

```js
const COUNTER_API = 'https://counter.beatai.org';

export async function hitArticle(slug) {
  try {
    const r = await fetch(`${COUNTER_API}/hit?slug=${encodeURIComponent(slug)}`, {
      method: 'POST',
      keepalive: true,
    });
    if (!r.ok) return null;
    const data = await r.json();
    return typeof data.count === 'number' ? data.count : null;
  } catch {
    return null;
  }
}

export async function fetchViews(slugs) {
  if (!slugs.length) return {};
  try {
    const r = await fetch(
      `${COUNTER_API}/views?slugs=${slugs.map(encodeURIComponent).join(',')}`,
    );
    if (!r.ok) return {};
    return await r.json();
  } catch {
    return {};
  }
}
```

`COUNTER_API` 走环境变量（`REACT_APP_COUNTER_API`），未配置时整个特性自动失活。

### 2. 改 `src/components/docs/DocContent.js`

在文章 markdown 加载成功后的 `useEffect` 里：

```js
useEffect(() => {
  if (!slug || !markdownContent) return;
  hitArticle(slug).then(count => {
    if (count !== null) setViews(count);
  });
}, [slug, markdownContent]);
```

把 `views` 透传给 `DocArticleHeader`。

### 3. 改 `src/components/docs/DocArticleHeader.js`

在日期/作者那一行后面追加：

```jsx
{views !== null && (
  <span className="text-zinc-500 text-sm">阅读 {views.toLocaleString()} 次</span>
)}
```

`views === null` 时完全不渲染，避免显示"阅读 0 次"对老文章造成"没人看"的尴尬印象。

## 三个还没决定的事

下面这三个开关需要你拍板，再开始动手：

### Q1：历史阅读量是否回填？

- **不回填**（推荐） —— 所有文章从 0 开始，简单干净。代价是上线第一天每篇都是 0
- **回填** —— 从已有的统计源（如果有 GA/Plausible/服务器日志）批量 `wrangler kv key put view:<slug> <n>`。但目前看不到现有的统计接入

### Q2：要不要给文章一个"基础值"？

- **不给**（推荐） —— 真实数据，慢慢涨
- **给** —— 比如发布每过 1 周加 50，避免老文章看起来都没人看。但这是造假数据，发现了会很难看

### Q3：展示位置

- **A 只在文章页**（最小可行） —— 头部日期旁，一处
- **B 文章页 + 列表页** —— 列表项也显示 `阅读 N 次`。需要在列表组件里调 `fetchViews` 批量拉
- **C 文章页 + 列表页 + 排行榜** —— 多一个"热门文章"区域。工作量明显加大

## 落地步骤（待用户确认后执行）

按顺序跑：

1. **Cloudflare 准备**（用户手工，约 10 分钟）
   - 注册 / 登录 Cloudflare（如果还没有账号）
   - `npm i -g wrangler && wrangler login`
   - `wrangler kv namespace create VIEWS`，记下返回的 namespace id
   - `wrangler secret put SALT`（输入一个随机字符串，例如 `openssl rand -hex 16` 的输出）
2. **Worker 代码** —— 仓库里新建独立目录 `services/counter/`（不进 React 构建产物）
   - 写 `worker.js`、`wrangler.toml`、`package.json`
   - `wrangler deploy`，先用默认 `beatai-counter.<account>.workers.dev` 跑通
3. **可选：自定义域名** —— 在 CF Dashboard 给 Worker 绑 `counter.beatai.org`（前提：`beatai.org` 已托管在 CF DNS）
4. **React 集成**
   - 加 `src/utils/viewCounter.js`
   - 改 `DocContent.js`、`DocArticleHeader.js`
   - 加 `.env` 变量 `REACT_APP_COUNTER_API=https://counter.beatai.org`（生产环境配在部署流程里）
5. **本地验证**
   - `npm start`，打开一篇文章，检查 KV 里 `view:<slug>` 是否变 1
   - 刷新页面，应保持为 1（去重生效）
   - 等 24h 或手工删除 dedupe key，验证再次计数
6. **生产部署**
   - 设好 `REACT_APP_COUNTER_API`，`npm run build && npm run deploy:gh`
7. **手动 smoke 测试**
   - 打开 3 篇不同分类的文章（ai-insights / docs / learn-claude-code），看数字
   - 看一遍 CF Dashboard 里 Worker 的 invocation 数和错误率

## 验证清单

- [ ] Worker 部署后能在 `*.workers.dev` 上响应 200
- [ ] CORS 在 `https://beatai.org` 和 `http://localhost:3000` 下都通
- [ ] CORS 在伪造 Origin 时返回 `https://beatai.org` 默认值
- [ ] 同一访客 24h 内只增一次
- [ ] KV 中 `dedupe:*` 24h 后自动过期
- [ ] 计数服务故障时，React 页面正常渲染（只是不显示数字）
- [ ] 列表页未启用 `fetchViews`（如果选 Q3.A）不发出任何额外请求

## 不做的事

- 不接入 GA / Plausible / Umami（用户明确拒绝第三方）
- 不做 Durable Object 强一致（KV 在博客流量下足够）
- 不存原始 IP / UA / referer，只存 IP+slug 的截断哈希
- 不做后台管理 UI（数据用 `wrangler kv key list` / Dashboard 查）
- 不做 RSS / sitemap 联动

## 成本估算

CF 免费版：

| 资源 | 免费额度 | 估算用量（1 万 PV/天） | 余量 |
|---|---|---|---|
| Workers 请求 | 100k/天 | ~10k 写 + ~10k 读 = 20k | 80% 余量 |
| KV 读 | 100k/天 | ~10k（去重查 + 读现值） | 90% 余量 |
| KV 写 | 1k/天 | ~10k（首访写 + 去重 PUT）| **超额** —— 需要观察 |
| KV 存储 | 1 GB | < 100 KB（517 篇文章） | 几乎不占 |

> 注意：写入 1k/天免费额度对 1 万 PV 是 **不够** 的。如果实际写入超出，会进入按量计费：$0.50 / 百万次。1 万 PV/天 ≈ 月 30 万写入 ≈ **$0.15/月**。如果你不想付这点钱，方案是把去重时间从 24h 拉长到 7 天，写入会大幅下降。

