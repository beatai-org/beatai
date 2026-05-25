import { renderHook } from '@testing-library/react';
import { normalizeDocsMeta } from '../../utils/docsMetaNormalizer';
import { useMarkdownSource } from '../../hooks/useMarkdownSource';
import { useDocArticleModel } from './useDocArticleModel';

jest.mock('../../hooks/useMarkdownSource', () => ({
  useMarkdownSource: jest.fn()
}));

const QUIET = { warn: false };

function createMeta() {
  return normalizeDocsMeta({
    categories: [{
      id: 'ai-insights',
      title: 'AI 前沿学习',
      sections: [{
        title: '2026 年 5 月',
        items: [{
          title: 'Meta Title',
          path: 'ai-insights/meta-title',
          file: 'docs/ai-insights/2026-05/23/meta-title.md',
          publishedAt: '2026-05-23',
          contributors: [{
            role: 'author',
            name: 'Ada',
            link: 'https://example.com/ada'
          }],
          tags: ['AI']
        }]
      }]
    }]
  }, QUIET);
}

beforeEach(() => {
  useMarkdownSource.mockReset();
});

test('builds a doc article view model from meta, markdown, and frontmatter', () => {
  useMarkdownSource.mockReturnValue({
    text: [
      '---',
      'title: Frontmatter Title',
      'description: Frontmatter description',
      'url: https://medium.com/example',
      'translated: 2026-05-23',
      '---',
      '# Meta Title',
      '',
      '<doc-component />',
      '',
      'Body'
    ].join('\n'),
    loading: false,
    error: null
  });

  const { result } = renderHook(() => useDocArticleModel({
    meta: createMeta(),
    pathname: '/ai-insights/meta-title',
    findTitleByPath: () => 'Fallback Title'
  }));

  expect(useMarkdownSource).toHaveBeenCalledWith({
    url: '/docs/ai-insights/2026-05/23/meta-title.md',
    enabled: true
  });
  expect(result.current.docPath).toBe('ai-insights/meta-title');
  expect(result.current.pageTitle).toBe('Meta Title');
  expect(result.current.pageDescription).toBe('Frontmatter description');
  expect(result.current.isAiInsightsArticle).toBe(true);
  expect(result.current.isTranslatedArticle).toBe(true);
  expect(result.current.formattedPublishedDate).toBe('2026年5月23日');
  expect(result.current.formattedContributors).toEqual([{
    key: 'author:Ada',
    label: '作者',
    name: 'Ada',
    link: 'https://example.com/ada'
  }]);
  expect(result.current.markdownContent).not.toContain('# Meta Title');
  expect(result.current.markdownContent).toContain('<doc-component>\n</doc-component>');
  expect(result.current.historyRecord).toEqual({
    path: '/ai-insights/meta-title',
    title: 'Meta Title',
    categoryId: 'ai-insights',
    category: 'AI 前沿学习',
    section: '2026 年 5 月'
  });
});

test('falls back to public docs path and frontmatter title without meta entry', () => {
  useMarkdownSource.mockReturnValue({
    text: [
      '---',
      'title: Frontmatter Title',
      '---',
      'Body'
    ].join('\n'),
    loading: false,
    error: null
  });

  const { result } = renderHook(() => useDocArticleModel({
    meta: createMeta(),
    pathname: '/missing/path'
  }));

  expect(useMarkdownSource).toHaveBeenCalledWith({
    url: '/docs/missing/path.md',
    enabled: true
  });
  expect(result.current.pageTitle).toBe('Frontmatter Title');
  expect(result.current.historyRecord).toBe(null);
});
