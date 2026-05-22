import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemePanel from './themeSelector/ThemePanel';
import { useThemeSelectorState } from './themeSelector/useThemeSelectorState';

const ThemeSelector = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  const {
    currentBackgroundDepth,
    currentFont,
    currentFontSize,
    currentFontWeight,
    currentTheme,
    handleBackgroundDepthChange,
    handleFontChange,
    handleFontSizeChange,
    handleFontWeightChange,
    handleThemeChange,
    isDarkMode,
    isTransitioning
  } = useThemeSelectorState();

  const handleTogglePanel = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPanelPosition({
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isTransitioning && <div className="theme-transition-overlay" />}

      <div className="theme-selector">
        <button
          ref={buttonRef}
          className="theme-button"
          onClick={handleTogglePanel}
          aria-label="Select theme"
        >
        </button>

        {isOpen && ReactDOM.createPortal(
          <div className="theme-overlay" onClick={() => setIsOpen(false)}>
            <ThemePanel
              currentBackgroundDepth={currentBackgroundDepth}
              currentFont={currentFont}
              currentFontSize={currentFontSize}
              currentFontWeight={currentFontWeight}
              currentTheme={currentTheme}
              isDarkMode={isDarkMode}
              panelPosition={panelPosition}
              themeMode={theme}
              onBackgroundDepthChange={handleBackgroundDepthChange}
              onFontChange={handleFontChange}
              onFontSizeChange={handleFontSizeChange}
              onFontWeightChange={handleFontWeightChange}
              onThemeChange={handleThemeChange}
              onThemeModeToggle={toggleTheme}
            />
          </div>,
          document.body
        )}
      </div>
    </>
  );
};

export default ThemeSelector;
