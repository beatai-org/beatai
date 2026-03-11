# Release Script

自动化发布流程脚本，用于快速发布新版本到 GitHub。

## 使用方法

### 方式 1：直接运行脚本

```bash
./scripts/release.sh <version> "<commit message>"
```

### 方式 2：使用 npm script

```bash
npm run release <version> "<commit message>"
```

## 示例

```bash
# 发布 v0.4.4，自定义提交信息
./scripts/release.sh 0.4.4 "Fix authentication bug"

# 或使用 npm
npm run release 0.4.4 "Add new feature"
```

## 脚本功能

该脚本会自动执行以下操作：

1. ✅ 更新 `package.json` 中的版本号
2. ✅ 检查 git 状态
3. ✅ 暂存所有更改
4. ✅ 创建提交（包含版本号和消息）
5. ✅ 创建 git tag
6. ✅ 推送到 GitHub (main 分支 + tag)
7. ✅ 显示发布摘要和 GitHub 链接

## 注意事项

- 确保在执行前已经完成所有代码更改
- 脚本会暂存所有文件（`git add -A`）
- 版本号格式：`x.y.z`（不需要 `v` 前缀）
- 提交信息会自动添加 "Release vX.Y.Z: " 前缀

## 提交格式

```
Release vX.Y.Z: <commit message>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

## 故障排除

如果脚本执行失败：

1. 检查 git 状态：`git status`
2. 确保有权限推送到 GitHub
3. 检查版本号格式是否正确
4. 确保脚本有执行权限：`chmod +x scripts/release.sh`
