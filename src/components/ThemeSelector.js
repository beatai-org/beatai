import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemePanel from './themeSelector/ThemePanel';
import { useThemeSelectorState } from './themeSelector/useThemeSelectorState';
import './ThemeSelector.css';

const ThemeSelector = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  const {
    currentFont,
    currentFontSize,
    currentFontWeight,
    currentTheme,
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
              currentFont={currentFont}
              currentFontSize={currentFontSize}
              currentFontWeight={currentFontWeight}
              currentTheme={currentTheme}
              isDarkMode={isDarkMode}
              panelPosition={panelPosition}
              themeMode={theme}
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
