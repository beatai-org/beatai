import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Navigate,
  Route,
  Routes,
  useLocation
} from 'react-router-dom';
import Sidebar from '../components/docs/Sidebar';
import { LearnRouteNotFound } from '../components/learnClaudeCode/NotFoundState';
import VersionPage from '../components/learnClaudeCode/VersionPage';
import PageShell from '../components/layout/PageShell';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useSidebarState } from '../hooks/useSidebarState';
import { useDocsMeta } from '../hooks/useDocsMeta';
import './LearnClaudeCode.css';
import '../components/docs/DocContent.css';
import '../styles/prism-custom.css';
import { LEARNING_PATH } from '../vendor/learn-claude-code/data';
import { buildLearnClaudeCodeSidebarMeta } from '../components/learnClaudeCode/sidebarMeta';
import {
  getLearnClaudeCodePath,
  isPracticeVersion,
  LEARN_AI_PRACTICES_BASE_PATH
} from '../utils/learnAiPaths';

function LearnClaudeCode() {
  const { meta } = useDocsMeta();
  const location = useLocation();
  const handleCategoryClick = useCategoryNavigation();
  const { sidebarOpen, closeSidebar, toggleSidebar } = useSidebarState({
    closeOnChange: location.pathname
  });

  const categories = meta?.categories || [];
  const sidebarMeta = useMemo(() => buildLearnClaudeCodeSidebarMeta(), []);
  const isPracticesRoute = location.pathname.startsWith(LEARN_AI_PRACTICES_BASE_PATH);
  const currentVersion = location.pathname.split('/').filter(Boolean).at(-1) || '';
  const isVersionPath = currentVersion !== 'learn-claude-code' && currentVersion !== 'practices';

  if (isVersionPath) {
    const shouldUsePracticesRoute = isPracticeVersion(currentVersion);
    if (shouldUsePracticesRoute !== isPracticesRoute) {
      return <Navigate to={getLearnClaudeCodePath(currentVersion)} replace />;
    }
  }

  const defaultVersion = isPracticesRoute
    ? LEARNING_PATH.find(isPracticeVersion) || LEARNING_PATH[0]
    : LEARNING_PATH.find((version) => !isPracticeVersion(version)) || LEARNING_PATH[0];

  return (
    <>
      <Helmet>
        <title>AI 学习宝典 | BeatAI</title>
        <meta
          name="description"
          content="AI 学习宝典学习路径已接入 BeatAI，包含学习路径、版本详情、文档讲解、模拟器与源码浏览。"
        />
      </Helmet>

      <PageShell
        rootClassName="lcc-page"
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
        sidebarOpen={sidebarOpen}
        onMenuToggle={toggleSidebar}
      >
        <div className="lcc-shell">
          <div className="lcc-workspace">
            <Sidebar
              meta={sidebarMeta}
              isOpen={sidebarOpen}
              onClose={closeSidebar}
            />

            <div className="lcc-content">
              <Routes>
                <Route index element={<Navigate to={defaultVersion} replace />} />
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
