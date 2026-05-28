import React from 'react';
import { HiLightningBolt } from 'react-icons/hi';
import FontSizeControl from './FontSizeControl';
import ThemeGridSection from './ThemeGridSection';
import ThemeModeSection from './ThemeModeSection';

const READING_SHORTCUTS = [
  { keys: ['CMD', 'UP'], description: '快速回到当前章节顶部' },
  { keys: ['CMD', 'DOWN'], description: '快速滚动到评论区开始位置' },
  { keys: ['CMD', 'LEFT'], description: '访问上一章节' },
  { keys: ['CMD', 'RIGHT'], description: '访问下一章节' }
];

export default function ThemePanel({
  currentFontSize,
  currentTheme,
  isDarkMode,
  panelPosition,
  themeMode,
  onFontSizeChange,
  onThemeChange,
  onThemeModeToggle
}) {
  return (
    <div
      className="theme-panel slide-in-bottom"
      onClick={(event) => event.stopPropagation()}
      style={{
        position: 'fixed',
        top: `${panelPosition.top}px`,
        right: `${panelPosition.right}px`
      }}
    >
      <ThemeModeSection themeMode={themeMode} toggleTheme={onThemeModeToggle} />

      <ThemeGridSection
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
        onThemeChange={onThemeChange}
      />

      <FontSizeControl
        currentValue={currentFontSize}
        onChange={onFontSizeChange}
        title="Font Size"
      />

      <section className="theme-section theme-shortcuts-section">
        <h3 className="theme-panel-title theme-shortcuts-title">
          <HiLightningBolt />
          <span>阅读快捷键</span>
        </h3>
        <ul className="theme-shortcuts-list">
          {READING_SHORTCUTS.map((shortcut) => (
            <li key={shortcut.keys.join('-')} className="theme-shortcut">
              <span
                className="theme-shortcut-keys"
                aria-label={shortcut.keys.join(' + ')}
              >
                {shortcut.keys.map((key) => (
                  <kbd key={key}>{key}</kbd>
                ))}
              </span>
              <span className="theme-shortcut-desc">{shortcut.description}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
