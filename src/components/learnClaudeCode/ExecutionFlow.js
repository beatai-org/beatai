import React from 'react';

function buildFlowPath(from, to) {
  const diamondSize = 50;
  const nodeHeight = 40;
  const fromHeight = from.type === 'decision' ? diamondSize / 2 : nodeHeight / 2;
  const toHeight = to.type === 'decision' ? diamondSize / 2 : nodeHeight / 2;

  if (Math.abs(from.x - to.x) < 10) {
    return `M ${from.x} ${from.y + fromHeight} L ${to.x} ${to.y - toHeight}`;
  }

  const startY = from.y + fromHeight;
  const endY = to.y - toHeight;
  const midY = (startY + endY) / 2;
  return `M ${from.x} ${startY} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${endY}`;
}

function FlowNode({ node }) {
  const colors = {
    start: '#3B82F6',
    process: '#10B981',
    decision: '#F59E0B',
    subprocess: '#8B5CF6',
    end: '#EF4444'
  };
  const lines = node.label.split('\\n');

  if (node.type === 'decision') {
    const half = 25;
    return (
      <g className="lcc-flow-node">
        <polygon
          points={`${node.x},${node.y - half} ${node.x + half},${node.y} ${node.x},${node.y + half} ${node.x - half},${node.y}`}
          fill="none"
          stroke={colors[node.type]}
          strokeWidth="2"
        />
        {lines.map((line, index) => (
          <text key={index} x={node.x} y={node.y + (index - (lines.length - 1) / 2) * 12}>
            {line}
          </text>
        ))}
      </g>
    );
  }

  if (node.type === 'start' || node.type === 'end') {
    return (
      <g className="lcc-flow-node">
        <rect
          x={node.x - 70}
          y={node.y - 20}
          width="140"
          height="40"
          rx="20"
          fill="none"
          stroke={colors[node.type]}
          strokeWidth="2"
        />
        <text x={node.x} y={node.y}>{node.label}</text>
      </g>
    );
  }

  return (
    <g className="lcc-flow-node">
      <rect
        x={node.x - 70}
        y={node.y - 20}
        width="140"
        height="40"
        rx="4"
        fill="none"
        stroke={colors[node.type]}
        strokeWidth="2"
        strokeDasharray={node.type === 'subprocess' ? '6 3' : undefined}
      />
      {lines.map((line, index) => (
        <text key={index} x={node.x} y={node.y + (index - (lines.length - 1) / 2) * 12}>
          {line}
        </text>
      ))}
    </g>
  );
}

function ExecutionFlow({ flow }) {
  if (!flow) {
    return null;
  }

  const maxY = Math.max(...flow.nodes.map((item) => item.y)) + 50;

  return (
    <div className="lcc-card">
      <svg viewBox={`0 0 600 ${maxY}`} className="lcc-flow-svg">
        <defs>
          <marker id="lcc-arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
          </marker>
        </defs>

        {flow.edges.map((edge) => {
          const from = flow.nodes.find((item) => item.id === edge.from);
          const to = flow.nodes.find((item) => item.id === edge.to);
          const path = buildFlowPath(from, to);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={`${edge.from}-${edge.to}`} className="lcc-flow-edge">
              <path d={path} markerEnd="url(#lcc-arrowhead)" />
              {edge.label ? (
                <text x={midX + 8} y={midY - 4}>
                  {edge.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {flow.nodes.map((node) => (
          <FlowNode key={node.id} node={node} />
        ))}
      </svg>
    </div>
  );
}

export default ExecutionFlow;
