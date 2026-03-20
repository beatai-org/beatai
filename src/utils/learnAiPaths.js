export const LEARN_CLAUDE_CODE_BASE_PATH = '/learn-ai/learn-claude-code';
export const LEARN_AI_PRACTICES_BASE_PATH = '/learn-ai/practices';
export const LEGACY_LEARN_CLAUDE_CODE_BASE_PATH = '/learn-claude-code';

export function isPracticeVersion(version = '') {
  return /^bp\d+$/i.test(String(version || ''));
}

export function getLearnClaudeCodePath(version = '') {
  const basePath = isPracticeVersion(version)
    ? LEARN_AI_PRACTICES_BASE_PATH
    : LEARN_CLAUDE_CODE_BASE_PATH;

  return version
    ? `${basePath}/${version}`
    : basePath;
}

export function rewriteLegacyLearnClaudeCodePath(pathname = '') {
  if (!pathname.startsWith(LEGACY_LEARN_CLAUDE_CODE_BASE_PATH)) {
    return pathname;
  }

  const version = pathname
    .replace(`${LEGACY_LEARN_CLAUDE_CODE_BASE_PATH}/`, '')
    .split('/')[0];

  return pathname.replace(
    LEGACY_LEARN_CLAUDE_CODE_BASE_PATH,
    isPracticeVersion(version) ? LEARN_AI_PRACTICES_BASE_PATH : LEARN_CLAUDE_CODE_BASE_PATH
  );
}
