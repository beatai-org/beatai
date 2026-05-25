# 2026-05-25：内容层（书 / 教程集合 / 顶栏）统一架构落地，并为 LCC MDX 化准备

> 这份文档是「上一轮重构」交给「下一轮 LCC MDX 化」的交接说明。新对话只要把它当首条输入投喂进去就能直接接着干活，不需要回看历史会话。

## 0. 这次干完了什么（high-level）

把站内书籍/教程集合/顶栏/广场卡片，从「4 套并行机制 + 散落在 pageConfig / 各 hub / public JSON 的写法」收敛成**三张数据表 + 一个查询层 + 一套渲染管线**。删了 ~900 行代码，新增 ~370 行，净瘦 -500+。所有 URL / 路由 / 测试都通了。仓库 main 分支已合入三个 commit：

| Commit | 标题 |
|---|---|
| `2f2eb5f` | feat(content): add /mba hub and unify tutorial-hub infrastructure |
| `c7f5b57` | refactor(content): unify books, collections, and routing into one data layer |
| `cfd01e0` | refactor(content): clean up vestigial spaces/categories plumbing |

下一步：**把 Learn Claude Code 这本 `contentKind: 'mdx'` 的书真正 MDX 化**——这是当前唯一一本 mdx 书，也是 BOOKS schema 上唯一一个还没真正同构的点。MDX 化做完之后，整个内容子系统就是「不论什么书都走同一条路径」。

---

## 1. 当前架构（必读，新对话直接读这一节就能上手）

### 1.1 三张数据表 + 查询层（`src/content/`）

```
src/content/
├── books.js         BOOKS：每一本书的注册表
├── collections.js   COLLECTIONS：教程集合（hub）
├── topNav.js        TOP_NAV：顶栏配置（书 / 集合 / 路由 的引用清单）
├── squareCards.js   SQUARE_CARDS：广场卡片（同 TOP_NAV 引用风格）
└── index.js         查询接口（所有路由 / 导航 / breadcrumb 的入口）
```

**Book schema**（`src/content/books.js`）：
```js
{
  id, slug,
  contentKind: 'markdown' | 'mdx',     // ← 决定走 MarkdownBookContent 还是 MdxBookContent
  title, bookTitle, description,
  metaFile,          // 指向 public/docs/.../_meta.json（mdx 书可为 null）
  defaultEntry,      // 默认落点（书内相对路径）
  cardLabel?, cardMeta?, cardCta?,     // 在集合卡片墙上的显示
  githubRepo?        // 顶栏 github 图标的来源
}
```

**Collection schema**（`src/content/collections.js`）：
```js
{ id, slug, basePath, title, description, bookIds: [...] }
```

**TOP_NAV schema**：`{ kind: 'book' | 'collection' | 'route', id? | label?+href? }`

**SQUARE_CARDS schema**：`{ kind: 'book' | 'route', icon, bookId? | href?, title, description }`

**`content/index.js` 暴露的关键函数**：
- `getBookById(id)` / `getCollectionById(id)`
- `getCollectionOfBook(bookOrId)` / `getBooksOfCollection(collectionOrId)`
- `getBookBasePath(book)` — 无集合 → `/<slug>`；有集合 → `/<collection.basePath>/<slug>`
- `getBookDefaultUrl(book)` — `basePath + '/' + defaultEntry`
- `getBookByPathname(pathname)` / `getCollectionByPathname(pathname)`
- `getTopNavItems()` / `getActiveTopNavItem(pathname)`
- `getSquareCards()`

### 1.2 路由完全由数据生成（`src/App.js`）

```jsx
{/* 集合 hub 卡片墙 */}
{COLLECTIONS.map(c => <Route path={c.basePath} element={<CollectionPage collection={c} />} />)}

{/* 每本书一条路由 */}
{BOOKS.map(b => <Route path={`${getBookBasePath(b)}/*`} element={<BookPage book={b} />} />)}

{/* AI Insights archive（feed 视图，跟书的文章页正交，独立一条） */}
<Route path="/ai-insights" element={<AiInsightsArchive />} />

