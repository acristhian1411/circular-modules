import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './layout/AppShell';
import ExplorerPage from './pages/ExplorerPage';
import ComponentsPage from './pages/ComponentsPage';
import ComponentEditorPage from './pages/ComponentEditorPage';
import ImpactVisualizerPage from './pages/ImpactVisualizerPage';

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<ExplorerPage />} />
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/editor" element={<ComponentEditorPage />} />
        <Route path="/editor/:id" element={<ComponentEditorPage />} />
        <Route path="/visualizer" element={<ImpactVisualizerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
