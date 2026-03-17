import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { HiMoon, HiSun } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeSelector.css';

const THEMES = [
  {
    id: 'classic-mono',
    name: 'Classic Mono',
    gradient: '#1a1a1a',
    gradientDark: '#d4d4d4',
    colors: ['#1a1a1a'],
    isSolid: true
  },
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    gradient: '#3b82f6',
    gradientDark: '#60a5fa',
    colors: ['#3b82f6'],
    isSolid: true
  },
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
  },
  {
    id: 'sailor-moon',
    name: 'Sailor Moon',
    gradient: 'linear-gradient(135deg, #ff69b4 0%, #ffd700 50%, #ff1493 100%)',
    gradientDark: 'linear-gradient(135deg, #ff69b4 0%, #ffd700 50%, #ff1493 100%)',
    colors: ['#ff69b4', '#ffd700', '#ff1493'],
    backgroundImage: '/images/themes/sailor-moon-bg.svg',
    isImageTheme: true
  }
];

const FONTS = [
  // 系统字体（3 个）
  {
    id: 'system',
    name: '系统默认',
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
  },
  {
    id: 'pingfang',
    name: '苹方',
    family: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
  },
  {
    id: 'microsoft-yahei',
    name: '微软雅黑',
    family: '"Microsoft YaHei", "Microsoft YaHei UI", "PingFang SC", sans-serif'
  },

  // 现代科技感（2 个）
  {
    id: 'noto-sans',
    name: '思源黑体',
    family: '"Noto Sans SC", sans-serif'
  },
  {
    id: 'noto-serif',
    name: '思源宋体',
    family: '"Noto Serif SC", serif'
  },

  // 优雅书卷气（3 个）
  {
    id: 'lxgw-wenkai',
    name: '霞鹜文楷',
    family: '"LXGW WenKai", "KaiTi", serif'
  },
  {
    id: 'ma-shan-zheng',
    name: '马善政楷书',
    family: '"Ma Shan Zheng", cursive'
  },
  {
    id: 'liu-jian-mao-cao',
    name: '刘兼毛草',
    family: '"Liu Jian Mao Cao", cursive'
  },

  // 粗犷有力量（2 个）
  {
    id: 'zcool-qingke',
    name: '站酷高端黑',
    family: '"ZCOOL QingKe HuangYou", sans-serif'
  },
  {
    id: 'zhi-mang-xing',
    name: '志忙星手写',
    family: '"Zhi Mang Xing", cursive'
  },

  // 圆润可爱（2 个）
  {
    id: 'zcool-kuaile',
    name: '站酷快乐体',
    family: '"ZCOOL KuaiLe", sans-serif'
  },
  {
    id: 'zcool-xiaowei',
    name: '站酷小薇',
    family: '"ZCOOL XiaoWei", serif'
  }
];

const FONT_WEIGHTS = [
  { id: 'light', name: '细体', value: '300' },
  { id: 'normal', name: '常规', value: '400' },
  { id: 'medium', name: '中等', value: '500' },
  { id: 'semibold', name: '半粗', value: '600' },
  { id: 'bold', name: '粗体', value: '700' },
];

const FONT_SIZES = [
  { id: 'small', name: '小', value: '14px' },
  { id: 'normal', name: '标准', value: '16px' },
  { id: 'large', name: '大', value: '18px' },
  { id: 'xlarge', name: '超大', value: '20px' },
];

