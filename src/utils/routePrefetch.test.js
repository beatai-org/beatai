const mockLoaders = {
  aiInsights: jest.fn(),
  collectionPage: jest.fn(),
  notFound: jest.fn(),
  bookPage: jest.fn(),
  tag: jest.fn()
};

jest.mock('./routeModuleLoaders', () => ({
  ROUTE_MODULE_LOADERS: mockLoaders
}));

const {
  clearRoutePreloadCache,
  getRouteIdForPath,
  preloadRouteForPath
} = require('./routePrefetch');

beforeEach(() => {
  clearRoutePreloadCache();
  Object.values(mockLoaders).forEach((loader) => {
    loader.mockReset();
    loader.mockResolvedValue({ default: () => null });
  });
});

test('resolves route ids from internal paths', () => {
  expect(getRouteIdForPath('/')).toBe('aiInsights');
  expect(getRouteIdForPath('/ai-insights')).toBe('aiInsights');
  expect(getRouteIdForPath('/tags/Artificial%20Intelligence')).toBe('tag');
  expect(getRouteIdForPath('/learn-ai')).toBe('collectionPage');
  expect(getRouteIdForPath('/learn-ai/deep-learning/chapter-01/lesson-01')).toBe('bookPage');
  expect(getRouteIdForPath('/mba')).toBe('collectionPage');
  expect(getRouteIdForPath('/mba/elon-book/about')).toBe('bookPage');
  expect(getRouteIdForPath('/rust-course/about-book')).toBe('bookPage');
  expect(getRouteIdForPath('https://example.com/rust-course/about-book')).toBeNull();
});

test('deduplicates route module preloads by resolved route id', async () => {
  await Promise.all([
    preloadRouteForPath('/rust-course/about-book'),
    preloadRouteForPath('/rust-course/into-rust')
  ]);

  expect(mockLoaders.bookPage).toHaveBeenCalledTimes(1);
});

test('swallows failed preloads and allows retrying the same route later', async () => {
  mockLoaders.tag.mockRejectedValueOnce(new Error('chunk load failed'));

  await expect(preloadRouteForPath('/tags/AI')).resolves.toBeUndefined();
  expect(mockLoaders.tag).toHaveBeenCalledTimes(1);

  await expect(preloadRouteForPath('/tags/AI')).resolves.toEqual({ default: expect.any(Function) });
  expect(mockLoaders.tag).toHaveBeenCalledTimes(2);
});
