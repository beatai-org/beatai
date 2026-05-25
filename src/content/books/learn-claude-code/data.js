import zhMessages from './data/i18n.json';
import baseVersionsData from './data/versions.json';

import s01Annotations from './data/annotations/s01.json';
import s02Annotations from './data/annotations/s02.json';
import s03Annotations from './data/annotations/s03.json';
import s04Annotations from './data/annotations/s04.json';
import s05Annotations from './data/annotations/s05.json';
import s06Annotations from './data/annotations/s06.json';
import s07Annotations from './data/annotations/s07.json';
import s08Annotations from './data/annotations/s08.json';
import s09Annotations from './data/annotations/s09.json';
import s10Annotations from './data/annotations/s10.json';
import s11Annotations from './data/annotations/s11.json';
import s12Annotations from './data/annotations/s12.json';

import s01Scenario from './data/scenarios/s01.json';
import s02Scenario from './data/scenarios/s02.json';
import s03Scenario from './data/scenarios/s03.json';
import s04Scenario from './data/scenarios/s04.json';
import s05Scenario from './data/scenarios/s05.json';
import s06Scenario from './data/scenarios/s06.json';
import s07Scenario from './data/scenarios/s07.json';
import s08Scenario from './data/scenarios/s08.json';
import s09Scenario from './data/scenarios/s09.json';
import s10Scenario from './data/scenarios/s10.json';
import s11Scenario from './data/scenarios/s11.json';
import s12Scenario from './data/scenarios/s12.json';

// Data backing the LCC widgets registered as <doc-component> entries. Per-
// section data only — navigation / TOC / sidebar layout live in the book's
// _meta.json (public/docs/llc-content/_meta.json) and the markdown files
// themselves.

export const ANNOTATIONS = {
  s01: s01Annotations,
  s02: s02Annotations,
  s03: s03Annotations,
  s04: s04Annotations,
  s05: s05Annotations,
  s06: s06Annotations,
  s07: s07Annotations,
  s08: s08Annotations,
  s09: s09Annotations,
  s10: s10Annotations,
  s11: s11Annotations,
  s12: s12Annotations
};

export const SCENARIOS = {
  s01: s01Scenario,
  s02: s02Scenario,
  s03: s03Scenario,
  s04: s04Scenario,
  s05: s05Scenario,
  s06: s06Scenario,
  s07: s07Scenario,
  s08: s08Scenario,
  s09: s09Scenario,
  s10: s10Scenario,
  s11: s11Scenario,
  s12: s12Scenario
};

export const versionsData = baseVersionsData;

const FLOW_WIDTH = 600;
const COL_CENTER = FLOW_WIDTH / 2;
const COL_LEFT = 140;
const COL_RIGHT = FLOW_WIDTH - 140;

