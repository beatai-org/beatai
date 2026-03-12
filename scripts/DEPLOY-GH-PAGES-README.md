# GitHub Pages 部署工具

自动化部署到 GitHub Pages 的 shell 脚本工具。

## 功能特点

✅ 自动检查 Git 状态
✅ 构建生产版本
✅ 验证构建结果
✅ 部署到 gh-pages 分支
✅ 显示部署信息和访问链接
✅ 支持多种部署模式

## 快速开始

### 方式 1: 使用 npm 脚本（推荐）

```bash
# 完整部署流程（构建 + 部署）
npm run deploy:gh

# 跳过构建，直接部署（使用现有 build 目录）
npm run deploy:gh:skip-build

# 仅构建和测试（不部署）
npm run deploy:gh:test
```

### 方式 2: 直接运行脚本

```bash
# 完整部署流程
bash scripts/deploy-gh-pages.sh

# 显示帮助信息
bash scripts/deploy-gh-pages.sh --help
```

## 使用场景

### 场景 1: 日常部署

适用于代码已提交，需要发布到生产环境：

```bash
npm run deploy:gh
```

**流程：**
1. ✅ 检查 Git 状态（如有未提交更改会提示）
2. 🔨 运行 `npm run build`
3. ✔️ 验证构建结果
4. 🚀 部署到 gh-pages
5. 📊 显示部署信息

### 场景 2: 快速重新部署

已经构建过，只需重新部署：

```bash
npm run deploy:gh:skip-build
```

**适用于：**
- 修改了非代码文件（如 CNAME）
- 部署失败需要重试
- 已有构建产物想快速部署

### 场景 3: 测试构建

只想测试构建是否成功，不实际部署：

```bash
npm run deploy:gh:test
```

**适用于：**
- 验证构建配置
- 检查构建产物
- CI/CD 测试阶段

## 命令行选项

| 选项 | 简写 | 说明 |
|------|------|------|
| `--help` | `-h` | 显示帮助信息 |
| `--skip-build` | `-s` | 跳过构建，使用现有 build 目录 |
| `--test` | `-t` | 仅构建和测试，不部署 |
| `--verbose` | `-v` | 显示详细输出 |

## 示例

### 示例 1: 显示详细日志

```bash
bash scripts/deploy-gh-pages.sh --verbose
```

### 示例 2: 组合选项

```bash
# 跳过构建 + 显示详细日志
bash scripts/deploy-gh-pages.sh -s -v
```

## 部署流程说明

### 步骤 1: 检查 Git 状态

- 检查是否有未提交的更改
- 如有更改，提示用户是否继续

### 步骤 2: 构建生产版本

- 运行 `npm run build`
- 编译 React 应用
- 生成优化的静态文件

### 步骤 3: 检查构建结果

验证关键文件和目录：
- `build/index.html`
- `build/CNAME`
- `build/static/js`
- `build/static/css`
- `build/docs`

显示构建统计：
- 构建目录大小
- 文件总数
- 自定义域名（如有）

### 步骤 4: 部署到 gh-pages

- 运行 `npm run deploy`
- 使用 `gh-pages` 包推送到远程分支

### 步骤 5: 显示部署信息

- 仓库信息
- 提交哈希
- 访问链接
- 注意事项

## 输出示例

```
ℹ️  🚀 GitHub Pages 部署工具

🔹 步骤 1/5: 检查 Git 状态
✅ Git 状态检查完成

🔹 步骤 2/5: 构建生产版本
ℹ️  运行: npm run build
✅ 构建完成

🔹 步骤 3/5: 检查构建结果
ℹ️  构建目录大小: 2.5M
ℹ️  文件总数: 458
ℹ️  自定义域名: beatai.org
✅ 构建结果检查通过

🔹 步骤 4/5: 部署到 gh-pages 分支
ℹ️  运行: npm run deploy
✅ 部署完成

🔹 步骤 5/5: 部署信息
ℹ️  仓库: beatai-org/beatai
ℹ️  主页: https://beatai.org
ℹ️  提交: a1b2c3d
✅ 🎉 部署成功！

🌐 访问地址: https://beatai.org

📝 注意事项：
   • GitHub Pages 可能需要几分钟时间更新
   • 首次部署可能需要 10 分钟左右
   • 检查部署状态: https://github.com/beatai-org/beatai/actions

✅ 部署流程完成！
```

