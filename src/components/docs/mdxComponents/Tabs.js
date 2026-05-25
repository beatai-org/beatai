import React, { useState } from 'react';
import { cn } from '../../../utils/classNames';

export function Tab({ children }) {
  return <>{children}</>;
}

function isTab(child) {
  return React.isValidElement(child) && child.type === Tab;
}

function Tabs({ children }) {
  const tabs = React.Children.toArray(children).filter(isTab);
  const [activeIndex, setActiveIndex] = useState(0);

  if (tabs.length === 0) {
    return null;
  }

  if (tabs.length === 1) {
    return <div className="lcc-tab-panel">{tabs[0].props.children}</div>;
  }

  const safeIndex = Math.min(activeIndex, tabs.length - 1);

  return (
    <div className="doc-tabs-shell">
      <div className="lcc-tabs" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.props.label ?? index}
            type="button"
            role="tab"
            aria-selected={index === safeIndex}
            className={cn(index === safeIndex && 'active')}
            onClick={() => setActiveIndex(index)}
          >
            {tab.props.label ?? `Tab ${index + 1}`}
          </button>
        ))}
      </div>
      <div className="lcc-tab-panel" role="tabpanel">
        {tabs[safeIndex].props.children}
      </div>
    </div>
  );
}

export default Tabs;
