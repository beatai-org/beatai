# DocSearch 使用指南（中文版）

## 📌 快速概览

DocSearch 已经集成到您的项目中，但需要经过以下阶段才能使用全文搜索功能：

```
当前状态 ──→ 部署网站 ──→ 申请 Algolia ──→ 配置凭证 ──→ 等待爬取 ──→ 全文搜索可用
(元数据搜索)    (公网访问)     (1-3天)        (5分钟)       (1-2天)      (完成！)
```

---

## 🎯 第一步：测试当前功能

### 启动开发服务器

```bash
cd /Users/sunfei/development/test1
npm start
```

浏览器会自动打开 http://localhost:3000

### 使用搜索功能

1. 点击页面左侧的**浮动 AI 小球**（带星星图标 ✨）
2. 输入搜索关键词，例如：
   - "变量绑定"
   - "所有权"
   - "Rust 基础"
3. 查看搜索结果

### 当前效果

搜索结果会显示：
```
Found 3 results (Metadata only)
```

这表示目前只能搜索**标题和描述**，还不能搜索文档内容。

---

## 🚀 第二步：启用全文搜索（可选）

如果您想要搜索文档的全部内容（不仅是标题），需要启用 Algolia DocSearch。

### 2.1 部署网站到公网

Algolia 需要访问您的网站来建立索引，因此必须部署到公网。

#### 选项 A：使用 Vercel（最简单，推荐）

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel（首次使用需要）
vercel login

# 3. 部署
vercel --prod

# 按照提示操作，几分钟内就能完成
# 会得到一个公网地址，例如：https://your-project.vercel.app
```

#### 选项 B：使用 Netlify

```bash
# 1. 构建项目
npm run build

# 2. 使用 Netlify Drop（最简单）
# 访问 https://app.netlify.com/drop
# 直接拖拽 build 文件夹到页面
# 会立即获得一个公网地址
```

#### 选项 C：使用 GitHub Pages

```bash
# 1. 确保代码已推送到 GitHub

# 2. 安装 gh-pages
npm install -g gh-pages

# 3. 部署
npm run build
gh-pages -d build

# 网站会部署到 https://your-username.github.io/your-repo
```

**记住您的网站地址！**（下一步需要用）

---

### 2.2 申请 Algolia DocSearch

#### 填写申请表单

访问：**https://docsearch.algolia.com/apply/**

填写以下信息：

| 字段 | 填写内容 | 示例 |
|------|---------|------|
| **Website URL** | 您刚才部署的公网地址 | https://your-project.vercel.app |
| **Email** | 您的邮箱 | your-email@example.com |
| **Repository** | GitHub 仓库地址（可选） | https://github.com/username/repo |
| **Description** | 网站描述 | BeatAI 技术文档，包含 Rust 教程和使用指南 |

#### 确认声明

勾选以下三项：
- ✅ I am the owner of this website
- ✅ The website is publicly available
- ✅ The website is technical documentation

#### 提交并等待

- **提交**申请
- **等待** 1-3 个工作日
- Algolia 团队会通过邮件回复

---

### 2.3 收到凭证后配置

#### 您会收到的邮件内容

```
Hi there,

Your DocSearch index is now live!

Here are your credentials:
- appId: BH4D9OD16A
- apiKey: 2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p
- indexName: your_site_name

Happy searching!
```

#### 方法一：使用自动配置脚本（推荐）

```bash
cd /Users/sunfei/development/test1
./UPDATE_ALGOLIA_CONFIG.sh
```

按照提示输入 appId、apiKey 和 indexName，脚本会自动更新配置。

#### 方法二：手动配置

打开文件：`src/components/docs/AIAssistant.js`

找到第 19-24 行的配置：

```javascript
const ALGOLIA_CONFIG = {
  appId: 'YOUR_APP_ID',           // 替换为您的 appId
  apiKey: 'YOUR_SEARCH_API_KEY',  // 替换为您的 apiKey
  indexName: 'YOUR_INDEX_NAME',   // 替换为您的 indexName
  enabled: false                   // 改为 true
};
```

替换后应该像这样：

```javascript
const ALGOLIA_CONFIG = {
  appId: 'BH4D9OD16A',
  apiKey: '2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p',
  indexName: 'beatai_docs',
  enabled: true  // ⚠️ 重要：必须改为 true
};
```

---

### 2.4 重新部署

配置完成后，重新构建并部署：

```bash
# 1. 构建
npm run build

# 2. 部署（使用您之前选择的方式）
vercel --prod
# 或
netlify deploy --prod
```

---

### 2.5 等待 Algolia 爬取

- **时间**：1-2 天
- **自动进行**：无需任何操作
- **进度查看**：登录 Algolia Dashboard (https://www.algolia.com/dashboard)

#### 查看爬取状态

1. 访问 https://www.algolia.com/dashboard
2. 找到您的索引（indexName）
3. 点击 "Browse" 查看已索引的内容
4. 如果看到文档记录，说明爬取成功

---

## ✅ 第三步：测试全文搜索

爬取完成后，再次测试搜索功能：

### 应该看到的变化

1. **搜索结果标签变化**：
   ```
   Found 5 results (Full-text)  ← 注意这里变成了 "Full-text"
   ```

2. **显示内容片段**：
   搜索结果会显示匹配的文档内容片段，而不仅是描述

3. **关键词高亮**：
   匹配的关键词会有**黄色背景**高亮显示

### 测试建议

尝试搜索文档内容中的具体词汇（不是标题）：

```
搜索 "let mut"     ← 代码关键字
搜索 "可变变量"    ← 具体概念
搜索 "所有权规则"  ← 详细内容
```

如果能找到包含这些词的文档片段，说明全文搜索已生效！

---

## 🎨 功能对比

### 元数据搜索（当前）

```
搜索："变量绑定"

