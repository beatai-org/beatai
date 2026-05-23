import { useNavigate } from 'react-router-dom';
import { getFirstNavigablePathForCategory } from '../utils/docsMetaSelectors';

export function useCategoryNavigation(options = {}) {
  const { mode = 'navigate' } = options;
  const navigate = useNavigate();

  return (entry) => {
    const path = entry?.entryPath || getFirstNavigablePathForCategory(entry);

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
