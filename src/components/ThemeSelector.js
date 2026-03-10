import React, { useState, useEffect } from 'react';
import { HiColorSwatch } from 'react-icons/hi';
import './ThemeSelector.css';

const THEMES = [
  {
    id: 'purple-pink',
    name: 'Purple Pink',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    gradientDark: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
    colors: ['#8b5cf6', '#ec4899']
  },
  {
    id: 'blue-green',
    name: 'Blue Green',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
    gradientDark: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
    colors: ['#3b82f6', '#10b981']
  },
  {
    id: 'orange-red',
    name: 'Orange Red',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    gradientDark: 'linear-gradient(135deg, #fb923c 0%, #f87171 100%)',
    colors: ['#f97316', '#ef4444']
  },
  {
    id: 'aurora',
    name: 'Aurora',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #10b981 100%)',
    gradientDark: 'linear-gradient(135deg, #a78bfa 0%, #22d3ee 50%, #34d399 100%)',
    colors: ['#8b5cf6', '#06b6d4', '#10b981']
  },
  {
    id: 'northern-lights',
    name: 'Northern Lights',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #10b981 50%, #7c3aed 100%)',
    gradientDark: 'linear-gradient(135deg, #1e40af 0%, #34d399 50%, #a78bfa 100%)',
    colors: ['#1e3a8a', '#10b981', '#7c3aed']
  },
  {
    id: 'desert-dune',
    name: 'Desert Dune',
    gradient: 'linear-gradient(135deg, #92400e 0%, #f59e0b 50%, #38bdf8 100%)',
    gradientDark: 'linear-gradient(135deg, #a16207 0%, #fbbf24 50%, #7dd3fc 100%)',
    colors: ['#92400e', '#f59e0b', '#38bdf8']
  },
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    gradient: 'linear-gradient(135deg, #0e7490 0%, #fb7185 50%, #2dd4bf 100%)',
    gradientDark: 'linear-gradient(135deg, #0891b2 0%, #fda4af 50%, #5eead4 100%)',
    colors: ['#0e7490', '#fb7185', '#2dd4bf']
  },
  {
    id: 'autumn-forest',
    name: 'Autumn Forest',
    gradient: 'linear-gradient(135deg, #065f46 0%, #f59e0b 50%, #dc2626 100%)',
    gradientDark: 'linear-gradient(135deg, #047857 0%, #fbbf24 50%, #f87171 100%)',
    colors: ['#065f46', '#f59e0b', '#dc2626']
  }
];

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('purple-pink');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load saved gradient theme from localStorage
    const savedTheme = localStorage.getItem('docs-theme');
    if (savedTheme && THEMES.some(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Set default gradient theme only if not already set
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (!currentTheme) {
        document.documentElement.setAttribute('data-theme', 'purple-pink');
      }
    }

    // Check initial dark mode
    const checkDarkMode = () => {
      const isDark = document.documentElement.getAttribute('data-theme-mode') === 'dark';
      setIsDarkMode(isDark);
    };
    checkDarkMode();

    // Listen for theme mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme-mode') {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme-mode']
    });

    return () => observer.disconnect();
  }, []);

  const handleThemeChange = (themeId) => {
    if (themeId === currentTheme) {
      setIsOpen(false);
      return;
    }

    // Show transition overlay
    setIsTransitioning(true);

    // Apply theme
    setTimeout(() => {
      setCurrentTheme(themeId);
      document.documentElement.setAttribute('data-theme', themeId);
      localStorage.setItem('docs-theme', themeId);
    }, 250);

    // Hide overlay
    setTimeout(() => {
      setIsTransitioning(false);
      setIsOpen(false);
    }, 500);
  };

  const currentThemeData = THEMES.find(t => t.id === currentTheme);
  const currentGradient = isDarkMode ? currentThemeData.gradientDark : currentThemeData.gradient;

  return (
    <>
      {/* Theme transition overlay */}
      {isTransitioning && <div className="theme-transition-overlay" />}

      <div className="theme-selector">
        <button
          className="theme-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select theme"
          style={{ background: currentGradient }}
        >
          <HiColorSwatch />
        </button>

        {isOpen && (
          <>
            <div
              className="theme-overlay"
              onClick={() => setIsOpen(false)}
            />
            <div className="theme-panel slide-in-bottom">
              <h3 className="theme-panel-title">Choose Theme</h3>
              <div className="theme-grid">
                {THEMES.map((theme) => {
                  const themeGradient = isDarkMode ? theme.gradientDark : theme.gradient;
                  return (
                    <button
                      key={theme.id}
                      className={`theme-card ${currentTheme === theme.id ? 'active' : ''}`}
                      onClick={() => handleThemeChange(theme.id)}
                      aria-label={`Switch to ${theme.name} theme`}
                    >
                      <div
                        className="theme-card-gradient"
                        style={{ background: themeGradient }}
                      >
                        {currentTheme === theme.id && (
                          <div className="theme-card-check">✓</div>
                        )}
                      </div>
                      <span className="theme-card-name">{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ThemeSelector;
