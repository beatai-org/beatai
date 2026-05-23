import { LAYERS, zhMessages } from '../../vendor/learn-claude-code/data';
import { getLearnAiEntryPath, getLearnAiSpacePath } from '../../utils/learnAiPaths';
import { getLearnAiSpace, LEARN_AI_SPACES } from '../../utils/learnAiSpaces';
import { PAGE_CONFIG, PAGE_IDS } from '../../utils/pageConfig';
import { getVersionNavTitle } from './versionUtils';

const AI_TUTORIALS_TITLE = PAGE_CONFIG[PAGE_IDS.aiTutorials].title;

function mapLayerToSidebarItem(layer, space) {
  const versions = layer.versions || [];
  const firstVersion = versions[0];
  const title = zhMessages.layer_labels?.[layer.id] || layer.label;

  if (layer.id === 'introduction') {
    return {
      title,
      path: firstVersion ? getLearnAiEntryPath(firstVersion) : getLearnAiSpacePath(space.slug)
    };
  }

  return {
    title,
    path: firstVersion ? getLearnAiEntryPath(firstVersion) : getLearnAiSpacePath(space.slug),
    highlightable: false,
    children: versions.map((versionId) => ({
      title: getVersionNavTitle(versionId),
      path: getLearnAiEntryPath(versionId)
    }))
  };
}

function mapFlatSpaceItems(space) {
  return (space.versionIds || []).map((versionId) => ({
    title: getVersionNavTitle(versionId),
    path: getLearnAiEntryPath(versionId)
  }));
}

export function buildLearnAiSidebarMeta(currentSpace = null) {
  const resolvedCurrentSpace = currentSpace?.slug
    ? (getLearnAiSpace(currentSpace.slug) || currentSpace)
    : LEARN_AI_SPACES.find((space) => (
      space.id === currentSpace?.id ||
      space.title === currentSpace?.title ||
      space.bookTitle === currentSpace?.bookTitle
    )) || currentSpace;

  if (resolvedCurrentSpace?.contentSource === 'docs') {
    return {
      title: resolvedCurrentSpace.bookTitle || resolvedCurrentSpace.title,
      sections: resolvedCurrentSpace.sections || [],
      githubRepo: resolvedCurrentSpace.githubRepo,
      repoTitle: resolvedCurrentSpace.repoTitle,
      bookPath: {
        parentTitle: AI_TUTORIALS_TITLE,
        currentTitle: resolvedCurrentSpace.bookTitle || resolvedCurrentSpace.title || AI_TUTORIALS_TITLE
      }
    };
  }

  const targetSpaces = resolvedCurrentSpace
    ? [resolvedCurrentSpace]
    : LEARN_AI_SPACES.filter((space) => space.contentSource !== 'docs');

  const sections = targetSpaces.flatMap((space) => {
    if (space.sidebarKind === 'layered') {
      const sectionGroups = space.sectionGroups?.length
        ? space.sectionGroups
        : [{ title: space.title, layerIds: space.layerIds || [] }];

      return sectionGroups.map((group) => ({
        title: group.title,
        items: group.versionIds?.length
          ? group.versionIds.map((versionId) => ({
            title: getVersionNavTitle(versionId),
            path: getLearnAiEntryPath(versionId)
          }))
          : (group.layerIds || [])
            .map((layerId) => LAYERS.find((layer) => layer.id === layerId))
            .filter(Boolean)
            .map((layer) => mapLayerToSidebarItem(layer, space))
      }));
    }

    return [{
      title: space.title,
      items: mapFlatSpaceItems(space)
    }];
  });

  return {
    title: resolvedCurrentSpace?.bookTitle || resolvedCurrentSpace?.title || 'Learn Claude Code',
    sections,
    bookPath: {
      parentTitle: AI_TUTORIALS_TITLE,
      currentTitle: resolvedCurrentSpace?.bookTitle || resolvedCurrentSpace?.title || 'Learn Claude Code'
    }
  };
}
