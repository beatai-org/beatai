# material-pipeline v7：sub-list 重设计 + leaf 无脑契约

**日期**：2026-05-18

## 目标

用户在白天跑完一次完整流水线（5 篇）之后发现：再次触发"跑一遍"会把同样 5 篇重新 fetch + 重新翻译再发布 —— 浪费 chrome + LLM + 时间。要求修复重复处理的根因，并把 sub-list 设计成真正能跨日 / 跨多次跑提供 dedup 真相的耐久产物。后续延伸出多条新规则：

1. dedup 窗口必须**含当天**（同日多次跑也不能重复）
2. **每次** run.js 都拉新候选（删 `--refresh-list` / 复用旧 sub-list 路径）
3. sub-list **只增不减**，多次 run merge 进同一个文件
4. **fetch / handoff 无脑消费 orchestrator 给的列表**（删除"raw 已存在则跳过"等本地兜底），唯一 dedup 决策权在阶段 1
5. `limit` 是 **per-tag-per-day** 上限，不是 per-run；sub-list 单 tag 累计永不超 limit
6. sub-list JSON 只保留真相（`groups[*].articles`）+ 工具版本号；所有瞬时统计字段（剔除数、新增数、tag 状态等）一律实时计算并打到 stdout，不写盘缓存
7. 提供 `--skip-fetch` flag：写 sub-list 但不真跑 fetch / handoff，便于反复验证 sub-list 行为

## 计划

1. 把 dedup 窗口从「过去 N 天」改成「今天 + 前 N-1 天」，loop `i = 0` 起步
2. 删 `--refresh-list` flag 和"复用当日 sub-list"分支；每次都 `spawnSync` medium-sub
3. 计算「本次新增」=候选 ∖（dedup ∪ tag-full）；新增 merge 进当日 sub-list（保留之前条目）
4. fetch 阶段循环对象改为「本次新增」，删 `existsSync(mdPath)` 检查，删 `--force` flag
5. handoff candidates 只来自 fetch 阶段产出（`downloaded`）；不再回查 sub-list
6. merge 阶段对每 tag 做 `mg.articles.length >= mediumLimit → break`，dedup 阶段算 `remaining = mediumLimit - already` 作为本次 tag 的硬上限——双保险防 per-day 越限
7. 把 sub-list JSON schema 精简到 `{generator, groups}`；删 `fetchedAt / source / tagsConfig / limitPerTag / excludedFromLookback / droppedAs* / stats`
8. 加 `--skip-fetch`，写 sub-list 后立刻 `process.exit(0)`，跳过阶段 3-5
9. SKILL.md + docs/run.md 同步所有新规则；删除已下线 flag 的描述
10. 用 `--dry-run` 和 `--skip-fetch` 反复测试每条规则，最后跑一次跨日 dedup（手动把 5/18.json rename 为 5/17.json）

## 过程

