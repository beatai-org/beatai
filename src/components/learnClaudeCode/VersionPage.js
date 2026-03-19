import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PaginationNav from '../docs/PaginationNav';
import {
  ANNOTATIONS,
  LEARNING_PATH,
  SCENARIOS,
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
import { getLayerLabelForVersion, getVersionData, getVersionNavTitle, safeSessionLabel } from './versionUtils';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

function VersionPage() {
  const { version } = useParams();
  const [activeTab, setActiveTab] = useState('learn');

  useEffect(() => {
    setActiveTab('learn');
  }, [version]);

  if (!LEARNING_PATH.includes(version)) {
    return <NotFoundState label={version} />;
  }

  const versionData = getVersionData(version);
  const meta = VERSION_META[version];
  const hasVisualization = Boolean(zhMessages.viz?.[version]);
  const hasSimulateTab = Boolean(SCENARIOS[version]);
  const hasCodeTab = Boolean(versionData?.source);
  const hasDeepDiveTab = Boolean(getFlowForVersion(version) || ANNOTATIONS[version]?.decisions?.length);
  const pathIndex = LEARNING_PATH.indexOf(version);
  const prevVersion = pathIndex > 0 ? LEARNING_PATH[pathIndex - 1] : null;
  const nextVersion = pathIndex < LEARNING_PATH.length - 1 ? LEARNING_PATH[pathIndex + 1] : null;
  const prevNav = prevVersion ? {
    path: `/learn-claude-code/${prevVersion}`,
    title: getVersionNavTitle(prevVersion),
    section: getLayerLabelForVersion(prevVersion)
  } : null;
  const nextNav = nextVersion ? {
    path: `/learn-claude-code/${nextVersion}`,
    title: getVersionNavTitle(nextVersion),
    section: getLayerLabelForVersion(nextVersion)
  } : null;
  const tabs = [{ id: 'learn', label: zhMessages.version.tab_learn }];

  if (hasSimulateTab) {
    tabs.push({ id: 'simulate', label: zhMessages.version.tab_simulate });
  }

  if (hasCodeTab) {
    tabs.push({ id: 'code', label: zhMessages.version.tab_code });
  }

  if (hasDeepDiveTab) {
    tabs.push({ id: 'deep-dive', label: zhMessages.version.tab_deep_dive });
  }

  return (
    <section className="lcc-section">
      <header className="lcc-version-header">
        <h2>{safeSessionLabel(version)}</h2>
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
    </section>
  );
}

export default VersionPage;