{/* 兜底：未匹配 → NotFound */}
<Route path="/*" element={<NotFound />} />
```

> 新加一本书 = 在 `books.js` 加一条；新加集合 = 在 `collections.js` 加一条；顶栏 / 广场加项 = 在对应表加一行。**`App.js` / `pageConfig.js` / `routeModuleLoaders.js` 都不用动。**

### 1.3 渲染管线（`src/pages/`）

```
BookPage ──► 按 book.contentKind 分发
              ├─ 'markdown' → MarkdownBookContent  ─► DocsLayout ─► DocContent ─► DocMarkdownRenderer
              └─ 'mdx'      → MdxBookContent       ─► LearnClaudeCode（LCC 现行实现，待 MDX 化）

CollectionPage ──► 读 collection.bookIds → 卡片墙
```

- `MarkdownBookContent.js`：纯 markdown 书的唯一渲染器。读 `book.metaFile` 的 `_meta.json`，用 `DocsLayout` 包外壳，内部 `<Route path="*" element={<DocContent />} />`。每本 markdown 书走这一条路径——`rust-course` / `ai-insights` / `deep-learning` / `agent-harness` / `elon-book` 都是。
- `MdxBookContent.js`：当前只是 `<LearnClaudeCode book={book} />` 的薄壳（11 行）。这是 LCC MDX 化后的**唯一改动落地点**。
- `LearnClaudeCode.js`：LCC 现行实现，复用 `BookWorkspaceLayout` + 自己的 sidebar + `<VersionPage>`。
- `CollectionPage.js`：通用 hub 卡片墙，只认 `collection.bookIds`。

### 1.4 顶栏 / 广场 / breadcrumb 的数据来源

- 顶栏：`getTopNavItems()` → 由 TOP_NAV 引用反查得到 `{id, label, href}` 列表
- 顶栏 active 高亮：`getActiveTopNavItem(pathname)` 最长前缀匹配
- 顶栏 github icon：`getBookById(activeNavItem.id)?.githubRepo`
- breadcrumb parentTitle：`getCollectionOfBook(book.id)?.title || ''`
- 广场卡片：`getSquareCards()`
- LCC sidebar 层级配置：`src/vendor/learn-claude-code/sidebarConfig.js` 的 `LCC_SIDEBAR_SECTION_GROUPS`

### 1.5 已删除的东西（重要！不要尝试用这些名字）

| 已删除 | 替代 |
|---|---|
| `src/pages/Docs.js` | BookPage 路由（每本书一条） |
| `src/pages/LearnAiDocsBook.js` | MarkdownBookContent |
| `src/pages/TutorialBook.js` | App.js 中 BOOKS.map 直接 mount BookPage |
| `src/pages/TutorialsHubPage.js`、`AITutorials.js`、`MbaTutorials.js` | CollectionPage |
| `src/utils/learnAiSpaces.js` / `mbaSpaces.js` / `tutorialHubs.js` | `src/content/books.js` + `collections.js` |
| `src/utils/learnAiPaths.js` / `mbaPaths.js` | `getBookBasePath` / `getBookDefaultUrl` 等 in `content/index.js` |
| `src/utils/topNav.js` | `src/content/topNav.js` + `getTopNavItems()` |
| `src/utils/knowledgeSpaces.js` | 整个文件删了——buildKnowledgeSpaces / findActiveKnowledgeSpace / getAiTutorialSpace 全部失效 |
| `src/hooks/useCategoryNavigation.js` | 无消费者，删 |
| `public/docs/_meta.json`（顶级） | docsMeta.js 改为从 BOOKS 动态构建根 meta |
| `PAGE_IDS.aiTutorials` / `mbaTutorials` / `learnAiBook` / `mbaBook` / `learnClaudeCode` | 替成 `PAGE_IDS.bookPage` / `collectionPage`（组件级 chunk key） |
| `book.lcc` 字段（曾在 books.js） | 挪到 `vendor/learn-claude-code/sidebarConfig.js` |
| `SQUARE_CONTENT_CARDS` from pageConfig.js | `src/content/squareCards.js` |
| `buildKnowledgeNavigationModel` / `getAiTutorialNavigationSpace` | 删 |
| `buildLearnAiDocsMeta` → 改名 `buildBookCategoryMeta`，参数也改了 |
| `buildLearnAiDocsRouteValidationModel` → 改名 `buildBookRouteValidationModel` |

PageShell / BookWorkspaceLayout / DocsLayout 全都不再接收 `spaces` / `activeSpace` / `onSpaceClick` / `categories` / `activeCategory` / `onCategoryClick` 这套 prop。

### 1.6 测试 / 验证

- `cd /Users/sunfei/development/beatai && CI=true npm test -- --watchAll=false` 跑全套（44/44 应通过）
- `(BROWSER=none PORT=3456 npm start &) > /dev/null 2>&1` 在后台启 dev server，等到 `curl -sf http://localhost:3456 >/dev/null` 返回 200。注意 `npm start` 不能前台跑，要后台。
- 烟测一条命令：
```bash
for u in / /square /ai-insights /ai-insights/why-claude-code-is-so-good \
  /rust-course/about-book /learn-ai /learn-ai/learn-claude-code \
  /learn-ai/learn-claude-code/preface /learn-ai/deep-learning/chapter-01/lesson-01 \
  /learn-ai/agent-harness/chapter-01/lesson-01 /mba /mba/elon-book/about \
  /learn-claude-code/s01 /no-such-path; do
  echo "$(curl -sf "http://localhost:3456$u" -o /dev/null -w '%{http_code}')  $u"
done
```
全部 200 才算 OK（最后那个 `/no-such-path` 走 SPA shell，由 React Router 内部渲染 NotFound）。
- 跑完 dev server 记得：`lsof -ti:3456 | xargs -r kill`

