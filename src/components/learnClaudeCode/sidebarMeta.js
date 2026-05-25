// Sidebar builder for the Learn Claude Code book (the only book whose sidebar
// is layered + driven by vendor data). The Markdown book sidebar comes from
// each book's `_meta.json` and is built by DocsLayout directly.

import { LAYERS, zhMessages } from '../../vendor/learn-claude-code/data';
import { getBookBasePath } from '../../content';
import { getLccVersionPath, getVersionNavTitle } from './versionUtils';

function mapLayerToSidebarItem(layer, book) {
  const versions = layer.versions || [];
  const firstVersion = versions[0];
  const title = zhMessages.layer_labels?.[layer.id] || layer.label;
  const fallbackPath = firstVersion ? getLccVersionPath(firstVersion) : getBookBasePath(book);

  if (layer.id === 'introduction') {
    return { title, path: fallbackPath };
  }

  return {
    title,
    path: fallbackPath,
    highlightable: false,
    children: versions.map((versionId) => ({
      title: getVersionNavTitle(versionId),
      path: getLccVersionPath(versionId)
    }))
  };
}

export function buildLccSidebarMeta(book, collection = null) {
  const lcc = book?.lcc;
  const sectionGroups = lcc?.sectionGroups?.length
    ? lcc.sectionGroups
    : [{ title: book?.title, layerIds: lcc?.layerIds || [] }];

  const sections = sectionGroups.map((group) => ({
    title: group.title,
    items: group.versionIds?.length
      ? group.versionIds.map((versionId) => ({
        title: getVersionNavTitle(versionId),
        path: getLccVersionPath(versionId)
      }))
      : (group.layerIds || [])
        .map((layerId) => LAYERS.find((layer) => layer.id === layerId))
        .filter(Boolean)
        .map((layer) => mapLayerToSidebarItem(layer, book))
  }));

  return {
    title: book?.bookTitle || book?.title || 'Learn Claude Code',
    sections,
    bookPath: {
      parentTitle: collection?.title || '',
      currentTitle: book?.bookTitle || book?.title || 'Learn Claude Code'
    }
  };
}
