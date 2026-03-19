import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_FONT_ID,
  DEFAULT_FONT_SIZE_ID,
  DEFAULT_FONT_WEIGHT_ID,
  DEFAULT_THEME_ID
} from './config';
import {
  applyFont,
  applyFontSize,
  applyFontWeight,
  applySavedThemeSelectorState,
  getIsDarkMode,
  getSavedThemeSelectorState,
  persistFont,
  persistFontSize,
  persistFontWeight,
  persistTheme,
  setThemeAttribute
} from './themeSelectorUtils';

const THEME_APPLY_DELAY = 250;
const THEME_TRANSITION_DURATION = 500;

export function useThemeSelectorState() {
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME_ID);
  const [currentFont, setCurrentFont] = useState(DEFAULT_FONT_ID);
  const [currentFontWeight, setCurrentFontWeight] = useState(DEFAULT_FONT_WEIGHT_ID);
  const [currentFontSize, setCurrentFontSize] = useState(DEFAULT_FONT_SIZE_ID);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const themeApplyTimerRef = useRef(null);
  const themeOverlayTimerRef = useRef(null);

  useEffect(() => {
    const savedState = getSavedThemeSelectorState();

    setCurrentTheme(savedState.themeId);
    setCurrentFont(savedState.fontId);
    setCurrentFontWeight(savedState.fontWeightId);
    setCurrentFontSize(savedState.fontSizeId);
    applySavedThemeSelectorState(savedState);
    setIsDarkMode(getIsDarkMode());

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme-mode') {
          setIsDarkMode(getIsDarkMode());
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme-mode']
    });

    return () => {
      observer.disconnect();
      clearTimeout(themeApplyTimerRef.current);
      clearTimeout(themeOverlayTimerRef.current);
    };
  }, []);

  const handleThemeChange = (themeId) => {
    if (themeId === currentTheme) {
      return;
    }

    clearTimeout(themeApplyTimerRef.current);
    clearTimeout(themeOverlayTimerRef.current);

    setIsTransitioning(true);
    themeApplyTimerRef.current = setTimeout(() => {
      setCurrentTheme(themeId);
      setThemeAttribute(themeId);
      persistTheme(themeId);
    }, THEME_APPLY_DELAY);

    themeOverlayTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, THEME_TRANSITION_DURATION);
  };

  const handleFontChange = (fontId) => {
    setCurrentFont(fontId);
    applyFont(fontId);
    persistFont(fontId);
  };

  const handleFontWeightChange = (weightId) => {
    setCurrentFontWeight(weightId);
    applyFontWeight(weightId);
    persistFontWeight(weightId);
  };

  const handleFontSizeChange = (sizeId) => {
    setCurrentFontSize(sizeId);
    applyFontSize(sizeId);
    persistFontSize(sizeId);
  };

  return {
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
  };
}
