import React, { useState } from 'react';
import { cn } from '../../utils/classNames';

// Generic tab container usable inside any markdown document via
// `<doc-tabs><doc-tab label="...">...</doc-tab></doc-tabs>`. The renderer is
// agnostic to what each tab holds — content inside `<doc-tab>` is parsed as
// markdown by CommonMark's HTML-block rules (blank lines around the tags),
// and tab metadata is extracted from React children at render time.

export function DocTab({ children }) {
  return <>{children}</>;
}

function isDocTab(child) {
  return React.isValidElement(child) && child.type === DocTab;
}

function DocTabs({ children }) {
  const tabs = React.Children.toArray(children).filter(isDocTab);
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

export default DocTabs;
