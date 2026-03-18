import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader/AppHeader';
import Footer from '../components/Footer/Footer';
import './NotFound.css';

const NotFound = ({ requestedPath = '' }) => {
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const metaPath = `${process.env.PUBLIC_URL}/docs/_meta.json`;
    fetch(metaPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setMeta(data))
      .catch((err) => console.error('Failed to load docs meta:', err));
  }, []);

  const categories = meta?.categories || [];

  const handleCategoryClick = (category) => {
    const firstSection = category.sections?.[0];
    const firstItem = firstSection?.items?.[0];
    const targetPath = firstItem?.path || firstSection?.path;

    if (targetPath) {
      window.location.href = targetPath;
    }
  };

  return (
    <>
      <Helmet>
        <title>404 | BeatAI</title>
        <meta name="description" content="BeatAI 404 页面 - 当前访问路径不存在" />
      </Helmet>

      <div className="notfound-page dynamic-background">
        <div className="sailor-moon-bg-layer"></div>

        <AppHeader
          categories={categories}
          activeCategory={null}
          onCategoryClick={handleCategoryClick}
        />

        <main className="notfound-shell">
          <div className="notfound-gridlines" aria-hidden="true"></div>
          <section className="notfound-frame">
            <div className="notfound-frame-top">
              <span className="notfound-eyebrow">BEATAI OS // BULKHEAD CONTROL</span>
              <div className="notfound-status-lamps" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div className="notfound-bulkhead">
              <div className="notfound-door notfound-door-left">
                <div className="notfound-door-inner">
                  <span className="notfound-tag">AIRLOCK // 404</span>
                  <div className="notfound-code-cluster">
                    <span className="ghost">404</span>
                    <strong>404</strong>
                  </div>
                  <h1>目标舱段不存在，隔离门未开启。</h1>
                  <p className="notfound-lead">
                    当前请求没有对应页面。系统已终止自动回落，不会把你静默送回广场，
                    而是直接显示未命中状态。
                  </p>

                  <div className="notfound-chip-row">
                    <span className="chip warn">ROUTE LOST</span>
                    <span className="chip info">MANUAL RECOVERY</span>
                    <span className="chip ok">CORE ONLINE</span>
                  </div>

                  <div className="notfound-actions">
                    <Link to="/square" className="notfound-btn primary">
                      返回广场
                    </Link>
                    <Link to="/learn-claude-code/s01" className="notfound-btn secondary">
                      进入学习路径
                    </Link>
                  </div>
                </div>
              </div>

              <div className="notfound-door notfound-door-right">
                <div className="notfound-door-inner">
                  <div className="notfound-panel-head">
                    <span>ROUTE TELEMETRY</span>
                    <span className="notfound-pulse" aria-hidden="true"></span>
                  </div>

                  <div className="notfound-metric">
                    <span className="label">Requested Path</span>
                    <strong>{requestedPath || window.location.pathname}</strong>
                  </div>

                  <div className="notfound-metric">
                    <span className="label">Door Status</span>
                    <strong>SEALED // NOT FOUND</strong>
                  </div>

                  <div className="notfound-metric">
                    <span className="label">Recovery Protocol</span>
                    <strong className="soft">Use top navigation or jump to a known entry node.</strong>
                  </div>

                  <div className="notfound-terminal">
                    <div className="terminal-head">
                      <span></span>
                      <span></span>
                      <span></span>
                      <strong>bulkhead-log</strong>
                    </div>
                    <div className="terminal-body">
                      <div><span>&gt;</span> route signature unresolved</div>
                      <div><span>&gt;</span> path buffer: <em>{requestedPath || window.location.pathname}</em></div>
                      <div><span>&gt;</span> auto-fallback disabled</div>
                      <div><span>&gt;</span> awaiting manual destination lock</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="notfound-core" aria-hidden="true">
                <div className="notfound-core-ring ring-a"></div>
                <div className="notfound-core-ring ring-b"></div>
                <div className="notfound-core-center">
                  <span>404</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NotFound;
