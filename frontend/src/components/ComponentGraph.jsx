// ComponentGraph.jsx
import React, { useEffect, useState } from 'react';
import ReactFlow, { Controls, MiniMap, useNodesState, useEdgesState, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { getDependents } from '../api';

export default function ComponentGraph({ component }) {
  const [elements, setElements] = useState([]);
  const [nodes, setNodes, onNodesChange] = useState([]);
  const [edges, setEdges, onEdgesChange] = useState([]);

  useEffect(() => {
    const loadGraph = async () => {
      console.log('Loading graph for component:', component.id);
    const data = await getDependents(component.id);
    console.log('Dependencies:', data);
    if (!data || data.length === 0) return;
    // el componente principal viene en la primera posición
    const main = data[0];
    // nodo principal
    const nodes = [
      {
        id: `c${main.id}`,
        data: { label: main.name },
        position: { x: 250, y: 50 }
      }
    ];
    // dependencias
    const depNodes = main.dependencies.map((d, idx) => ({
      id: `c${d.id}`,
      data: { label: d.name },
      position: { x: 200 * (idx + 1), y: 200 }
    }));
    // edges
    const edges = main.dependencies.map((d) => ({
      id: `e${main.id}-${d.id}`,
      source: `c${main.id}`,
      target: `c${d.id}`,
      position: 'vertical',
      type: 'smoothstep',
      style: { stroke: '#0bcf15d4' },
      label: 'depends on',
      labelStyle: { fill: '#1147daff', fontSize: 12 },
      labelBgStyle: { fill: '#000', color: '#fff' },
      labelBgPadding: 8,
      animated: true
    }));

    setNodes([...nodes, ...depNodes]);
    setEdges(edges);
    setElements([...nodes, ...depNodes, ...edges]);
  };

  loadGraph();
  }, [component.id, component.name]);

  return (
    <div style={{ width:"100%", height: 400 }}>
      {/* {console.log('elements:', elements)}
      {console.log('nodes:', nodes)}
      {console.log('edges:', edges)} */}
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
