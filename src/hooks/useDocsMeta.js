import { useEffect, useState } from 'react';
import { loadDocsMeta } from '../utils/docsMeta';
import { normalizeDocsMeta } from '../utils/docsMetaNormalizer';

export function useDocsMeta(initialMeta = null, metaUrl = null) {
  const [meta, setMeta] = useState(() => (initialMeta ? normalizeDocsMeta(initialMeta) : null));
  const [loading, setLoading] = useState(!initialMeta);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (initialMeta) {
      setMeta(normalizeDocsMeta(initialMeta));
      setLoading(false);
      setError(null);
      return undefined;
    }

    setLoading(true);

    loadDocsMeta(metaUrl || undefined)
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setMeta(data);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }

        setError(err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialMeta, metaUrl]);

  return { meta, loading, error };
}
