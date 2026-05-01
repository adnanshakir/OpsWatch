import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import Landing from '@/pages/public/Landing';
import Login from '@/pages/public/Login';
import Signup from '@/pages/public/Signup';
import PublicStatus from '@/pages/public/PublicStatus';
import Dashboard from '@/pages/app/Dashboard';
import IncidentsList from '@/pages/app/IncidentsList';
import Team from '@/pages/app/Team';
import StatusPageSettings from '@/pages/app/StatusPageSettings';
import Settings from '@/pages/app/Settings';
import IncidentDetail from '@/pages/incident/IncidentDetail';
import Postmortem from '@/pages/incident/Postmortem';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { auth } from '@/lib/api';

function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialCheckDone = useAuthStore((s) => s.isInitialCheckDone);

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  if (!isInitialCheckDone) {
    return null; // Keep screen clean while checking session
  }

  return children;
}

export default function App() {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitialCheckDone = useAuthStore((s) => s.setInitialCheckDone);

  useEffect(() => {
    // Check session on mount to sync with backend cookies
    auth.me()
      .then(user => setUser(user))
      .finally(() => setInitialCheckDone(true));

    // Session heartbeat: periodically verify session is still valid
    const interval = setInterval(() => {
      auth.me();
    }, 10000);

    return () => clearInterval(interval);
  }, [setUser, setInitialCheckDone]);

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/status/:teamSlug" element={<PublicStatus />} />

        {/* App shell */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="incidents" element={<IncidentsList />} />
          <Route path="incidents/:id" element={<IncidentDetail />} />
          <Route path="incidents/:id/postmortem" element={<Postmortem />} />
          <Route path="team" element={<Team />} />
          <Route path="status" element={<StatusPageSettings />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)',
          },
        }}
      />
    </>
  );
}
