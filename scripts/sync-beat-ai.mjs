#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import ora from 'ora';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  // GitHub README.md URL
  githubReadmeUrl: ' https://raw.githubusercontent.com/beatai-org/beatai/main/README.md',

  // 本地目标文件
  targetFile: path.resolve(__dirname, '../public/docs/ai-insights/viewpoint/2026.md'),
};

/**
 * 从 GitHub 获取 README.md 内容
 */
async function fetchGithubReadme() {
  const spinner = ora('从 GitHub 获取 README.md...').start();

  try {
    const response = await axios.get(CONFIG.githubReadmeUrl, {
      timeout: 10000,
    });

    spinner.succeed('README.md 获取成功');
    return response.data;
  } catch (error) {
    spinner.fail('获取 README.md 失败');
    console.error(chalk.red('错误详情:'), error.message);

    if (error.code === 'ECONNABORTED') {
      console.error(chalk.yellow('提示：网络请求超时，请检查网络连接'));
    } else if (error.response?.status === 404) {
      console.error(chalk.yellow('提示：GitHub 文件未找到，请检查 URL'));
    }

    throw error;
  }
}

/**
 * 保存内容到本地文件
 */
async function saveToLocal(content) {
  const spinner = ora('保存到本地文件...').start();

  try {
    // 确保目录存在
    await fs.ensureDir(path.dirname(CONFIG.targetFile));

    // 写入文件
    await fs.writeFile(CONFIG.targetFile, content, 'utf-8');

    spinner.succeed('文件保存成功');
    return true;
  } catch (error) {
    spinner.fail('文件保存失败');
    console.error(chalk.red('错误详情:'), error.message);
    throw error;
  }
}

/**
 * 显示文件差异统计
 */
async function showDiff(oldContent, newContent) {
  const oldLines = oldContent.split('\n').length;
  const newLines = newContent.split('\n').length;
  const diffLines = newLines - oldLines;

  console.log(chalk.cyan('\n📊 更新统计:'));
  console.log(chalk.gray(`   • 原文件行数: ${oldLines}`));
  console.log(chalk.gray(`   • 新文件行数: ${newLines}`));

  if (diffLines > 0) {
    console.log(chalk.green(`   • 增加行数: +${diffLines}`));
  } else if (diffLines < 0) {
    console.log(chalk.yellow(`   • 减少行数: ${diffLines}`));
  } else {
    console.log(chalk.gray(`   • 行数无变化`));
  }
}

/**
 * 主函数：同步文章
 */
async function syncArticle() {
  console.log(chalk.bold.cyan('\n🔄 开始同步 AI 前沿分享文章\n'));
  console.log(chalk.gray(`源地址: ${CONFIG.githubReadmeUrl}`));
  console.log(chalk.gray(`目标文件: ${CONFIG.targetFile}\n`));

  try {
    // 1. 读取本地现有内容（如果存在）- 仅用于显示统计
    let oldContent = '';
    if (await fs.pathExists(CONFIG.targetFile)) {
      oldContent = await fs.readFile(CONFIG.targetFile, 'utf-8');
    }

    // 2. 从 GitHub 获取最新内容
    const newContent = await fetchGithubReadme();

    // 3. 显示差异统计
    if (oldContent) {
      await showDiff(oldContent, newContent);
    } else {
      console.log(chalk.cyan('\n📊 首次同步'));
    }

    // 4. 直接保存到本地（无条件覆盖）
    await saveToLocal(newContent);

    // 5. 显示成功信息
    console.log(chalk.bold.green('\n✅ 同步完成！\n'));
    console.log(chalk.cyan('📝 更新内容:'));
    console.log(chalk.gray(`   • 文件路径: ${CONFIG.targetFile}`));
    console.log(chalk.gray(`   • 文件大小: ${(newContent.length / 1024).toFixed(2)} KB`));

    // 6. 提取最新文章标题（第一个markdown链接）
    const latestArticleMatch = newContent.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (latestArticleMatch) {
      console.log(chalk.gray(`   • 最新文章: ${latestArticleMatch[1]}`));
    }

  } catch (error) {
    console.error(chalk.bold.red('\n❌ 同步失败！\n'));
    console.error(chalk.red('错误信息:'), error.message);
    process.exit(1);
  }
}

// 运行同步
syncArticle();
