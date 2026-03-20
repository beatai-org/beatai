import {
  BACKGROUND_DEPTHS,
  DEFAULT_BACKGROUND_DEPTH_ID,
  DEFAULT_FONT_ID,
  DEFAULT_FONT_SIZE_ID,
  DEFAULT_FONT_WEIGHT_ID,
  DEFAULT_THEME_ID,
  FONTS,
  FONT_SIZES,
  FONT_WEIGHTS,
  THEMES
} from './config';

const STORAGE_KEYS = {
  theme: 'docs-theme',
  font: 'docs-font',
  fontWeight: 'docs-font-weight',
  fontSize: 'docs-font-size',
  backgroundDepth: 'docs-background-depth'
};

function getStoredValue(key, options, fallback) {
  const savedValue = localStorage.getItem(key);
  return options.some((option) => option.id === savedValue) ? savedValue : fallback;
}

export function setThemeAttribute(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
}

export function getIsDarkMode() {
  return document.documentElement.getAttribute('data-theme-mode') === 'dark';
}

export function applyFont(fontId) {
  const font = FONTS.find((item) => item.id === fontId);
  if (font) {
    document.documentElement.style.setProperty('--font-family', font.family);
  }
}

export function applyFontWeight(weightId) {
  const weight = FONT_WEIGHTS.find((item) => item.id === weightId);
  if (weight) {
    document.documentElement.style.setProperty('--font-weight', weight.value);
  }
}

export function applyFontSize(sizeId) {
  const size = FONT_SIZES.find((item) => item.id === sizeId);
  if (size) {
    document.documentElement.style.setProperty('--font-size', size.value);
  }
}

export function applyBackgroundDepth(depthId) {
  const depth = BACKGROUND_DEPTHS.find((item) => item.id === depthId);
  if (depth) {
    document.documentElement.style.setProperty('--site-shell-bg-light', depth.pageBackgroundLight);
    document.documentElement.style.setProperty('--site-shell-bg-dark', depth.pageBackgroundDark);
    document.documentElement.style.setProperty('--site-shell-overlay-opacity-light', depth.overlayOpacityLight);
    document.documentElement.style.setProperty('--site-shell-overlay-opacity-dark', depth.overlayOpacityDark);
  }
}

export function getSavedThemeSelectorState() {
  return {
    themeId: getStoredValue(STORAGE_KEYS.theme, THEMES, DEFAULT_THEME_ID),
    fontId: getStoredValue(STORAGE_KEYS.font, FONTS, DEFAULT_FONT_ID),
    fontWeightId: getStoredValue(STORAGE_KEYS.fontWeight, FONT_WEIGHTS, DEFAULT_FONT_WEIGHT_ID),
    fontSizeId: getStoredValue(STORAGE_KEYS.fontSize, FONT_SIZES, DEFAULT_FONT_SIZE_ID),
    backgroundDepthId: getStoredValue(STORAGE_KEYS.backgroundDepth, BACKGROUND_DEPTHS, DEFAULT_BACKGROUND_DEPTH_ID)
  };
}

export function applySavedThemeSelectorState(savedState) {
  setThemeAttribute(savedState.themeId);
  applyFont(savedState.fontId);
  applyFontWeight(savedState.fontWeightId);
  applyFontSize(savedState.fontSizeId);
  applyBackgroundDepth(savedState.backgroundDepthId);
}

export function persistTheme(themeId) {
  localStorage.setItem(STORAGE_KEYS.theme, themeId);
}

export function persistFont(fontId) {
  localStorage.setItem(STORAGE_KEYS.font, fontId);
}

export function persistFontWeight(weightId) {
  localStorage.setItem(STORAGE_KEYS.fontWeight, weightId);
}

export function persistFontSize(sizeId) {
  localStorage.setItem(STORAGE_KEYS.fontSize, sizeId);
}

export function persistBackgroundDepth(depthId) {
  localStorage.setItem(STORAGE_KEYS.backgroundDepth, depthId);
}
