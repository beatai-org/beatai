import React from 'react';
import {
  getDocComponentByName,
  listDocComponentNames
} from './registry';

function normalizeComponentName(name) {
  if (typeof name !== 'string') {
    return '';
  }

  if (getDocComponentByName(name)) {
    return name;
  }

  const sanitizedName = name.replace(/^user-content-/, '');

  return getDocComponentByName(sanitizedName) ? sanitizedName : name;
}

function parseAttributeValue(value) {
  if (value === undefined || value === null || value === '') {
    return true;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return true;
  }

  if (trimmedValue === 'true') {
    return true;
  }

  if (trimmedValue === 'false') {
    return false;
  }

  if (trimmedValue === 'null') {
    return null;
  }

  if (/^-?\d+(?:\.\d+)?$/.test(trimmedValue)) {
    return Number(trimmedValue);
  }

  if (
    (trimmedValue.startsWith('{') && trimmedValue.endsWith('}'))
    || (trimmedValue.startsWith('[') && trimmedValue.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmedValue);
    } catch (error) {
      return value;
    }
  }

  return value;
}

function normalizeComponentProps(props) {
  const normalizedProps = {};
  const rawPropsObject = parseAttributeValue(props.props);
  const parsedPropsObject = rawPropsObject && typeof rawPropsObject === 'object' && !Array.isArray(rawPropsObject)
    ? rawPropsObject
    : null;

  if (parsedPropsObject) {
    Object.assign(normalizedProps, parsedPropsObject);
  }

  return Object.entries(props).reduce((result, [key, value]) => {
    // children pass through to the registered component as a real React prop
    // (see DocMarkdownComponent below) so container widgets like <tabs> can
    // host nested <doc-component name="tab">…</doc-component> children.
    if (
      key === 'node'
      || key === 'children'
      || key === 'name'
      || key === 'className'
      || key === 'props'
    ) {
      return result;
    }

    result[key] = parseAttributeValue(value);
    return result;
  }, normalizedProps);
}

function MissingComponentState({ name }) {
  return (
    <blockquote className="doc-blockquote">
      <strong>Unknown doc component:</strong>
      {' '}
      <code className="doc-code-inline">{name || '(empty)'}</code>
      <br />
      Available components:
      {' '}
      {listDocComponentNames().join(', ')}
      <br />
      Example:
      {' '}
      <code className="doc-code-inline">{'<doc-component name="scene-sequence" src="./scene-sequence.json" />'}</code>
    </blockquote>
  );
}

function DocMarkdownComponent({ name = '', children, ...props }) {
  const normalizedName = normalizeComponentName(name);
  const Component = getDocComponentByName(normalizedName);

  if (!Component) {
    return <MissingComponentState name={name} />;
  }

  // No outer wrapper: each <doc-component> renders as its registered React
  // component directly, so container widgets (e.g. tabs) can filter children
  // by component identity (child.type === Tab) without a wrapping div in
  // between. Leaf widgets that need a visual shell apply it internally.
  const componentProps = normalizeComponentProps(props);

  return <Component {...componentProps}>{children}</Component>;
}

export default DocMarkdownComponent;
