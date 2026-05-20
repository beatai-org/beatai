# ai-insights 目录重新设计：档案页 + 精简 sidebar

**日期**：2026-05-19
**作者**：sunfei + Claude
**状态**：待审批，未实施

## 目标

把 ai-insights 的"浏览/发现"动作从 sidebar 搬到独立的档案页，让 sidebar 在文章数量从当前 29 篇扩展到几百、几千篇时仍然保持稳定的视觉密度。核心变化：

- 新增 `/ai-insights` 档案页，承担**全部浏览/发现**职责。按"日"分组的滚动流，最新日期在最顶部
- 档案页支持**两种视图**：卡片流（默认）和 README 式标题列表，用户可一键切换
- 文章阅读视图（`/ai-insights/<slug>`）的左侧 sidebar 收敛为"当前月份 + 返回档案"，不再罗列全部文章
- 右侧 `TableOfContents` 继续保留，作为阅读辅助
- 档案页**不提供搜索框**——浏览路径是日期 + tag 筛选；定向查找走全站 docsearch（顶部 header 已有）

不动数据层（_meta.json 结构、markdown 路径、路由 slug 全部保持不变）。

## 现状分析

按 10 篇/天的发布节奏：

| 时间 | 文章数 | 现 sidebar 行数（含 section 标题） |
|---|---|---|
| 现在 | 29 | ~33 |
| 1 个月后 | ~330 | ~350 |
| 半年后 | ~1800 | ~1830 |
| 1 年后 | ~3600 | ~3650 |

代码事实：

- `src/components/docs/Sidebar.js:332-347` 把 `meta.sections[]` 全量铺到 DOM，无虚拟滚动、无分页
- `src/components/docs/BookWorkspaceLayout.js:120-132` 在阅读视图里挂两份 Sidebar（desktop + mobile drawer），各自渲染全量列表
- `src/utils/docsMeta.js:7-16` 的 `normalizeCategoryMeta` 仅对 ai-insights 做了"section 顺序反转"，是当前唯一一处 ai-insights 专属逻辑
- 路由 `/ai-insights/<slug>` 走通配 `<Route path="/*" element={<Docs />}>`（`src/App.js:56`），由 `DocContent` 渲染
- `/ai-insights` 这条 URL 当前没有命中专门页面，会落入 Docs 默认行为（找不到匹配条目 → 重定向到首篇文章）
- `src/pages/Square.js:66` 的 `getFirstItemPath('ai-insights')` 把 ai-insights 卡片链接到"第一篇文章" —— 这条入口待重定向到档案页

已可复用的资产：

- `src/components/docs/TableOfContents.js` —— 文章 H2/H3 大纲，已挂在 `DocArticleLayout`
- `src/contexts/TagContext.js` + `src/pages/TagPage.js` —— 全站 tag 索引和单 tag 列表页，可作为 tag chip 数据源
- `src/utils/docsMeta.js` 的 `loadDocsMeta` —— 已带缓存，档案页可直接复用，不需要重复 fetch

## 方案

### 1. 新增档案页 `/ai-insights`

**路由**

在 `src/App.js` 通配路由前插入：
```jsx
<Route path="/ai-insights" element={<AiInsightsArchive />} />
```

注意：必须放在 `<Route path="/*" element={<Docs />}>` 之前，否则会被通配吃掉。

**组件**：`src/pages/AiInsightsArchive.js`（新增）

**布局**（单列，无左右 sidebar）：

```
┌────────────────────────────────────────────┐
│ AI 前沿学习                                 │
│ <description from meta>                    │
│                                            │
│ 全部 (29)  Claude Code (8)  Agent (6)      │  ← tag chips
│ Harness (4)  AI Coding (3)  ...            │
│                                  [卡片|列表] │  ← 视图切换
│                                            │
│ ──── 2026-05-19（5 篇） ────                │
│ ┌────────────────────────────────────────┐ │
│ │ Harness：企业被打造来迎接的时代              │ │
│ │ Fabio Yáñez Romero                      │ │
│ │ #...                                     │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ 不用更好的模型，也能造出更好的 AI            │ │
│ │ Sau Sheong                               │ │
│ └────────────────────────────────────────┘ │
│ ...                                        │
│ ──── 2026-05-18（3 篇） ────                │
│ ...                                        │
│ ──── 2026-03-27（1 篇） ────                │
│ ...                                        │
└────────────────────────────────────────────┘
```