结果：
┌────────────────────────────┐
│ Rust 核心概念 › 基础语法   │
│ 变量绑定与解构             │  ← 只能找到标题
│ 了解 Rust 中的变量绑定规则 │  ← 描述信息
└────────────────────────────┘

找到 1 个结果
```

### 全文搜索（启用 Algolia 后）

```
搜索："变量绑定"

结果：
┌────────────────────────────────────────────┐
│ Rust 核心概念 › 基础语法                   │
│ 变量绑定与解构                             │
│ Rust 使用 let 关键字进行变量绑定。默认情况│
│ 下，变量是不可变的...                      │
│         ^^^^                               │
│      (黄色高亮)                            │
└────────────────────────────────────────────┘
┌────────────────────────────────────────────┐
│ Rust 核心概念 › 所有权系统                 │
│ 所有权规则                                 │
│ 在 Rust 中，所有权系统要求明确的变量绑定。│
│ 每个值都有一个唯一的所有者...              │
│                          ^^^^              │
│                        (黄色高亮)          │
└────────────────────────────────────────────┘

找到 5 个结果 ← 更多结果
```

---

## 🔧 故障排查

### 问题：仍然显示 "(Metadata only)"

**可能原因和解决方法：**

1. **配置未启用**
   ```javascript
   // 检查 AIAssistant.js 第 23 行
   enabled: true  // 必须是 true，不是 false
   ```

2. **凭证错误**
   - 仔细核对 appId、apiKey、indexName
   - 确保没有多余的空格或引号

3. **未重新部署**
   - 配置更改后必须重新构建和部署
   ```bash
   npm run build
   vercel --prod  # 或您使用的部署方式
   ```

4. **Algolia 尚未爬取**
   - 等待 1-2 天
   - 在 Algolia Dashboard 检查索引是否有数据

### 问题：搜索没有结果

**检查项：**

1. **索引是否为空**
   - 登录 Algolia Dashboard
   - 查看 Browse 页面是否有记录

2. **爬虫配置**
   - 检查网站的 HTML 结构是否匹配 `docsearch.config.json`
   - 可能需要调整 selector 配置

3. **网络连接**
   - 检查浏览器控制台是否有错误
   - 确保能访问 Algolia API

---

## 📚 文档资源

项目中包含以下详细文档：

- **QUICK_START.md** - 英文快速开始指南
- **ALGOLIA_INTEGRATION.md** - 完整集成文档（300+ 行）
- **IMPLEMENTATION_SUMMARY.md** - 技术实现细节
- **BEFORE_AFTER_COMPARISON.md** - 功能对比说明
- **本文件** - 中文使用指南

---

## 💡 常见问题 (FAQ)

### Q1: 必须使用 Algolia 吗？

**A:** 不是必须的。当前的元数据搜索已经可以正常工作。Algolia 只是提供更强大的全文搜索功能。

### Q2: Algolia 是免费的吗？

**A:** 对于开源项目和公开的技术文档，Algolia DocSearch 完全免费，没有任何限制。

### Q3: 如果不想用 Algolia，还有其他方案吗？

**A:** 有的，可以考虑：
- **Pagefind** - 完全静态的搜索方案
- **Meilisearch** - 自托管的搜索引擎
- **继续使用现有的元数据搜索**

### Q4: 数据安全吗？

**A:** 是的。Algolia 只会索引您公开网站上的内容，使用的是 Search-Only API Key（只能搜索，不能修改数据）。

### Q5: 多久更新一次索引？

**A:** 默认每周一次。如果需要更频繁的更新，可以联系 Algolia 支持申请增加频率。

### Q6: 我的网站是中文内容，Algolia 支持吗？

**A:** 完全支持！Algolia 内置中文分词和搜索优化。

---

## 🎯 下一步建议

### 如果您想立即测试

```bash
# 1. 启动开发服务器
npm start

# 2. 打开浏览器，点击 AI 小球
# 3. 尝试搜索功能（当前是元数据搜索）
```

### 如果您想启用全文搜索

1. ✅ 部署网站到公网（Vercel/Netlify/GitHub Pages）
2. ✅ 访问 https://docsearch.algolia.com/apply/ 申请
3. ✅ 等待邮件（1-3 天）
4. ✅ 运行 `./UPDATE_ALGOLIA_CONFIG.sh` 配置凭证
5. ✅ 重新部署
6. ✅ 等待爬取（1-2 天）
7. ✅ 享受全文搜索功能！

---

## 📞 获取帮助

- **Algolia 文档**: https://docsearch.algolia.com/docs/what-is-docsearch
- **Algolia 支持**: support@algolia.com
- **项目文档**: 查看项目根目录的 Markdown 文件

---

**祝您使用愉快！** 🎉

如有任何问题，请查阅详细文档或联系 Algolia 支持团队。
