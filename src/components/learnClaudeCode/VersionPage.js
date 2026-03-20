import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PaginationNav from '../docs/PaginationNav';
import { cn } from '../../utils/classNames';
import { useDocShortcuts } from '../../hooks/useDocShortcuts';
import {
  ANNOTATIONS,
  LEARNING_PATH,
  VERSION_META,
  getFlowForVersion,
  zhMessages
} from '../../vendor/learn-claude-code/data';
import { SessionVisualization } from '../../vendor/learn-claude-code/visualizations/index.js';
import AgentLoopSimulator from './AgentLoopSimulator';
import DesignDecisions from './DesignDecisions';
import DocRenderer from './DocRenderer';
import ExecutionFlow from './ExecutionFlow';
import { NotFoundState } from './NotFoundState';
import SourceViewer from './SourceViewer';
import GiscusComments from '../comments/GiscusComments';
import { getVersionData, getVersionPagination, getVersionTabs, safeSessionLabel } from './versionUtils';

function VersionPage() {
  const { version } = useParams();
  const [activeTab, setActiveTab] = useState('learn');
  const commentsRef = React.useRef(null);
  const articleTopRef = React.useRef(null);

  useEffect(() => {
    setActiveTab('learn');
  }, [version]);

  const isValidVersion = LEARNING_PATH.includes(version);

  const versionData = isValidVersion ? getVersionData(version) : null;
  const meta = isValidVersion ? VERSION_META[version] : null;
  const hasVisualization = isValidVersion && Boolean(zhMessages.viz?.[version]);
  const { prev: prevNav, next: nextNav } = isValidVersion
    ? getVersionPagination(version)
    : { prev: null, next: null };
  const tabs = isValidVersion ? getVersionTabs(version, versionData) : [];

  useDocShortcuts({
    articleRef: articleTopRef,
    commentsRef,
    prev: prevNav,
    next: nextNav,
    enabled: isValidVersion
  });

  if (!isValidVersion) {
    return <NotFoundState label={version} />;
  }

  return (
    <section ref={articleTopRef} className="lcc-section">
      <header className="lcc-version-header">
        <h2>{safeSessionLabel(version)}</h2>
        {version === 'preface' ? (
          <section className="lcc-copyright-card" aria-label="版权声明">
            <div className="lcc-copyright-card-title">版权声明</div>
            <p>
              版权归属于原版 LCC：
              <a
                className="doc-link"
                href="https://github.com/shareAI-lab/learn-claude-code"
                target="_blank"
                rel="noreferrer"
              >
                shareAI-lab/learn-claude-code
              </a>
            </p>
          </section>
        ) : null}
        <p>{meta.subtitle}</p>
        <blockquote className="doc-blockquote">{meta.keyInsight}</blockquote>
      </header>

      {hasVisualization ? (
        <section className="lcc-hero-shell">
          <SessionVisualization version={version} />
        </section>
      ) : null}

      <section className={cn('lcc-body-shell', activeTab === 'learn' && 'lcc-body-shell-doc')}>
        {tabs.length > 1 ? (
          <div className="lcc-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={cn(activeTab === tab.id && 'active')}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="lcc-tab-panel">
          {activeTab === 'learn' && <DocRenderer version={version} />}
          {activeTab === 'simulate' && <AgentLoopSimulator version={version} />}
          {activeTab === 'code' && (
            <SourceViewer source={versionData.source} filename={versionData.filename} />
          )}
          {activeTab === 'deep-dive' && (
            <div className="lcc-stack">
              <section>
                <h3 className="lcc-block-title">{zhMessages.version.execution_flow}</h3>
                <ExecutionFlow flow={getFlowForVersion(version)} />
              </section>
              <DesignDecisions annotations={ANNOTATIONS[version]} messages={zhMessages} />
            </div>
          )}
        </div>
      </section>

      <PaginationNav prev={prevNav} next={nextNav} />
      {activeTab === 'learn' ? (
        <GiscusComments pageTitle={safeSessionLabel(version)} containerRef={commentsRef} />
      ) : null}
    </section>
  );
}

export default VersionPage;
