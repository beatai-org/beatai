import { LAYERS, VERSION_META, versionsData, zhMessages } from '../../vendor/learn-claude-code/data';

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
  return layer ? (zhMessages.layer_labels?.[layer.id] || layer.label) : 'CC宝典';
}
