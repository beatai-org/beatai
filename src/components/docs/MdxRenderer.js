import React, { useEffect, useState } from 'react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import remarkCjkFriendly from 'remark-cjk-friendly';
import { useMdxComponents } from './mdxComponents';

const REMARK_PLUGINS = [remarkGfm, remarkCjkFriendly];

export default function MdxRenderer({
  source,
  book = null,
  markdownUrl = '',
  onImageClick = null,
  enablePlayground = false,
  includeH1 = true
}) {
  const { components, ready: scopeReady } = useMdxComponents({
    book,
    enablePlayground,
    includeH1,
    markdownUrl,
    onImageClick
  });
  const [state, setState] = useState({ Content: null, error: null });

  useEffect(() => {
    let cancelled = false;

    if (!source || !scopeReady) {
      setState({ Content: null, error: null });
      return undefined;
    }

    setState({ Content: null, error: null });

    evaluate(source, {
      ...runtime,
      development: false,
      remarkPlugins: REMARK_PLUGINS
    })
      .then((mod) => {
        if (cancelled) {
          return;
        }
        setState({ Content: mod.default, error: null });
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }
        // eslint-disable-next-line no-console
        console.error('[MdxRenderer] MDX compile error:', err);
        setState({ Content: null, error: err });
      });

    return () => {
      cancelled = true;
    };
  }, [source, scopeReady]);

  if (state.error) {
    return (
      <div className="doc-error">
        <h1>Document failed to render</h1>
        <p>{String(state.error?.message || state.error)}</p>
      </div>
    );
  }

  if (!state.Content) {
    return <div className="doc-loading" aria-live="polite">正在加载文章...</div>;
  }

  const Content = state.Content;
  return <Content components={components} />;
}
