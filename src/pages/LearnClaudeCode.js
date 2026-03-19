import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import Sidebar from '../components/docs/Sidebar';
import { LearnRouteNotFound } from '../components/learnClaudeCode/NotFoundState';
import VersionPage from '../components/learnClaudeCode/VersionPage';
import PageShell from '../components/layout/PageShell';
import { useDocsMeta } from '../hooks/useDocsMeta';
import { getFirstNavigablePathForCategory } from '../utils/docsMeta';
import './LearnClaudeCode.css';
import '../components/docs/DocContent.css';
import '../styles/prism-custom.css';
import { LAYERS, LEARNING_PATH, zhMessages } from '../vendor/learn-claude-code/data';
import { getVersionNavTitle } from '../components/learnClaudeCode/versionUtils';

function LearnClaudeCode() {
  const { meta } = useDocsMeta();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const categories = meta?.categories || [];

  const handleCategoryClick = (category) => {
    const path = getFirstNavigablePathForCategory(category);
    if (path) {
      navigate(path);
    }
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const sidebarMeta = useMemo(() => {
    const courseLayers = LAYERS.filter((l) => l.id !== 'best-practices');
    const bpLayers = LAYERS.filter((l) => l.id === 'best-practices');

    const mapLayer = (layer) => {
      const versions = layer.versions || [];
      const firstVersion = versions[0];

      if (layer.id === 'introduction') {
        return {
          title: zhMessages.layer_labels?.[layer.id] || layer.label,
          path: firstVersion ? `/learn-claude-code/${firstVersion}` : '/learn-claude-code'
        };
      }

      return {
        title: zhMessages.layer_labels?.[layer.id] || layer.label,
        path: firstVersion ? `/learn-claude-code/${firstVersion}` : '/learn-claude-code',
        highlightable: false,
        children: versions.map((versionId) => ({
          title: getVersionNavTitle(versionId),
          path: `/learn-claude-code/${versionId}`
        }))
      };
    };

    const sections = [
      {
        title: '从零手搓 Claude Code',
        items: courseLayers.map(mapLayer)
      }
    ];

    if (bpLayers.length > 0) {
      sections.push({
        title: '最佳实践',
        items: bpLayers.flatMap((layer) =>
          (layer.versions || []).map((versionId) => ({
            title: getVersionNavTitle(versionId),
            path: `/learn-claude-code/${versionId}`
          }))
        )
      });
    }

    return { title: 'CC宝典', sections };
  }, []);

  return (
    <>
      <Helmet>
        <title>CC宝典 | BeatAI</title>
        <meta
          name="description"
          content="CC宝典学习路径已接入 BeatAI，包含学习路径、版本详情、文档讲解、模拟器与源码浏览。"
        />
      </Helmet>

      <PageShell
        rootClassName="lcc-page"
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
        sidebarOpen={sidebarOpen}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      >
        <div className="lcc-shell">
          <div className="lcc-workspace">
            <Sidebar
              meta={sidebarMeta}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            <div className="lcc-content">
              <Routes>
                <Route index element={<Navigate to={LEARNING_PATH[0]} replace />} />
                <Route path=":version" element={<VersionPage />} />
                <Route path="*" element={<LearnRouteNotFound />} />
              </Routes>
            </div>
          </div>
        </div>
      </PageShell>
    </>
  );
}

export default LearnClaudeCode;
