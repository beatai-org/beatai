# 文档渲染 chunk 体积优化

**日期**：2026-05-19
**作者**：sunfei + Claude
**状态**：待审批，未实施

## 目标

减小 `build/static/js/228.*.chunk.js`（当前 **924 KB** minified，未 gzip）的体积。该 chunk 在每次打开文档/文章页时下载，是次大 chunk（373 KB）的 2.5 倍。目标是把 P0 项落地后将其压到 **≤ 600 KB**（减 ~35%），并为后续可选的 P1/P2 留出路径。

## 现状分析

通过解析 `228.*.chunk.js.map` 列出该 chunk 实际包含的 npm 包：

| 包 | 用途 | 备注 |
|---|---|---|
| react-markdown | 主渲染器 | 必需 |
| remark-gfm / mdast-util-from-markdown / micromark-* | GFM markdown | 必需 |
| remark-math / rehype-katex / katex | 数学公式渲染 | **绝大多数文档无公式**（P2 候选） |
| rehype-raw → parse5 → entities | 渲染原生 HTML | 重，待评估 |
| rehype-sanitize → hast-util-sanitize | 清洗 HTML | 配合 rehype-raw 使用 |
| **gray-matter** | frontmatter 解析 | **静态依赖 esprima（~120 KB）+ js-yaml** |
| lucide-react | 图标 | 已是 named import，已被 tree-shake |
| yet-another-react-lightbox | 图片 lightbox | 必需 |

事实依据：
- `grep -rn gray-matter src/` 在运行时只有 1 处真实消费：`src/components/docs/DocContent.js`
- `DocContent.js` 仅读取 `frontmatter.title` 和 `frontmatter.description` 两个字段
- 全站 517 篇 markdown 中只有 **20 篇**第一行是 `---`（即真有 frontmatter），其余 ~497 篇 frontmatter 为空
- 这 20 篇里使用的 key 仅 5 个，全部是扁平字符串：`title` / `description` / `author` / `url` / `translated`
- 没有任何 frontmatter 用到 YAML 复杂特性（嵌套、列表、多行字符串、JS engine）
- 因此 `gray-matter` 的全部高级能力都未被使用，但 esprima + js-yaml + extend / extend-shallow / kind-of / is-extendable + Buffer polyfill 全部被打进 bundle

## 方案

按收益和风险拆成三个独立可落地的优化点。P0 是这次的主推，P1/P2 仅列出来供后续讨论。

### P0：替换 `gray-matter` 为自写极简 frontmatter 解析器（本次主推）

**变更范围**

1. 新建 `src/utils/parseFrontmatter.js`，约 50 行：
   - 仅支持顶层 `key: value` 的 YAML 子集
   - 支持双引号 / 单引号字符串（含转义），裸值，布尔，null
   - 不支持嵌套、列表、多行 —— 全站 frontmatter 不需要
   - 返回 `{ data, content }`，与 `gray-matter` 调用侧形态一致
2. 改 `src/components/docs/DocContent.js`：
   - 删 `import matter from 'gray-matter'`
   - 用 `parseFrontmatter` 替换 `matter(rawDoc)`
3. 改 `src/index.js`：
   - 删 `import { Buffer } from 'buffer'`
   - 删 `window.Buffer = Buffer` 以及注释
4. 改 `package.json`：
   - `dependencies` 移除 `gray-matter`、`buffer`
   - `npm install` 重新生成 lockfile

**预估收益**

- 直接去掉的代码：esprima、js-yaml、extend、extend-shallow、kind-of、is-extendable、buffer polyfill
- 估算 chunk 228 缩减 **300–400 KB**（基于 sourcemap 中各包源码大小求和）
- `src/index.js` 净减 3 行

**风险**

- 低。frontmatter 解析行为差异只影响 20 篇文档的 2 个字段（title / description），且行为对齐了 YAML 子集
- 边界情况：标题里嵌入 `"`（如 `Anthropic 的工程师说 "干掉 Markdown"`），自写解析器需要支持"裸值原样保留"，不能误识为引号边界 —— 见下面"验证计划"

**回滚成本**

低。`git revert` 一个提交即可，不涉及构建/路由/数据格式变更。

### P1（可选）：评估 `rehype-raw` 必要性

`rehype-raw` 把 markdown 里的内联 HTML 重新解析成 hast 树，代价是引入了一份 `parse5` 和 `entities` 拷贝。如果文档里实际用到的内联 HTML 都能被 react-markdown 默认的 hast 转换处理（或可以用专门的 directive 替代），就能去掉这条依赖链。

需要先做的事：

1. `grep` 全站 `.md` 文件里出现的 HTML 标签清单
2. 看哪些标签 react-markdown 默认渲染不出来，必须经过 rehype-raw
3. 评估改造成本（可能要替换成 `remark-directive` 或自定义组件）

不建议在本次一起做，工作量更大、回归面更广。

### P2（可选）：`katex` 按需加载

`rehype-katex` + `katex` + `katex.min.css` 加起来约 200–300 KB。绝大多数 ai-insights / elon-book / rust-course 文档不含 `$...$` 或 `$$...$$` 公式。

思路：

- 在加载 markdown 文本之后、渲染之前，扫一次是否有 `$` 数学语法
- 有 → `await import('rehype-katex')` + dynamically load CSS
- 无 → 完全不引入

不建议本次一起做，涉及 React 渲染时序和 CSS 注入，回归面比 P0 大得多。

## 验证计划（P0）

按顺序跑：

1. **解析器单测覆盖** —— 用真实文档喂测试（20 篇的 frontmatter 块）：
   - 双引号字符串（含中文冒号 `：`）
   - 裸值字符串（含字面 `"`，如 `Anthropic 的工程师说 "干掉 Markdown"`）
   - 含 `url:` 这种值里带冒号和 `/` 的场景（裸值，不是 key）
   - 空 frontmatter（`---\n---\n` 紧邻）
   - 完全无 frontmatter（直接 `# 标题`）
   - 验证 `data.title` 与 gray-matter 输出一致（人肉对照即可，量小）

2. **`npm run build`** —— 必须通过
3. **构建产物对比**：
   - 记录 build 前 chunk 228 大小：924 KB
   - build 后定位新的 markdown chunk（hash 会变），记录新大小
   - 期望 ≤ 600 KB；若 < 500 KB 是惊喜
4. **`npm run serve:prod`** —— 本地起生产构建，访问：
   - `/ai-insights/2026-05/19/anthropics-engineer-said-kill-markdown-here-s-what-he-actually-meant`（裸值标题 + 字面引号 + 中文标点）
   - `/elon-book/foreword`（双引号 frontmatter）
   - 任一无 frontmatter 文档（验证空 frontmatter 路径）
   - 确认页面 title、`<meta description>` 显示正确

5. **`npm test`** —— CRA 默认链路通过

## 不做的事

- 不改 ai-insights / elon-book / rust-course 的任何 markdown 内容
- 不改 `_meta.json` 或路由
- 不动 `scripts/` 下任何 Node 脚本（它们不消费 gray-matter）
- 不一并做 P1 / P2，除非 P0 落地后用户明确要求

## 落地步骤（待用户确认后执行）

1. 写 `src/utils/parseFrontmatter.js`
2. 改 `src/components/docs/DocContent.js`
3. 改 `src/index.js`
4. 改 `package.json` + `npm install`
5. `npm run build` 测体积，记录数据
6. `npm run serve:prod` + 浏览器人工验证 3 类页面
7. `npm test`
8. 提交，commit message 草案：`perf(docs): replace gray-matter with minimal frontmatter parser`
