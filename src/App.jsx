import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/*" element={
          <PrivateRoute>
            <div style={{
              minHeight: "100vh", background: "#0a0d14", color: "#e8e4dc",
              fontFamily: "'DM Sans', sans-serif", overflowX: "hidden"
            }}>
              <Navigation />
              <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 64px" }}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </div>
            </div>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}