**视图 2：README 式标题列表**（切换后）

```
┌────────────────────────────────────────────┐
│ AI 前沿学习                                 │
│ <description from meta>                    │
│                                            │
│ 全部 (29)  Claude Code (8)  Agent (6)  ... │
│                                  [卡片|列表] │
│                                            │
│ ## 2026-05-19                              │
│ - Harness：企业被打造来迎接的时代             │
│ - 不用更好的模型，也能造出更好的 AI            │
│ - Anthropic 的工程师说 "干掉 Markdown"...   │
│ - 为一团中等规模的混乱编写架构文档             │
│ - 两支团队，一次转向：AI 如何重塑我们...      │
│                                            │
│ ## 2026-05-18                              │
│ - 官方文档没告诉你的 Claude Code skills 真相 │
│ - 云端蚁群                                  │
│ - 我们已经走到 legacy code 的尽头了吗？      │
│                                            │
│ ## 2026-03-27                              │
│ - AI时代设计该何去何从                       │
│ ...                                        │
└────────────────────────────────────────────┘
```

列表视图的设计原则：

- 每个日期一个 H2（`## YYYY-MM-DD`），下接 markdown bullet 列表
- 一行一篇，只显示 title（无作者、无 tags、无卡片背景），密度最大
- title 即文章链接，整行可点
- 视觉风格贴近 readme.md，可一目十行地扫
- 标记当日数量（H2 同行小灰字 `5 篇` 等）

**交互行为**：

- tag chips：可多选，多选时取并集（任一命中即显示）；"全部"清空筛选
- 视图切换：右上角切换按钮（icon-only，卡片 / 列表两态），状态持久化到 `localStorage.aiInsightsView`
- 筛选状态写入 URL：`?tag=Claude%20Code,Agent`，便于分享
- 日期分块标题在筛选后仍渲染，但隐藏空分组（当日无命中即整组隐藏）
- 卡片/列表项点击 → `/ai-insights/<slug>` 阅读视图

**分组规则**：

- 按 item.publishedAt（已是 `YYYY-MM-DD` 字符串）精确分组到"日"
- 字符串字典序倒排即时间倒序，无需 Date 对象
- 同日内 items 顺序保持 `_meta.json` 已定的顺序（manifest 内即写入顺序）

**数据来源**：复用 `useMeta()` 拿到的 `categories.find(c => c.id === 'ai-insights')`，遍历 `sections[].items[]` 拍平后渲染。**不引入新的 fetch、不改 _meta.json 格式。**

### 2. 阅读视图的 sidebar 收敛

文件：`src/components/docs/Sidebar.js`

判断条件：`meta.id === 'ai-insights'`（书级，不是 article 级）

行为：

- **顶部** 加一行"← 返回 ai-insights 档案"（指向 `/ai-insights`）
- **section 列表** 改成只渲染**当前文章所在月份**那一节，其他月份全部不渲染
  - "当前月份"从 `location.pathname` 反查 meta 找到 active item，取其 section
- 月份内 items 全部展开，便于在同月内左右切换
- 不显示其他月份的折叠占位（视觉极简）

效果：sidebar 行数 ≤ 当月文章数（默认 ≤ 30 行），不会随总文章数增长。

### 3. Square 页入口指向档案页

文件：`src/pages/Square.js:66`

把 `href={getFirstItemPath('ai-insights')}` 改成 `href="/ai-insights"`。

### 4. 文章页内补一处"档案"返回入口（可选）

文章正文底部已有 `PaginationNav`（上一篇/下一篇），不动。可在 `PaginationNav` 同区域加一个"返回 ai-insights 档案"链接，给从外部直达文章页的访客提供二次浏览入口。

## 风险与权衡

| 风险 | 严重度 | 缓解 |
|---|---|---|
| 当前 tag 质量不均（多篇 2026-05 文章 tags 为 `[]`） | 中 | 档案页 tag chips 只用"出现 ≥2 次"的 tag，避免长尾噪音；无 tag 文章在"全部"视图下仍按日完整列出，不会被遮蔽 |
| 改 Square 链接是站点首屏可见的变化 | 低 | 风险点在视觉/动效，逻辑改动只 1 行 |
| sidebar 改成"仅当月" → 用户从 sidebar 无法跨月跳转 | 中 | 已通过新增"返回档案"入口 + URL 状态保留筛选条件补偿 |
| 路由 `/ai-insights` 当前会被 Docs 通配兜底 | 低 | 在 App.js 加专属 Route，放在 `/*` 通配之前即可 |
| 仅对 ai-insights 改 sidebar，rust-course / elon-book 不受影响 | 低 | 通过 `meta.id === 'ai-insights'` 判断，其他 book 渲染逻辑不变 |
| 直链/SEO：`/ai-insights/<slug>` 路径未变 | 无 | 文章页 URL 不变，外部链接全部可用 |

