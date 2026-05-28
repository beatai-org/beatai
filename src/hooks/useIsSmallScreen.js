import { useEffect, useState } from 'react';

const DEFAULT_MAX_WIDTH = 968;

export function useIsSmallScreen(maxWidth = DEFAULT_MAX_WIDTH) {
  const [isSmall, setIsSmall] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(max-width: ${maxWidth}px)`).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const handler = (event) => setIsSmall(event.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [maxWidth]);

  return isSmall;
}
