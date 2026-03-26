import React from 'react';
import SceneSequenceDocEmbed from './SceneSequenceDocEmbed';
import RegisteredDocComponentEmbed from './RegisteredDocComponentEmbed';

export const DOC_COMPONENT_REGISTRY = {
  'scene-sequence': SceneSequenceDocEmbed,
  component: RegisteredDocComponentEmbed
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
