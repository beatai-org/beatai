import React from 'react';
import { cn } from '../../utils/classNames';

export default function ThemeOptionSection({
  buttonClassName,
  checkClassName,
  currentValue,
  getButtonStyle,
  labelClassName,
  listClassName,
  options,
  onChange,
  title
}) {
  return (
    <div className="theme-section">
      <h3 className="theme-panel-title">{title}</h3>
      <div className={listClassName}>
        {options.map((option) => (
          <button
            key={option.id}
            className={cn(buttonClassName, currentValue === option.id && 'active')}
            onClick={() => onChange(option.id)}
            style={getButtonStyle ? getButtonStyle(option) : undefined}
          >
            <span className={labelClassName}>{option.name}</span>
            {currentValue === option.id && <span className={checkClassName}>✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
