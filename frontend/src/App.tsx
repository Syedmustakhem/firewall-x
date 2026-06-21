import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { initTheme } from "./store/themeStore";
import { Layout } from "./components/layout/Layout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DevicesPage } from "./pages/DevicesPage";
import { PoliciesPage } from "./pages/PoliciesPage";
import { RulesPage } from "./pages/RulesPage";
import { DeploymentsPage } from "./pages/DeploymentsPage";
import { LogsPage } from "./pages/LogsPage";
import { HeartbeatPage } from "./pages/HeartbeatPage";
import { TrafficPage } from "./pages/TrafficPage";
import { UsersPage } from "./pages/UsersPage";
import { AlertsPage } from "./pages/AlertsPage";
import { PolicyVersionsPage } from "./pages/PolicyVersionsPage";
import { SuperAdminPage } from "./pages/SuperAdminPage";
import { ClientDashboardPage } from "./pages/ClientDashboardPage";
// Add this import at the top:
import { LandingPage } from "./pages/landingPage";

// Add this route BEFORE the /login route:
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  useEffect(() => { initTheme(); }, []);

  return (
    <BrowserRouter>
     <Routes>
  <Route path="/"      element={<LandingPage />} />   {/* Public landing */}
  <Route path="/login" element={<LoginPage />} />      {/* Login */}

  {/* Protected dashboard routes */}
  <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
    <Route index element={<Navigate to="/app/dashboard" replace />} />
    <Route path="dashboard"        element={<DashboardPage />} />
    <Route path="devices"          element={<DevicesPage />} />
    <Route path="policies"         element={<PoliciesPage />} />
    <Route path="rules"            element={<RulesPage />} />
    <Route path="deployments"      element={<DeploymentsPage />} />
    <Route path="logs"             element={<LogsPage />} />
    <Route path="heartbeat"        element={<HeartbeatPage />} />
    <Route path="traffic"          element={<TrafficPage />} />
    <Route path="users"            element={<UsersPage />} />
    <Route path="alerts"           element={<AlertsPage />} />
    <Route path="versions"         element={<PolicyVersionsPage />} />
    <Route path="super-admin"      element={<SuperAdminPage />} />
    <Route path="client-dashboard" element={<ClientDashboardPage />} />
  </Route>

  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;