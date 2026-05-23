import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import MapScene from '../components/aiContinent/MapScene';
import QuestPanel from '../components/aiContinent/QuestPanel';
import PageShell from '../components/layout/PageShell';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useDocsMeta } from '../hooks/useDocsMeta';
import {
  AI_CONTINENT_INITIAL_COMPLETED_NODE_IDS,
  AI_CONTINENT_NODE_MAP,
  AI_CONTINENT_NODES,
  buildStatusByNodeId,
  findAncestorChain,
  getPrerequisites,
  getRecommendedPath
} from '../data/aiContinentMap';
import { buildKnowledgeSpaces } from '../utils/knowledgeSpaces';
import {
  buildSiteTitle,
  SITE_CONFIG
} from '../utils/siteConfig';
import './AIContinentDemo.css';

function AIContinentDemo() {
  const { meta } = useDocsMeta();
  const handleCategoryClick = useCategoryNavigation();
  const spaces = useMemo(() => buildKnowledgeSpaces(meta), [meta]);
  const categories = meta?.categories || [];

  const [mode, setMode] = useState('mainline');
  const [completedNodeIds, setCompletedNodeIds] = useState(AI_CONTINENT_INITIAL_COMPLETED_NODE_IDS);
  const [selectedNodeId, setSelectedNodeId] = useState('ml');

  const completedSet = useMemo(() => new Set(completedNodeIds), [completedNodeIds]);
  const selectedNode = AI_CONTINENT_NODE_MAP[selectedNodeId];

  const statusByNodeId = useMemo(() => buildStatusByNodeId(completedSet), [completedSet]);
  const ancestorChain = useMemo(() => {
    if (!selectedNodeId) {
      return new Set();
    }
    return findAncestorChain(selectedNodeId);
  }, [selectedNodeId]);
  const pathSuggestion = useMemo(() => getRecommendedPath(completedSet), [completedSet]);

  const unlockedCount = useMemo(() => {
    return Object.values(statusByNodeId).filter((value) => value === 'done').length;
  }, [statusByNodeId]);
  const progress = Math.round((unlockedCount / AI_CONTINENT_NODES.length) * 100);

  const selectedPrerequisites = selectedNode ? getPrerequisites(selectedNode.id) : [];
  const selectedMissing = selectedPrerequisites.filter((id) => !completedSet.has(id));
  const canCompleteSelected = selectedNode && statusByNodeId[selectedNode.id] === 'ready';

  const handleCompleteSelected = () => {
    if (!selectedNodeId || !canCompleteSelected || completedSet.has(selectedNodeId)) {
      return;
    }

    setCompletedNodeIds((previous) => [...previous, selectedNodeId]);
  };

  const handleReset = () => {
    setCompletedNodeIds(AI_CONTINENT_INITIAL_COMPLETED_NODE_IDS);
    setSelectedNodeId('ml');
    setMode('mainline');
  };

  return (
    <>
      <Helmet>
        <title>{buildSiteTitle('AI 大陆测试场')}</title>
        <meta name="description" content={`${SITE_CONFIG.brandName} AI 大陆学习路径测试页：可视化展示地点、依赖关系与解锁流程。`} />
      </Helmet>

      <PageShell
        rootClassName="ai-continent-page"
        spaces={spaces}
        activeSpace={null}
        onSpaceClick={handleCategoryClick}
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
      >
        <main className="ai-continent-main">
          <section className="ai-continent-intro">
            <div className="ai-continent-intro-copy">
              <p className="ai-continent-kicker">{SITE_CONFIG.brandName} World Preview</p>
              <h1>AI 大陆世界模型地图测试场</h1>
              <p>
                这一版已经放弃手搓地形模型，改成完整游戏地图底图，只保留路线、节点和任务交互。
                后续如果要继续升级，方向会是换更强的整幅地图资产，而不是继续堆程序化地貌。
              </p>
            </div>
            <div className="ai-continent-actions">
              <button
                type="button"
                className={mode === 'mainline' ? 'mode-btn is-active' : 'mode-btn'}
                onClick={() => setMode('mainline')}
              >
                推荐主线
              </button>
              <button
                type="button"
                className={mode === 'explore' ? 'mode-btn is-active' : 'mode-btn'}
                onClick={() => setMode('explore')}
              >
                自由探索
              </button>
              <button
                type="button"
                className="mode-btn mode-btn-reset"
                onClick={handleReset}
              >
                重置进度
              </button>
            </div>
          </section>

          <section className="ai-continent-stage">
            <div className="ai-map-column">
              <div className="progress-wrap ai-progress-floating">
                <span>探索进度 {progress}%</span>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <MapScene
                nodes={AI_CONTINENT_NODES}
                statusByNodeId={statusByNodeId}
                selectedNodeId={selectedNodeId}
                mode={mode}
                pathSuggestion={pathSuggestion}
                ancestorChain={ancestorChain}
                onSelectNode={setSelectedNodeId}
              />
            </div>

            <QuestPanel
              selectedNode={selectedNode}
              selectedPrerequisites={selectedPrerequisites}
              completedSet={completedSet}
              selectedMissing={selectedMissing}
              statusByNodeId={statusByNodeId}
              canCompleteSelected={canCompleteSelected}
              onCompleteSelected={handleCompleteSelected}
              pathSuggestion={pathSuggestion}
            />
          </section>
        </main>
      </PageShell>
    </>
  );
}

export default AIContinentDemo;
