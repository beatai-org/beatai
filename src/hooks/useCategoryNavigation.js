import { useNavigate } from 'react-router-dom';
import { getFirstNavigablePathForCategory } from '../utils/docsMeta';

export function useCategoryNavigation(options = {}) {
  const { mode = 'navigate' } = options;
  const navigate = useNavigate();

  return (category) => {
    const path = getFirstNavigablePathForCategory(category);

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
