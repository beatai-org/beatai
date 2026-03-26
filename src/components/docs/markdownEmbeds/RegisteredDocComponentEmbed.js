import React from 'react';
import TaylorApproximationDemo from '../../sceneDemos/TaylorApproximationDemo';

const DOC_COMPONENTS = {
  'taylor-approximation-demo': TaylorApproximationDemo
};

function MissingRegisteredComponentState({ componentName = '' }) {
  return (
    <blockquote className="doc-blockquote">
      <strong>Unknown registered component:</strong>
      {' '}
      <code className="doc-code-inline">{componentName || '(empty)'}</code>
    </blockquote>
  );
}

function RegisteredDocComponentEmbed({ component: componentName = '' }) {
  const Component = DOC_COMPONENTS[componentName] || null;

  if (!Component) {
    return <MissingRegisteredComponentState componentName={componentName} />;
  }

  return <Component />;
}

export default RegisteredDocComponentEmbed;
