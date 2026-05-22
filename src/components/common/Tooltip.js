import React from 'react';

function Tooltip({ content, children, className = '' }) {
  if (!content) {
    return children;
  }

  return (
    <span className={`ui-tooltip ${className}`.trim()}>
      {children}
      <span className="ui-tooltip-bubble" role="tooltip">
        {content}
      </span>
    </span>
  );
}

export default Tooltip;