---

## 2. 下一步任务：LCC 真 MDX 化

### 2.1 任务定义

**目标**：把 `<LearnClaudeCode />` 现行那套读 `vendor/learn-claude-code/data.js` + `VersionPage` 多 tab 的实现，替换成「正常的 MDX 书」。完成的硬指标：

1. `MdxBookContent` 不再是 LearnClaudeCode 的壳；它（或将来叫 `MdxBookContent`）变成**通用 MDX 渲染器**，跟 `MarkdownBookContent` 在主结构上对称——读 `book.metaFile`，按 `_meta.json` 渲染 sidebar，按 URL 选 `.mdx` 文件，挂到 `DocsLayout` 里。
2. `vendor/learn-claude-code/data.js` 里 `LEARNING_PATH` / `VERSION_META` / `ANNOTATIONS` / `SCENARIOS` / `docsData` / `versionsData` / `EXECUTION_FLOWS` / `getFlowForVersion` 全部消失。每一节的「文档 + 模拟器 + 代码视图 + 设计决策」**都内嵌在该节 .mdx 文件里**。
3. `book.lcc` / `sidebarConfig.js`（`LCC_SIDEBAR_SECTION_GROUPS`）变成普通 `_meta.json` 的 `sections[]` 描述，跟其他 markdown 书写法一致。
4. `src/pages/LearnClaudeCode.js`、`src/components/learnClaudeCode/VersionPage.js` / `versionUtils.js` / `sidebarMeta.js` / `docUtils.js` 整体可以删（或瘦身到几行）。
5. 新增第 2 本 mdx 书时**零特例**——只是在 `books.js` 加一条 `contentKind: 'mdx'` 的 entry。

### 2.2 LCC 现状（要继承的功能 + 必须保持兼容的地方）

**URL**：`/learn-ai/learn-claude-code/<version>`，version ∈ `{preface, s01..s12, bp01}`。**MDX 化后 URL 必须保持不变**，避免外链 404。也就是说 `_meta.json` 里每一节的 `path` 必须就是这个值。

**legacy URL**：`/learn-claude-code/<version>` 需要 301 到新 URL。当前是 `App.js` 的 `LegacyLearnClaudeCodeRedirect`，保持。

**内容文件**（迁移源）：
- `public/docs/llc-content/zh/{preface,s01..s12,bp01}.md` ——共 14 个文件，这是「Learn」tab 里展示的 markdown。
- 注意：`bp01.md` 跟 `s01..s12` 平级，但出现在 sidebar 的「最佳实践」分组（不是「从零手搓 Claude Code」分组）。

