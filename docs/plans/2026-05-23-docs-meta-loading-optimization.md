# Docs Meta 加载架构优化

**日期**：2026-05-23
**作者**：sunfei + Codex
**状态**：待实施，未来优化

## 背景

当前内容系统以 `_meta.json` 作为事实源。这个方向是对的，但加载粒度偏粗：访问某个文章或栏目时，代码容易为了定位路径、生成侧栏、构建标签索引而加载整套 docs meta。

现在主要 meta 文件体积大致为：

| 文件 | 体积 |
|---|---:|
| `public/docs/rust-course/_meta.json` | 约 62.5 KB |
| `public/docs/ai-insights/_meta.json` | 约 44.9 KB |
| `public/docs/learn-ai/deep-learning/_meta.json` | 约 28.3 KB |
| `public/docs/_meta.json` | 约 0.7 KB |

问题不在单个文件特别大，而在加载链路上：直达一篇文章时，理想情况应该只需要知道当前 path 对应哪个 markdown 文件，以及当前栏目需要哪个 meta；不应该默认把所有书籍的目录都拉下来。

## 目标

把 docs meta 从“全量事实源一次性加载”优化为“三层索引”：

1. 根 manifest：只描述有哪些内容空间。
2. route index：用很小的索引从 URL path 定位文章文件和所属栏目。
3. category meta：只在需要侧栏、档案页、标签页时按需加载当前栏目完整目录。

最终效果：

- 直达文章时不加载无关书籍的 `_meta.json`
- `/ai-insights` 只加载 `ai-insights` 需要的数据
- `/learn-ai/deep-learning/...` 只加载 deep-learning 的目录
- 页面组件消费 normalize 后的干净数据
- 未来可以继续生成 tag index、search index、content manifest

## 现状

`src/utils/docsMeta.js` 目前的 `resolveDocsMeta` 会在根 meta 包含 `books` 时，并行加载每个 book 的 `metaFile`，再合成完整 `categories`。

这让调用方很方便，但也带来两个问题：

1. **直达文章链路过重**：打开单篇文章前，先等待所有 book meta 完成。
2. **职责混合**：一个 loader 同时负责根 manifest、category meta、完整 categories 合成。

此外，`_meta.json` 既承担导航、文章定位、标签、档案页列表，又承担部分文章卡片摘要和封面数据。随着内容增长，这些职责应该逐步拆分。

## 目标架构

### 1. 根 manifest

保留 `public/docs/_meta.json`，但明确它只做内容空间清单：

```json
{
  "title": "BeatAI Docs",
  "books": [
    {
      "id": "ai-insights",
      "title": "AI 前沿学习",
      "description": "...",
      "entryPath": "/ai-insights",
      "metaFile": "/docs/ai-insights/_meta.json",
      "githubRepo": "https://github.com/beatai-org/beatai"
    }
  ]
}
```

约束：

- 不包含 `sections`
- 不包含文章列表
- 不包含 tag index
- 只服务顶部导航、内容空间选择和 fallback 信息

### 2. Route Index

新增生成产物：`public/docs/_route-index.json`。

建议结构：

```json
{
  "/ai-insights/building-an-agent-harness": {
    "categoryId": "ai-insights",
    "metaFile": "/docs/ai-insights/_meta.json",
    "file": "/docs/ai-insights/2026-05/22/building-an-agent-harness.md",
    "title": "Building an Agent Harness",
    "publishedAt": "2026-05-22"
  }
}
```

用途：

- 直达文章时快速找到 markdown 文件
- 判断路径是否合法
- 找到所属 category 和 category meta 文件
- 支持 hover/touch 预取当前文章 md

设计要求：

- 只放打开文章必需的最小字段
- 不放完整 section/items
- 不放长 summary
- 不放 contributors 这类展示细节
- 生成过程要从 category meta 派生，避免手写维护

### 3. Category Meta

各栏目自己的 `_meta.json` 继续保留完整结构：

```text
public/docs/ai-insights/_meta.json
public/docs/rust-course/_meta.json
public/docs/learn-ai/deep-learning/_meta.json
```

它们继续负责：

- 侧栏 sections/items
- 档案页文章列表
- tags
- cover / summary / contributors / publishedAt
- category 内部 prev/next navigation

但加载策略改为按需：

- 进入 `/ai-insights` 档案页：加载 root manifest + `ai-insights/_meta.json`
- 进入 `/rust-course/...`：加载 route index + `rust-course/_meta.json`
- 进入单篇文章：先用 route index 找 md，文章先渲染；侧栏需要时再补当前 category meta
- 进入 tag 页：第一阶段可继续加载所有 category meta；第二阶段再生成独立 tag index

## Loader 设计

建议新增或重构为以下边界：

| 模块 | 职责 |
|---|---|
| `docsManifest.js` | 加载/缓存根 manifest |
| `docsRouteIndex.js` | 加载/缓存 route index，提供 path lookup |
| `docsCategoryMeta.js` | 按 `categoryId` 或 `metaFile` 加载单个 category meta |
| `docsMetaNormalizer.js` | 拆成 manifest / routeIndex / categoryMeta 三类 normalize |

需要保留兼容层：

- `loadDocsMeta()` 可以暂时保留，但不要作为新代码首选
- 老测试和老页面逐步迁移
- 迁移完成后再删除全量合成行为

## 页面加载策略

### 文章页

目标链路：

