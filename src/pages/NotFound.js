import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import PageSeo from '../components/seo/PageSeo';
import { SITE_CONFIG } from '../utils/siteConfig';
import { PAGE_IDS } from '../utils/pageConfig';
import { HOME_PATH } from '../utils/siteRoutes';
import './NotFound.css';

const NotFound = ({ requestedPath = '' }) => {
  const lostPath = requestedPath || window.location.pathname;

  return (
    <>
      <PageSeo pageId={PAGE_IDS.notFound} />

      <PageShell rootClassName="notfound-page">
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
