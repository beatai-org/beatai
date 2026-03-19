# Repository Guidelines

## 项目结构与模块组织
本仓库是基于 `react-scripts` 的 React 应用。
主要业务代码位于 [`src`](/Users/sunfei/development/test1/src)：页面入口在 `src/pages`，通用 UI 组件在 `src/components`，共享逻辑在 `src/utils`、`src/services`、`src/contexts`，样式在 `src/styles`。迁移进来的 Learn Claude Code 数据与可视化代码位于 `src/vendor/learn-claude-code`。静态资源和生成后的文章内容位于 [`public`](/Users/sunfei/development/test1/public)，重点目录包括 `public/docs/*` 和 `public/images/*`。发布与部署脚本位于 [`scripts`](/Users/sunfei/development/test1/scripts)。

用户自定义的 SKILLS 在 `.claude/skills` 目录。

## 构建、测试与开发命令
- `npm start`：启动本地开发服务器。
- `npm run build`：生成生产构建产物到 `build/`。
- `npm test`：运行 CRA 默认测试。
- `npm run serve:prod`：在本地 `3000` 端口启动生产构建。
- `npm run release <version> "<message>"`：更新版本号、提交、打 tag 并推送发布。
- `npm run deploy:gh`：构建并部署到 `gh-pages`。

示例：`npm run release 0.10.12 "Refine LLC docs loading"`。

## 代码风格与命名约定
JS、JSX、CSS 和 JSON 统一使用 2 空格缩进。优先使用函数式 React 组件，页面相关逻辑尽量放在 `src/pages`。React 组件文件使用 `PascalCase`，函数和 Hook 使用 `camelCase`，静态 markdown 和资源文件使用小写短横线命名，例如 `public/docs/llc-content/zh/s01.md`。新增实现前先遵循现有模式，避免无必要抽象。

## 测试规范
测试基于 Jest 和 React Testing Library，走 CRA 默认链路。当前基础测试文件是 [`src/App.test.js`](/Users/sunfei/development/test1/src/App.test.js)。新增测试建议就近放置，并使用 `*.test.js` 命名。涉及逻辑改动至少运行 `npm test`；涉及路由、markdown、文档系统或资源管线改动时，至少再运行一次 `npm run build`。

## 提交与 Pull Request 规范
最近提交历史以发布式标题为主，例如 `Release v0.10.11: LLC zh-only content and markdown split`。非发布类提交请使用祈使句并明确描述变更，例如 `Fix LLC sidebar expansion state`。PR 应包含简短说明、受影响的页面或文档章节、UI 变更截图，以及涉及 `public/` 或路由行为时的部署说明。

## Agent 备注
未经明确要求，不要覆盖用户手写的文档内容或本地化 markdown。编辑生成内容或同步内容时，保持 `public/docs` 和 `src/vendor/learn-claude-code` 下现有目录约定不变。

新增或修改 docs、`learnClaudeCode`、`PageShell` 相关页面前，先检查现有共享实现，优先复用而不是重写。当前明确的复用入口包括：
- 文档页面外壳与头部：`src/components/docs/DocArticleLayout.js`、`src/components/docs/DocArticleHeader.js`
- Markdown 渲染：`src/components/docs/markdownRenderers.js`
- Markdown 内容加载：`src/hooks/useMarkdownSource.js`
- 分类跳转与 sidebar 状态：`src/hooks/useCategoryNavigation.js`、`src/hooks/useSidebarState.js`
- 通用类名拼接：`src/utils/classNames.js`
- `learnClaudeCode` 派生逻辑：`src/components/learnClaudeCode/versionUtils.js`、`src/components/learnClaudeCode/docUtils.js`

如果新需求与上述能力只有轻微差异，优先扩展现有实现；只有在职责明显不同、扩展会导致边界变坏时，才允许新增一套实现，并且需要在说明中写清楚不复用现有实现的原因。

调用 SKILL 时，严格确保所有步骤都被执行，不要遗漏。
