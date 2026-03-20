import React from 'react';
import { BACKGROUND_DEPTHS, FONTS, FONT_WEIGHTS } from './config';
import BackgroundDepthControl from './BackgroundDepthControl';
import FontSizeControl from './FontSizeControl';
import ThemeGridSection from './ThemeGridSection';
import ThemeModeSection from './ThemeModeSection';
import ThemeOptionSection from './ThemeOptionSection';

export default function ThemePanel({
  currentBackgroundDepth,
  currentFont,
  currentFontSize,
  currentFontWeight,
  currentTheme,
  isDarkMode,
  panelPosition,
  themeMode,
  onBackgroundDepthChange,
  onFontChange,
  onFontSizeChange,
  onFontWeightChange,
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

      <BackgroundDepthControl
        currentValue={currentBackgroundDepth}
        onChange={onBackgroundDepthChange}
        options={BACKGROUND_DEPTHS}
        title="网站背景暗度"
      />

      <ThemeOptionSection
        buttonClassName="font-option"
        checkClassName="font-option-check"
        currentValue={currentFont}
        getButtonStyle={(font) => ({ fontFamily: font.family })}
        labelClassName="font-option-name"
        listClassName="font-list"
        onChange={onFontChange}
        options={FONTS}
        title="Font Family"
      />

      <ThemeOptionSection
        buttonClassName="font-weight-option"
        checkClassName="font-weight-check"
        currentValue={currentFontWeight}
        getButtonStyle={(weight) => ({ fontWeight: weight.value })}
        labelClassName="font-weight-name"
        listClassName="font-weight-list"
        onChange={onFontWeightChange}
        options={FONT_WEIGHTS}
        title="Font Weight"
      />

      <FontSizeControl
        currentValue={currentFontSize}
        onChange={onFontSizeChange}
        title="Font Size"
      />
    </div>
  );
}
