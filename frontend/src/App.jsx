import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './layout/AppShell';
import ExplorerPage from './pages/ExplorerPage';
import ComponentsPage from './pages/ComponentsPage';
import ComponentEditorPage from './pages/ComponentEditorPage';
import ImpactVisualizerPage from './pages/ImpactVisualizerPage';
import LoginPage from './pages/LoginPage';
import { clearAccessToken, getCurrentUser, getStoredAccessToken, logout } from './api';

function App() {
  const [authState, setAuthState] = useState({
    checking: true,
    isAuthenticated: false,
    user: null,
  });

  const refreshSession = useCallback(async () => {
    const token = getStoredAccessToken();
    if (!token) {
      setAuthState({ checking: false, isAuthenticated: false, user: null });
      return;
    }

    try {
      const { user } = await getCurrentUser();
      setAuthState({ checking: false, isAuthenticated: true, user: user ?? null });
    } catch {
      clearAccessToken();
      setAuthState({ checking: false, isAuthenticated: false, user: null });
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  if (authState.checking) {
    return null;
  }

  if (!authState.isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={refreshSession} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppShell
      user={authState.user}
      onLogout={() => {
        logout();
        setAuthState({ checking: false, isAuthenticated: false, user: null });
      }}
    >
      <Routes>
        <Route path="/" element={<ExplorerPage />} />
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/editor" element={<ComponentEditorPage />} />
        <Route path="/editor/:id" element={<ComponentEditorPage />} />
        <Route path="/visualizer" element={<ImpactVisualizerPage />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
