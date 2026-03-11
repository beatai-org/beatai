import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import matter from 'gray-matter';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-rust';
import '../../styles/prism-custom.css';
import TableOfContents from './TableOfContents';
import CodePlayground from './CodePlayground';
import './DocContent.css';
import '../../styles/3d-effects.css';
import '../../styles/animations.css';

// Utility function to convert heading text to URL-friendly ID
// Uses encodeURIComponent to properly handle Unicode characters (Chinese, special chars, etc.)
const slugify = (text) => {
  return encodeURIComponent(
    text
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
  )
  .replace(/%20/g, '-')           // Space → hyphen
  .replace(/[!'()*]/g, c => c)    // Decode safe characters for readability
  .replace(/%2D/g, '-');          // Decode hyphen
};

const DocContent = () => {
  const location = useLocation();
  const [content, setContent] = useState('');
  const [frontmatter, setFrontmatter] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headings, setHeadings] = useState([]);

  // Extract the path from URL (now starts from root)
  const docPath = location.pathname.replace(/^\//, '');

  useEffect(() => {
    const loadDoc = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/docs/${docPath}.md`);

        if (!response.ok) {
          throw new Error('Document not found');
        }

        const text = await response.text();
        const { data, content: markdownContent } = matter(text);

        setFrontmatter(data);
        setContent(markdownContent);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDoc();
  }, [docPath]);

  // Extract headings from rendered content for TOC
  useEffect(() => {
    if (!content) return;

    // Wait for ReactMarkdown to render
    const timer = setTimeout(() => {
      const article = document.querySelector('.doc-content');
      const headingElements = article?.querySelectorAll('h2, h3, h4');
      const extractedHeadings = Array.from(headingElements || []).map((el) => ({
        id: el.id,
        text: el.textContent,
        level: parseInt(el.tagName.substring(1))
      }));
      setHeadings(extractedHeadings);
    }, 100);

    return () => clearTimeout(timer);
  }, [content]);

  if (error) {
    return (
      <div className="doc-error">
        <h1>Document Not Found</h1>
        <p>{error}</p>
      </div>
    );
  }

  // Create heading components with auto-generated IDs
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

  // Custom code component that checks for playground attribute
  const CodeComponent = ({ node, inline, className, children, ...props }) => {
    // Handle inline code
    if (inline) {
      return <code className="doc-code-inline" {...props}>{children}</code>;
    }

    // Handle block code
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');

    // Check if this is a playground code block
    const isPlayground = className?.includes('playground');

    if (isPlayground) {
      return <CodePlayground initialCode={code} language={language} />;
    }

    // Apply syntax highlighting with Prism
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

  // Custom pre component
  const PreComponent = ({ children, ...props }) => {
    return (
      <pre className="doc-pre" {...props}>
        {children}
      </pre>
    );
  };

  // Prepare page title and description with fallbacks
  const slug = docPath.split('/').pop() || 'documentation';
  const pageTitle = frontmatter.title || slug.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  const pageDescription = frontmatter.description || `Documentation for ${pageTitle}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle} | BeatAI Docs</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Helmet>

      <>
        <div className="doc-wrapper">
          <article className="doc-content" key={docPath}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: createHeading(1),
                h2: createHeading(2),
                h3: createHeading(3),
                h4: createHeading(4),
                p: ({ node, ...props }) => <p className="doc-p" {...props} />,
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                a: ({ node, ...props }) => <a className="doc-link" {...props} />,
                code: CodeComponent,
                pre: PreComponent,
                table: ({ node, ...props }) => (
                  <div className="doc-table-wrapper">
                    <table className="doc-table" {...props} />
                  </div>
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="doc-blockquote" {...props} />
                ),
                ul: ({ node, ...props }) => <ul className="doc-ul" {...props} />,
                ol: ({ node, ...props }) => <ol className="doc-ol" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>

        <TableOfContents headings={headings} />
      </>
    </>
  );
};

export default DocContent;
