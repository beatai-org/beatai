import { useEffect, useMemo, useState } from 'react';
import Tabs, { Tab } from './Tabs';
import { useDocMarkdownComponents } from '../docMarkdownRendererUtils';

const frameworkMdxComponents = { Tabs, Tab };

// Resolve the MDX component scope for a given book. Always returns a complete
// `components` object; `ready` becomes true once the book's lazy scope (if any)
// has loaded. Callers should wait on `ready` before evaluating MDX so
// references to book-private components are guaranteed to resolve.
export function useMdxComponents({
  book = null,
  enablePlayground = false,
  includeH1 = true,
  markdownUrl = '',
  onImageClick = null
} = {}) {
  const docComponents = useDocMarkdownComponents({
    enablePlayground,
    includeH1,
    markdownUrl,
    onImageClick
  });

  const [bookScope, setBookScope] = useState(
    book?.mdxComponents ? null : {}
  );

  useEffect(() => {
    if (!book?.mdxComponents) {
      setBookScope({});
      return undefined;
    }

    let cancelled = false;
    setBookScope(null);
    Promise.resolve(book.mdxComponents()).then((mod) => {
      if (cancelled) {
        return;
      }
      setBookScope(mod?.default || mod || {});
    });

    return () => {
      cancelled = true;
    };
  }, [book]);

  const components = useMemo(() => ({
    ...docComponents,
    ...frameworkMdxComponents,
    ...(bookScope || {})
  }), [docComponents, bookScope]);

  return { components, ready: bookScope !== null };
}
