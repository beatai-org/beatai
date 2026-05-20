// Usage:
//   node scripts/generate-ai-insights-cover-thumbs.mjs --dry-run   # 仅扫描，不动文件
//   node scripts/generate-ai-insights-cover-thumbs.mjs             # 生成缩略图 + 改写 cover
//
// 一次性回填：为 public/docs/ai-insights/ 下历史文章的本地封面生成列表缩略图衍生
// <name>.thumb.webp（宽 400 / q72），并把指向它的引用写回 cover 字段——
//   - _meta.json 里 sections[].items[].cover
//   - 对应文章 .md 的 frontmatter cover
// cover 只用于 /ai-insights 文章卡片，卡片只占 160px，故直接指向缩略图。
// 同时清除早期方案残留的 coverThumb 字段。
//
// 远端 URL 封面（substack CDN 等）无法本地衍生，cover 原样保留。
// 新文章的 cover 衍生由 material-pipeline 的 publish.js 负责。
// 缩略图转码委托给 scripts/lib/image-webp.mjs 的 makeThumbnail。

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { checkTools, makeThumbnail, thumbRefPath, fmtMB } from './lib/image-webp.mjs';

const ROOT = '/Users/sunfei/development/beatai';
const META = join(ROOT, 'public/docs/ai-insights/_meta.json');

const DRY = process.argv.includes('--dry-run');

// 在 .md frontmatter 里更新一个标量字段（cover）。无 frontmatter 块则跳过。
function upsertFrontmatterField(mdPath, key, value) {
  let text;
  try {
    text = readFileSync(mdPath, 'utf8');
  } catch {
    return false;
  }
  const m = text.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!m) return false;
  const lines = m[2].split(/\r?\n/);
  const line = `${key}: ${value}`;
  const i = lines.findIndex((l) => new RegExp(`^${key}\\s*:`).test(l));
  if (i >= 0) {
    if (lines[i] === line) return false;
    lines[i] = line;
  } else {
    lines.push(line);
  }
  writeFileSync(mdPath, m[1] + lines.join('\n') + m[3] + text.slice(m[0].length), 'utf8');
  return true;
}

const tools = checkTools();
if (!tools.ok) {
  console.error('✗ 缺少必需工具:');
  for (const t of tools.missing) console.error(`   ${t}`);
  console.error('  请先 `brew install webp` 或设置 CWEBP_BIN 环境变量。');
  process.exit(1);
}

if (!existsSync(META)) {
  console.error(`✗ _meta.json 不存在: ${META}`);
  process.exit(1);
}

console.log(`📋 meta:     ${META}`);
console.log(`📋 dry-run:  ${DRY ? 'yes' : 'no'}`);
console.log('');

const meta = JSON.parse(readFileSync(META, 'utf8'));
const items = [];
for (const s of meta.sections || []) {
  for (const it of s?.items || []) items.push(it);
}

let repointed = 0;
let fmUpdated = 0;
let skippedRemote = 0;
let skippedDone = 0;
let failed = 0;
let totalBefore = 0;
let totalAfter = 0;

for (const item of items) {
  // 清除早期方案残留字段
  if ('coverThumb' in item) delete item.coverThumb;

  if (!item.cover) continue;

  const thumbRef = thumbRefPath(item.cover);
  if (!thumbRef) {
    skippedRemote++;
    continue;
  }
  if (thumbRef === item.cover) {
    // cover 已指向 .thumb.webp，无需再处理
    skippedDone++;
    continue;
  }

  // item.file 形如 /docs/ai-insights/YYYY-MM/DD/slug.md → public/ 下；cover 相对该 md。
  const mdAbs = join(ROOT, 'public', item.file);
  const srcAbs = resolve(dirname(mdAbs), item.cover);

  if (DRY) {
    console.log(`  [dry] ${existsSync(srcAbs) ? '将衍生 → ' + thumbRef : '✗ 原图缺失 ' + srcAbs}`);
    if (existsSync(srcAbs)) repointed++;
    else failed++;
    continue;
  }

  const r = makeThumbnail(srcAbs);
  if (!r.ok) {
    console.error(`  ⚠ ${item.path}: ${r.error || r.skipped}`);
    failed++;
    continue;
  }

  item.cover = thumbRef;
  repointed++;
  if (upsertFrontmatterField(mdAbs, 'cover', thumbRef)) fmUpdated++;

  if (typeof r.before === 'number') {
    totalBefore += r.before;
    totalAfter += r.after;
    console.log(`  ✓ ${fmtMB(r.before).padStart(8)} → ${fmtMB(r.after).padStart(8)}  ${thumbRef}`);
  } else {
    console.log(`  ✓ (缩略图已存在，仅改写 cover)  ${thumbRef}`);
  }
}

console.log('');
console.log('📊 总量:');
console.log(`   articles:        ${items.length}`);
console.log(`   cover 改写:      ${repointed}`);
console.log(`   frontmatter 改写: ${fmUpdated}`);
console.log(`   跳过(远端封面):  ${skippedRemote}`);
console.log(`   跳过(已是缩略图): ${skippedDone}`);
console.log(`   失败:            ${failed}`);
if (totalBefore > 0) {
  const pct = Math.round((1 - totalAfter / totalBefore) * 100);
  console.log(`   原图 ${fmtMB(totalBefore)} → 缩略图 ${fmtMB(totalAfter)} (省 ${pct}%)`);
}

if (DRY) {
  console.log('');
  console.log('--dry-run，未生成缩略图、未改写任何文件。');
  process.exit(0);
}

writeFileSync(META, JSON.stringify(meta, null, 2) + '\n', 'utf8');
console.log('');
console.log(`✓ 已回写 _meta.json`);
