import {
  ANNOTATIONS,
  LAYERS,
  LEARNING_PATH,
  SCENARIOS,
  VERSION_META,
  getFlowForVersion,
  versionsData,
  zhMessages
} from '../../vendor/learn-claude-code/data';
import { getLearnClaudeCodePath } from '../../utils/learnAiPaths';

export function getVersionData(version) {
  return versionsData.versions.find((item) => item.id === version) || null;
}

export function formatVersionCode(version) {
  return version.toUpperCase();
}

export function normalizeSessionTitle(title) {
  return String(title || '').replace(/^(s\d{2})(:|\b)/, (match, code, suffix) => (
    `${code.toUpperCase()}${suffix}`
  ));
}

export function safeSessionLabel(version) {
  return normalizeSessionTitle(
    zhMessages.sessions?.[version] || VERSION_META[version]?.title || version
  );
}

export function getVersionNavTitle(version) {
  return version === 'preface'
    ? safeSessionLabel(version)
    : `${formatVersionCode(version)} ${safeSessionLabel(version)}`;
}

export function getLayerLabelForVersion(version) {
  const layer = LAYERS.find((item) => item.versions.includes(version));
  return layer ? (zhMessages.layer_labels?.[layer.id] || layer.label) : 'AI 学习宝典';
}

export function getVersionPagination(version) {
  const pathIndex = LEARNING_PATH.indexOf(version);
  const prevVersion = pathIndex > 0 ? LEARNING_PATH[pathIndex - 1] : null;
  const nextVersion = pathIndex < LEARNING_PATH.length - 1 ? LEARNING_PATH[pathIndex + 1] : null;

  return {
    prev: prevVersion ? {
      path: getLearnClaudeCodePath(prevVersion),
      title: getVersionNavTitle(prevVersion),
      section: getLayerLabelForVersion(prevVersion)
    } : null,
    next: nextVersion ? {
      path: getLearnClaudeCodePath(nextVersion),
      title: getVersionNavTitle(nextVersion),
      section: getLayerLabelForVersion(nextVersion)
    } : null
  };
}

export function getVersionTabs(version, versionData) {
  const tabs = [{ id: 'learn', label: zhMessages.version.tab_learn }];

  if (SCENARIOS[version]) {
    tabs.push({ id: 'simulate', label: zhMessages.version.tab_simulate });
  }

  if (versionData?.source) {
    tabs.push({ id: 'code', label: zhMessages.version.tab_code });
  }

  if (getFlowForVersion(version) || ANNOTATIONS[version]?.decisions?.length) {
    tabs.push({ id: 'deep-dive', label: zhMessages.version.tab_deep_dive });
  }

  return tabs;
}
