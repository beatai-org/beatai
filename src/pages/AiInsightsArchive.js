import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageShell from '../components/layout/PageShell';
import ArchiveCard from '../components/aiInsights/ArchiveCard';
import ArchiveList from '../components/aiInsights/ArchiveList';
import TagChipBar from '../components/aiInsights/TagChipBar';
import ViewToggle from '../components/aiInsights/ViewToggle';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useDocsMeta } from '../hooks/useDocsMeta';
import { buildKnowledgeSpaces } from '../utils/knowledgeSpaces';
import { buildSiteTitle } from '../utils/siteConfig';
import { PAGE_CONFIG, PAGE_IDS } from '../utils/pageConfig';
import { AI_INSIGHTS_CATEGORY_ID, HOME_PATH } from '../utils/siteRoutes';
import './AiInsightsArchive.css';

const VIEW_STORAGE_KEY = 'aiInsightsView';
const DEFAULT_VIEW = 'card';

function readStoredView() {
  if (typeof window === 'undefined') return DEFAULT_VIEW;
  try {
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    return stored === 'card' || stored === 'list' ? stored : DEFAULT_VIEW;
  } catch {
    return DEFAULT_VIEW;
  }
}

function parseTagParam(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function flattenArticles(category) {
  const out = [];
  for (const section of category?.sections || []) {
    for (const item of section.items || []) {
      if (item?.path && item?.publishedAt) out.push(item);
    }
  }
  return out;
}

function groupByDate(articles) {
  const map = new Map();
  for (const a of articles) {
    const date = a.publishedAt;
    if (!map.has(date)) map.set(date, []);
    map.get(date).push(a);
  }
  // YYYY-MM-DD 字典序倒排 = 时间倒序
  return [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0))
    .map(([date, items]) => ({ date, articles: items }));
}

function buildTagList(articles) {
  const counts = new Map();
  for (const a of articles) {
    if (!Array.isArray(a.tags)) continue;
    for (const tag of a.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.tag.localeCompare(b.tag, 'zh');
    });
}

const ArchiveContent = ({ category, categories, spaces }) => {
  const handleCategoryClick = useCategoryNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState(readStoredView);

  const selectedTag = useMemo(
    () => parseTagParam(searchParams.get('tag')),
    [searchParams]
  );

  const articles = useMemo(() => flattenArticles(category), [category]);
  const tagList = useMemo(() => buildTagList(articles), [articles]);

  const filteredArticles = useMemo(() => {
    if (!selectedTag) return articles;
    return articles.filter(
      (a) => Array.isArray(a.tags) && a.tags.includes(selectedTag)
    );
  }, [articles, selectedTag]);

  const groups = useMemo(() => groupByDate(filteredArticles), [filteredArticles]);

  const handleSelectTag = useCallback(
    (tag) => {
      const params = new URLSearchParams(searchParams);
      if (tag === selectedTag) params.delete('tag');
      else params.set('tag', tag);
      setSearchParams(params, { replace: true });
    },
    [searchParams, selectedTag, setSearchParams]
  );

  const handleClearTag = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('tag');
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleViewChange = useCallback((next) => {
    setViewMode(next);
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (viewMode !== 'card' && viewMode !== 'list') {
      setViewMode(DEFAULT_VIEW);
    }
  }, [viewMode]);

  const filteredCount = filteredArticles.length;

  return (
    <>
      <Helmet>
        <title>{buildSiteTitle(category.title)}</title>
        <meta
          name="description"
          content={category.description || PAGE_CONFIG[PAGE_IDS.aiInsights].description}
        />
      </Helmet>

      <PageShell
        rootClassName="ai-insights-archive-page"
        spaces={spaces}
        activeSpace={null}
        onSpaceClick={handleCategoryClick}
        categories={categories}
        activeCategory={category}
        onCategoryClick={handleCategoryClick}
      >
        <div className="archive-container">
          <div className="archive-controls">
            <TagChipBar
              tags={tagList}
              selectedTag={selectedTag}
              onSelectTag={handleSelectTag}
              onClear={handleClearTag}
            />
            <ViewToggle value={viewMode} onChange={handleViewChange} />
          </div>

          {filteredCount === 0 ? (
            <div className="archive-empty">
              <p>当前筛选下没有文章。</p>
              <button
                type="button"
                className="archive-empty-clear"
                onClick={handleClearTag}
              >
                清除筛选
              </button>
            </div>
          ) : viewMode === 'list' ? (
            <ArchiveList groups={groups} />
          ) : (
            <div className="archive-cards">
              {groups.map(({ date, articles: dayArticles }) => (
                <section key={date} className="archive-cards-group">
                  <h2 className="archive-cards-date">
                    <span className="archive-cards-date-value">{date}</span>
                  </h2>
                  <div className="archive-cards-grid">
                    {dayArticles.map((article) => (
                      <ArchiveCard key={article.path} article={article} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </PageShell>
    </>
  );
};

const AiInsightsArchive = () => {
  const { meta, loading, error } = useDocsMeta();

  if (loading) {
    return <div className="ai-insights-archive-loading">Loading...</div>;
  }

  if (error || !meta) {
    return <div className="ai-insights-archive-error">Failed to load metadata</div>;
  }

  const category = meta.categories?.find((c) => c.id === AI_INSIGHTS_CATEGORY_ID);
  if (!category) {
    return (
      <div className="ai-insights-archive-error">
        <p>未找到 ai-insights 分类。</p>
        <Link to={HOME_PATH}>返回首页</Link>
      </div>
    );
  }

  const spaces = buildKnowledgeSpaces(meta);

  return (
    <ArchiveContent
      category={category}
      categories={meta.categories || []}
      spaces={spaces}
    />
  );
};

export default AiInsightsArchive;