## 错误处理

### 构建失败

```
❌ 构建失败！

ℹ️  显示构建日志：
[显示最后 30 行日志]
```

**解决方法：**
1. 检查代码错误
2. 查看完整日志：`cat /tmp/deploy-build.log`
3. 修复后重新运行

### 部署失败

```
❌ 部署失败！

ℹ️  显示部署日志：
[显示最后 30 行日志]
```

**解决方法：**
1. 检查网络连接
2. 验证 GitHub 权限
3. 查看完整日志：`cat /tmp/deploy-gh-pages.log`

### build 目录不存在

```
❌ build 目录不存在！请先运行构建或移除 -s 选项
```

**解决方法：**
- 移除 `-s` 选项，让脚本自动构建
- 或先手动运行：`npm run build`

## 配置文件

### package.json

```json
{
  "homepage": "https://beatai.org",
  "scripts": {
    "deploy:gh": "bash scripts/deploy-gh-pages.sh",
    "deploy:gh:skip-build": "bash scripts/deploy-gh-pages.sh -s",
    "deploy:gh:test": "bash scripts/deploy-gh-pages.sh -t"
  }
}
```

### CNAME 文件

位置：`public/CNAME`

内容：
```
beatai.org
```

构建时会自动复制到 `build/CNAME`

## 与其他工具对比

### vs `npm run deploy`

| 特性 | deploy-gh-pages.sh | npm run deploy |
|------|-------------------|----------------|
| Git 状态检查 | ✅ | ❌ |
| 构建结果验证 | ✅ | ❌ |
| 部署信息展示 | ✅ | ❌ |
| 错误处理 | ✅ | 基础 |
| 跳过构建选项 | ✅ | ❌ |
| 测试模式 | ✅ | ❌ |

### vs 手动部署

```bash
# 手动部署步骤
npm run build
# 检查构建结果...
npm run deploy
# 检查部署状态...
```

vs

```bash
# 使用脚本（一步完成）
npm run deploy:gh
```

## 常见问题

### Q: 部署后网站没有更新？

A: GitHub Pages 需要时间处理，通常 1-5 分钟。检查：
- GitHub Actions 状态
- 浏览器缓存（强制刷新：Cmd/Ctrl + Shift + R）

### Q: 如何回滚部署？

A:
```bash
# 1. 找到之前的提交
git log gh-pages

# 2. 重置到指定提交
git checkout gh-pages
git reset --hard <commit-hash>
git push -f origin gh-pages
```

### Q: 能否部署到其他分支？

A: 修改 `package.json` 中的 deploy 命令：
```json
"deploy": "gh-pages -d build -b <branch-name>"
```

## 最佳实践

### 1. 部署前先提交代码

```bash
git add .
git commit -m "Add new feature"
git push
npm run deploy:gh
```

### 2. 使用标签管理版本

```bash
npm run release v1.0.0  # 发布版本
npm run deploy:gh       # 部署到生产
```

### 3. CI/CD 集成

在 GitHub Actions 中使用：

```yaml
- name: Deploy to GitHub Pages
  run: npm run deploy:gh -- --verbose
```

## 维护

### 更新脚本

脚本位置：`scripts/deploy-gh-pages.sh`

修改后记得测试：
```bash
npm run deploy:gh:test
```

### 日志位置

- 构建日志：`/tmp/deploy-build.log`
- 部署日志：`/tmp/deploy-gh-pages.log`

## License

MIT
