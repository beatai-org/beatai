import {
  LEARN_CLAUDE_CODE_BASE_PATH,
  LEGACY_LEARN_CLAUDE_CODE_BASE_PATH
} from '../../utils/learnAiPaths';
import { docsData } from '../../vendor/learn-claude-code/data';

export function getVersionDoc(version, locale = 'zh') {
  return (
    docsData.find((item) => item.version === version && item.locale === locale) ||
    docsData.find((item) => item.version === version && item.locale === 'en') ||
    null
  );
}

export function stripLearningPathCode(content) {
  return String(content || '').replace(
    /\n\n`(?=[^`\n]*(?:s01|s02|s03|s04|s05|s06|s07|s08|s09|s10|s11|s12))[^`\n]*`\n\n/i,
    '\n\n'
  );
}

export function trimPrefaceContent(version, content) {
  if (version !== 'preface') {
    return String(content || '');
  }

  const marker = '\n## 快速开始';
  const normalized = String(content || '');
  const markerIndex = normalized.indexOf(marker);

  return markerIndex >= 0 ? normalized.slice(0, markerIndex).trimEnd() : normalized;
}

export function renameBookTitle(content) {
  return String(content || '').replace(
    /^# Learn Claude Code\b/m,
    '# AI 学习宝典'
  );
}

export function rewriteLearnClaudeCodeLinks(content) {
  return String(content || '').replaceAll(
    `](${LEGACY_LEARN_CLAUDE_CODE_BASE_PATH}/`,
    `](${LEARN_CLAUDE_CODE_BASE_PATH}/`
  );
}

export function transformVersionDocContent(version, content) {
  return rewriteLearnClaudeCodeLinks(
    renameBookTitle(trimPrefaceContent(version, stripLearningPathCode(content)))
  );
}
