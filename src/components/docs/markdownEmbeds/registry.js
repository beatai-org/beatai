import React from 'react';
import SceneSequenceDocEmbed from './SceneSequenceDocEmbed';
import RegisteredDocComponentEmbed from './RegisteredDocComponentEmbed';
import AgentLoopSimulator from '../../learnClaudeCode/AgentLoopSimulator';
import DeepDive from '../../learnClaudeCode/DeepDive';
import SourceViewer from '../../learnClaudeCode/SourceViewer';
import { SessionVisualization } from '../../../vendor/learn-claude-code/visualizations/index.js';
// LCC visual styles (lcc-tabs / lcc-tab-panel / lcc-card / lcc-sim-* / ...)
// are still needed by the LCC widgets registered above. Pulled in alongside
// the registry so any page that may render these embeds gets the styling.
import '../../learnClaudeCode/lcc-styles.css';

export const DOC_COMPONENT_REGISTRY = {
  'scene-sequence': SceneSequenceDocEmbed,
  component: RegisteredDocComponentEmbed,
  'agent-loop-simulator': AgentLoopSimulator,
  'source-viewer': SourceViewer,
  'deep-dive': DeepDive,
  'session-visualization': SessionVisualization
};

export function getDocComponentByName(name) {
  return DOC_COMPONENT_REGISTRY[name] || null;
}

export function listDocComponentNames() {
  return Object.keys(DOC_COMPONENT_REGISTRY);
}

export function hasDocComponent(name) {
  return Boolean(getDocComponentByName(name));
}

export function renderDocComponent(name, props = {}) {
  const Component = getDocComponentByName(name);

  if (!Component) {
    return null;
  }

  return <Component {...props} />;
}
