import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  DEFAULT_THEME_MODE,
  THEME_MODE_STORAGE_KEY
} from '../components/themeSelector/config';
import {
  getSavedThemeSelectorState,
  setThemeAttribute
} from '../components/themeSelector/themeSelectorUtils';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_MODE_STORAGE_KEY);
    return savedTheme || DEFAULT_THEME_MODE;
  });

  useEffect(() => {
    // Set theme mode
    localStorage.setItem(THEME_MODE_STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme-mode', theme);

    // Ensure gradient theme is set (don't override if already set)
    const currentGradientTheme = document.documentElement.getAttribute('data-theme');
    if (!currentGradientTheme) {
      setThemeAttribute(getSavedThemeSelectorState().themeId);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
