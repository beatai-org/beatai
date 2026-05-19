// Usage:
//   node scripts/optimize-ai-insights-images.mjs --dry-run    # 仅估算，不动文件
//   node scripts/optimize-ai-insights-images.mjs              # 实际转码 + 改写 .md
//
// 一次性回收 public/docs/ai-insights/ 下历史文章的图片体积：
//   - PNG → WebP (lossy q=80)：照片/截图常见 90% 压缩比
//   - GIF → animated WebP (lossy q=75 + mixed mode)：典型 90~95% 压缩比
//   - JPG/JPEG/WEBP：跳过（jpg 已是有损，再转 webp 不划算且会 double-lossy）
//
// 流程：
//   1) 转码所有 png/gif → 同目录同名 .webp
//   2) 删除原 png/gif
//   3) 扫所有 .md，把图片引用里的 `.png` / `.gif` 改成 `.webp`
//      （只匹配 path 形如 `images/.../file.ext` 的部分，alt text 中的字面量不动）
//
// 失败处理：单文件 cwebp/gif2webp 失败 → 保留原文件，记录 error；不阻塞其它文件。

import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ROOT = '/Users/sunfei/development/beatai';
const TARGET = join(ROOT, 'public/docs/ai-insights');
const CWEBP = process.env.CWEBP_BIN || '/opt/homebrew/bin/cwebp';
const GIF2WEBP = process.env.GIF2WEBP_BIN || '/opt/homebrew/bin/gif2webp';
const PNG_Q = 80;
const GIF_Q = 75;

const DRY = process.argv.includes('--dry-run');

function walkFiles(dir, exts) {
  const out = [];
  for (const f of readdirSync(dir)) {
    const full = join(dir, f);
    let s;
    try { s = statSync(full); } catch { continue; }
    if (s.isDirectory()) out.push(...walkFiles(full, exts));
    else if (exts.has(extname(f).toLowerCase())) out.push(full);
  }
  return out;
}

function fmtMB(b) {
  return (b / 1048576).toFixed(2) + ' MB';
}

const pngs = walkFiles(TARGET, new Set(['.png']));
const gifs = walkFiles(TARGET, new Set(['.gif']));
console.log(`📋 target:    ${TARGET}`);
console.log(`📋 png:       ${pngs.length} 张`);
console.log(`📋 gif:       ${gifs.length} 张`);
console.log(`📋 dry-run:   ${DRY ? 'yes' : 'no'}`);
console.log('');

let totalBefore = 0;
let totalAfter = 0;
let converted = 0;
let failed = 0;
const failures = [];

function convert(src, kind) {
  const before = statSync(src).size;
  totalBefore += before;
  const dst = src.replace(/\.(png|gif)$/i, '.webp');

  if (DRY) {
    // 估算系数从 benchmark + 业界经验：png ≈ 10%、gif ≈ 5% 残留
    const est = kind === 'png' ? before * 0.1 : before * 0.05;
    totalAfter += est;
    converted++;
    return;
  }

  const tool = kind === 'png' ? CWEBP : GIF2WEBP;
  const args = kind === 'png'
    ? ['-q', String(PNG_Q), '-quiet', src, '-o', dst]
    : ['-q', String(GIF_Q), '-quiet', '-mixed', src, '-o', dst];
  const r = spawnSync(tool, args, { stdio: 'pipe' });
  if (r.status !== 0) {
    failed++;
    failures.push({ src: relative(ROOT, src), error: r.stderr?.toString() || `exit ${r.status}` });
    return;
  }
  const after = statSync(dst).size;
  totalAfter += after;
  unlinkSync(src);
  converted++;
  const pct = Math.round((1 - after / before) * 100);
  console.log(`  ✓ ${kind}  ${fmtMB(before).padStart(8)} → ${fmtMB(after).padStart(8)}  (-${pct}%)  ${relative(ROOT, dst)}`);
}

console.log('▶ 转码');
for (const f of pngs) convert(f, 'png');
for (const f of gifs) convert(f, 'gif');
console.log('');
console.log(`📊 总量:`);
console.log(`   converted:  ${converted}`);
console.log(`   failed:     ${failed}`);
console.log(`   ${DRY ? '估算' : '实际'}: ${fmtMB(totalBefore)} → ${DRY ? '≈' : ''}${fmtMB(totalAfter)} (省 ≈ ${fmtMB(totalBefore - totalAfter)}, ${Math.round((1 - totalAfter / totalBefore) * 100)}%)`);
if (failures.length > 0) {
  console.log('');
  console.log('⚠ 转码失败:');
  for (const f of failures) console.log(`   ${f.src}  →  ${f.error.split('\n')[0]}`);
}

if (DRY) {
  console.log('');
  console.log('--dry-run，未改任何文件，未改写 .md。');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// 改写 .md 中的图片引用
// ---------------------------------------------------------------------------

console.log('');
console.log('▶ 改写 .md 图片引用');
const mds = walkFiles(TARGET, new Set(['.md']));
let mdsTouched = 0;
let refsReplaced = 0;
for (const md of mds) {
  const before = readFileSync(md, 'utf8');
  const after = before.replace(/(images\/[^\s)"'<>]+?)\.(png|gif)/gi, (_m, p1) => {
    refsReplaced++;
    return p1 + '.webp';
  });
  if (after !== before) {
    writeFileSync(md, after);
    mdsTouched++;
  }
}
console.log(`   .md touched:    ${mdsTouched}`);
console.log(`   refs replaced:  ${refsReplaced}`);
