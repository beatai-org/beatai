import { LAYERS, zhMessages } from '../../vendor/learn-claude-code/data';
import { getVersionNavTitle } from './versionUtils';

function mapLayerToSidebarItem(layer) {
  const versions = layer.versions || [];
  const firstVersion = versions[0];
  const title = zhMessages.layer_labels?.[layer.id] || layer.label;

  if (layer.id === 'introduction') {
    return {
      title,
      path: firstVersion ? `/learn-claude-code/${firstVersion}` : '/learn-claude-code'
    };
  }

  return {
    title,
    path: firstVersion ? `/learn-claude-code/${firstVersion}` : '/learn-claude-code',
    highlightable: false,
    children: versions.map((versionId) => ({
      title: getVersionNavTitle(versionId),
      path: `/learn-claude-code/${versionId}`
    }))
  };
}

function mapBestPracticeItems(layer) {
  return (layer.versions || []).map((versionId) => ({
    title: getVersionNavTitle(versionId),
    path: `/learn-claude-code/${versionId}`
  }));
}

export function buildLearnClaudeCodeSidebarMeta() {
  const courseLayers = LAYERS.filter((layer) => layer.id !== 'best-practices');
  const bestPracticeLayers = LAYERS.filter((layer) => layer.id === 'best-practices');
  const sections = [
    {
      title: '从零手搓 Claude Code',
      items: courseLayers.map(mapLayerToSidebarItem)
    }
  ];

  if (bestPracticeLayers.length > 0) {
    sections.push({
      title: '最佳实践',
      items: bestPracticeLayers.flatMap(mapBestPracticeItems)
    });
  }

  return { title: 'CC宝典', sections };
}
