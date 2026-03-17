import React from 'react';
import './TabGroup.css';

/**
 * TabGroup - 通用标签页组件
 *
 * @param {Array} tabs - 标签数组 [{ id: string, label: string, count?: number }, ...]
 * @param {string} activeTab - 当前激活的标签 id
 * @param {Function} onChange - 标签切换回调 (tabId) => void
 * @param {string} className - 额外的 CSS 类名
 */
const TabGroup = ({ tabs, activeTab, onChange, className = '' }) => {
  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className={`tab-group ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
          disabled={tab.disabled}
        >
          <span className="tab-label">{tab.label}</span>
          {tab.count !== undefined && (
            <span className="tab-count">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabGroup;
