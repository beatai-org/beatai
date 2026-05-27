const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repoRoot = path.resolve(__dirname, '..');
const commentsPath = path.join(repoRoot, 'src/components/comments/GiscusComments.js');
const outputDir = path.join(repoRoot, 'public/giscus-themes');

const THEMES = [
  { id: 'classic-mono', light: ['#1a1a1a', '#1a1a1a'], dark: ['#d4d4d4', '#d4d4d4'] },
  { id: 'classic-blue', light: ['#3b82f6', '#3b82f6'], dark: ['#60a5fa', '#60a5fa'] },
  { id: 'classic-green', light: ['#16a34a', '#16a34a'], dark: ['#22c55e', '#22c55e'] },
  { id: 'orange-red', light: ['#f97316', '#ef4444'], dark: ['#fb923c', '#f87171'] },
  { id: 'aurora', light: ['#06b6d4', '#10b981'], dark: ['#22d3ee', '#34d399'] },
  { id: 'sailor-moon', light: ['#ff69b4', '#ffd700'], dark: ['#ff69b4', '#ffd700'] }
];

function loadThemeBuilder() {
  const source = fs.readFileSync(commentsPath, 'utf8');
  const start = source.indexOf('function normalizeColor');
  const end = source.indexOf('function buildGiscusTheme(');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Failed to locate giscus theme builder functions.');
  }

  return source.slice(start, end);
}

function renderCss(theme, mode, accentStart, accentEnd, builderSource) {
  const context = {
    window: {
      getComputedStyle: () => ({
        getPropertyValue: (name) => {
          const values = {
            '--accent-start': accentStart,
            '--accent-end': accentEnd,
            '--accent-primary': accentStart,
            '--accent-secondary': accentEnd
          };
          return values[name] || '';
        }
      })
    },
    document: {
      documentElement: {}
    }
  };

  vm.createContext(context);
  vm.runInContext(builderSource, context);

  if (typeof context.buildGiscusThemeCss !== 'function') {
    throw new Error('buildGiscusThemeCss is not available after evaluation.');
  }

  const css = context.buildGiscusThemeCss(mode);
  const filePath = path.join(outputDir, `${theme.id}-${mode}.css`);
  fs.writeFileSync(filePath, css);
}

function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const builderSource = loadThemeBuilder();

  THEMES.forEach((theme) => {
    renderCss(theme, 'light', theme.light[0], theme.light[1], builderSource);
    renderCss(theme, 'dark', theme.dark[0], theme.dark[1], builderSource);
  });

  console.log(`Generated ${THEMES.length * 2} giscus theme files in ${outputDir}`);
}

main();
