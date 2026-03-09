import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';
import { HiMoon, HiSun } from 'react-icons/hi';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <HiSun /> : <HiMoon />}
    </button>
  );
};

export default ThemeToggle;