1. 根据 `location.pathname` 查 route index
2. 拿到 `file` 后立即加载 markdown
3. 用 route index 的 `title` 先生成初始 SEO/title
4. 后台加载当前 category meta
5. category meta 到达后补齐侧栏、tags、prev/next、contributors 等细节

这样即使 category meta 慢，文章正文也可以先出来。

### 档案页

`/ai-insights` 不需要所有书籍目录，只需要：

1. root manifest 生成顶部导航
2. `ai-insights/_meta.json` 生成列表、标签筛选和卡片

### Learn AI Docs Book

`/learn-ai/:space/*` 使用当前 space 配置中的 `docsMetaFile`，不需要先合成全部 docs meta。

如果顶部导航需要展示所有内容空间，只加载 root manifest 即可。

### Tag 页

第一阶段：

- 继续懒加载全部 category meta，保持行为不变
- 不放在文章首屏链路上

第二阶段：

- 生成 `public/docs/_tag-index.json`
- tag 页直接读 tag index
- 点击文章时再根据 route index 加载对应 md

## Normalize / Schema 边界

需要把数据清洗放在 loader 边界，而不是页面组件里到处防御。

建议拆出三类 normalize：

1. `normalizeDocsManifest(raw)`
   - `books[]`
   - `id`
   - `title`
   - `description`
   - `entryPath`
   - `metaFile`

2. `normalizeDocsRouteIndex(raw)`
   - path 必须以 `/` 开头
   - `categoryId` 必须非空
   - `metaFile` 必须指向 `/docs/.../_meta.json`
   - `file` 必须指向 markdown 或为空
   - title/publishedAt 标准化

3. `normalizeDocsCategoryMeta(raw)`
   - 沿用当前 category/section/item normalize
   - 继续处理 `path`、`file`、`entryPath`、`tags`、`contributors`、`publishedAt`
   - 保持 `ai-insights` 时间倒序逻辑

## 生成脚本

新增脚本建议：

```text
scripts/generate-docs-indexes.mjs
```

职责：

1. 读取 `public/docs/_meta.json`
2. 遍历每个 `book.metaFile`
3. 读取并 normalize category meta
4. 遍历 sections/items/children
5. 生成：
   - `public/docs/_route-index.json`
   - 后续可选：`public/docs/_tag-index.json`
   - 后续可选：`public/docs/_content-manifest.json`

package script：

```json
{
  "scripts": {
    "generate-docs-indexes": "node scripts/generate-docs-indexes.mjs"
  }
}
```

未来可以接到内容同步脚本之后执行，避免手工忘记更新索引。

## 分阶段实施

### Phase 1：新增 route index，不改主流程

- 增加生成脚本
- 生成 `_route-index.json`
- 加 route index loader 和测试
- 不改页面行为

收益：低风险建立基础设施。

### Phase 2：文章页使用 route index 定位 markdown

- `DocContent` 优先从 route index 获取 `file`
- category meta 慢时，文章正文仍可加载
- 当前 meta entry 作为增强数据，不作为正文加载前置条件

收益：直接改善直达文章的等待时间。

### Phase 3：Docs / Archive 按 category meta 加载

- `Docs` 不再默认合成所有 categories
- `AiInsightsArchive` 只加载 `ai-insights/_meta.json`
- `LearnAiDocsBook` 只加载当前 space meta
- 顶部导航从 root manifest 构建

收益：降低各路由无关数据加载。

### Phase 4：Tag/Search 独立索引

- 生成 `_tag-index.json`
- 后续可生成搜索轻量索引
- tag 页不再需要全量 category meta

收益：进一步降低内容系统整体耦合。

## 验证计划

每个 phase 都至少验证：

1. `npm test -- --watchAll=false`
2. `npm run build`
3. 浏览器 smoke test：
   - `/ai-insights`
   - 任一 ai-insights 文章
   - 任一 rust-course 文章
   - `/learn-ai/deep-learning/chapter-01/lesson-01`
   - `/tags/AI`
4. 网络面板确认：
   - 直达 ai-insights 文章不下载 rust-course meta
   - 直达 rust-course 文章不下载 ai-insights meta
   - `/ai-insights` 不下载 deep-learning meta
5. 功能确认：
   - 侧栏正常
   - tags 正常
   - prev/next 正常
   - reading mode 正常
   - 页面 title/description 正常

## 风险与回滚

风险：

- 路径匹配和 encode/decode 行为可能出现差异
- 分类首页重定向可能依赖旧的完整 meta
- tag 页如果过早迁移，容易漏文章
- route index 生成脚本如果没有接入内容发布流程，可能出现索引落后于 meta

控制方式：

- 第一阶段只新增索引，不改行为
- loader 保留旧 `loadDocsMeta()` fallback
- 每次迁移一个页面，不混在一次大改里
- route index 测试覆盖中文路径、空格、encodeURI、children/items 嵌套

回滚：

- Phase 1 可直接删除生成产物和 loader
- Phase 2/3 保留旧全量 loader fallback，必要时切回旧链路

## 不做的事

- 不修改任何 markdown 内容
- 不改变现有 `_meta.json` 的手写字段语义
- 不一次性重写全部 docs loader
- 不把 tag/search/cache 全部塞进同一个 PR
- 不改 `.claude/skills` 下 material-pipeline 内容

## 推荐 commit 拆分

1. `chore(docs): generate docs route index`
2. `feat(docs): load article source from route index`
3. `perf(docs): lazy load category meta by route`
4. `perf(docs): add generated tag index`

每个 commit 都应独立可构建、可回滚。
