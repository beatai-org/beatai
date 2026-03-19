import { useEffect, useState } from 'react';

export function useMarkdownSource({ url = '', inlineContent = '', enabled = true } = {}) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setText('');
      setLoading(false);
      setError(null);
      return undefined;
    }

    if (!url) {
      setText(inlineContent || '');
      setLoading(false);
      setError(null);
      return undefined;
    }

    const controller = new AbortController();

    setText('');
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then((value) => {
        setText(value);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          return;
        }

        setText('');
        setLoading(false);
        setError(err);
      });

    return () => controller.abort();
  }, [enabled, inlineContent, url]);

  return { text, loading, error };
}
