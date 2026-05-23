import {
  clearDocsMetaCache,
  getCachedDocsMeta,
  loadDocsMeta
} from './docsMeta';
import { fetchJson } from './http';

jest.mock('./http', () => ({
  fetchJson: jest.fn()
}));

beforeEach(() => {
  clearDocsMetaCache();
  fetchJson.mockReset();
});

test('exposes fulfilled docs meta synchronously from cache', async () => {
  fetchJson.mockResolvedValueOnce({
    categories: [{
      id: 'ai-insights',
      title: 'AI Insights',
      sections: []
    }]
  });

  expect(getCachedDocsMeta('/docs/_meta.json')).toBeNull();

  const meta = await loadDocsMeta('/docs/_meta.json');

  expect(fetchJson).toHaveBeenCalledWith('/docs/_meta.json');
  expect(getCachedDocsMeta('/docs/_meta.json')).toBe(meta);
  expect(getCachedDocsMeta('/docs/_meta.json').categories[0].id).toBe('ai-insights');
});
