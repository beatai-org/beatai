import React, { createContext, useState, useContext, useEffect } from 'react';

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
    const savedTheme = localStorage.getItem('theme-mode');
    return savedTheme || 'light';  // Default to light mode
  });

  useEffect(() => {
    // Set theme mode
    localStorage.setItem('theme-mode', theme);
    document.documentElement.setAttribute('data-theme-mode', theme);

    // Ensure gradient theme is set (don't override if already set)
    const currentGradientTheme = document.documentElement.getAttribute('data-theme');
    if (!currentGradientTheme) {
      const savedGradientTheme = localStorage.getItem('docs-theme') || 'purple-pink';
      document.documentElement.setAttribute('data-theme', savedGradientTheme);
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