- **首次 publish 失败 + 浪费成本**：盲跑 `node run.js`，5 篇 fetch + 翻译完成后 publish 时 5 条全 skip（dest 已存在）；调查发现是上午跑过同样配置的 ai tag → sub-list 已存在但 raw/ 被 cleanup 删了 → run.js 旧逻辑复用 sub-list 不做 dedup → 全部重抓重译。这是 v7 改造的直接触发点。
- **v7 第一轮（dedup 含当天 + 每次拉新 + merge）**：改 `collectRecentSubListSlugs` 循环边界；删 `--refresh-list`；写 sub-list 时 read existing + merge groups + 计算 newlyAdded；fetch / handoff 仅消费 newlyAdded。`--dry-run` 验证候选与今日 sub-list 求差集 = 0、不 fetch、不 handoff。
- **v7 第二轮（leaf 无脑契约）**：用户指出"fetch 不应该再判断'该不该 fetch'"——删 `existsSync(mdPath)` 检查、删 `--force` flag、删 `skipped` 数组；handoff candidates 从 `[downloaded, skipped]` 改成 `downloaded`。文档加入 "leaf 无脑契约" 段，与 SKILL.md 既有 "orchestrator vs leaf executors" 章节呼应。
- **重新触发流水线 + 真发了 2 篇**：跑一次完整流程（fetch `cloud-ant-colonies` + `have-we-reached-the-end-of-legacy-code` → translate → publish），dest viewpoint/2026-05-18/ 累计 7 篇，sub-list 累计 7 条。
- **per-tag-per-day limit bug**：用户改 config 到 `[ai, ai-agent] limit:5` 又跑一次后发现 sub-list `totalArticles: 17`（ai:10、ai-agent:7，都 > limit 5）。根因：旧 dedup 只用 `kept.length >= mediumLimit` 限制单次拉新，merge 时不看 existing。修复：算 `remaining = mediumLimit - already[tag]`，dedup 用 `kept.length >= remaining`；merge 阶段再加 `mg.articles.length >= mediumLimit → break` 防御。
- **手动清理超限数据**：sub-list 截断 ai/ai-agent 各保留前 5 篇（前者已发布，后者前 2 已发布 + 3 占位）；删 raw/ 5 个超限 slug 目录（用户决定不翻译这 5 篇）。
- **schema 精简**：用户问 "excludedFromLookback 为什么写进 sub-list" → 这些字段都是写盘时的瞬时快照，下次跑会被覆盖、误导读者。彻底剥离 `fetchedAt / source / tagsConfig / limitPerTag / excludedFromLookback / droppedAs* / stats.*`，sub-list JSON 只剩 `{generator, groups}`。所有统计实时算 + stdout。
- **会话规则锁定 + `--skip-fetch`**：用户宣布本次会话只测试 sub-list、不跑 fetch/translate。`--dry-run` 不写盘导致 merge 行为无法连续测试，加 `--skip-fetch`：阶段 1 正常写 sub-list、阶段 2 末尾 `process.exit(0)`。
- **跨日 dedup 验证**：手动把 5/18.json 重命名为 5/17.json，跑 `node run.js --skip-fetch`：候选 28 篇 = 8 dedup（命中昨日）+ 7 cap + 13 新增 ✓；新写的 5/18 ai/ai-agent 各拿满 5，llm 只能凑 3（因为 medium 推荐池里 llm 候选 8 篇有 5 篇在 5/17）。所有规则 saturate 验证通过。
- **dest 收尾清理**：用户决定只保留今日 3 篇（`cloud-ant-colonies` / `what-the-docs-dont-tell-you-about-claude-code-skills` / `have-we-reached-the-end-of-legacy-code`），删另 4 篇 md + images + 从 `_meta.json` 同步移除 4 条 item。

## 结果

修改文件：

- `.claude/skills/material-pipeline/scripts/run.js` — 完全重构：dedup 含当天、每次拉新、merge、per-tag-per-day limit、leaf 无脑、schema 精简、加 `--skip-fetch`（PIPELINE_VERSION 从 6.0.0 升到 7.0.0）
- `.claude/skills/material-pipeline/SKILL.md` — 版本号 + 核心规则 + leaf 契约 + per-tag-per-day limit
- `.claude/skills/material-pipeline/docs/run.md` — CLI flags / dedup 规则 / sub-list schema / 幂等性章节全部重写
- `.claude/skills/material-pipeline/materials/sub-list/2026-05-18.json` — 精简 schema 累计 13 篇 [ai:5 / ai-agent:5 / llm:3]
- `public/docs/ai-insights/_meta.json` — 5/18 section 移除 4 条不要的 item
- `public/docs/ai-insights/viewpoint/2026-05-18/` — 保留 3 篇 md + 3 个 images 子目录

新建文件：

- `.claude/skills/material-pipeline/materials/sub-list/2026-05-17.json` — 手动重命名留下的跨日 dedup 测试数据（15 篇）
- `docs/executions/2026-05-18-material-pipeline-v7-sublist-redesign.md` — 本文档

**验证方式**：

1. `node run.js --dry-run` — saturate 状态下 0 新增、不写盘、stdout 实时统计完整
2. `node run.js --skip-fetch` — 真写 sub-list 但不 fetch / handoff，可反复跑验证 merge 幂等
3. 手动 rename 5/18→5/17 后跑 `--skip-fetch` → 新 5/18 从 0 起步 + 8 dedup 命中 + 7 cap + 13 新增，全部对账归零
4. `cat sub-list/2026-05-18.json` 只看到 `generator` + `groups` 两个顶层键，零冗余字段

**遗留事项 / 后续约束**：

- AGENTS.md 实际**没有**加入"任务执行总结"强制规则章节（早上的 `2026-05-18-add-task-summary-rule-to-agents-md.md` 文档说加了，但 `head AGENTS.md` 看不到）—— 本次会话沿用"按规则该写就写"的语义，写了这份总结，但 AGENTS.md 本身的章节还需要单独 commit 修补
- 今天 dest 上 5 篇被删的文章已经被 sub-list 5/17.json 记录在 dedup 窗口里，未来 2 天不会被重抓——如想让它们重回流水线需要手动从 sub-list 删条目
- `--skip-fetch` 与 `--dry-run` 互斥，已加 args 校验
