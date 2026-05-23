import { useEffect, useState } from 'react';
import { getCachedDocsMeta, loadDocsMeta } from '../utils/docsMeta';
import { normalizeDocsMeta } from '../utils/docsMetaNormalizer';

function readInitialMeta(initialMeta, metaUrl) {
  if (initialMeta) {
    return normalizeDocsMeta(initialMeta);
  }

  return getCachedDocsMeta(metaUrl || undefined);
}

export function useDocsMeta(initialMeta = null, metaUrl = null) {
  const [meta, setMeta] = useState(() => readInitialMeta(initialMeta, metaUrl));
  const [loading, setLoading] = useState(() => !readInitialMeta(initialMeta, metaUrl));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (initialMeta) {
      setMeta(normalizeDocsMeta(initialMeta));
      setLoading(false);
      setError(null);
      return undefined;
    }

    const cachedMeta = getCachedDocsMeta(metaUrl || undefined);
    if (cachedMeta) {
      setMeta(cachedMeta);
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
