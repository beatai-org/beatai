import React, { useMemo } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams
} from 'react-router-dom';
import BookWorkspaceLayout from '../components/docs/BookWorkspaceLayout';
import PageSeo from '../components/seo/PageSeo';
import { LearnRouteNotFound, NotFoundState } from '../components/learnClaudeCode/NotFoundState';
import VersionPage from '../components/learnClaudeCode/VersionPage';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useSidebarState } from '../hooks/useSidebarState';
import { useDocsMeta } from '../hooks/useDocsMeta';
import './LearnClaudeCode.css';
import { buildLearnAiSidebarMeta } from '../components/learnClaudeCode/sidebarMeta';
import {
  buildKnowledgeNavigationModel,
  getAiTutorialNavigationSpace
} from '../domain/docs';
import {
  getLearnAiDefaultPath,
  getLearnAiEntryPath
} from '../utils/learnAiPaths';
import {
  getLearnAiSpace,
  getLearnAiSpaceByVersion
} from '../utils/learnAiSpaces';
import { PAGE_IDS } from '../utils/pageConfig';

function LearnClaudeCode() {
  const { space: spaceSlug } = useParams();
  const { meta } = useDocsMeta();
  const location = useLocation();
  const handleCategoryClick = useCategoryNavigation();
  const { sidebarOpen, closeSidebar, toggleSidebar } = useSidebarState({
    closeOnChange: location.pathname
  });

  const { categories, spaces } = useMemo(() => buildKnowledgeNavigationModel(meta), [meta]);
  const currentSpace = getLearnAiSpace(spaceSlug);
  const sidebarMeta = useMemo(() => buildLearnAiSidebarMeta(currentSpace), [currentSpace]);
  const activeSpace = useMemo(() => getAiTutorialNavigationSpace(), []);
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentVersion = pathParts.length > 2 ? pathParts[2] : '';

  if (!currentSpace) {
    return <NotFoundState label={spaceSlug || location.pathname} />;
  }

  if (currentVersion) {
    const targetSpace = getLearnAiSpaceByVersion(currentVersion);
    if (targetSpace && targetSpace.slug !== currentSpace.slug) {
      return <Navigate to={getLearnAiEntryPath(currentVersion)} replace />;
    }
  }

  return (
    <>
      <PageSeo pageId={PAGE_IDS.learnClaudeCode} />

      <BookWorkspaceLayout
        rootClassName="lcc-page"
        spaces={spaces}
        activeSpace={activeSpace}
        onSpaceClick={handleCategoryClick}
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
        sidebarMeta={sidebarMeta}
        sidebarOpen={sidebarOpen}
        onMenuToggle={toggleSidebar}
        onSidebarClose={closeSidebar}
      >
        <Routes>
          <Route index element={<Navigate to={getLearnAiDefaultPath(currentSpace.slug)} replace />} />
          <Route path=":version" element={<VersionPage />} />
          <Route path="*" element={<LearnRouteNotFound />} />
        </Routes>
      </BookWorkspaceLayout>
    </>
  );
}

export default LearnClaudeCode;
