import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TagProvider, useTag } from '../contexts/TagContext';
import PageShell from '../components/layout/PageShell';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useDocsMeta } from '../hooks/useDocsMeta';
import { buildKnowledgeSpaces } from '../utils/knowledgeSpaces';
import { buildDocsTitle } from '../utils/siteConfig';
import { HOME_PATH } from '../utils/siteRoutes';
import './TagPage.css';

// Inner component that uses TagContext
const TagPageContent = ({ categories, spaces }) => {
  const { tagName } = useParams();
  const decodedTagName = decodeURIComponent(tagName);
  const { getArticlesByTag, groupByCategory } = useTag();
  const handleCategoryClick = useCategoryNavigation();

  // Get all articles with this tag
  const articles = getArticlesByTag(decodedTagName);

  // Group articles by category
  const groupedArticles = groupByCategory(articles);
  const articleCategories = Object.keys(groupedArticles);

  return (
    <>
      <Helmet>
        <title>{buildDocsTitle(`#${decodedTagName} 标签`)}</title>
        <meta
          name="description"
          content={`浏览所有带有 ${decodedTagName} 标签的文章，共 ${articles.length} 篇。`}
        />
      </Helmet>

      <PageShell
        rootClassName="tag-page"
        spaces={spaces}
        activeSpace={null}
        onSpaceClick={handleCategoryClick}
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
      >
        <div className="tag-page-container">
          <div className="tag-page-header">
            <h1 className="tag-page-title">#{decodedTagName}</h1>
            <p className="tag-page-subtitle">
              共 {articles.length} 篇文章
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="tag-page-empty">
              <p>暂无带有此标签的文章</p>
              <Link to={HOME_PATH} className="tag-page-back-link">
                返回首页
              </Link>
            </div>
          ) : (
            <div className="tag-page-content">
              {articleCategories.map((category) => (
                <div key={category} className="tag-category-section">
                  <h2 className="tag-category-title">
                    <span className="tag-category-icon">📖</span>
                    {category}
                  </h2>

                  <div className="tag-articles-list">
                    {groupedArticles[category].map((article, index) => (
                      <Link
                        key={index}
                        to={article.path}
                        className="tag-article-item"
                      >
                        <span className="tag-article-arrow">→</span>
                        <span className="tag-article-title">{article.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageShell>
    </>
  );
};

// Main component that loads meta and provides TagContext
const TagPage = () => {
  const { meta, loading, error } = useDocsMeta();

  if (loading) {
    return <div className="tag-page-loading">Loading...</div>;
  }

  if (error || !meta) {
    return <div className="tag-page-error">Failed to load metadata</div>;
  }

  return (
    <TagProvider meta={meta}>
      <TagPageContent categories={meta.categories || []} spaces={buildKnowledgeSpaces(meta)} />
    </TagProvider>
  );
};

export default TagPage;
