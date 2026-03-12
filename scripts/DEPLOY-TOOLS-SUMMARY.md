# 部署工具集合

本项目提供了三个自动化部署工具：

## 1. 版本发布工具 (`release.sh`)

**用途：** 发布新版本并打标签

**命令：**
```bash
npm run release v1.0.0
```

**功能：**
- 更新 package.json 版本号
- 创建 git commit
- 创建 git tag
- 推送到 GitHub

---

## 2. 文档同步工具 (`sync-docs.mjs`)

**用途：** 从 GitHub 仓库同步 Markdown 文档

**命令：**
```bash
npm run sync-docs
```

**功能：**
- 克隆 rust-course 仓库
- 复制 Markdown 文件到本地
- 保持目录结构
- 清理临时文件

---

## 3. GitHub Pages 部署工具 (`deploy-gh-pages.sh`) ⭐ 新增

**用途：** 自动化部署到 GitHub Pages

**命令：**
```bash
# 完整部署（推荐）
npm run deploy:gh

# 跳过构建
npm run deploy:gh:skip-build

# 仅测试构建
npm run deploy:gh:test
```

**功能：**
- ✅ 检查 Git 状态
- 🔨 构建生产版本
- ✔️ 验证构建结果
- 🚀 部署到 gh-pages
- 📊 显示部署信息

**优势：**
- 自动化检查流程
- 友好的错误提示
- 支持多种部署模式
- 彩色终端输出

---

## 完整工作流示例

### 开发 → 发布 → 部署

```bash
# 1. 开发功能
# ... 编写代码 ...

# 2. 同步文档（如需要）
npm run sync-docs

# 3. 测试构建
npm run deploy:gh:test

# 4. 提交代码
git add .
git commit -m "Add new feature"
git push

# 5. 发布版本
npm run release v1.0.0

# 6. 部署到生产
npm run deploy:gh
```

### 快速修复部署

```bash
# 1. 修复问题
# ... 修改代码 ...

# 2. 提交
git add .
git commit -m "Fix bug"
git push

# 3. 直接部署（无需新版本）
npm run deploy:gh
```

---

## 工具对比

| 工具 | 用途 | 频率 | 依赖 |
|------|------|------|------|
| release.sh | 版本管理 | 版本发布时 | git |
| sync-docs.mjs | 文档同步 | 文档更新时 | git, node |
| deploy-gh-pages.sh | 网站部署 | 每次部署 | npm, gh-pages |

---

## 文档链接

- [版本发布工具文档](./RELEASE-README.md)
- [文档同步工具文档](./SYNC-DOCS-README.md)
- [GitHub Pages 部署工具文档](./DEPLOY-GH-PAGES-README.md) ⭐

---

## 快速参考

```bash
# 查看帮助
npm run deploy:gh -- --help

# 显示详细日志
npm run deploy:gh -- --verbose

# 组合命令
bash scripts/deploy-gh-pages.sh -s -v
```
