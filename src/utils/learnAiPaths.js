import {
  getDefaultLearnAiSpace,
  getLearnAiSpace,
  getLearnAiSpaceByVersion
} from './learnAiSpaces';

export const LEARN_AI_BASE_PATH = '/learn-ai';
export const LEARN_CLAUDE_CODE_BASE_PATH = '/learn-ai/learn-claude-code';
export const LEGACY_LEARN_CLAUDE_CODE_BASE_PATH = '/learn-claude-code';

export function getLearnAiSpacePath(spaceSlug = '') {
  const space = getLearnAiSpace(spaceSlug) || getDefaultLearnAiSpace();
  return `${LEARN_AI_BASE_PATH}/${space?.slug || ''}`.replace(/\/$/, '');
}

export function getLearnAiEntryPath(version = '') {
  const space = getLearnAiSpaceByVersion(version) || getDefaultLearnAiSpace();
  const basePath = getLearnAiSpacePath(space?.slug);

  return version
    ? `${basePath}/${version}`
    : basePath;
}

export function getLearnAiDefaultPath(spaceSlug = '') {
  const space = getLearnAiSpace(spaceSlug) || getDefaultLearnAiSpace();
  if (space?.defaultPath) {
    return space.defaultPath;
  }
  return getLearnAiEntryPath(space?.defaultEntry || '');
}

// Backward-compatible alias for existing callers.
export const getLearnClaudeCodePath = getLearnAiEntryPath;

export function rewriteLegacyLearnClaudeCodePath(pathname = '') {
  if (!pathname.startsWith(LEGACY_LEARN_CLAUDE_CODE_BASE_PATH)) {
    return pathname;
  }

  const version = pathname
    .replace(`${LEGACY_LEARN_CLAUDE_CODE_BASE_PATH}/`, '')
    .split('/')[0];

  return pathname.replace(
    LEGACY_LEARN_CLAUDE_CODE_BASE_PATH,
    getLearnAiSpacePath(getLearnAiSpaceByVersion(version)?.slug)
  );
}
