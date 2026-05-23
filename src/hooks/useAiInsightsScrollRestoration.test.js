import { getAiInsightsRestoreTarget } from './useAiInsightsScrollRestoration';

beforeEach(() => {
  document.body.innerHTML = '';
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: 0
  });
});

test('falls back to the saved absolute scroll position', () => {
  expect(getAiInsightsRestoreTarget({
    scrollY: 480,
    articlePath: '/ai-insights/missing',
    articleViewportTop: 120
  })).toBe(480);
});

test('restores relative to the clicked article when it is present', () => {
  document.body.innerHTML = '<a data-ai-insights-article-path="/ai-insights/example"></a>';
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: 1000
  });

  const article = document.querySelector('[data-ai-insights-article-path]');
  article.getBoundingClientRect = jest.fn(() => ({ top: 360 }));

  expect(getAiInsightsRestoreTarget({
    scrollY: 480,
    articlePath: '/ai-insights/example',
    articleViewportTop: 140
  })).toBe(1220);
});
