import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import AppHeader from '../components/AppHeader/AppHeader';
import Sidebar from '../components/docs/Sidebar';
import Footer from '../components/Footer/Footer';
import './LearnClaudeCode.css';
import {
  ANNOTATIONS,
  LAYERS,
  LEARNING_PATH,
  SCENARIOS,
  VERSION_META,
  docsData,
  getFlowForVersion,
  versionsData,
  zhMessages
} from '../vendor/learn-claude-code/data';
import { SessionVisualization } from '../vendor/learn-claude-code/visualizations/index.js';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

function getVersionData(version) {
  return versionsData.versions.find((item) => item.id === version) || null;
}

function getVersionDoc(version, locale = 'zh') {
  return (
    docsData.find((item) => item.version === version && item.locale === locale) ||
    docsData.find((item) => item.version === version && item.locale === 'en') ||
    null
  );
}

function safeSessionLabel(version) {
  return zhMessages.sessions?.[version] || VERSION_META[version]?.title || version;
}

function LearnClaudeCode() {
  const [meta, setMeta] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const metaPath = `${process.env.PUBLIC_URL}/docs/_meta.json`;
    fetch(metaPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setMeta(data);
      })
      .catch((err) => console.error('Failed to load docs meta:', err));
  }, []);

  const categories = meta?.categories || [];

  const handleCategoryClick = (category) => {
    const firstSection = category.sections?.[0];
    const firstItem = firstSection?.items?.[0];

    if (firstItem?.path) {
      navigate(firstItem.path);
    }
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const sidebarMeta = useMemo(() => ({
    title: 'Learn Claude Code',
    sections: LAYERS.map((layer) => ({
      title: zhMessages.layer_labels?.[layer.id] || layer.label,
      items: layer.versions.map((versionId) => ({
        title: `${versionId} ${safeSessionLabel(versionId)}`,
        path: `/learn-claude-code/${versionId}`
      }))
    }))
  }), []);

  return (
    <>
      <Helmet>
        <title>Learn Claude Code | BeatAI</title>
        <meta
          name="description"
          content="Learn Claude Code 学习路径已接入 BeatAI，包含学习路径、版本详情、文档讲解、模拟器与源码浏览。"
        />
      </Helmet>

      <div className="lcc-page dynamic-background">
        <div className="sailor-moon-bg-layer"></div>
        <AppHeader
          categories={categories}
          activeCategory={null}
          onCategoryClick={handleCategoryClick}
          sidebarOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

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

        <Footer />
      </div>
    </>
  );
}

function VersionPage() {
  const { version } = useParams();
  const [activeTab, setActiveTab] = useState('learn');

  if (!LEARNING_PATH.includes(version)) {
    return <NotFoundState label={version} />;
  }

  const versionData = getVersionData(version);
  const meta = VERSION_META[version];
  const pathIndex = LEARNING_PATH.indexOf(version);
  const prevVersion = pathIndex > 0 ? LEARNING_PATH[pathIndex - 1] : null;
  const nextVersion = pathIndex < LEARNING_PATH.length - 1 ? LEARNING_PATH[pathIndex + 1] : null;
  const tabs = [
    { id: 'learn', label: zhMessages.version.tab_learn },
    { id: 'simulate', label: zhMessages.version.tab_simulate },
    { id: 'code', label: zhMessages.version.tab_code },
    { id: 'deep-dive', label: zhMessages.version.tab_deep_dive }
  ];

  return (
    <section className="lcc-section">
      <header className="lcc-version-header">
        <h2>{safeSessionLabel(version)}</h2>
        <p>{meta.subtitle}</p>
        <blockquote className="lcc-version-quote">{meta.keyInsight}</blockquote>
      </header>

      <section className="lcc-hero-shell">
        <SessionVisualization version={version} />
      </section>

      <section className="lcc-body-shell">
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
                <ExecutionFlow version={version} />
              </section>
              <DesignDecisions version={version} />
            </div>
          )}
        </div>
      </section>

      <nav className="lcc-version-nav">
        {prevVersion ? (
          <Link to={`/learn-claude-code/${prevVersion}`}>
            <span>{zhMessages.version.prev}</span>
            <strong>{prevVersion} - {safeSessionLabel(prevVersion)}</strong>
          </Link>
        ) : (
          <div></div>
        )}

        {nextVersion ? (
          <Link to={`/learn-claude-code/${nextVersion}`} className="align-right">
            <span>{zhMessages.version.next}</span>
            <strong>{safeSessionLabel(nextVersion)} - {nextVersion}</strong>
          </Link>
        ) : (
          <div></div>
        )}
      </nav>
    </section>
  );
}

