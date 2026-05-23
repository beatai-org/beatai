import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import PageSeo from '../components/seo/PageSeo';
import ArchiveCard from '../components/aiInsights/ArchiveCard';
import ArchiveList from '../components/aiInsights/ArchiveList';
import TagChipBar from '../components/aiInsights/TagChipBar';
import ViewToggle from '../components/aiInsights/ViewToggle';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useDocsMeta } from '../hooks/useDocsMeta';
import {
  buildArticleTagList,
  filterArticlesByTag,
  findCategoryById,
  getCategoryArticles,
  groupArticlesByDate
} from '../utils/docsMetaSelectors';
import { buildKnowledgeSpaces } from '../utils/knowledgeSpaces';
import { PAGE_IDS } from '../utils/pageConfig';
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

const ArchiveContent = ({ category, categories, spaces }) => {
  const handleCategoryClick = useCategoryNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState(readStoredView);

  const selectedTag = useMemo(
    () => parseTagParam(searchParams.get('tag')),
    [searchParams]
  );

  const articles = useMemo(() => getCategoryArticles(category), [category]);
  const tagList = useMemo(() => buildArticleTagList(articles), [articles]);

  const filteredArticles = useMemo(() => {
    return filterArticlesByTag(articles, selectedTag);
  }, [articles, selectedTag]);

  const groups = useMemo(() => groupArticlesByDate(filteredArticles), [filteredArticles]);

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
      <PageSeo
        pageId={PAGE_IDS.aiInsights}
        title={category.title}
        description={category.description || undefined}
      />

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

  const category = findCategoryById(meta, AI_INSIGHTS_CATEGORY_ID);
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
      categories={meta.categories}
      spaces={spaces}
    />
  );
};

export default AiInsightsArchive;
