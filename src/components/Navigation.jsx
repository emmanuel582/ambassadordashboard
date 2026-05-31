import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, User, Settings } from 'lucide-react';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div style={{ borderBottom: "1px solid #1a1f2e", padding: "0 32px" }}>
      <div className="header-content" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #C8A96E, #E8845C)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>R</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, letterSpacing: ".02em", color: "#e8e4dc" }}>RFL Platform</div>
            <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: ".1em", textTransform: "uppercase" }}>Ambassador Compensation</div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <NavLink to="/dashboard" className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
          <NavLink to="/onboarding" className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}>Onboarding</NavLink>

          <div style={{ width: 1, height: 24, background: "#1e2333", margin: "0 12px" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#a0a8b8", fontSize: 13 }}>
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" style={{ width: 24, height: 24, borderRadius: "50%" }} />
              ) : (
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#C8A96E20", border: "1px solid #C8A96E40", display: "flex", alignItems: "center", justifyContent: "center", color: "#C8A96E", fontSize: 11, fontWeight: 700 }}>
                  {(user?.user_metadata?.full_name || user?.email || 'A').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hide-mobile" style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.user_metadata?.full_name || user?.email}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 8 }}>
              <button onClick={() => navigate('/settings')} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }} title="Settings">
                <Settings size={16} />
              </button>
              <button onClick={handleSignOut} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }} title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