const ThemeSelector = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('classic-mono');
  const [currentFont, setCurrentFont] = useState('system');
  const [currentFontWeight, setCurrentFontWeight] = useState('medium');
  const [currentFontSize, setCurrentFontSize] = useState('large');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [panelPosition, setPanelPosition] = useState({ top: 0, right: 0 });
  const buttonRef = React.useRef(null);

  useEffect(() => {
    // Load saved gradient theme from localStorage
    const savedTheme = localStorage.getItem('docs-theme');
    if (savedTheme && THEMES.some(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Set default gradient theme
      setCurrentTheme('classic-mono');
      document.documentElement.setAttribute('data-theme', 'classic-mono');
    }

    // Load saved font from localStorage
    const savedFont = localStorage.getItem('docs-font');
    if (savedFont && FONTS.some(f => f.id === savedFont)) {
      setCurrentFont(savedFont);
      applyFont(savedFont);
    } else {
      // Set default font to system
      setCurrentFont('system');
      applyFont('system');
    }

    // Load saved font weight from localStorage
    const savedFontWeight = localStorage.getItem('docs-font-weight');
    if (savedFontWeight && FONT_WEIGHTS.some(w => w.id === savedFontWeight)) {
      setCurrentFontWeight(savedFontWeight);
      applyFontWeight(savedFontWeight);
    } else {
      // Set default font weight
      setCurrentFontWeight('medium');
      applyFontWeight('medium');
    }

    // Load saved font size from localStorage
    const savedFontSize = localStorage.getItem('docs-font-size');
    if (savedFontSize && FONT_SIZES.some(s => s.id === savedFontSize)) {
      setCurrentFontSize(savedFontSize);
      applyFontSize(savedFontSize);
    } else {
      // Set default font size
      setCurrentFontSize('large');
      applyFontSize('large');
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

  const applyFont = (fontId) => {
    const font = FONTS.find(f => f.id === fontId);
    if (font) {
      document.documentElement.style.setProperty('--font-family', font.family);
    }
  };

  const applyFontWeight = (weightId) => {
    const weight = FONT_WEIGHTS.find(w => w.id === weightId);
    if (weight) {
      document.documentElement.style.setProperty('--font-weight', weight.value);
    }
  };

  const applyFontSize = (sizeId) => {
    const size = FONT_SIZES.find(s => s.id === sizeId);
    if (size) {
      document.documentElement.style.setProperty('--font-size', size.value);
    }
  };

  const handleThemeChange = (themeId) => {
    if (themeId === currentTheme) {
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
    }, 500);
  };

  const handleFontChange = (fontId) => {
    setCurrentFont(fontId);
    applyFont(fontId);
    localStorage.setItem('docs-font', fontId);
  };

  const handleFontWeightChange = (weightId) => {
    setCurrentFontWeight(weightId);
    applyFontWeight(weightId);
    localStorage.setItem('docs-font-weight', weightId);
  };

  const handleFontSizeChange = (sizeId) => {
    setCurrentFontSize(sizeId);
    applyFontSize(sizeId);
    localStorage.setItem('docs-font-size', sizeId);
  };

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

  const currentThemeData = THEMES.find(t => t.id === currentTheme);
  const currentGradient = isDarkMode ? currentThemeData.gradientDark : currentThemeData.gradient;

  return (
    <>
      {/* Theme transition overlay */}
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
          <div
            className="theme-overlay"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="theme-panel slide-in-bottom"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                top: `${panelPosition.top}px`,
                right: `${panelPosition.right}px`
              }}
            >
              {/* Theme Mode Toggle Section */}
              <div className="theme-section theme-mode-section">
                <h3 className="theme-panel-title">Theme Mode</h3>
                <div className="theme-mode-toggle">
                  <button
                    className={`theme-mode-option ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => theme === 'dark' && toggleTheme()}
                    aria-label="Switch to light mode"
                  >
                    <HiSun className="theme-mode-icon" />
                    <span className="theme-mode-name">Light</span>
                    {theme === 'light' && <span className="theme-mode-check">✓</span>}
                  </button>
                  <button
                    className={`theme-mode-option ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => theme === 'light' && toggleTheme()}
                    aria-label="Switch to dark mode"
                  >
                    <HiMoon className="theme-mode-icon" />
                    <span className="theme-mode-name">Dark</span>
                    {theme === 'dark' && <span className="theme-mode-check">✓</span>}
                  </button>
                </div>
              </div>

              {/* Color Themes Section */}
              <div className="theme-section">
                <h3 className="theme-panel-title">Color Theme</h3>
                <div className="theme-grid">
                  {THEMES.map((theme) => {
                    const themeGradient = isDarkMode ? theme.gradientDark : theme.gradient;
                    return (
                      <button
                        key={theme.id}
                        className={`theme-card ${currentTheme === theme.id ? 'active' : ''} ${theme.isImageTheme ? 'image-theme' : ''}`}
                        onClick={() => handleThemeChange(theme.id)}
                        aria-label={`Switch to ${theme.name} theme`}
                      >
                        <div
                          className="theme-card-gradient"
                          style={{
                            background: themeGradient,
                            ...(theme.isImageTheme && {
                              backgroundImage: `${themeGradient}, url(${theme.backgroundImage})`,
                              backgroundSize: 'cover, cover',
                              backgroundPosition: 'center, center',
                              backgroundBlend: 'overlay'
                            })
                          }}
                        >
                          {currentTheme === theme.id && (
                            <div className="theme-card-check">✓</div>
                          )}
                          {theme.isImageTheme && (
                            <div className="theme-card-badge">🌙</div>
                          )}
                        </div>
                        <span className="theme-card-name">{theme.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Selection Section */}
              <div className="theme-section">
                <h3 className="theme-panel-title">Font Family</h3>
                <div className="font-list">
                  {FONTS.map((font) => (
                    <button
                      key={font.id}
                      className={`font-option ${currentFont === font.id ? 'active' : ''}`}
                      onClick={() => handleFontChange(font.id)}
                      style={{ fontFamily: font.family }}
                    >
                      <span className="font-option-name">{font.name}</span>
                      {currentFont === font.id && (
                        <span className="font-option-check">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Weight Selection Section */}
              <div className="theme-section">
                <h3 className="theme-panel-title">Font Weight</h3>
                <div className="font-weight-list">
                  {FONT_WEIGHTS.map((weight) => (
                    <button
                      key={weight.id}
                      className={`font-weight-option ${currentFontWeight === weight.id ? 'active' : ''}`}
                      onClick={() => handleFontWeightChange(weight.id)}
                      style={{ fontWeight: weight.value }}
                    >
                      <span className="font-weight-name">{weight.name}</span>
                      {currentFontWeight === weight.id && (
                        <span className="font-weight-check">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Selection Section */}
              <div className="theme-section">
                <h3 className="theme-panel-title">Font Size</h3>
                <div className="font-size-list">
                  {FONT_SIZES.map((size) => (
                    <button
                      key={size.id}
                      className={`font-size-option ${currentFontSize === size.id ? 'active' : ''}`}
                      onClick={() => handleFontSizeChange(size.id)}
                    >
                      <span className="font-size-name">{size.name}</span>
                      {currentFontSize === size.id && (
                        <span className="font-size-check">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </>
  );
};

export default ThemeSelector;
