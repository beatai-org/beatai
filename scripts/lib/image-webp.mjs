// 共享转码工具：把 PNG/GIF 用 cwebp / gif2webp 转成 WebP，并把 .md 中的图片引用改写为 .webp。
//
// 消费者：
//   - scripts/optimize-ai-insights-images.mjs（一次性回收旧图）
//   - .claude/skills/material-pipeline/scripts/compress-images.js（每日 pipeline 在 translate 后压缩）
//
// 设计原则：纯函数 + 显式参数；不读 env 路径、不打 process.exit、不假设 CLI 形态。
// 调用方决定 root / md 范围 / 是否 dry-run / 失败处理；本模块只做转码和返回数据。

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

export const DEFAULT_CWEBP = process.env.CWEBP_BIN || '/opt/homebrew/bin/cwebp';
export const DEFAULT_GIF2WEBP = process.env.GIF2WEBP_BIN || '/opt/homebrew/bin/gif2webp';

/**
 * 检查 cwebp / gif2webp 是否可用。
 * 返回 { ok, missing: [absolute-path,...] }。
 * 调用方决定是否退出 / 提示用户 `brew install webp`。
 */
export function checkTools({ cwebp = DEFAULT_CWEBP, gif2webp = DEFAULT_GIF2WEBP } = {}) {
  const missing = [];
  for (const t of [cwebp, gif2webp]) {
    if (!existsSync(t)) missing.push(t);
  }
  return { ok: missing.length === 0, missing };
}

/** 同步递归遍历目录，返回所有指定后缀的文件绝对路径。 */
export function walkFiles(dir, exts) {
  const lc = new Set([...exts].map((e) => e.toLowerCase()));
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const f of entries) {
    const full = join(dir, f);
    let s;
    try { s = statSync(full); } catch { continue; }
    if (s.isDirectory()) out.push(...walkFiles(full, exts));
    else if (lc.has(extname(f).toLowerCase())) out.push(full);
  }
  return out;
}

export function fmtMB(bytes) {
  return (bytes / 1048576).toFixed(2) + ' MB';
}

// 列表卡片缩略图默认规格：宽 400px（卡片显示 160px，@2.5x 覆盖高 DPR），q72。
export const DEFAULT_THUMB_WIDTH = 400;
export const DEFAULT_THUMB_QUALITY = 72;
const THUMB_SUFFIX = '.thumb.webp';

/**
 * 由封面图引用推出缩略图引用（不碰文件，纯字符串）。
 *   ./images/x/cover.jpg   → ./images/x/cover.thumb.webp
 *   远端 http(s) URL        → null（无法本地衍生，调用方回退原图）
 *   已是 .thumb.webp 的引用 → 原样返回
 */