export const EXECUTION_FLOWS = {
  s01: {
    nodes: [
      { id: 'start', label: 'User Input', type: 'start', x: COL_CENTER, y: 30 },
      { id: 'llm', label: 'LLM Call', type: 'process', x: COL_CENTER, y: 110 },
      { id: 'tool_check', label: 'tool_use?', type: 'decision', x: COL_CENTER, y: 190 },
      { id: 'bash', label: 'Execute Bash', type: 'subprocess', x: COL_LEFT, y: 280 },
      { id: 'append', label: 'Append Result', type: 'process', x: COL_LEFT, y: 360 },
      { id: 'end', label: 'Output', type: 'end', x: COL_RIGHT, y: 280 }
    ],
    edges: [
      { from: 'start', to: 'llm' },
      { from: 'llm', to: 'tool_check' },
      { from: 'tool_check', to: 'bash', label: 'yes' },
      { from: 'tool_check', to: 'end', label: 'no' },
      { from: 'bash', to: 'append' },
      { from: 'append', to: 'llm' }
    ]
  },
  s02: {
    nodes: [
      { id: 'start', label: 'User Input', type: 'start', x: COL_CENTER, y: 30 },
      { id: 'llm', label: 'LLM Call', type: 'process', x: COL_CENTER, y: 110 },
      { id: 'tool_check', label: 'tool_use?', type: 'decision', x: COL_CENTER, y: 190 },
      { id: 'dispatch', label: 'Tool Dispatch', type: 'process', x: COL_LEFT, y: 280 },
      { id: 'exec', label: 'bash / read / write / edit', type: 'subprocess', x: COL_LEFT, y: 360 },
      { id: 'append', label: 'Append Result', type: 'process', x: COL_LEFT, y: 440 },
      { id: 'end', label: 'Output', type: 'end', x: COL_RIGHT, y: 280 }
    ],
    edges: [
      { from: 'start', to: 'llm' },
      { from: 'llm', to: 'tool_check' },
      { from: 'tool_check', to: 'dispatch', label: 'yes' },
      { from: 'tool_check', to: 'end', label: 'no' },
      { from: 'dispatch', to: 'exec' },
      { from: 'exec', to: 'append' },
      { from: 'append', to: 'llm' }
    ]
  },
  s03: {
    nodes: [
      { id: 'start', label: 'User Input', type: 'start', x: COL_CENTER, y: 30 },
      { id: 'todo', label: 'Create Todos', type: 'process', x: COL_CENTER, y: 100 },
      { id: 'llm', label: 'LLM Call', type: 'process', x: COL_CENTER, y: 180 },
      { id: 'tool_check', label: 'tool_use?', type: 'decision', x: COL_CENTER, y: 260 },
      { id: 'exec', label: 'Execute Tool', type: 'subprocess', x: COL_LEFT, y: 340 },
      { id: 'append', label: 'Append Result', type: 'process', x: COL_LEFT, y: 410 },
      { id: 'end', label: 'Output', type: 'end', x: COL_RIGHT, y: 340 }
    ],
    edges: [
      { from: 'start', to: 'todo' },
      { from: 'todo', to: 'llm' },
      { from: 'llm', to: 'tool_check' },
      { from: 'tool_check', to: 'exec', label: 'yes' },
      { from: 'tool_check', to: 'end', label: 'no' },
      { from: 'exec', to: 'append' },
      { from: 'append', to: 'llm' }
    ]
  },
  s04: {
    nodes: [
      { id: 'start', label: 'User Input', type: 'start', x: COL_CENTER, y: 30 },
      { id: 'llm', label: 'LLM Call', type: 'process', x: COL_CENTER, y: 110 },
      { id: 'tool_check', label: 'tool_use?', type: 'decision', x: COL_CENTER, y: 190 },
      { id: 'is_task', label: 'task tool?', type: 'decision', x: COL_LEFT, y: 280 },
      { id: 'spawn', label: 'Spawn Subagent\\n(fresh messages[])', type: 'subprocess', x: 60, y: 380 },
      { id: 'sub_loop', label: 'Subagent Loop', type: 'process', x: 60, y: 460 },
      { id: 'exec', label: 'Execute Tool', type: 'subprocess', x: COL_LEFT + 80, y: 380 },
      { id: 'append', label: 'Append Result', type: 'process', x: COL_CENTER, y: 540 },
      { id: 'end', label: 'Output', type: 'end', x: COL_RIGHT, y: 280 }
    ],
    edges: [
      { from: 'start', to: 'llm' },
      { from: 'llm', to: 'tool_check' },
      { from: 'tool_check', to: 'is_task', label: 'yes' },
      { from: 'tool_check', to: 'end', label: 'no' },
      { from: 'is_task', to: 'spawn', label: 'task' },
      { from: 'is_task', to: 'exec', label: 'other' },
      { from: 'spawn', to: 'sub_loop' },
      { from: 'sub_loop', to: 'append' },
      { from: 'exec', to: 'append' },
      { from: 'append', to: 'llm' }
    ]
  },
  s05: {
    nodes: [
      { id: 'start', label: 'User Input', type: 'start', x: COL_CENTER, y: 30 },
      { id: 'llm', label: 'LLM Call', type: 'process', x: COL_CENTER, y: 110 },
      { id: 'tool_check', label: 'tool_use?', type: 'decision', x: COL_CENTER, y: 190 },
      { id: 'is_skill', label: 'load_skill?', type: 'decision', x: COL_LEFT, y: 280 },
      { id: 'load', label: 'Read SKILL.md', type: 'subprocess', x: 60, y: 370 },
      { id: 'inject', label: 'Inject via\\ntool_result', type: 'process', x: 60, y: 450 },
      { id: 'exec', label: 'Execute Tool', type: 'subprocess', x: COL_LEFT + 80, y: 370 },
      { id: 'append', label: 'Append Result', type: 'process', x: COL_CENTER, y: 530 },
      { id: 'end', label: 'Output', type: 'end', x: COL_RIGHT, y: 280 }
    ],
    edges: [
      { from: 'start', to: 'llm' },
      { from: 'llm', to: 'tool_check' },
      { from: 'tool_check', to: 'is_skill', label: 'yes' },
      { from: 'tool_check', to: 'end', label: 'no' },
      { from: 'is_skill', to: 'load', label: 'skill' },
      { from: 'is_skill', to: 'exec', label: 'other' },
      { from: 'load', to: 'inject' },
      { from: 'inject', to: 'append' },
      { from: 'exec', to: 'append' },
      { from: 'append', to: 'llm' }
    ]
  },
  s06: {
    nodes: [
      { id: 'start', label: 'User Input', type: 'start', x: COL_CENTER, y: 30 },
      { id: 'compress_check', label: 'Over token\\nlimit?', type: 'decision', x: COL_CENTER, y: 110 },
      { id: 'compress', label: 'Compress Context', type: 'subprocess', x: COL_RIGHT, y: 110 },
      { id: 'llm', label: 'LLM Call', type: 'process', x: COL_CENTER, y: 200 },
      { id: 'tool_check', label: 'tool_use?', type: 'decision', x: COL_CENTER, y: 280 },
      { id: 'exec', label: 'Execute Tool', type: 'subprocess', x: COL_LEFT, y: 360 },
      { id: 'append', label: 'Append Result', type: 'process', x: COL_LEFT, y: 430 },
      { id: 'end', label: 'Output', type: 'end', x: COL_RIGHT, y: 360 }
    ],
    edges: [
      { from: 'start', to: 'compress_check' },
      { from: 'compress_check', to: 'compress', label: 'yes' },
      { from: 'compress_check', to: 'llm', label: 'no' },
      { from: 'compress', to: 'llm' },
      { from: 'llm', to: 'tool_check' },
      { from: 'tool_check', to: 'exec', label: 'yes' },
      { from: 'tool_check', to: 'end', label: 'no' },
      { from: 'exec', to: 'append' },
      { from: 'append', to: 'compress_check' }
    ]
  },
  s07: {
    nodes: [
      { id: 'start', label: 'User Input', type: 'start', x: COL_CENTER, y: 30 },
      { id: 'llm', label: 'LLM Call', type: 'process', x: COL_CENTER, y: 110 },
      { id: 'tool_check', label: 'tool_use?', type: 'decision', x: COL_CENTER, y: 190 },
      { id: 'is_task', label: 'task_manager?', type: 'decision', x: COL_LEFT, y: 280 },
      { id: 'crud', label: 'CRUD Task\\n(file-based)', type: 'subprocess', x: 60, y: 370 },
      { id: 'dep_check', label: 'Check\\nDependencies', type: 'process', x: 60, y: 450 },
      { id: 'exec', label: 'Execute Tool', type: 'subprocess', x: COL_LEFT + 80, y: 370 },
      { id: 'append', label: 'Append Result', type: 'process', x: COL_CENTER, y: 530 },
      { id: 'end', label: 'Output', type: 'end', x: COL_RIGHT, y: 280 }
    ],
    edges: [
      { from: 'start', to: 'llm' },
      { from: 'llm', to: 'tool_check' },
      { from: 'tool_check', to: 'is_task', label: 'yes' },
      { from: 'tool_check', to: 'end', label: 'no' },
      { from: 'is_task', to: 'crud', label: 'task' },
      { from: 'is_task', to: 'exec', label: 'other' },
      { from: 'crud', to: 'dep_check' },
      { from: 'dep_check', to: 'append' },
      { from: 'exec', to: 'append' },
      { from: 'append', to: 'llm' }
    ]
  },
  s08: {
    nodes: [
      { id: 'start', label: 'User Input', type: 'start', x: COL_CENTER, y: 30 },
      { id: 'llm', label: 'LLM Call', type: 'process', x: COL_CENTER, y: 110 },
      { id: 'tool_check', label: 'tool_use?', type: 'decision', x: COL_CENTER, y: 190 },
      { id: 'bg_check', label: 'Background?', type: 'decision', x: COL_LEFT, y: 280 },
      { id: 'bg_spawn', label: 'Spawn Thread', type: 'subprocess', x: 60, y: 370 },
      { id: 'exec', label: 'Execute Tool', type: 'subprocess', x: COL_LEFT + 80, y: 370 },
      { id: 'append', label: 'Append Result', type: 'process', x: COL_CENTER, y: 450 },
      { id: 'notify', label: 'Notification\\nQueue', type: 'process', x: 60, y: 450 },
      { id: 'end', label: 'Output', type: 'end', x: COL_RIGHT, y: 280 }
    ],
    edges: [
      { from: 'start', to: 'llm' },
      { from: 'llm', to: 'tool_check' },
      { from: 'tool_check', to: 'bg_check', label: 'yes' },
      { from: 'tool_check', to: 'end', label: 'no' },
      { from: 'bg_check', to: 'bg_spawn', label: 'bg' },
      { from: 'bg_check', to: 'exec', label: 'fg' },
      { from: 'bg_spawn', to: 'notify' },
      { from: 'exec', to: 'append' },
      { from: 'append', to: 'llm' },
      { from: 'notify', to: 'llm' }
    ]
  },
  s09: {
    nodes: [
      { id: 'start', label: 'User Input', type: 'start', x: COL_CENTER, y: 30 },
      { id: 'llm', label: 'LLM Call\\n(team lead)', type: 'process', x: COL_CENTER, y: 110 },
      { id: 'tool_check', label: 'tool_use?', type: 'decision', x: COL_CENTER, y: 200 },
      { id: 'is_team', label: 'Team tool?', type: 'decision', x: COL_LEFT, y: 290 },
      { id: 'spawn', label: 'Spawn\\nTeammate', type: 'subprocess', x: 60, y: 390 },
      { id: 'msg', label: 'Send Message\\n(JSONL inbox)', type: 'subprocess', x: 60, y: 470 },
      { id: 'exec', label: 'Execute Tool', type: 'subprocess', x: COL_LEFT + 80, y: 390 },
      { id: 'append', label: 'Append Result', type: 'process', x: COL_CENTER, y: 550 },
      { id: 'end', label: 'Output', type: 'end', x: COL_RIGHT, y: 290 },
      { id: 'teammate', label: 'Teammate Agent\\n(own loop)', type: 'process', x: COL_RIGHT, y: 470 }
    ],
    edges: [
      { from: 'start', to: 'llm' },
      { from: 'llm', to: 'tool_check' },
      { from: 'tool_check', to: 'is_team', label: 'yes' },
      { from: 'tool_check', to: 'end', label: 'no' },
      { from: 'is_team', to: 'spawn', label: 'spawn' },
      { from: 'is_team', to: 'exec', label: 'other' },
      { from: 'spawn', to: 'teammate' },
      { from: 'spawn', to: 'msg' },
      { from: 'msg', to: 'append' },
      { from: 'exec', to: 'append' },
      { from: 'append', to: 'llm' }
    ]
  },
  s10: {
    nodes: [
      { id: 'start', label: 'User Input', type: 'start', x: COL_CENTER, y: 30 },
      { id: 'llm', label: 'LLM Call\\n(team lead)', type: 'process', x: COL_CENTER, y: 110 },
      { id: 'tool_check', label: 'tool_use?', type: 'decision', x: COL_CENTER, y: 200 },
      { id: 'is_proto', label: 'Protocol?', type: 'decision', x: COL_LEFT, y: 290 },
      { id: 'shutdown', label: 'Shutdown\\nRequest', type: 'subprocess', x: 60, y: 390 },
      { id: 'fsm', label: 'FSM:\\npending->approved', type: 'process', x: 60, y: 470 },
      { id: 'exec', label: 'Execute Tool', type: 'subprocess', x: COL_LEFT + 80, y: 390 },
      { id: 'append', label: 'Append Result', type: 'process', x: COL_CENTER, y: 550 },
      { id: 'end', label: 'Output', type: 'end', x: COL_RIGHT, y: 290 },
      { id: 'teammate', label: 'Teammate\\nreceives request_id', type: 'process', x: COL_RIGHT, y: 470 }
    ],
    edges: [
      { from: 'start', to: 'llm' },
      { from: 'llm', to: 'tool_check' },
      { from: 'tool_check', to: 'is_proto', label: 'yes' },
      { from: 'tool_check', to: 'end', label: 'no' },
      { from: 'is_proto', to: 'shutdown', label: 'shutdown' },
      { from: 'is_proto', to: 'exec', label: 'other' },
      { from: 'shutdown', to: 'fsm' },
      { from: 'fsm', to: 'teammate' },
      { from: 'teammate', to: 'append' },
      { from: 'exec', to: 'append' },
      { from: 'append', to: 'llm' }
    ]
  },
  s11: {
    nodes: [
      { id: 'start', label: 'User Input', type: 'start', x: COL_CENTER, y: 30 },
      { id: 'inbox', label: 'Check Inbox', type: 'process', x: COL_CENTER, y: 100 },
      { id: 'llm', label: 'LLM Call', type: 'process', x: COL_CENTER, y: 180 },
      { id: 'tool_check', label: 'tool_use?', type: 'decision', x: COL_CENTER, y: 260 },
      { id: 'exec', label: 'Execute Tool', type: 'subprocess', x: COL_LEFT, y: 340 },
      { id: 'append', label: 'Append Result', type: 'process', x: COL_LEFT, y: 410 },
      { id: 'end', label: 'Output', type: 'end', x: COL_RIGHT, y: 340 },
      { id: 'idle', label: 'Idle Cycle', type: 'process', x: COL_RIGHT, y: 420 },
      { id: 'poll', label: 'Poll Tasks\\n+ Auto-Claim', type: 'subprocess', x: COL_RIGHT, y: 500 }
    ],
    edges: [
      { from: 'start', to: 'inbox' },
      { from: 'inbox', to: 'llm' },
      { from: 'llm', to: 'tool_check' },
      { from: 'tool_check', to: 'exec', label: 'yes' },
      { from: 'tool_check', to: 'end', label: 'no' },
      { from: 'exec', to: 'append' },
      { from: 'append', to: 'llm' },
      { from: 'end', to: 'idle' },
      { from: 'idle', to: 'poll' },
      { from: 'poll', to: 'inbox' }
    ]
  },
  s12: {
    nodes: [
      { id: 'start', label: 'User Input', type: 'start', x: COL_CENTER, y: 30 },
      { id: 'llm', label: 'LLM Call', type: 'process', x: COL_CENTER, y: 110 },
      { id: 'tool_check', label: 'tool_use?', type: 'decision', x: COL_CENTER, y: 190 },
      { id: 'is_wt', label: 'worktree tool?', type: 'decision', x: COL_LEFT, y: 280 },
      { id: 'task', label: 'Task Board\\n(.tasks)', type: 'process', x: 60, y: 360 },
      { id: 'wt_create', label: 'Allocate / Enter\\nWorktree', type: 'subprocess', x: 60, y: 440 },
      { id: 'wt_run', label: 'Run in\\nIsolated Dir', type: 'subprocess', x: COL_LEFT + 80, y: 360 },
      { id: 'wt_close', label: 'Closeout:\\nworktree_keep / remove', type: 'process', x: COL_LEFT + 80, y: 440 },
      { id: 'events', label: 'Emit Lifecycle Events\\n(side-channel)', type: 'process', x: COL_RIGHT, y: 420 },
      { id: 'events_read', label: 'Optional Read\\nworktree_events', type: 'subprocess', x: COL_RIGHT, y: 520 },
      { id: 'append', label: 'Append Result', type: 'process', x: COL_CENTER, y: 530 },
      { id: 'end', label: 'Output', type: 'end', x: COL_RIGHT, y: 280 }
    ],
    edges: [
      { from: 'start', to: 'llm' },
      { from: 'llm', to: 'tool_check' },
      { from: 'tool_check', to: 'is_wt', label: 'yes' },
      { from: 'tool_check', to: 'end', label: 'no' },
      { from: 'is_wt', to: 'task', label: 'task ops' },
      { from: 'is_wt', to: 'wt_create', label: 'create/bind' },
      { from: 'is_wt', to: 'wt_run', label: 'run/status' },
      { from: 'task', to: 'wt_create', label: 'allocate lane' },
      { from: 'wt_create', to: 'wt_run' },
      { from: 'task', to: 'append', label: 'task result' },
      { from: 'wt_create', to: 'events', label: 'emit create' },
      { from: 'wt_create', to: 'append', label: 'create result' },
      { from: 'wt_run', to: 'wt_close' },
      { from: 'wt_run', to: 'append', label: 'run/status result' },
      { from: 'wt_close', to: 'events', label: 'emit closeout' },
      { from: 'wt_close', to: 'append', label: 'closeout result' },
      { from: 'events', to: 'events_read', label: 'optional query' },
      { from: 'events_read', to: 'append', label: 'events result' },
      { from: 'append', to: 'llm' }
    ]
  }
};

export function getFlowForVersion(version) {
  return EXECUTION_FLOWS[version] || null;
}

export { zhMessages };
