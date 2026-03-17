import React from 'react';
import './TabButton.css';

/**
 * TabButton - 单个标签按钮组件
 *
 * @param {string} label - 标签文字
 * @param {number|string} count - 计数（可选）
 * @param {boolean} active - 是否激活
 * @param {boolean} disabled - 是否禁用
 * @param {Function} onClick - 点击回调
 * @param {string} className - 额外的 CSS 类名
 */
const TabButton = ({
  label,
  count,
  active = false,
  disabled = false,
  onClick,
  className = ''
}) => {
  return (
    <button
      className={`tab-btn ${active ? 'active' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="tab-btn-label">{label}</span>
      {count !== undefined && (
        <span className="tab-btn-count">{count}</span>
      )}
    </button>
  );
};

export default TabButton;
