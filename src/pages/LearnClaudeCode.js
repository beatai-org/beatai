import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
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
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import Sidebar from '../components/docs/Sidebar';
import TableOfContents from '../components/docs/TableOfContents';
import PaginationNav from '../components/docs/PaginationNav';
import PageShell from '../components/layout/PageShell';
import { useDocsMeta } from '../hooks/useDocsMeta';
import { getFirstNavigablePathForCategory } from '../utils/docsMeta';
import './LearnClaudeCode.css';
import '../components/docs/DocContent.css';
import '../styles/prism-custom.css';
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

function slugify(text) {
  return encodeURIComponent(
    text
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
  )
    .replace(/%20/g, '-')
    .replace(/[!'()*]/g, (char) => char)
    .replace(/%2D/g, '-');
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

function formatVersionCode(version) {
  return version.toUpperCase();
}

function getVersionNavTitle(version) {
  return version === 'preface'
    ? safeSessionLabel(version)
    : `${formatVersionCode(version)} ${safeSessionLabel(version)}`;
}

function normalizeSessionTitle(title) {
  return String(title || '').replace(/^(s\d{2})(:|\b)/, (match, code, suffix) => (
    `${code.toUpperCase()}${suffix}`
  ));
}

function stripLearningPathCode(content) {
  return String(content || '').replace(
    /\n\n`(?=[^`\n]*(?:s01|s02|s03|s04|s05|s06|s07|s08|s09|s10|s11|s12))[^`\n]*`\n\n/i,
    '\n\n'
  );
}

function trimPrefaceContent(version, content) {
  if (version !== 'preface') {
    return String(content || '');
  }

  const marker = '\n## 快速开始';
  const normalized = String(content || '');
  const markerIndex = normalized.indexOf(marker);

  return markerIndex >= 0 ? normalized.slice(0, markerIndex).trimEnd() : normalized;
}

function renameBookTitle(content) {
  return String(content || '').replace(
    /^# Learn Claude Code\b/m,
    '# CC宝典'
  );
}

function resolveDocContentUrl(contentPath) {
  if (!contentPath) {
    return '';
  }

  if (/^https?:\/\//.test(contentPath)) {
    return contentPath;
  }

  const publicBase = process.env.PUBLIC_URL || '';
  const normalizedPath = contentPath.startsWith('/') ? contentPath : `/${contentPath}`;

  return `${publicBase}${normalizedPath}`;
}

function safeSessionLabel(version) {
  return normalizeSessionTitle(
    zhMessages.sessions?.[version] || VERSION_META[version]?.title || version
  );
}

function getLayerLabelForVersion(version) {
  const layer = LAYERS.find((item) => item.versions.includes(version));
  return layer ? (zhMessages.layer_labels?.[layer.id] || layer.label) : 'CC宝典';
}

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
                <ExecutionFlow version={version} />
              </section>
              <DesignDecisions version={version} />
            </div>
          )}
        </div>
      </section>

      <PaginationNav prev={prevNav} next={nextNav} />
    </section>
  );
}

function DocRenderer({ version }) {
  const doc = useMemo(() => getVersionDoc(version), [version]);
  const articleRef = useRef(null);
  const [headings, setHeadings] = useState([]);
  const [rawContent, setRawContent] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const content = useMemo(
    () => renameBookTitle(trimPrefaceContent(version, stripLearningPathCode(rawContent))),
    [rawContent, version]
  );

  useEffect(() => {
    if (!doc) {
      setRawContent('');
      setContentLoading(false);
      return undefined;
    }

    if (doc.contentPath) {
      const controller = new AbortController();
      const url = resolveDocContentUrl(doc.contentPath);

      setRawContent('');
      setContentLoading(true);

      fetch(url, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.text();
        })
        .then((text) => {
          setRawContent(text);
          setContentLoading(false);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Failed to load LLC markdown:', err);
            setRawContent('');
            setContentLoading(false);
          }
        });

      return () => controller.abort();
    }

    setRawContent(doc.content || '');
    setContentLoading(false);
    return undefined;
  }, [doc]);

  useEffect(() => {
    if (!doc) {
      setHeadings([]);
      return undefined;
    }

    const timer = setTimeout(() => {
      const article = articleRef.current;
      const headingElements = article?.querySelectorAll('h2, h3, h4');
      const extractedHeadings = Array.from(headingElements || []).map((el, index) => ({
        id: el.id,
        originalId: el.id,
        uniqueKey: `${el.id}-${index}`,
        text: el.textContent,
        level: parseInt(el.tagName.substring(1), 10)
      }));
      setHeadings(extractedHeadings);
    }, 100);

    return () => clearTimeout(timer);
  }, [content, doc, version]);

  if (!doc) {
    return null;
  }

  if (contentLoading && !rawContent) {
    return null;
  }

  const createHeading = (level) => {
    return ({ children, ...props }) => {
      const text = children?.toString() || '';
      const id = slugify(text);
      const Tag = `h${level}`;
      return (
        <Tag id={id} className={`doc-h${level}`} {...props}>
          {children}
        </Tag>
      );
    };
  };

  const CodeComponent = ({ inline, className, children, ...props }) => {
    if (inline) {
      return <code className="doc-code-inline" {...props}>{children}</code>;
    }

    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');
    const highlightedCode = language && Prism.languages[language]
      ? Prism.highlight(code, Prism.languages[language], language)
      : code;

    return (
      <code
        className={`doc-code-block ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
        {...props}
      />
    );
  };

  const PreComponent = ({ children, ...props }) => {
    const codeClassName = children?.props?.className || '';
    const languageMatch = /language-(\w+)/.exec(codeClassName);
    const language = languageMatch ? languageMatch[1] : '';
    const preClassName = ['doc-pre', codeClassName, props.className].filter(Boolean).join(' ');

    return (
      <pre
        {...props}
        className={preClassName}
        data-language={language || undefined}
      >
        {children}
      </pre>
    );
  };

  return (
    <div className="doc-wrapper">
      <article ref={articleRef} className="doc-content lcc-doc-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1() {
              return null;
            },
            h2: createHeading(2),
            h3: createHeading(3),
            h4: createHeading(4),
            p({ node, ...props }) {
              return <p className="doc-p" {...props} />;
            },
            a({ node, children, ...props }) {
              return <a className="doc-link" {...props}>{children}</a>;
            },
            blockquote({ node, ...props }) {
              return <blockquote className="doc-blockquote" {...props} />;
            },
            code: CodeComponent,
            pre: PreComponent,
            table({ node, ...props }) {
              return (
                <div className="doc-table-wrapper">
                  <table className="doc-table" {...props} />
                </div>
              );
            },
            ul({ node, ...props }) {
              return <ul className="doc-ul" {...props} />;
            },
            ol({ node, ...props }) {
              return <ol className="doc-ol" {...props} />;
            }
          }}
        >
          {content}
        </ReactMarkdown>
        <section className="lcc-copyright-card" aria-label="版权声明">
          <div className="lcc-copyright-card-title">版权声明</div>
          <p>
            本章节内容版权归属于原版 LCC：
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
      </article>
      <TableOfContents headings={headings} />
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
