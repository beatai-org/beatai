import { useNavigate } from 'react-router-dom';
import { getCategoryEntryPath } from '../domain/docs';

export function useCategoryNavigation(options = {}) {
  const { mode = 'navigate' } = options;
  const navigate = useNavigate();

  return (entry) => {
    const path = getCategoryEntryPath(entry, '');

    if (!path) {
      return;
    }

    if (mode === 'reload') {
      window.location.href = path;
      return;
    }

    navigate(path);
  };
}
