# Plan: material-pipeline 移除 .html 生成，publish-html.js → publish.js

> 状态：**未执行**。2026-05-18 提出，归档以备后续跟进。

## Context

2026-05-18 的工作流已经把飞书卡片链接从 GitLab Pages URL 切到 GitLab blob URL（`gitlab.chehejia.com/sunfei/beatai/-/blob/master/{date}/{slug}.md`）。blob 视图自带 markdown 渲染 + 相对图片路径解析，不再依赖 GitLab Pages，因此：

- **不再需要 .html**：当前 `publish-html.js` 第 212-231 行 spawn render-html 生成 .html，对 blob URL 链路完全多余
- **render-html skill 不该被废弃**：它是独立兄弟 skill，可能有其它用途；只是 material-pipeline 不再调用它
- **不再需要 GitLab Pages CI 检查**：push-lark.js 已经把 CI 检查做成「`t.ci` 存在才检查」的可选行为（v2.0.0+），且 config.yaml 里 `beatai-group` / `beatai-test-group` 已经不配 `ci:` 块；2026-05-18 手动跑全程没触发任何 CI 等待

本次目标：把 material-pipeline 这一侧从"渲染 html + push repo + 等 Pages CI"简化为"push md + 图片到 gitlab"。命名和文档同步收敛。

## 用户偏好

- 避免向后兼容 hack（不保留 `publish-html.js` 旧名作 alias，直接重命名）
- 文档和代码保持一致，过时的"渲染 html"叙事一律清掉
- 改动只动 material-pipeline，不动 render-html skill 自己

## 关键事实

- `render-html` 在 repo 内**只被 publish-html.js 引用**（除 render-html skill 自己）：grep 结果命中文件全部在 `.claude/skills/material-pipeline/` 下
- `publish-html.js` 共 327 行；删 render-html 调用块后 ~285 行
- `push-lark.js` 已经支持「无 ci 块就跳过 CI 检查」（line 452 `if (!args.skipCiCheck && t.ci && ...)`）—— 不需要改 push-lark.js 的运行时逻辑，只改注释/错误提示文案
- 当前 config.yaml `publish.targets.beatai-gitlab.branch = "master"`，脚本默认 fallback 仍是 `'main'`（保持不变）
- commit message 现在是 `publish ${date}: N articles`，新脚本继续用同一格式

## 实现步骤

### Step 1: 重命名脚本 + 文档（git mv）

```
git mv .claude/skills/material-pipeline/scripts/publish-html.js \
       .claude/skills/material-pipeline/scripts/publish.js
git mv .claude/skills/material-pipeline/docs/publish-html.md \
       .claude/skills/material-pipeline/docs/publish.md
```

### Step 2: 改 `scripts/publish.js`（重点）

**删**：

- `RENDER_HTML_SCRIPT` 常量（line 71-73）
- 整个「阶段 2: render-html」块（line 212-231，含 dry-run 分支与 spawn 调用）
- 与 render-html 相关的错误处理

**改**：

- 顶部 `Usage:` 注释里 `publish-html.js` → `publish.js`，去掉 "render+copy"、"渲染" 等字样
- 顶部触发短语注释：「渲染并发布到 beatai」/「publish html」/「把今天的翻译渲染成 html 推到 repo」 → 「发布到 beatai」/「publish」/「把今天的翻译推到 gitlab」/「push md 到 repo」等
- `parseArgs` 里 help 文本的 `publish-html.js` → `publish.js`
- `--no-commit` 描述：`仅 render+copy，不动 git` → `仅复制 md+图片，不动 git`
- 阶段编号注释：原"阶段 1 / 2 / 3 / 4" → "阶段 1: 复制 / 2: git / 3: 阅读链接"
- 阅读链接打印（line 288）：`${repoUrl}/-/blob/${branch}/${date}/${slug}.html` → `${repoUrl}/-/blob/${branch}/${date}/${slug}.md`

**保留不动**：

- `publishToGitTarget` 函数名（保留，符合目标 schema 命名）
- target schema 字段（`type / repo_path / repo_url / branch / auto_commit / auto_push`）
- 主循环、汇总、退出码逻辑

### Step 3: 改 `docs/publish.md`

整体重写顶部说明 + 流程章节，关键变化：

- 标题：`# publish-html.js — 渲染 HTML 并发布到目标 repo` → `# publish.js — 把译文 md + 图片推到目标 repo`
- 触发短语章节：去掉"渲染 html"叙事，改为"发布到 beatai / publish / push md 到 repo"
- CLI 例子全改 `publish.js`
- 「流程」第 6 步（spawn render-html）整条删除
- 「输出契约」去掉 `.html` 那条
- 「字段详解」`publishTo<Type>Target` 描述里 `publish-html.js` → `publish.js`
- 「失败排查」表里删除 `gitlab blob 视图不渲染 HTML` 那行（不再相关），其它 publish-html → publish
- 删除文档底部那段 GitLab Pages 提示（`> ℹ️ GitLab 默认 blob 视图...`，line 53）—— blob 视图渲染 .md 不再是问题
- 「这个步骤不做的事」首条「不内嵌图片为 base64...产物是 .html」改为「产物是 .md + sibling images/<slug>/」