export function thumbRefPath(coverRef) {
  if (!coverRef || /^https?:\/\//i.test(coverRef)) return null;
  if (coverRef.toLowerCase().endsWith(THUMB_SUFFIX)) return coverRef;
  return coverRef.replace(/\.[^.\/?#]+(?=$|[?#])/, THUMB_SUFFIX);
}

/**
 * 为一张本地图片生成缩略图衍生 `<name>.thumb.webp`（同目录），用于列表/卡片。
 * cwebp 支持 png/jpg/webp 输入；-resize <w> 0 等比缩放。
 *
 * 参数：
 *   srcPath  必填；原图绝对路径
 *   width    缩略图目标宽度，默认 400
 *   quality  cwebp -q，默认 72
 *   force    目标已存在时是否重新生成（默认 false → 幂等跳过）
 *   cwebp    cwebp 二进制路径
 *
 * 返回：{ ok, dst?, before?, after?, skipped?, error? }
 */
export function makeThumbnail(srcPath, {
  width = DEFAULT_THUMB_WIDTH,
  quality = DEFAULT_THUMB_QUALITY,
  force = false,
  cwebp = DEFAULT_CWEBP,
} = {}) {
  if (!srcPath || /^https?:\/\//i.test(srcPath)) return { ok: false, skipped: 'remote' };
  if (srcPath.toLowerCase().endsWith(THUMB_SUFFIX)) return { ok: false, skipped: 'already-thumb' };
  if (!existsSync(srcPath)) return { ok: false, error: `src not found: ${srcPath}` };

  const dst = srcPath.replace(/\.[^.\/]+$/, THUMB_SUFFIX);
  if (existsSync(dst) && !force) return { ok: true, dst, skipped: 'exists' };

  const r = spawnSync(
    cwebp,
    ['-q', String(quality), '-resize', String(width), '0', '-quiet', srcPath, '-o', dst],
    { stdio: 'pipe' }
  );
  if (r.status !== 0) {
    return { ok: false, error: (r.stderr?.toString() || `exit ${r.status}`).trim() };
  }
  return { ok: true, dst, before: statSync(srcPath).size, after: statSync(dst).size };
}

/**
 * 把 root 下所有 png/gif 转成同目录 .webp，删除原文件。
 *
 * 参数：
 *   root        必填；递归扫描的目录
 *   pngQ        cwebp -q，默认 80
 *   gifQ        gif2webp -q，默认 75（搭配 -mixed）
 *   dryRun      只估算，不实际转码（PNG 残留 ~10%、GIF ~5%）
 *   cwebp       cwebp 二进制路径
 *   gif2webp    gif2webp 二进制路径
 *   logRoot     打日志时 relative 起点（让输出更可读，默认 root）
 *   logger      `(msg) => void`，默认 console.log；可传 () => {} 静默
 *
 * 返回：
 *   { pngCount, gifCount, converted, failed, failures, totalBefore, totalAfter }
 */
export function compressTree({
  root,
  pngQ = 80,
  gifQ = 75,
  dryRun = false,
  cwebp = DEFAULT_CWEBP,
  gif2webp = DEFAULT_GIF2WEBP,
  logRoot = root,
  logger = console.log,
} = {}) {
  if (!root) throw new Error('compressTree: root is required');
  const pngs = walkFiles(root, ['.png']);
  const gifs = walkFiles(root, ['.gif']);

  let totalBefore = 0;
  let totalAfter = 0;
  let converted = 0;
  let failed = 0;
  const failures = [];

  function convert(src, kind) {
    const before = statSync(src).size;
    totalBefore += before;
    const dst = src.replace(/\.(png|gif)$/i, '.webp');

    if (dryRun) {
      const est = kind === 'png' ? before * 0.1 : before * 0.05;
      totalAfter += est;
      converted++;
      return;
    }

    const tool = kind === 'png' ? cwebp : gif2webp;
    const args = kind === 'png'
      ? ['-q', String(pngQ), '-quiet', src, '-o', dst]
      : ['-q', String(gifQ), '-quiet', '-mixed', src, '-o', dst];
    const r = spawnSync(tool, args, { stdio: 'pipe' });
    if (r.status !== 0) {
      failed++;
      failures.push({
        src: relative(logRoot, src),
        kind,
        error: (r.stderr?.toString() || '').trim() || `exit ${r.status}`,
      });
      return;
    }
    const after = statSync(dst).size;
    totalAfter += after;
    unlinkSync(src);
    converted++;
    const pct = Math.round((1 - after / before) * 100);
    logger(`  ✓ ${kind}  ${fmtMB(before).padStart(8)} → ${fmtMB(after).padStart(8)}  (-${pct}%)  ${relative(logRoot, dst)}`);
  }

  for (const f of pngs) convert(f, 'png');
  for (const f of gifs) convert(f, 'gif');

  return {
    pngCount: pngs.length,
    gifCount: gifs.length,
    converted,
    failed,
    failures,
    totalBefore,
    totalAfter,
  };
}

/**
 * 改写一组 .md 文件中 `images/.../<name>.(png|gif)` 引用为 `.webp`。
 * 只匹配 path 形如 `images/...` 的部分；alt text 中的字面量 `.png` 不动。
 *
 * 参数：
 *   mdFiles  必填；要扫描的 .md 绝对路径数组（由调用方决定范围）
 *   dryRun   true 时不写盘
 *
 * 返回：
 *   { mdsTouched, refsReplaced }
 */
export function rewriteMdRefs({ mdFiles, dryRun = false } = {}) {
  if (!Array.isArray(mdFiles)) throw new Error('rewriteMdRefs: mdFiles must be an array');
  let mdsTouched = 0;
  let refsReplaced = 0;
  for (const md of mdFiles) {
    const before = readFileSync(md, 'utf8');
    let count = 0;
    const after = before.replace(/(images\/[^\s)"'<>]+?)\.(png|gif)/gi, (_m, p1) => {
      count++;
      return p1 + '.webp';
    });
    if (after !== before) {
      if (!dryRun) writeFileSync(md, after);
      mdsTouched++;
      refsReplaced += count;
    }
  }
  return { mdsTouched, refsReplaced };
}
