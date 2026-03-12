#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  // GitHub 仓库信息
  owner: 'sunface',
  repo: 'rust-course',
  branch: 'main',

  // 源目录路径（仓库中的文档目录）
  sourceDir: 'src',

  // 目标本地目录
  targetDir: path.resolve(__dirname, '../public/docs/rust-course'),

  // 临时目录（用于 git clone）
  tempDir: path.resolve(__dirname, '../.temp-rust-course'),

  // 只同步这些文件扩展名
  allowedExtensions: ['.md'],
};

// 统计信息
const stats = {
  filesDownloaded: 0,
  totalSize: 0,
  startTime: Date.now(),
};

/**
 * 执行命令并显示输出
 */
function execCommand(command, options = {}) {
  try {
    return execSync(command, {
      stdio: 'pipe',
      encoding: 'utf-8',
      ...options
    });
  } catch (error) {
    throw new Error(`命令执行失败: ${command}\n${error.message}`);
  }
}

/**
 * 清理目标目录
 */
async function cleanTargetDir() {
  console.log(chalk.cyan('📁 清理目标目录...'));

  try {
    // 确保目标目录存在
    await fs.ensureDir(CONFIG.targetDir);

    // 递归删除所有 .md 文件
    const deleteMarkdownFiles = async (dir) => {
      let deletedCount = 0;
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          deletedCount += await deleteMarkdownFiles(fullPath);
        } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.md') {
          await fs.remove(fullPath);
          deletedCount++;
        }
      }

      return deletedCount;
    };

    const deletedCount = await deleteMarkdownFiles(CONFIG.targetDir);
    console.log(chalk.green(`✓ 目标目录清理完成（删除 ${deletedCount} 个文件）\n`));
  } catch (error) {
    console.error(chalk.red('✗ 清理目标目录失败'));
    throw error;
  }
}

/**
 * 克隆 GitHub 仓库
 */
async function cloneRepo() {
  console.log(chalk.cyan('📥 克隆 GitHub 仓库...'));

  try {
    // 清理临时目录
    await fs.remove(CONFIG.tempDir);

    const repoUrl = `https://github.com/${CONFIG.owner}/${CONFIG.repo}.git`;
    const command = `git clone --depth 1 --branch ${CONFIG.branch} --single-branch ${repoUrl} "${CONFIG.tempDir}"`;

    console.log(chalk.gray(`   执行: git clone ${repoUrl}`));
    execCommand(command);

    console.log(chalk.green('✓ 仓库克隆成功\n'));
  } catch (error) {
    console.error(chalk.red('✗ 克隆仓库失败'));
    throw error;
  }
}

/**
 * 复制 Markdown 文件
 */
async function copyMarkdownFiles() {
  console.log(chalk.cyan('📄 复制 Markdown 文件...'));

  const sourceDir = path.join(CONFIG.tempDir, CONFIG.sourceDir);

  if (!await fs.pathExists(sourceDir)) {
    throw new Error(`源目录不存在: ${CONFIG.sourceDir}`);
  }

  // 递归复制所有 .md 文件
  const copyFiles = async (srcDir, destDir) => {
    const entries = await fs.readdir(srcDir, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const relativePath = path.relative(sourceDir, srcPath);
      const destPath = path.join(CONFIG.targetDir, relativePath);

      if (entry.isDirectory()) {
        await copyFiles(srcPath, destPath);
      } else if (entry.isFile() && CONFIG.allowedExtensions.includes(path.extname(entry.name).toLowerCase())) {
        await fs.ensureDir(path.dirname(destPath));
        await fs.copy(srcPath, destPath);

        const fileStats = await fs.stat(srcPath);
        stats.filesDownloaded++;
        stats.totalSize += fileStats.size;

        console.log(chalk.gray(`   • ${relativePath}`));
      }
    }
  };

  await copyFiles(sourceDir, CONFIG.targetDir);
  console.log(chalk.green(`\n✓ 复制完成（${stats.filesDownloaded} 个文件）\n`));
}

/**
 * 清理临时目录
 */
async function cleanupTempDir() {
  console.log(chalk.cyan('🧹 清理临时文件...'));

  try {
    await fs.remove(CONFIG.tempDir);
    console.log(chalk.green('✓ 临时文件清理完成\n'));
  } catch (error) {
    console.warn(chalk.yellow('⚠ 临时文件清理失败（可手动删除）'));
  }
}

/**
 * 同步文档
 */
async function syncDocs() {
  console.log(chalk.bold.cyan('\n🚀 开始同步 Rust 语言圣经文档\n'));
  console.log(chalk.gray(`   源仓库: ${CONFIG.owner}/${CONFIG.repo}`));
  console.log(chalk.gray(`   分支: ${CONFIG.branch}`));
  console.log(chalk.gray(`   源目录: ${CONFIG.sourceDir}`));
  console.log(chalk.gray(`   目标目录: ${CONFIG.targetDir}\n`));

  try {
    // 1. 清理目标目录
    await cleanTargetDir();

    // 2. 克隆仓库
    await cloneRepo();

    // 3. 复制 Markdown 文件
    await copyMarkdownFiles();

    // 4. 清理临时目录
    await cleanupTempDir();

    // 5. 生成同步报告
    const duration = ((Date.now() - stats.startTime) / 1000).toFixed(2);
    const totalSizeMB = (stats.totalSize / 1024 / 1024).toFixed(2);

    console.log(chalk.bold.green('✅ 同步完成！\n'));
    console.log(chalk.cyan('📊 统计信息:'));
    console.log(chalk.gray(`   • 下载文件: ${stats.filesDownloaded} 个`));
    console.log(chalk.gray(`   • 总大小: ${totalSizeMB} MB`));
    console.log(chalk.gray(`   • 耗时: ${duration} 秒`));
    console.log(chalk.gray(`   • 目标目录: ${CONFIG.targetDir}\n`));

  } catch (error) {
    console.error(chalk.bold.red('\n❌ 同步失败！\n'));
    console.error(chalk.red('错误信息:'), error.message);

    // 清理临时目录
    await cleanupTempDir();

    process.exit(1);
  }
}

// 运行同步
syncDocs();
