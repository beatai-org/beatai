import { renderHook } from '@testing-library/react';
import { buildDocArticleRouteModel } from '../../domain/docs';
import { normalizeDocsMeta } from '../../utils/docsMetaNormalizer';
import { useDocArticleNavigation } from './useDocArticleNavigation';

const QUIET = { warn: false };

function createMeta() {
  return normalizeDocsMeta({
    categories: [{
      id: 'book',
      title: 'Book',
      sections: [{
        title: 'Intro',
        items: [{
          title: 'First',
          path: 'book/first',
          tags: ['Start']
        }, {
          title: 'Second',
          path: 'book/second',
          tags: ['Middle'],
          children: [{
            title: 'Second Child',
            path: 'book/second-child',
            tags: ['Child']
          }]
        }, {
          title: 'Third',
          path: 'book/third',
          tags: ['End']
        }]
      }]
    }, {
      id: 'other',
      title: 'Other',
      sections: [{
        title: 'Other Intro',
        items: [{
          title: 'Other First',
          path: 'other/first',
          tags: ['Other']
        }]
      }]
    }]
  }, QUIET);
}

test('derives adjacent chapters and article tags from meta', () => {
  const meta = createMeta();
  const { docMetaEntry } = buildDocArticleRouteModel({
    meta,
    pathname: '/book/second-child'
  });

  const { result } = renderHook(() => useDocArticleNavigation({
    meta,
    pathname: '/book/second-child',
    docMetaEntry,
    findArticleTags: jest.fn(() => ['Fallback'])
  }));

  expect(result.current.adjacentChapters).toEqual({
    prev: {
      title: 'Second',
      path: '/book/second',
      file: '',
      category: 'Book',
      section: 'Intro'
    },
    next: {
      title: 'Third',
      path: '/book/third',
      file: '',
      category: 'Book',
      section: 'Intro'
    }
  });
  expect(result.current.articleTags).toEqual(['Child']);
});

test('falls back to tag lookup when meta entry is absent', () => {
  const findArticleTags = jest.fn(() => ['Fallback']);

  const { result } = renderHook(() => useDocArticleNavigation({
    meta: createMeta(),
    pathname: '/book/missing',
    docMetaEntry: null,
    findArticleTags
  }));

  expect(result.current.adjacentChapters).toEqual({ prev: null, next: null });
  expect(result.current.articleTags).toEqual(['Fallback']);
  expect(findArticleTags).toHaveBeenCalledWith('/book/missing');
});

test('returns empty navigation state before meta is loaded', () => {
  const findArticleTags = jest.fn(() => ['Fallback']);

  const { result } = renderHook(() => useDocArticleNavigation({
    meta: null,
    pathname: '/book/first',
    findArticleTags
  }));

  expect(result.current.adjacentChapters).toEqual({ prev: null, next: null });
  expect(result.current.articleTags).toEqual([]);
  expect(findArticleTags).not.toHaveBeenCalled();
});
