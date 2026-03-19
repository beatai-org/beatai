import React from 'react';
import { useLocation } from 'react-router-dom';

export function NotFoundState({ label }) {
  return (
    <section className="lcc-section">
      <div className="lcc-empty">Page not found: {label}</div>
    </section>
  );
}

export function LearnRouteNotFound() {
  const location = useLocation();
  const label = location.pathname.replace('/learn-claude-code/', '') || location.pathname;

  return <NotFoundState label={label} />;
}
