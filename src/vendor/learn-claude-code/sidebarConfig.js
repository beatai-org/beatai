// LCC-specific sidebar layout. Only the `sectionGroups` ordering is bespoke;
// `layerIds` and `versionIds` are derivable from the vendor data but listed
// here too so the sidebar definition is self-contained.

import { LAYERS, LEARNING_PATH } from './data';

const ALL_LAYER_IDS = LAYERS.map((layer) => layer.id);

// How the two-tier sidebar splits the content. Layers go in the first group;
// "best-practices" lives in its own group at the bottom.
export const LCC_SIDEBAR_SECTION_GROUPS = Object.freeze([
  {
    title: '从零手搓 Claude Code',
    layerIds: ['introduction', 'tools', 'planning', 'memory', 'concurrency', 'collaboration']
  },
  {
    title: '最佳实践',
    versionIds: ['bp01']
  }
]);

export const LCC_LAYER_IDS = Object.freeze(ALL_LAYER_IDS);
export const LCC_VERSION_IDS = Object.freeze([...LEARNING_PATH]);