function DocRenderer({ version }) {
  const doc = useMemo(() => getVersionDoc(version), [version]);

  if (!doc) {
    return null;
  }

  return (
    <div className="lcc-card">
      <div className="lcc-prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1() {
              return null;
            },
            blockquote({ children }) {
              return <blockquote className="lcc-callout">{children}</blockquote>;
            },
            code(props) {
              const { className, children, inline } = props;
              const match = /language-(\w+)/.exec(className || '');
              if (inline) {
                return <code className="lcc-inline-code">{children}</code>;
              }
              return (
                <pre className="lcc-code-block" data-language={match ? match[1] : ''}>
                  <code className={className}>{children}</code>
                </pre>
              );
            }
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function AgentLoopSimulator({ version }) {
  const scenario = SCENARIOS[version];
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    setCurrentIndex(-1);
    setIsPlaying(false);
  }, [version]);

  useEffect(() => {
    if (!isPlaying || !scenario) {
      return undefined;
    }

    if (currentIndex >= scenario.steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 1200 / speed);

    return () => window.clearTimeout(timer);
  }, [currentIndex, isPlaying, scenario, speed]);

  if (!scenario) {
    return null;
  }

  const visibleSteps = scenario.steps.slice(0, currentIndex + 1);

  return (
    <section className="lcc-card">
      <h3 className="lcc-block-title">{zhMessages.version.simulator}</h3>
      <p className="lcc-muted-copy">{scenario.description}</p>

      <div className="lcc-sim-controls">
        <div className="lcc-sim-buttons lcc-step-controls-buttons">
          <button
            type="button"
            className="lcc-step-control-btn"
            onClick={() => {
              setCurrentIndex(-1);
              setIsPlaying(false);
            }}
            title={zhMessages.sim.reset}
            aria-label={zhMessages.sim.reset}
          >
            <RotateCcw size={16} />
          </button>
          {isPlaying ? (
            <button
              type="button"
              className="lcc-step-control-btn lcc-step-control-btn-primary"
              onClick={() => setIsPlaying(false)}
              title={zhMessages.sim.pause}
              aria-label={zhMessages.sim.pause}
            >
              <Pause size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="lcc-step-control-btn lcc-step-control-btn-primary"
              onClick={() => setIsPlaying(true)}
              disabled={currentIndex >= scenario.steps.length - 1}
              title={zhMessages.sim.play}
              aria-label={zhMessages.sim.play}
            >
              <Play size={16} />
            </button>
          )}
          <button
            type="button"
            className="lcc-step-control-btn"
            onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, scenario.steps.length - 1))}
            disabled={currentIndex >= scenario.steps.length - 1}
            title={zhMessages.sim.step}
            aria-label={zhMessages.sim.step}
          >
            <SkipForward size={16} />
          </button>
        </div>

        <div className="lcc-speed-row">
          <span>{zhMessages.sim.speed}:</span>
          {[0.5, 1, 2, 4].map((item) => (
            <button
              key={item}
              type="button"
              className={cn(speed === item && 'active')}
              onClick={() => setSpeed(item)}
            >
              {item}x
            </button>
          ))}
        </div>

        <span className="lcc-counter">
          {Math.max(0, currentIndex + 1)} {zhMessages.sim.step_of} {scenario.steps.length}
        </span>
      </div>

      <div className="lcc-sim-log">
        {visibleSteps.length === 0 ? (
          <div className="lcc-empty-inline">Press Play or Step to begin</div>
        ) : (
          visibleSteps.map((step, index) => (
            <div key={`${step.type}-${index}`} className={cn('lcc-sim-step', `type-${step.type}`)}>
              <div className="lcc-sim-step-head">
                <span>{step.type}</span>
                {step.toolName ? <strong>{step.toolName}</strong> : null}
              </div>
              {step.type === 'tool_call' || step.type === 'tool_result' || step.type === 'system_event' ? (
                <pre>{step.content || '(empty)'}</pre>
              ) : (
                <p>{step.content}</p>
              )}
              <em>{step.annotation}</em>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function SourceViewer({ source, filename }) {
  const lines = useMemo(() => source.split('\n'), [source]);

  return (
    <div className="lcc-source-viewer">
      <div className="lcc-source-header">
        <div className="lcc-source-dots">
          <span className="red"></span>
          <span className="yellow"></span>
          <span className="green"></span>
        </div>
        <span>{filename}</span>
      </div>
      <div className="lcc-source-body">
        {lines.map((line, index) => (
          <div key={`${filename}-${index}`} className="lcc-source-line">
            <span className="lcc-line-no">{index + 1}</span>
            <span className="lcc-line-code">{highlightLine(line)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function highlightLine(line) {
  const trimmed = line.trimStart();

  if (trimmed.startsWith('#')) {
    return <span className="comment">{line}</span>;
  }

  if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
    return <span className="string">{line}</span>;
  }

  const keywords = new Set([
    'def', 'class', 'import', 'from', 'return', 'if', 'elif', 'else', 'while', 'for',
    'in', 'not', 'and', 'or', 'is', 'None', 'True', 'False', 'try', 'except', 'raise',
    'with', 'as', 'yield', 'break', 'continue', 'pass', 'global', 'lambda', 'async', 'await'
  ]);

  const parts = line.split(
    /(\b(?:def|class|import|from|return|if|elif|else|while|for|in|not|and|or|is|None|True|False|try|except|raise|with|as|yield|break|continue|pass|global|lambda|async|await|self)\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|f"(?:[^"\\]|\\.)*"|f'(?:[^'\\]|\\.)*'|#.*$|\b\d+(?:\.\d+)?\b)/
  );

  return parts.map((part, index) => {
    if (!part) {
      return null;
    }

    if (keywords.has(part)) {
      return <span key={index} className="keyword">{part}</span>;
    }

    if (part === 'self') {
      return <span key={index} className="self">{part}</span>;
    }

    if (part.startsWith('#')) {
      return <span key={index} className="comment">{part}</span>;
    }

    if (
      (part.startsWith('"') && part.endsWith('"')) ||
      (part.startsWith("'") && part.endsWith("'")) ||
      (part.startsWith('f"') && part.endsWith('"')) ||
      (part.startsWith("f'") && part.endsWith("'"))
    ) {
      return <span key={index} className="string">{part}</span>;
    }

    if (/^\d+(?:\.\d+)?$/.test(part)) {
      return <span key={index} className="number">{part}</span>;
    }

    return <span key={index}>{part}</span>;
  });
}

function ExecutionFlow({ version }) {
  const flow = getFlowForVersion(version);

  if (!flow) {
    return null;
  }

  const maxY = Math.max(...flow.nodes.map((item) => item.y)) + 50;

  return (
    <div className="lcc-card">
      <svg viewBox={`0 0 600 ${maxY}`} className="lcc-flow-svg">
        <defs>
          <marker id="lcc-arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
          </marker>
        </defs>

        {flow.edges.map((edge) => {
          const from = flow.nodes.find((item) => item.id === edge.from);
          const to = flow.nodes.find((item) => item.id === edge.to);
          const path = buildFlowPath(from, to);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={`${edge.from}-${edge.to}`} className="lcc-flow-edge">
              <path d={path} markerEnd="url(#lcc-arrowhead)" />
              {edge.label ? (
                <text x={midX + 8} y={midY - 4}>
                  {edge.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {flow.nodes.map((node) => (
          <FlowNode key={node.id} node={node} />
        ))}
      </svg>
    </div>
  );
}

function buildFlowPath(from, to) {
  const diamondSize = 50;
  const nodeHeight = 40;
  const fromHeight = from.type === 'decision' ? diamondSize / 2 : nodeHeight / 2;
  const toHeight = to.type === 'decision' ? diamondSize / 2 : nodeHeight / 2;

  if (Math.abs(from.x - to.x) < 10) {
    return `M ${from.x} ${from.y + fromHeight} L ${to.x} ${to.y - toHeight}`;
  }

  const startY = from.y + fromHeight;
  const endY = to.y - toHeight;
  const midY = (startY + endY) / 2;
  return `M ${from.x} ${startY} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${endY}`;
}

function FlowNode({ node }) {
  const colors = {
    start: '#3B82F6',
    process: '#10B981',
    decision: '#F59E0B',
    subprocess: '#8B5CF6',
    end: '#EF4444'
  };
  const lines = node.label.split('\\n');

  if (node.type === 'decision') {
    const half = 25;
    return (
      <g className="lcc-flow-node">
        <polygon
          points={`${node.x},${node.y - half} ${node.x + half},${node.y} ${node.x},${node.y + half} ${node.x - half},${node.y}`}
          fill="none"
          stroke={colors[node.type]}
          strokeWidth="2"
        />
        {lines.map((line, index) => (
          <text key={index} x={node.x} y={node.y + (index - (lines.length - 1) / 2) * 12}>
            {line}
          </text>
        ))}
      </g>
    );
  }

  if (node.type === 'start' || node.type === 'end') {
    return (
      <g className="lcc-flow-node">
        <rect
          x={node.x - 70}
          y={node.y - 20}
          width="140"
          height="40"
          rx="20"
          fill="none"
          stroke={colors[node.type]}
          strokeWidth="2"
        />
        <text x={node.x} y={node.y}>{node.label}</text>
      </g>
    );
  }

  return (
    <g className="lcc-flow-node">
      <rect
        x={node.x - 70}
        y={node.y - 20}
        width="140"
        height="40"
        rx="4"
        fill="none"
        stroke={colors[node.type]}
        strokeWidth="2"
        strokeDasharray={node.type === 'subprocess' ? '6 3' : undefined}
      />
      {lines.map((line, index) => (
        <text key={index} x={node.x} y={node.y + (index - (lines.length - 1) / 2) * 12}>
          {line}
        </text>
      ))}
    </g>
  );
}

function DesignDecisions({ version }) {
  const annotations = ANNOTATIONS[version];
  const [openId, setOpenId] = useState(null);

  if (!annotations || annotations.decisions.length === 0) {
    return null;
  }

  return (
    <section className="lcc-stack">
      <h3 className="lcc-block-title">{zhMessages.version.design_decisions}</h3>
      {annotations.decisions.map((decision) => {
        const isOpen = openId === decision.id;
        const localized = decision.zh || {};
        const title = localized.title || decision.title;
        const description = localized.description || decision.description;

        return (
          <article key={decision.id} className="lcc-card lcc-accordion">
            <button type="button" onClick={() => setOpenId(isOpen ? null : decision.id)}>
              <span>{title}</span>
              <span>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen ? (
              <div className="lcc-accordion-body">
                <p>{description}</p>
                {decision.alternatives ? (
                  <div>
                    <h4>{zhMessages.version.alternatives}</h4>
                    <p>{decision.alternatives}</p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}

function LearnRouteNotFound() {
  const location = useLocation();
  const label = location.pathname.replace('/learn-claude-code/', '') || location.pathname;
  return <NotFoundState label={label} />;
}

function NotFoundState({ label }) {
  return (
    <section className="lcc-section">
      <div className="lcc-empty">Page not found: {label}</div>
    </section>
  );
}

export default LearnClaudeCode;
