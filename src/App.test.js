import { render, screen } from '@testing-library/react';
import App from './App';
import { getLearnAiEntryPath } from './utils/learnAiPaths';
import { buildLearnAiSidebarMeta } from './components/learnClaudeCode/sidebarMeta';

jest.mock('./utils/lazyWithMinLoadTime', () => ({
  lazyWithMinLoadTime: (importFunc) => importFunc()
}));

const originalFetch = global.fetch;

beforeEach(() => {
  window.history.pushState({}, '', '/');
  global.fetch = jest.fn((input) => {
    const url = String(input);

    if (url.endsWith('/docs/_meta.json')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          title: 'BeatAI Documentation',
          books: [
            {
              id: 'ai-insights',
              title: 'AI 前沿学习',
              description: 'AI 领域最新动态、技术分享与深度解析',
              metaFile: '/docs/ai-insights/_meta.json'
            },
            {
              id: 'rust-course',
              title: 'RUST语言圣经',
              description: 'Rust 编程语言完整学习指南',
              metaFile: '/docs/rust-course/_meta.json'
            },
            {
              id: 'deep-learning',
              title: '深度学习指南',
              description: '深度学习完整学习指南',
              metaFile: '/docs/learn-ai/deep-learning/_meta.json'
            }
          ]
        })
      });
    }

    if (url.endsWith('/docs/ai-insights/_meta.json')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          id: 'ai-insights',
          title: 'AI 前沿学习',
          description: 'AI 领域最新动态、技术分享与深度解析',
          sections: []
        })
      });
    }

    if (url.endsWith('/docs/rust-course/_meta.json')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          id: 'rust-course',
          title: 'RUST语言圣经',
          description: 'Rust 编程语言完整学习指南',
          sections: []
        })
      });
    }

    if (url.endsWith('/docs/learn-ai/deep-learning/_meta.json')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          id: 'deep-learning',
          title: '深度学习指南',
          description: '深度学习完整学习指南',
          sections: []
        })
      });
    }

    return Promise.reject(new Error(`Unhandled fetch in test: ${url}`));
  });
});

afterEach(() => {
  global.fetch = originalFetch;
});

test('renders square page entry content', async () => {
  window.history.pushState({}, '', '/square');
  render(<App />);
  expect(await screen.findByText('探索内容')).toBeInTheDocument();
  expect(await screen.findByText('AI学习教程')).toBeInTheDocument();
});

test('renders ai tutorials page with learn-ai card', async () => {
  window.history.pushState({}, '', '/learn-ai');
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Learn Claude Code' })).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: '深度学习指南' })).toBeInTheDocument();
});

test('maps best-practices chapter to unified learn-claude-code path', () => {
  expect(getLearnAiEntryPath('bp01')).toBe('/learn-ai/learn-claude-code/bp01');
});

test('renders best-practices as a separate sidebar section', () => {
  const sidebarMeta = buildLearnAiSidebarMeta({ title: 'Learn Claude Code', bookTitle: 'Learn Claude Code' });
  expect(sidebarMeta.sections.map((section) => section.title)).toEqual([
    '从零手搓 Claude Code',
    '最佳实践'
  ]);
  expect(sidebarMeta.bookPath).toEqual({
    parentTitle: 'AI学习教程',
    currentTitle: 'Learn Claude Code'
  });
  expect(sidebarMeta.sections[1].items[0].title).toBe('BP01 Claude Code 最佳实践指南');
  expect(sidebarMeta.sections[1].items[0].path).toBe('/learn-ai/learn-claude-code/bp01');
});
