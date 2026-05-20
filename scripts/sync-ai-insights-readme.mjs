#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const AI_INSIGHTS_DIR = join(REPO_ROOT, 'public/docs/ai-insights');
const README_PATH = join(REPO_ROOT, 'README.md');
const BASE_URL = 'https://beatai.org';
const MONTH_RE = /^\d{4}-\d{2}$/;
const DAY_RE = /^\d{2}$/;
const HEADER = '# BeatAI';
const WINDOW_DAYS = 30;
const ARCHIVE_URL = `${BASE_URL}/ai-insights`;

function withinWindow(dateStr, today, days) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  const cutoff = new Date(today);
  cutoff.setUTCDate(cutoff.getUTCDate() - days);
  return d >= cutoff;
}

function unquote(s) {
  return s.trim().replace(/^["']|["']$/g, '');
}

function extractMeta(mdPath) {
  const raw = readFileSync(mdPath, 'utf-8');
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  let title = '';
  let summary = '';
  if (fm) {
    const t = fm[1].match(/^title:\s*(.+)$/m);
    if (t) title = unquote(t[1]);
    const s = fm[1].match(/^summary:\s*(.+)$/m);
    if (s) summary = unquote(s[1]);
  }
  if (!title) {
    const h1 = raw.match(/^#\s+(.+)$/m);
    title = h1 ? h1[1].trim() : basename(mdPath, '.md');
  }
  return { title, summary };
}

function collectArticles(today) {
  const monthDirs = readdirSync(AI_INSIGHTS_DIR)
    .filter((name) => MONTH_RE.test(name))
    .filter((name) => statSync(join(AI_INSIGHTS_DIR, name)).isDirectory());

  const byDate = new Map();
  for (const month of monthDirs) {
    const monthPath = join(AI_INSIGHTS_DIR, month);
    const dayDirs = readdirSync(monthPath)
      .filter((name) => DAY_RE.test(name))
      .filter((name) => statSync(join(monthPath, name)).isDirectory());
    for (const day of dayDirs) {
      const date = `${month}-${day}`;
      if (!withinWindow(date, today, WINDOW_DAYS)) continue;
      const dirPath = join(monthPath, day);
      const articles = readdirSync(dirPath)
        .filter((f) => f.endsWith('.md'))
        .map((f) => {
          const slug = f.replace(/\.md$/, '');
          const { title, summary } = extractMeta(join(dirPath, f));
          return {
            slug,
            title,
            summary,
            url: `${BASE_URL}/ai-insights/${slug}?mode=read`,
          };
        })
        .sort((a, b) => a.slug.localeCompare(b.slug));
      if (articles.length) byDate.set(date, articles);
    }
  }
  return byDate;
}

function render(byDate) {
  const lines = [
    HEADER,
    '',
    `> 最近 ${WINDOW_DAYS} 天发布 · 完整列表见 <${ARCHIVE_URL}>`,
    '',
  ];
  const dates = [...byDate.keys()].sort().reverse();
  if (dates.length === 0) {
    lines.push(`_最近 ${WINDOW_DAYS} 天暂无新文章。_`);
  }
  for (const date of dates) {
    lines.push(`### ${date}`, '');
    for (const a of byDate.get(date)) {
      if (a.summary) {
        lines.push(`- [${a.title}](${a.url})  `);
        lines.push(`  ${a.summary}`);
      } else {
        lines.push(`- [${a.title}](${a.url})`);
      }
    }
    lines.push('');
  }
  return lines.join('\n').trimEnd() + '\n';
}

const dryRun = process.argv.includes('--dry-run');
const today = new Date();
const byDate = collectArticles(today);
const next = render(byDate);
const articleCount = [...byDate.values()].reduce((s, a) => s + a.length, 0);

if (dryRun) {
  process.stdout.write(next);
  console.error(`\n[dry-run] ${byDate.size} days · ${articleCount} articles · README not written`);
  process.exit(0);
}

const current = readFileSync(README_PATH, 'utf-8');
if (current === next) {
  console.log(`README.md is up to date (${byDate.size} days · ${articleCount} articles)`);
  process.exit(0);
}

writeFileSync(README_PATH, next);
console.log(`Wrote README.md: ${byDate.size} days · ${articleCount} articles`);
