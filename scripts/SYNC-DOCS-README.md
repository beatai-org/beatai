# GitHub 文档同步工具

这是一个用于从 GitHub 仓库同步 Markdown 文档到本地项目的工具。

## 功能特点

✅ 一键同步 GitHub 仓库的最新文档
✅ 保证本地文档与源仓库完全一致
✅ 自动处理目录结构
✅ 提供同步进度和结果反馈
✅ 错误处理和日志记录

## 使用方法

### 同步 Rust 语言圣经文档

```bash
npm run sync-docs
```

这会从 [rust-course](https://github.com/sunface/rust-course) 仓库同步所有 Markdown 文档到 `public/docs/rust/` 目录。

## 同步策略

- **完全替换**：每次同步会先删除现有的 Markdown 文件，然后重新下载
- **仅 Markdown**：只同步 `.md` 文件，忽略其他类型的文件
- **保持结构**：保持源仓库的目录结构

## 配置说明

同步配置在 `scripts/sync-docs.mjs` 文件中：

```javascript
const CONFIG = {
  owner: 'sunface',           // GitHub 用户名
  repo: 'rust-course',        // 仓库名
  branch: 'main',             // 分支名
  sourceDir: 'src',           // 源目录（仓库中的文档目录）
  targetDir: '../public/docs/rust',  // 目标目录
  allowedExtensions: ['.md']  // 允许的文件扩展名
};
```

## 工作流程

1. 清理目标目录（删除现有 .md 文件）
2. 克隆 GitHub 仓库（使用 `--depth 1` 加速）
3. 复制 Markdown 文件到目标目录
4. 清理临时文件
5. 生成同步报告

## 输出示例

```
🚀 开始同步 Rust 语言圣经文档

   源仓库: sunface/rust-course
   分支: main
   源目录: src
   目标目录: /path/to/public/docs/rust

📁 清理目标目录...
✓ 目标目录清理完成（删除 0 个文件）

📥 克隆 GitHub 仓库...
   执行: git clone https://github.com/sunface/rust-course.git
✓ 仓库克隆成功

📄 复制 Markdown 文件...
   • SUMMARY.md
   • about-book.md
   ...
✓ 复制完成（344 个文件）

🧹 清理临时文件...
✓ 临时文件清理完成

✅ 同步完成！

📊 统计信息:
   • 下载文件: 344 个
   • 总大小: 2.29 MB
   • 耗时: 3.14 秒
   • 目标目录: /path/to/public/docs/rust
```

## 依赖

- Node.js >= 14
- Git
- npm 包：
  - `fs-extra` - 文件系统操作
  - `chalk` - 终端彩色输出

## 故障排查

### 问题 1: Git 克隆失败

**错误信息：** `克隆仓库失败`

**解决方法：**
1. 检查网络连接
2. 检查 GitHub 是否可访问
3. 确保已安装 Git

### 问题 2: 权限错误

**错误信息：** `EACCES: permission denied`

**解决方法：**
1. 检查目标目录权限
2. 确保有写入权限

### 问题 3: 源目录配置错误

**症状：** 同步成功但没有文件

**解决方法：**
1. 访问 GitHub 仓库确认文档目录结构
2. 更新配置中的 `sourceDir` 参数

## 扩展功能

如需同步其他 GitHub 仓库，可以修改 `scripts/sync-docs.mjs` 中的配置，或创建新的脚本文件。

## License

MIT
