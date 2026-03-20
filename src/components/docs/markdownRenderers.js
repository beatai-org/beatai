import React from 'react';
import { defaultSchema } from 'rehype-sanitize';
import { slugifyHeading, getTextContent } from '../../utils/markdown';
import Prism from '../../utils/prism';

function fallbackCopyText(text) {
  if (typeof document === 'undefined') {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

async function copyText(text) {
  if (!text) {
    return false;
  }

  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      return fallbackCopyText(text);
    }
  }

  return fallbackCopyText(text);
}

function MarkdownPreBlock({ children, className, language = '', rawCode = '', ...props }) {
  const [copied, setCopied] = React.useState(false);
  const preRef = React.useRef(null);
  const resetTimerRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleCopy = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const codeElement = preRef.current?.querySelector('code');
    const textToCopy = rawCode || codeElement?.textContent || '';
    const didCopy = await copyText(textToCopy);

    if (!didCopy) {
      return;
    }

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    setCopied(true);
    resetTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      resetTimerRef.current = null;
    }, 1800);
  };

  return (
    <div className="doc-code-block-shell">
      <pre
        {...props}
        ref={preRef}
        className={className}
        data-language={language || undefined}
      >
        <button
          type="button"
          className={`doc-code-copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label={copied ? '代码已复制' : '复制代码'}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
        {children}
      </pre>
    </div>
  );
}

export const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [
      ...(defaultSchema.attributes?.a || []),
      'target',
      'rel'
    ]
  }
};

export function createMarkdownHeading(level) {
  return ({ children, ...props }) => {
    const text = getTextContent(children);
    const id = slugifyHeading(text);
    const Tag = `h${level}`;

    return (
      <Tag id={id} className={`doc-h${level}`} {...props}>
        {children}
      </Tag>
    );
  };
}

export function createMarkdownCodeComponent({ playgroundRenderer = null } = {}) {
  return ({ inline, className, children, ...props }) => {
    if (inline) {
      return <code className="doc-code-inline" {...props}>{children}</code>;
    }

    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');
    const isPlayground = className?.includes('playground');

    if (isPlayground && playgroundRenderer) {
      return playgroundRenderer({ code, language });
    }

    const highlightedCode = language && Prism.languages[language]
      ? Prism.highlight(code, Prism.languages[language], language)
      : code;

    return (
      <code
        className={`doc-code-block ${className || ''}`}
        data-raw-code={code}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
        {...props}
      />
    );
  };
}

export function createMarkdownPreComponent() {
  return ({ children, ...props }) => {
    const codeClassName = children?.props?.className || '';
    const rawCode = children?.props?.['data-raw-code'] || '';
    const languageMatch = /language-(\w+)/.exec(codeClassName);
    const language = languageMatch ? languageMatch[1] : '';
    const preClassName = ['doc-pre', codeClassName, props.className].filter(Boolean).join(' ');

    return (
      <MarkdownPreBlock
        {...props}
        className={preClassName}
        language={language}
        rawCode={rawCode}
      >
        {children}
      </MarkdownPreBlock>
    );
  };
}

export function createDocMarkdownComponents({
  codeComponent,
  preComponent,
  includeH1 = true
} = {}) {
  return {
    h1: includeH1 ? createMarkdownHeading(1) : () => null,
    h2: createMarkdownHeading(2),
    h3: createMarkdownHeading(3),
    h4: createMarkdownHeading(4),
    p({ node, ...props }) {
      return <p className="doc-p" {...props} />;
    },
    a({ node, children, ...props }) {
      return <a className="doc-link" {...props}>{children}</a>;
    },
    blockquote({ node, ...props }) {
      return <blockquote className="doc-blockquote" {...props} />;
    },
    code: codeComponent,
    pre: preComponent,
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
  };
}
