// ComponentGraph.jsx
import { useEffect } from 'react';
import ReactFlow, { Controls, MiniMap, useNodesState, useEdgesState, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { getDependents } from '../api';

export default function ComponentGraph({ component }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const loadGraph = async () => {
      const data = await getDependents(component.id);
      const centerNode = {
        id: `c${component.id}`,
        data: { label: component.name },
        position: { x: 300, y: 60 },
      };

      if (!data || data.length === 0) {
        setNodes([centerNode]);
        setEdges([]);
        return;
      }

      const dependentNodes = data.map((dep, idx) => ({
        id: `c${dep.id}`,
        data: { label: dep.name },
        position: { x: 80 + idx * 200, y: 230 },
      }));

      const nextEdges = data.map((dep) => ({
        id: `e${dep.id}-${component.id}`,
        source: `c${dep.id}`,
        target: `c${component.id}`,
        type: 'smoothstep',
        style: { stroke: dep.criticality === 'critical' ? '#c4314b' : '#697586' },
        animated: dep.criticality === 'critical',
      }));

      setNodes([centerNode, ...dependentNodes]);
      setEdges(nextEdges);
    };

    loadGraph();
  }, [component.id, component.name, setEdges, setNodes]);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