## 验证计划

按顺序：

1. **新档案页可访问** —— `/ai-insights` 渲染出标题 + tag chips + 视图切换按钮 + 按日分组的卡片列表
2. **日期分组排序**：最顶部的分块是当前数据里 `publishedAt` 最大的那一天（应为 `2026-05-19`），其下依次降序
3. **同日数量标记**：每个日期 H 旁边显示"N 篇"，与该组卡片实际渲染数一致
4. **筛选**：点击"Claude Code" tag → 只显示该 tag 的文章；再点击"Agent" → 显示两个 tag 的并集；空分组隐藏整组
5. **URL 状态**：含 `?tag=...` 的 URL 刷新后筛选状态保持
6. **视图切换**：
   - 默认进入档案页是卡片视图
   - 点击切换按钮 → 切到 README 式标题列表，每日 `## YYYY-MM-DD` + bullet 链接
   - 刷新页面后视图保持（localStorage 持久化）
   - 两种视图下 tag 筛选效果一致
7. **链接行为**：卡片或列表项点击 → 进入 `/ai-insights/<slug>` 阅读视图，文章内容正常渲染
8. **阅读视图 sidebar 收敛**：
   - 仅显示当月 section + 该 section 下的文章
   - 顶部有"← 返回 ai-insights 档案"链接
   - 其他月份不出现
9. **跨月跳转**：在阅读 2026-03 文章时，sidebar 仅显示 3 月文章；点"返回档案"回到 `/ai-insights`，日期分块仍完整
10. **Square 入口**：点击首页 ai-insights 卡片 → 落到 `/ai-insights`（不再是某一篇文章）
11. **其他书系不变**：随机访问 rust-course / elon-book 任意一篇文章，sidebar 仍是原样（全章节列表）
12. **移动端**：drawer Sidebar 同步收敛行为；档案页卡片在窄屏下单列堆叠；列表视图天然适配窄屏

## 不做的事

- 不动 `_meta.json` 结构或路径
- 不动 markdown 文件存储路径
- 档案页**不加搜索框**；定向查找走顶部 header 的全站 docsearch
- 不动 rust-course / elon-book 的 sidebar / 路由
- 不重写 TagPage（已存在）
- 不做分页/虚拟滚动（档案页一次渲染所有卡片/列表项；当 > 200 篇出现卡顿再加）

## 落地步骤

1. 新建 `src/pages/AiInsightsArchive.js` + `AiInsightsArchive.css`
   - 内含按日分组逻辑、视图状态、tag 状态、URL 同步
2. 新建 `src/components/aiInsights/ArchiveCard.js`（卡片视图，~40 行）
3. 新建 `src/components/aiInsights/ArchiveList.js`（README 列表视图，~30 行）
4. 新建 `src/components/aiInsights/TagChipBar.js`（tag chip 横排 + 状态，~50 行）
5. 新建 `src/components/aiInsights/ViewToggle.js`（卡片 / 列表切换按钮，~25 行）
6. `src/App.js` 注册 `/ai-insights` 路由
7. `src/components/docs/Sidebar.js` 加 ai-insights 分支：返回链接 + 仅当月 section
8. `src/pages/Square.js:66` 改链接目标
9. 端到端浏览器验证（按上文验证计划 12 项）
10. 提交，commit message 草案：
   - `feat(ai-insights): add archive page at /ai-insights with card + list views`
   - `feat(ai-insights): collapse sidebar to current-month-only in article view`
   - 两个 commit，便于回滚

## 后续可选迭代（不在本次范围）

- 档案页加"按 tag 分组""按作者分组"视图（当前仅按日分组）
- 列表视图加可选的密度调节（仅 title / title+作者 / title+作者+tags）
- 文章页 sidebar 末尾加"本月其他文章"折叠卡片，覆盖跨月探索
- 文章 > 500 篇时上分页或虚拟滚动
- 文章 > 1000 篇时把月份索引拆成独立 `_meta.json`（之前讨论的 Level 3），由档案页和 sidebar 共用懒加载
