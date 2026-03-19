import React from 'react';
import { cn } from '../../utils/classNames';
import { THEMES } from './config';

function getThemeCardStyle(theme, isDarkMode) {
  const themeGradient = isDarkMode ? theme.gradientDark : theme.gradient;

  if (!theme.isImageTheme) {
    return { background: themeGradient };
  }

  return {
    background: themeGradient,
    backgroundImage: `${themeGradient}, url(${theme.backgroundImage})`,
    backgroundSize: 'cover, cover',
    backgroundPosition: 'center, center',
    backgroundBlend: 'overlay'
  };
}

export default function ThemeGridSection({
  currentTheme,
  isDarkMode,
  onThemeChange
}) {
  return (
    <div className="theme-section">
      <h3 className="theme-panel-title">Color Theme</h3>
      <div className="theme-grid">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            className={cn(
              'theme-card',
              currentTheme === theme.id && 'active',
              theme.isImageTheme && 'image-theme'
            )}
            onClick={() => onThemeChange(theme.id)}
            aria-label={`Switch to ${theme.name} theme`}
          >
            <div
              className="theme-card-gradient"
              style={getThemeCardStyle(theme, isDarkMode)}
            >
              {currentTheme === theme.id && <div className="theme-card-check">✓</div>}
              {theme.isImageTheme && <div className="theme-card-badge">🌙</div>}
            </div>
            <span className="theme-card-name">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
