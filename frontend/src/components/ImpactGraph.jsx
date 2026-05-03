import { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';

const CENTER = { x: 420, y: 280 };
const IMPACT_ROOT = { x: 520, y: 80 };
const CRITICAL_COLOR = '#c4314b';
const OPTIONAL_COLOR = '#697586';

function buildGraph(rootId, rootName, rows, mode) {
  const rootPosition = mode === 'impact' ? IMPACT_ROOT : CENTER;
  const rootNode = {
    id: `n${rootId}`,
    data: { label: rootName },
    position: rootPosition,
    style: {
      background: '#0f6cbd',
      color: '#fff',
      fontWeight: 700,
      borderRadius: 8,
      padding: '6px 12px',
      minWidth: 120,
      textAlign: 'center',
    },
  };

  let otherNodes;

  if (mode === 'impact') {
    // Arrange impact nodes by depth layers for a clearer parent -> child flow.
    const byDepth = {};
    for (const row of rows) {
      const d = row.depth ?? 1;
      if (!byDepth[d]) byDepth[d] = [];
      byDepth[d].push(row);
    }
    otherNodes = [];
    for (const [depthStr, group] of Object.entries(byDepth).sort((a, b) => Number(a[0]) - Number(b[0]))) {
      const depth = Number(depthStr);
      const spacing = 220;
      const startX = rootPosition.x - ((group.length - 1) * spacing) / 2;
      group.forEach((row, i) => {
        otherNodes.push({
          id: `n${row.id}`,
          data: { label: row.name },
          position: {
            x: startX + i * spacing,
            y: rootPosition.y + depth * 145,
          },
          style: { borderRadius: 6, padding: '4px 10px', minWidth: 100, textAlign: 'center' },
        });
      });
    }
  } else {
    // Single ring for direct dependents / dependencies.
    const radius = Math.max(180, rows.length * 45);
    otherNodes = rows.map((row, i) => {
      const angle = (2 * Math.PI * i) / rows.length - Math.PI / 2;
      return {
        id: `n${row.id}`,
        data: { label: row.name },
        position: {
          x: CENTER.x + radius * Math.cos(angle),
          y: CENTER.y + radius * Math.sin(angle),
        },
        style: { borderRadius: 6, padding: '4px 10px', minWidth: 100, textAlign: 'center' },
      };
    });
  }

  const edges = rows.map((row) => {
    const isCritical = row.criticality === 'critical';
    const color = isCritical ? CRITICAL_COLOR : OPTIONAL_COLOR;
    const [source, target] = mode === 'impact'
      ? [`n${row.tree_parent_id ?? rootId}`, `n${row.id}`]
      : mode === 'dependencies'
        ? [`n${rootId}`, `n${row.id}`]
        : [`n${row.id}`, `n${rootId}`];

    if (source === target) {
      return null;
    }

    return {
      id: `e${source}-${target}`,
      source,
      target,
      type: 'smoothstep',
      style: { stroke: color, strokeWidth: isCritical ? 2 : 1.5 },
      animated: isCritical,
    };
  }).filter(Boolean);

  return { nodes: [rootNode, ...otherNodes], edges };
}

export default function ImpactGraph({ rootId, rootName, rows, mode }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraph(rootId, rootName, rows, mode),
    [rootId, rootName, rows, mode]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100%', height: 520 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.25 }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
