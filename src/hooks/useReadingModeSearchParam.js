import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const READING_MODE_PARAM = 'mode';
export const READING_MODE_VALUE = 'read';
export const READING_MODE_READONLY_VALUE = 'readonly';

const READING_MODE_VALUES = new Set([
  READING_MODE_VALUE,
  READING_MODE_READONLY_VALUE
]);

export function isReadingModeParam(value) {
  return READING_MODE_VALUES.has(value);
}

export function useReadingModeSearchParam(options = {}) {
  const { replace = false } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const modeParam = searchParams.get(READING_MODE_PARAM) || '';
  const isReadingMode = isReadingModeParam(modeParam);
  const isReadonlyMode = modeParam === READING_MODE_READONLY_VALUE;
  const modeSearch = isReadingMode ? `?${READING_MODE_PARAM}=${modeParam}` : '';

  const setReadingMode = useCallback((next) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      const currentValue = isReadingModeParam(params.get(READING_MODE_PARAM));
      const resolved = typeof next === 'function' ? next(currentValue) : next;

      if (resolved) {
        params.set(READING_MODE_PARAM, READING_MODE_VALUE);
      } else {
        params.delete(READING_MODE_PARAM);
      }

      return params;
    }, { replace });
  }, [replace, setSearchParams]);

  const toggleReadingMode = useCallback(() => {
    setReadingMode((current) => !current);
  }, [setReadingMode]);

  return useMemo(() => ({
    isReadingMode,
    isReadonlyMode,
    modeSearch,
    setReadingMode,
    toggleReadingMode
  }), [
    isReadingMode,
    isReadonlyMode,
    modeSearch,
    setReadingMode,
    toggleReadingMode
  ]);
}
