import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useDocsMeta } from '../hooks/useDocsMeta';
import { buildKnowledgeSpaces } from '../utils/knowledgeSpaces';
import {
  buildSiteTitle,
  SITE_CONFIG
} from '../utils/siteConfig';
import { HOME_PATH } from '../utils/siteRoutes';
import './NotFound.css';

const NotFound = ({ requestedPath = '' }) => {
  const { meta } = useDocsMeta();
  const handleCategoryClick = useCategoryNavigation({ mode: 'reload' });

  const categories = meta?.categories || [];
  const spaces = buildKnowledgeSpaces(meta);
  const lostPath = requestedPath || window.location.pathname;

  return (
    <>
      <Helmet>
        <title>{buildSiteTitle('404')}</title>
        <meta name="description" content={`${SITE_CONFIG.brandName} 404 页面 - 当前访问路径不存在`} />
      </Helmet>

      <PageShell
        rootClassName="notfound-page"
        spaces={spaces}
        activeSpace={null}
        onSpaceClick={handleCategoryClick}
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
      >
        <main className="notfound-shell">
          <div className="notfound-term">
            <div className="notfound-line">
              <span className="prompt">{SITE_CONFIG.labels.terminalPrompt}</span>
              <span className="dim"> :~$ </span>
              open <span className="path">{lostPath}</span>
            </div>

            <h1 className="notfound-code">404</h1>
            <p className="notfound-sub">{'// 该路径没有对应页面 — route not found'}</p>

            <div className="notfound-line">
              <span className="prompt">{SITE_CONFIG.labels.terminalPrompt}</span>
              <span className="dim"> :~$ </span>
              <span className="notfound-cursor" aria-hidden="true"></span>
            </div>

            <div className="notfound-actions">
              <Link to={HOME_PATH} className="notfound-btn primary">
                cd {HOME_PATH}
              </Link>
            </div>
          </div>
        </main>
      </PageShell>
    </>
  );
};

export default NotFound;
