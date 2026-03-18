import React, { lazy, Suspense } from 'react';
import { zhMessages } from '../data';

const visualizations = {
  s01: lazy(() => import('./s01-agent-loop.js')),
  s02: lazy(() => import('./s02-tool-dispatch.js')),
  s03: lazy(() => import('./s03-todo-write.js')),
  s04: lazy(() => import('./s04-subagent.js')),
  s05: lazy(() => import('./s05-skill-loading.js')),
  s06: lazy(() => import('./s06-context-compact.js')),
  s07: lazy(() => import('./s07-task-system.js')),
  s08: lazy(() => import('./s08-background-tasks.js')),
  s09: lazy(() => import('./s09-agent-teams.js')),
  s10: lazy(() => import('./s10-team-protocols.js')),
  s11: lazy(() => import('./s11-autonomous-agents.js')),
  s12: lazy(() => import('./s12-worktree-task-isolation.js'))
};

export function SessionVisualization({ version }) {
  const Component = visualizations[version];

  if (!Component) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-[500px] animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
      }
    >
      <div className="min-h-[500px]">
        <Component title={zhMessages.viz?.[version] || version} />
      </div>
    </Suspense>
  );
}