### Step 4: 改 `SKILL.md`

- frontmatter `description`：剔除"publish-html"叙事，改成"publish — 把译文 .md + 图片推到 gitlab，blob 视图直接渲染"；删除"publish-html 强制依赖 + GitLab pipeline status=success"那段（已是 v2.0.0+ 现实），保留 push-lark 的简短描述
- `version: 1.10.0` → `1.11.0`（minor bump，去除一个对外脚本/产物语义）
- line 25：`不会自动跑 publish-html` → `不会自动跑 publish`
- line 84：`publish-html.js / push-lark.js` → `publish.js / push-lark.js`
- line 165 「第四步」标题：`渲染 HTML 并发布到目标 repo` → `把 md + 图片推到目标 repo`
- line 167 触发短语：去 html，改成「发布到 beatai」/「publish」/「push md 到 gitlab」
- line 169：`docs/publish-html.md` → `docs/publish.md`
- line 175 强约束段：v2.0.0+ 已不强制 CI 检查，删整段或大幅弱化为「push-lark 默认假设 publish 已跑过；卡片链接是 blob URL，因此不需要等 Pages CI」
- line 222：`publish-html 与 push-lark` → `publish 与 push-lark`
- line 250：`publish-html / push-lark` → `publish / push-lark`
- line 259：`不修改 medium-sub / medium-fetch / render-html / translate` → 保留（render-html 仍是兄弟 skill，只是不再被 material-pipeline 调用，措辞 OK）
- line 260：`publish-html / push-lark` → `publish / push-lark`
- line 269：`publish-html.md` → `publish.md`
- line 274：`publish-html.js  # 可选：复制译文 → render-html → git commit/push` → `publish.js  # 可选:复制译文 .md + 图片 → git commit/push`

### Step 5: 改 `config.yaml`

只改顶部注释（不动配置数据）：

- line 6：`publish-html.js` → `publish.js`
- line 11-13：CLI 注释里 `publish-html.js` → `publish.js`

### Step 6: 改 `docs/push-lark.md`

- line 18：`publish-html.js 必须先成功执行...链接对应的 html 必须先被 publish 流程渲染` → `publish.js 必须先成功执行...链接对应的 .md 必须先被 publish 流程 push 到目标 repo（blob 视图直接渲染）`
- line 112 失败排查表：「报 CI 检查超时 / Pages 在 Ns 内未上线」那行，把 `publish-html` 改成 `publish`，"Pages CI" 改为 "GitLab pipeline"（描述弱化以匹配现状：CI 检查只在 target.ci 配置时才跑）
- 其它出现 `publish-html` 的地方（line 5-14 强约束段；line 7、19）：把脚本名改 publish；CI 强约束语义不在本次重构范围内但措辞要一致（强约束章节首句 `push 必须在 publish 之后跑——并且要等 GitLab pipeline status=success` 可改成 `push 必须在 publish 之后跑；如果配了 ci 块还会等 GitLab pipeline status=success`，让它跟代码现实一致）

### Step 7: 改 `scripts/push-lark.js`

- line 15 注释：`publish-html.js 把 .md + 图片` → `publish.js 把 .md + 图片`
- line 360 错误提示：`请先跑 publish-html 触发 CI` → `请先跑 publish 推到 gitlab`

### Step 8: 改 `scripts/run.js`

- line 126 注释：`下游（fetch / publish-html / push-lark）` → `下游（fetch / publish / push-lark）`

### Step 9: 验证

```bash
cd /Users/sunfei/development/test1/.claude/skills/material-pipeline/scripts

node publish.js --date 2026-05-18 --dry-run
node publish.js --date 2026-05-18 --dry-run | grep "blob/"
grep -r "publish-html" .claude/skills/material-pipeline/ || echo "✓ 无残留"
grep -r "render-html" .claude/skills/material-pipeline/ || echo "✓ 无 render-html 调用"
node publish.js --date 2026-05-18
```

## 不做的事

- **不动 render-html skill 本身**
- **不改 config.yaml 的配置数据**（只改注释）
- **不改 push-lark 的 CI 强约束代码逻辑**
- **不加新 flag**（不加 `--no-html` 兼容性 flag，直接砍掉）
- **不改 commit message 模板**
- **不删 render-html skill 的目录或文档**

## 关键文件路径

| 文件 | 动作 |
|---|---|
| `.claude/skills/material-pipeline/scripts/publish-html.js` | rename → `publish.js`，删 render-html 调用 |
| `.claude/skills/material-pipeline/scripts/push-lark.js` | 改 2 处注释/提示 |
| `.claude/skills/material-pipeline/scripts/run.js` | 改 1 处注释 |
| `.claude/skills/material-pipeline/docs/publish-html.md` | rename → `publish.md`，重写流程 |
| `.claude/skills/material-pipeline/docs/push-lark.md` | 改若干处文案 |
| `.claude/skills/material-pipeline/SKILL.md` | 多处替换 + version bump 1.10→1.11 |
| `.claude/skills/material-pipeline/config.yaml` | 改注释 |
