#!/usr/bin/env node

import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const extractScriptPath = path.join(repoRoot, '.claude', 'skills', 'extract-article', 'scripts', 'extract_html.py');
const deepLearningRoot = path.join(repoRoot, 'public', 'docs', 'learn-ai', 'deep-learning');
const metaPath = path.join(deepLearningRoot, '_meta.json');
const defaultSummaryPath = path.join(os.homedir(), 'Downloads', 'test-book', 'SUMMARY.md');
const siteBaseUrl = 'https://www.rethink.fun';

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      throw new Error(`Unexpected argument: ${token}`);
    }

    const key = token.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for ${token}`);
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

function parseSummaryEntries(summaryContent) {
  const entries = summaryContent
    .split('\n')
    .map((line) => line.match(/^\s*-\s+\[(.+?)\]\((.+?\.md)\)\s*$/))
    .filter(Boolean)
    .map((match) => ({
      title: match[1].trim(),
      sourcePath: match[2].trim()
    }))
    .filter((entry) => entry.sourcePath !== 'README.md' && entry.sourcePath !== 'AFTER.md');

  const deduped = [];
  const pathToIndex = new Map();

  for (const entry of entries) {
    const existingIndex = pathToIndex.get(entry.sourcePath);

    if (existingIndex !== undefined) {
      deduped[existingIndex] = entry;
      continue;
    }

    pathToIndex.set(entry.sourcePath, deduped.length);
    deduped.push(entry);
  }

  return deduped;
}

function flattenMetaItems(meta) {
  return meta.sections.flatMap((section) => section.items.map((item) => ({
    title: item.title,
    file: item.file
  })));
}

function encodeUrlPath(markdownPath) {
  const htmlPath = markdownPath.replace(/\.md$/i, '.html');
  return htmlPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function buildSourceUrl(markdownPath) {
  if (markdownPath === 'README.md') {
    return `${siteBaseUrl}/`;
  }

  return `${siteBaseUrl}/${encodeUrlPath(markdownPath)}`;
}

function replaceImageUrls(markdown, targetFilePath) {
  return markdown.replace(/!\[([^\]]*)\]\((https?:\/\/(?:www\.)?rethink\.fun\/imgs\/([^)\s]+))\)/g, (_, alt, _url, filename) => {
    const relativePath = path.posix.relative(
      path.posix.dirname(targetFilePath),
      path.posix.join('/docs/learn-ai/deep-learning/imgs', filename)
    );
    return `![${alt}](${relativePath})`;
  });
}

function cleanExtractedMarkdown(markdown, targetFilePath) {
  return replaceImageUrls(markdown, targetFilePath)
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}

async function fetchPageMarkdown(url) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'deep-learning-page-'));
  const htmlPath = path.join(tempDir, 'page.html');

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const html = await response.text();
    await fs.writeFile(htmlPath, html, 'utf8');

    const { stdout } = await execFileAsync('python3', [extractScriptPath, htmlPath], {
      cwd: repoRoot,
      maxBuffer: 16 * 1024 * 1024
    });

    return stdout;
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const summaryPath = path.resolve(args.summary || defaultSummaryPath);
  const offset = Number.parseInt(args.offset || '0', 10);
  const limit = Number.parseInt(args.limit || '0', 10);
  const summaryContent = await fs.readFile(summaryPath, 'utf8');
  const summaryEntries = parseSummaryEntries(summaryContent);
  const meta = JSON.parse(await fs.readFile(metaPath, 'utf8'));
  const metaItems = flattenMetaItems(meta);

  if (summaryEntries.length !== metaItems.length) {
    throw new Error(`Entry count mismatch: summary=${summaryEntries.length}, meta=${metaItems.length}`);
  }

  const endExclusive = limit > 0 ? Math.min(offset + limit, metaItems.length) : metaItems.length;

  for (let index = offset; index < endExclusive; index += 1) {
    const metaItem = metaItems[index];
    const summaryEntry = summaryEntries[index];

    if (metaItem.title.trim() !== summaryEntry.title.trim()) {
      throw new Error(`Title mismatch at index ${index}: meta="${metaItem.title}", summary="${summaryEntry.title}"`);
    }

    const sourceUrl = buildSourceUrl(summaryEntry.sourcePath);
    const extractedMarkdown = await fetchPageMarkdown(sourceUrl);
    const cleanedMarkdown = cleanExtractedMarkdown(extractedMarkdown, metaItem.file);
    const absoluteTargetPath = path.join(repoRoot, 'public', metaItem.file.replace(/^\//, ''));

    await fs.writeFile(absoluteTargetPath, cleanedMarkdown, 'utf8');
    console.log(`Synced ${metaItem.file} <- ${sourceUrl}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
