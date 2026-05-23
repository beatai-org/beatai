import { normalizeDocsMeta } from './docsMetaNormalizer';
import {
  buildArticleTagList,
  buildSearchableDocs,
  buildTagIndex,
  collectDocPaths,
  filterArticlesByTag,
  findActiveCategoryByPath,
  findArticleTags,
  findCategoryById,
  findMetaEntryByPath,
  getAllTags,
  getArticlesByTag,
  getCategoryArticles,
  getFirstNavigablePathForCategory,
  groupArticlesByCategory,
  groupArticlesByDate
} from './docsMetaSelectors';

const QUIET = { warn: false };

function createMeta() {
  return normalizeDocsMeta({
    categories: [{
      id: 'book',
      title: 'Book',
      sections: [{
        title: 'Intro',
        path: 'book/intro',
        tags: ['Section Tag'],
        items: [{
          title: 'Parent',
          path: 'book/parent',
          file: 'docs/book/parent.md',
          description: 'Parent description',
          publishedAt: '2026-05-20',
          tags: ['AI', 'Guide'],
          children: [{
            title: 'Child',
            path: 'book/child',
            tags: ['AI']
          }],
          items: [{
            title: 'Nested',
            path: 'book/你好',
            publishedAt: '2026-05-21',
            tags: ['Guide']
          }]
        }]
      }]
    }, {
      id: 'notes',
      title: 'Notes',
      sections: []
    }]
  }, QUIET);
}

test('selects doc paths and active entries from normalized meta', () => {
  const meta = createMeta();

  expect(findCategoryById(meta, 'book').title).toBe('Book');
  expect(getFirstNavigablePathForCategory(meta.categories[0])).toBe('/book/parent');

  const paths = collectDocPaths(meta);
  expect(paths.has('/book')).toBe(true);
  expect(paths.has('/book/intro')).toBe(true);
  expect(paths.has('/book/child')).toBe(true);
  expect(paths.has('/book/%E4%BD%A0%E5%A5%BD')).toBe(true);

  const entry = findMetaEntryByPath(meta, '/book/child');
  expect(entry).toMatchObject({
    type: 'item',
    item: { title: 'Child' },
    category: { title: 'Book' },
    section: { title: 'Intro' }
  });

  expect(findActiveCategoryByPath(meta, '/book/missing').title).toBe('Book');
});

test('builds tag selectors from normalized meta', () => {
  const meta = createMeta();
  const tagIndex = buildTagIndex(meta);

  expect(getAllTags(tagIndex)).toEqual(['AI', 'Guide', 'Section Tag']);
  expect(getArticlesByTag(tagIndex, 'AI').map((article) => article.title)).toEqual([
    'Parent',
    'Child'
  ]);
  expect(groupArticlesByCategory(getArticlesByTag(tagIndex, 'Guide'))).toEqual({
    Book: [
      {
        title: 'Parent',
        path: '/book/parent',
        category: 'Book',
        file: '/docs/book/parent.md'
      },
      {
        title: 'Nested',
        path: '/book/你好',
        category: 'Book',
        file: ''
      }
    ]
  });
  expect(findArticleTags(meta, '/book/parent')).toEqual(['AI', 'Guide']);
});

test('builds search and archive projections', () => {
  const meta = createMeta();
  const articles = getCategoryArticles(meta.categories[0]);

  expect(buildSearchableDocs(meta).map((item) => item.title)).toEqual([
    'Parent',
    'Child',
    'Nested'
  ]);
  expect(articles.map((article) => article.title)).toEqual(['Parent', 'Nested']);
  expect(filterArticlesByTag(articles, 'Guide').map((article) => article.title)).toEqual([
    'Parent',
    'Nested'
  ]);
  expect(buildArticleTagList(articles)).toEqual([
    { tag: 'Guide', count: 2 },
    { tag: 'AI', count: 1 }
  ]);
  expect(groupArticlesByDate(articles).map((group) => group.date)).toEqual([
    '2026-05-21',
    '2026-05-20'
  ]);
});
