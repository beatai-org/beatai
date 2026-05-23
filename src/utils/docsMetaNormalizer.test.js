import {
  normalizeDocsMeta,
  normalizeMetaFilePath,
  normalizeMetaRoutePath
} from './docsMetaNormalizer';

const QUIET = { warn: false };

test('normalizes route and file paths without changing external or relative assets', () => {
  expect(normalizeMetaRoutePath('rust-course/intro')).toBe('/rust-course/intro');
  expect(normalizeMetaRoutePath('/rust-course/intro')).toBe('/rust-course/intro');
  expect(normalizeMetaRoutePath('#local')).toBe('#local');
  expect(normalizeMetaRoutePath('https://example.com/x')).toBe('https://example.com/x');

  expect(normalizeMetaFilePath('docs/rust-course/intro.md')).toBe('/docs/rust-course/intro.md');
  expect(normalizeMetaFilePath('/docs/rust-course/intro.md')).toBe('/docs/rust-course/intro.md');
  expect(normalizeMetaFilePath('./images/cover.webp')).toBe('./images/cover.webp');
});

test('normalizes root meta book entries', () => {
  const meta = normalizeDocsMeta({
    title: 'Docs',
    books: [{
      id: '/rust-course/',
      title: ' Rust ',
      description: ' Learn Rust ',
      metaFile: 'docs/rust-course/_meta.json'
    }]
  }, QUIET);

  expect(meta.categories).toEqual([]);
  expect(meta.books).toEqual([{
    id: 'rust-course',
    title: 'Rust',
    description: 'Learn Rust',
    metaFile: '/docs/rust-course/_meta.json',
    githubRepo: '',
    repoTitle: ''
  }]);
});

test('normalizes category, sections, items, tags, contributors, and nested children', () => {
  const meta = normalizeDocsMeta({
    id: '/rust-course/',
    title: ' Rust Course ',
    entryPath: 'rust-course/intro',
    sections: [{
      title: ' Intro ',
      path: 'rust-course/intro',
      file: 'docs/rust-course/intro.md',
      items: [{
        title: ' Ownership ',
        path: 'rust-course/ownership',
        file: 'docs/rust-course/ownership.md',
        publishedAt: '2026-05-23',
        tags: ['Rust', ' Rust ', '', 'Rust'],
        contributors: [{ role: ' author ', name: ' Ferris ', link: ' https://example.com ' }],
        children: [{
          title: ' Borrowing ',
          path: 'rust-course/borrowing'
        }]
      }]
    }]
  }, QUIET);

  expect(meta.id).toBe('rust-course');
  expect(meta.entryPath).toBe('/rust-course/intro');
  expect(meta.sections[0].path).toBe('/rust-course/intro');
  expect(meta.sections[0].file).toBe('/docs/rust-course/intro.md');

  const item = meta.sections[0].items[0];
  expect(item.path).toBe('/rust-course/ownership');
  expect(item.file).toBe('/docs/rust-course/ownership.md');
  expect(item.publishedAt).toBe('2026-05-23');
  expect(item.tags).toEqual(['Rust']);
  expect(item.contributors).toEqual([{
    role: 'author',
    name: 'Ferris',
    link: 'https://example.com'
  }]);
  expect(item.children[0].path).toBe('/rust-course/borrowing');
  expect(item.children[0].items).toEqual([]);
});

test('normalizes malformed collections to arrays', () => {
  const meta = normalizeDocsMeta({
    id: 'rust-course',
    sections: [{
      title: 'Intro',
      items: 'not-an-array'
    }]
  }, QUIET);

  expect(meta.sections[0].items).toEqual([]);
});

test('keeps ai-insights section reverse ordering behavior', () => {
  const meta = normalizeDocsMeta({
    categories: [{
      id: 'ai-insights',
      title: 'AI',
      sections: [
        { title: 'older', items: [] },
        { title: 'newer', items: [] }
      ]
    }]
  }, QUIET);

  expect(meta.categories[0].sections.map((section) => section.title)).toEqual(['newer', 'older']);
});
