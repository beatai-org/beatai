import { LAYERS, zhMessages } from '../../vendor/learn-claude-code/data';
import { getLearnClaudeCodePath, LEARN_CLAUDE_CODE_BASE_PATH } from '../../utils/learnAiPaths';
import { getVersionNavTitle } from './versionUtils';

function mapLayerToSidebarItem(layer) {
  const versions = layer.versions || [];
  const firstVersion = versions[0];
  const title = zhMessages.layer_labels?.[layer.id] || layer.label;

  if (layer.id === 'introduction') {
    return {
      title,
      path: firstVersion ? getLearnClaudeCodePath(firstVersion) : LEARN_CLAUDE_CODE_BASE_PATH
    };
  }

  return {
    title,
    path: firstVersion ? getLearnClaudeCodePath(firstVersion) : LEARN_CLAUDE_CODE_BASE_PATH,
    highlightable: false,
    children: versions.map((versionId) => ({
      title: getVersionNavTitle(versionId),
      path: getLearnClaudeCodePath(versionId)
    }))
  };
}

function mapBestPracticeItems(layer) {
  return (layer.versions || []).map((versionId) => ({
    title: getVersionNavTitle(versionId),
    path: getLearnClaudeCodePath(versionId)
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

  return { title: 'AI 学习宝典', sections };
}