**Sidebar 结构**（要在 `_meta.json` 里复刻）：
```
从零手搓 Claude Code
├── Preface (preface)
├── Tools & Execution
│   ├── S01 The Agent Loop
│   └── S02 Tool Dispatch
├── Planning
│   ├── S03 TodoWrite
│   ├── S04 ...
│   └── ...
├── Memory (S06)
├── Concurrency (S08)
└── Collaboration (S09–S12)

最佳实践
└── BP01 Claude Code 最佳实践指南
```
具体每层叫什么、含哪几个 version：见 `vendor/learn-claude-code/data.js:LAYERS` + `zhMessages.layer_labels`。

**每节的「Tabs」**（在当前 `VersionPage` 里）：
- **Learn**：`.md` 渲染（必备，所有 14 节）
- **Simulate**：交互模拟（只在 `SCENARIOS[version]` 存在时显示）。组件 = `<AgentLoopSimulator>`（s01）/ 各种 visualizations（`vendor/learn-claude-code/visualizations/s01..s12-*.tsx`）。
- **Code**：源码浏览（只在 `versionsData.versions.find(v => v.id === version)?.source` 存在时显示）。组件 = `<SourceViewer>`。
- **Deep Dive**：执行流 + 设计决策（只在 `getFlowForVersion(version)` 或 `ANNOTATIONS[version]?.decisions?.length` 时显示）。组件 = `<ExecutionFlow>` + `<DesignDecisions>`。

各 tab 由 `getVersionTabs(version, versionData)` 算出来。

**LCC 用到的 React 组件**（这些是要被 MDX 嵌进 .mdx 文件的）：
- `src/components/learnClaudeCode/AgentLoopSimulator.js`
- `src/components/learnClaudeCode/ExecutionFlow.js`
- `src/components/learnClaudeCode/DesignDecisions.js`
- `src/components/learnClaudeCode/SourceViewer.js`
- `src/vendor/learn-claude-code/visualizations/s01-agent-loop.tsx` 等 12 个 visualization（`SessionVisualization` 是统一入口）
- `src/components/comments/GiscusComments.js`（每节文末的评论区）

**i18n**：`vendor/learn-claude-code/data.js:zhMessages` 提供 layer 名 / tab 名 / session 名等中文字符串。MDX 化后这些字符串散到各 `.mdx` 里写死中文即可，i18n 暂不做。

### 2.3 推荐迁移路径

1. **引入 MDX 工具链**：`@mdx-js/react` + `@mdx-js/loader`（或 `@mdx-js/rollup` / `@mdx-js/esbuild` 看 CRA 实际打包器）。**CRA 直接装 MDX 有可能踩坑**（webpack loader 配置 / async/await syntax），可能要 craco 或 vite 切换。先做调研，告知用户取舍。
2. **新建一本验证用的 mdx 书 placeholder**：例如 `mdx-playground` 加入 BOOKS，单文件 mdx，确认渲染 + sidebar + URL 全部对上后，再开始迁 LCC。
3. **写通用 `MdxBookContent`**：参考 `MarkdownBookContent`，差别只是用 MDX 编译器替换 `DocMarkdownRenderer`。MDX provider 通过 `useMDXComponents()` 暴露可嵌组件（h1/h2/p 等 + 业务组件 AgentLoopSimulator 等）。
4. **逐节迁内容**：
    - `public/docs/llc-content/zh/preface.md` → `.mdx`，前置只有 markdown。
    - `s01.md` → `.mdx`，文末加 `<AgentLoopSimulator />` / `<ExecutionFlow flow={...} />` / `<DesignDecisions items={...} />` 等。
    - tab 是否仍然要分 4 个？两条路：(a) 保持 tabs 但 tabs 是 MDX 组件 `<Tabs>` 由文章作者自己写；(b) 干掉 tabs，把 Simulate / Code / Deep Dive 内容直接嵌正文。**建议跟用户先选一条**。
