import { normalizeDocsMeta } from '../../utils/docsMetaNormalizer';
import {
  buildDocArticleHistoryRecord,
  buildDocArticleNavigationModel,
  buildDocArticleRouteModel,
  buildDocsArchiveModel,
  buildDocsRouteValidationModel,
  buildDocsWorkspaceModel,
  buildNormalizedArticleMarkdown
} from './docsDomain';

const QUIET = { warn: false };

function createMeta() {
  return normalizeDocsMeta({
    categories: [{
      id: 'ai-insights',
      title: 'AI 前沿学习',
      entryPath: 'ai-insights',
      sections: [{
        title: '2026 年 5 月',
        items: [{
          title: 'First Article',
          path: 'ai-insights/first',
          file: 'docs/ai-insights/2026-05/23/first.md',
          publishedAt: '2026-05-23',
          tags: ['AI', 'Guide']
        }, {
          title: 'Second Article',
          path: 'ai-insights/second',
          file: 'docs/ai-insights/2026-05/23/second.md',
          publishedAt: '2026-05-22',
          tags: ['Guide']
        }]
      }]
    }, {
      id: 'rust-course',
      title: 'Rust Course',
      sections: [{
        title: 'Intro',
        items: [{
          title: 'Ownership',
          path: 'rust-course/ownership',
          file: 'docs/rust-course/ownership.md',
          tags: ['Rust']
        }]
      }]
    }]
  }, QUIET);
}

test('builds an article route model from meta and pathname', () => {
  const route = buildDocArticleRouteModel({
    meta: createMeta(),
    pathname: '/ai-insights/first',
    findTitleByPath: () => 'Fallback Title'
  });

  expect(route).toMatchObject({
    docPath: 'ai-insights/first',
    isArticleEntry: true,
    isAiInsightsArticle: true,
    markdownUrl: '/docs/ai-insights/2026-05/23/first.md',
    titleFromMeta: 'First Article',
    category: { id: 'ai-insights' },
    section: { title: '2026 年 5 月' }
  });
});

test('falls back to conventional markdown path when route is missing', () => {
  const route = buildDocArticleRouteModel({
    meta: createMeta(),
    pathname: '/missing/path',
    findTitleByPath: () => 'Fallback Title'
  });

  expect(route.docMetaEntry).toBe(null);
  expect(route.markdownUrl).toBe('/docs/missing/path.md');
  expect(route.titleFromMeta).toBe('Fallback Title');
});

test('builds normalized markdown and history records at the domain boundary', () => {
  const route = buildDocArticleRouteModel({
    meta: createMeta(),
    pathname: '/ai-insights/first'
  });

  const markdown = buildNormalizedArticleMarkdown('# First Article\n\n<doc-component />', {
    isAiInsightsArticle: route.isAiInsightsArticle,
    stripTitle: (content, enabled) => enabled ? content.replace(/^# .+\n\n/, '') : content
  });

  expect(markdown).toBe('<doc-component ></doc-component>');
  expect(buildDocArticleHistoryRecord({
    articleRoute: route,
    pathname: '/ai-insights/first',
    frontmatter: { title: 'Frontmatter Title' },
    rawDoc: '# First Article',
    error: null
  })).toEqual({
    path: '/ai-insights/first',
    title: 'First Article',
    categoryId: 'ai-insights',
    category: 'AI 前沿学习',
    section: '2026 年 5 月'
  });
});

test('builds adjacent navigation and archive projections', () => {
  const meta = createMeta();
  const route = buildDocArticleRouteModel({ meta, pathname: '/ai-insights/second' });

  expect(buildDocArticleNavigationModel({
    meta,
    pathname: '/ai-insights/second',
    docMetaEntry: route.docMetaEntry
  })).toEqual({
    adjacentChapters: {
      prev: {
        title: 'First Article',
        path: '/ai-insights/first',
        file: '/docs/ai-insights/2026-05/23/first.md',
        category: 'AI 前沿学习',
        section: '2026 年 5 月'
      },
      next: null
    },
    articleTags: ['Guide']
  });

  expect(buildDocsArchiveModel(meta.categories[0], 'Guide')).toMatchObject({
    filteredCount: 2,
    tagList: [
      { tag: 'Guide', count: 2 },
      { tag: 'AI', count: 1 }
    ],
    groups: [
      { date: '2026-05-23' },
      { date: '2026-05-22' }
    ]
  });
});

test('builds workspace and route validation models for page shells', () => {
  const meta = createMeta();

  expect(buildDocsWorkspaceModel({
    meta,
    pathname: '/rust-course/ownership'
  })).toMatchObject({
    categories: [
      { id: 'ai-insights' },
      { id: 'rust-course' }
    ],
    activeCategory: { id: 'rust-course' },
    activeSpace: { id: 'rust-course' },
    sidebarMeta: {
      title: 'Rust Course',
      sections: expect.any(Array)
    }
  });

  expect(buildDocsRouteValidationModel(meta, '/ai-insights/first')).toMatchObject({
    defaultPath: '/ai-insights/first',
    isValidDocsPath: true
  });
  expect(buildDocsRouteValidationModel(meta, '/missing')).toMatchObject({
    isValidDocsPath: false
  });
});
