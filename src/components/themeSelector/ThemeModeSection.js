import React from 'react';
import { HiMoon, HiSun } from 'react-icons/hi';
import { cn } from '../../utils/classNames';

function ThemeModeOption({ active, icon, label, onClick }) {
  return (
    <button
      className={cn('theme-mode-option', active && 'active')}
      onClick={onClick}
      aria-label={`Switch to ${label.toLowerCase()} mode`}
    >
      {icon}
      <span className="theme-mode-name">{label}</span>
      {active && <span className="theme-mode-check">✓</span>}
    </button>
  );
}

export default function ThemeModeSection({ themeMode, toggleTheme }) {
  return (
    <div className="theme-section theme-mode-section">
      <h3 className="theme-panel-title">Theme Mode</h3>
      <div className="theme-mode-toggle">
        <ThemeModeOption
          active={themeMode === 'light'}
          icon={<HiSun className="theme-mode-icon" />}
          label="Light"
          onClick={() => themeMode === 'dark' && toggleTheme()}
        />
        <ThemeModeOption
          active={themeMode === 'dark'}
          icon={<HiMoon className="theme-mode-icon" />}
          label="Dark"
          onClick={() => themeMode === 'light' && toggleTheme()}
        />
      </div>
    </div>
  );
}
