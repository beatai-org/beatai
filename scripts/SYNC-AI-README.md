# AI 文章同步工具

自动同步 GitHub 上的 AI 前沿分享文章到网站。

## 功能

- ✅ 从 GitHub 获取最新的 README.md 内容
- ✅ 自动保存到本地 `2026.md` 文件
- ✅ 显示文件变化统计
- ✅ 提取最新文章标题
- ✅ 彩色终端输出

## 使用方法

### 方式 1: 使用 npm 脚本（推荐）

```bash
npm run sync-ai
```

### 方式 2: 直接运行脚本

```bash
node scripts/sync-ai-article.mjs
```

## 同步源

- **源地址：** https://github.com/beatai-org/beatai/blob/main/README.md
- **目标文件：** `public/docs/ai-insights/viewpoint/2026.md`

## 工作流程

```
┌─────────────────────────────────────────────┐
│  1. 从 GitHub 获取 README.md                │
│     ↓                                        │
│  2. 读取本地现有内容                         │
│     ↓                                        │
│  3. 比较内容差异                             │
│     ↓                                        │
│  4. 显示更新统计                             │
│     ↓                                        │
│  5. 保存到本地文件                           │
│     ↓                                        │
│  6. 显示成功信息                             │
└─────────────────────────────────────────────┘
```

## 输出示例

```
🔄 开始同步 AI 前沿分享文章

源地址: https://raw.githubusercontent.com/beatai-org/beatai/main/README.md
目标文件: /Users/sunfei/development/test1/public/docs/ai-insights/viewpoint/2026.md

✔ README.md 获取成功

📊 更新统计:
   • 原文件行数: 78
   • 新文件行数: 80
   • 增加行数: +2

✔ 文件保存成功

✅ 同步完成！

📝 更新内容:
   • 文件路径: /Users/sunfei/development/test1/public/docs/ai-insights/viewpoint/2026.md
   • 文件大小: 5.46 KB
   • 最新文章: 百万级代码背后的零人工奇迹
```

## 配置

脚本配置位于 `scripts/sync-ai-article.mjs` 文件中：

```javascript
const CONFIG = {
  // GitHub README.md URL
  githubReadmeUrl: 'https://raw.githubusercontent.com/beatai-org/beatai/main/README.md',

  // 本地目标文件
  targetFile: path.resolve(__dirname, '../public/docs/ai-insights/viewpoint/2026.md'),
};
```

## 使用场景

### 场景 1: 定期同步最新文章

当 GitHub 仓库的 README.md 更新后：

```bash
# 同步文章
npm run sync-ai

# 查看效果（开发服务器会自动重载）
npm start
```

### 场景 2: 发布前同步

在发布新版本前确保文章最新：

```bash
# 1. 同步文章
npm run sync-ai

# 2. 提交更改
git add .
git commit -m "Sync AI articles"

# 3. 发布版本
npm run release v0.6.5

# 4. 部署到 gh-pages
npm run deploy:gh
```

### 场景 3: CI/CD 集成

在 GitHub Actions 或其他 CI/CD 中自动同步：

```yaml
- name: Sync AI articles
  run: npm run sync-ai

- name: Commit changes
  run: |
    git add .
    git commit -m "Auto-sync AI articles" || exit 0
```

## 错误处理

### 网络超时

```
✖ 获取 README.md 失败
错误详情: timeout of 10000ms exceeded
提示：网络请求超时，请检查网络连接
```

**解决方法：**
- 检查网络连接
- 重新运行脚本

### 文件未找到

```
✖ 获取 README.md 失败
错误详情: Request failed with status code 404
提示：GitHub 文件未找到，请检查 URL
```

**解决方法：**
- 检查 GitHub 仓库 URL 是否正确
- 确认文件路径是否存在

### 文件保存失败

```
✖ 文件保存失败
错误详情: EACCES: permission denied
```

**解决方法：**
- 检查文件权限
- 确保目标目录可写

## 依赖

- `axios` - HTTP 请求
- `fs-extra` - 文件操作
- `ora` - 终端加载动画
- `chalk` - 彩色终端输出

所有依赖已在项目中安装，无需额外安装。

## 注意事项

1. ✅ 脚本会自动创建目标目录（如果不存在）
2. ✅ 如果内容没有变化，会提示"内容已是最新"
3. ✅ 支持断网重试，不会破坏本地文件
4. ⚠️ 同步会完全覆盖本地文件内容
5. ⚠️ 建议在同步前先提交本地更改

## 与其他工具对比

| 工具 | 用途 | 命令 |
|------|------|------|
| sync-ai-article.mjs | 同步 AI 文章 | `npm run sync-ai` |
| sync-docs.mjs | 同步 Rust 文档 | `npm run sync-docs` |
| release.sh | 发布版本 | `npm run release` |
| deploy-gh-pages.sh | 部署到 gh-pages | `npm run deploy:gh` |

## 开发

如需修改同步逻辑，编辑 `scripts/sync-ai-article.mjs` 文件。

主要函数：
- `fetchGithubReadme()` - 从 GitHub 获取内容
- `saveToLocal()` - 保存到本地文件
- `showDiff()` - 显示差异统计
- `syncArticle()` - 主同步流程

## License

MIT
