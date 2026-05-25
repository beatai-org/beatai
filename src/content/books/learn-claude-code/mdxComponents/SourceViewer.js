import React, { useMemo } from 'react';
import { versionsData } from '../data';

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

function SourceViewer({ version, source, filename }) {
  const resolved = useMemo(() => {
    if (source) {
      return { source, filename };
    }

    if (!version) {
      return null;
    }

    const entry = versionsData?.versions?.find((item) => item.id === version);

    if (!entry?.source) {
      return null;
    }

    return { source: entry.source, filename: entry.filename };
  }, [filename, source, version]);

  const lines = useMemo(
    () => (resolved?.source ? resolved.source.split('\n') : []),
    [resolved]
  );

  if (!resolved) {
    return null;
  }

  return (
    <div className="lcc-source-viewer">
      <div className="lcc-source-header">
        <div className="lcc-source-dots">
          <span className="red"></span>
          <span className="yellow"></span>
          <span className="green"></span>
        </div>
        <span>{resolved.filename}</span>
      </div>
      <div className="lcc-source-body">
        {lines.map((line, index) => (
          <div key={`${resolved.filename}-${index}`} className="lcc-source-line">
            <span className="lcc-line-no">{index + 1}</span>
            <span className="lcc-line-code">{highlightLine(line)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SourceViewer;