5. **生成 `_meta.json`**：`public/docs/llc-content/_meta.json`（新建），描述「从零手搓 Claude Code」+「最佳实践」两段 + 14 节，每个 item 给 `path` `file` `title`。书的 `metaFile` 指向它。
6. **删除老 LCC 代码**：`LearnClaudeCode.js` / `VersionPage.js` / `versionUtils.js` / `sidebarMeta.js` / `docUtils.js` / `vendor/learn-claude-code/data.js` 大部分 / `sidebarConfig.js`。`MdxBookContent.js` 单文件实现 = LCC 不再特殊。
7. **保留 visualization 组件**：移到 `src/components/learnClaudeCode/visualizations/` 之类的位置，作为可嵌入 MDX 的 React 组件继续存在；它们的数据可以保留为 ts/js 模块。

### 2.4 已知的硬骨头

- **CRA + MDX 兼容性**：CRA 默认 webpack 没有 MDX loader，要么 eject、要么 craco-override。**优先调研可行性**，给出代价评估。如果代价过大，备选方案是用 remark-mdx 自定义 transformer 在 markdown 文件里支持 `<Component />` 内嵌，跳过完整 MDX 生态。
- **annotations / scenarios / flows 的数据形态**：当前是 JS 模块（`vendor/learn-claude-code/data/annotations` / `scenarios` / `EXECUTION_FLOWS`）。迁到 .mdx 之后这些数据要么在 .mdx 里以 frontmatter / import 形式出现，要么把组件改成自己读数据（`<DesignDecisions versionId="s01" />`）。后者改动更少。
- **search / tag index**：MarkdownBookContent 经 `_meta.json` 的 sections+items 参与 tag/article 索引；LCC 现在不进这套（它有自己一套）。MDX 化后 LCC 跟其他书一样进索引，副作用：站内搜索/标签页里会出现 LCC 文章——多半是好事，但要确认。
- **Reading mode**：LCC 的 BookWorkspaceLayout 支持 reading mode。MDX 化后改成 DocsLayout 路径要确认 reading mode 仍然工作（DocsLayout 内部也用 BookWorkspaceLayout，理论上 ok）。

### 2.5 先问用户的事

进入实施前要问：
1. **CRA 转 Vite / craco / 保持 CRA + 手搓 MDX loader？** 取决于 1–2 小时调研。
2. **保留 4-tab 结构 vs 摊平到正文？** 摊平更清爽；保留 tab 更接近现状用户体验。
3. **范围：只 LCC，还是顺便给 `agent-harness` 也做 MDX 升级 demo？**

---

## 3. 仓库当前状态

- 分支：`main`，干净（无未提交改动）
- 最近 3 个相关 commit：见 §0
- 测试：`npm test` 44/44 通过
- 上一轮的计划文件：`/Users/sunfei/.claude/plans/ai-wiggly-iverson.md`（已经实施完，仅供查阅；新对话不需要读它）

## 4. 可以直接复用的查询接口（小抄）

```js
import {
  // data
  BOOKS, COLLECTIONS, TOP_NAV, SQUARE_CARDS,
  // book/collection lookups
  getBookById, getCollectionById,
  getCollectionOfBook, getBooksOfCollection,
  getBookBasePath, getBookDefaultUrl,
  getBookByPathname, getCollectionByPathname,
  // nav / square projections
  getTopNavItems, getActiveTopNavItem,
  getSquareCards
} from '../content';
```

```js
import { buildBookCategoryMeta, buildBookRouteValidationModel } from '../domain/docs';
```

## 5. 用户偏好（这次对话观察到的）

- 喜欢「最抽象统一、简洁清晰」的设计，会主动质疑残留的不对称
- 重构前先 commit 备份
- 大变更前会问「下一步做什么」，希望得到带 ROI 排序的菜单 + 推荐
- 实施期间偏好流水推进；不需要每步问确认，但完成阶段会要 commit
- 中文沟通；技术输出要简练、带具体文件路径和行号
- 不要主动 commit，除非用户说 commit
- 让 dev server 真的跑起来 + curl 烟测每条 URL 是验证标准；浏览器视觉确认由用户自己做

新对话开场建议：「**已读 2026-05-25 那份交接说明。我现在站在 `main` 分支 commit `cfd01e0`，下一步开 LCC MDX 化。先调研 CRA + MDX 的兼容性 + 给两条迁移路径，再问你 §2.5 那三个问题。**」
