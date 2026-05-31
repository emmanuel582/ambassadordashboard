import { useState } from 'react';
import { User, Bell, Shield, CreditCard, ArrowUpRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Account Settings</h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Manage your profile, payout preferences, and platform notifications.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 32 }} className="volume-container">
        {/* Sidebar Nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { id: "profile", icon: User, label: "Profile Information" },
            { id: "payouts", icon: CreditCard, label: "Payout Settings" },
            { id: "notifications", icon: Bell, label: "Notifications" },
            { id: "security", icon: Shield, label: "Security & Access" }
          ].map(t => (
            <button key={t.id} 
              onClick={() => setActiveTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8,
                background: activeTab === t.id ? "#161b26" : "transparent",
                color: activeTab === t.id ? "#e8e4dc" : "#6b7280",
                border: "none", cursor: "pointer", textAlign: "left", transition: "all .2s",
                fontWeight: activeTab === t.id ? 600 : 500,
                borderLeft: activeTab === t.id ? "3px solid #C8A96E" : "3px solid transparent"
              }}>
              <t.icon size={18} color={activeTab === t.id ? "#C8A96E" : "#6b7280"} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="metric-box" style={{ padding: "32px" }}>
          {activeTab === "profile" && (
            <div className="fade-in">
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #1e2333" }}>Profile Information</h2>
              
              <form onSubmit={handleSave}>
                <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid #C8A96E40", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #C8A96E20, #E8845C20)", border: "1px solid #C8A96E30", display: "flex", alignItems: "center", justifyContent: "center", color: "#C8A96E", fontSize: 28, fontWeight: 700 }}>
                      {(user?.user_metadata?.full_name || user?.email || 'A').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <button type="button" style={{ background: "#e8e4dc", color: "#0a0d14", border: "none", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>Upload Photo</button>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>JPG, GIF or PNG. Max size of 800K</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "#a0a8b8", marginBottom: 8, fontWeight: 500 }}>Full Name</label>
                    <input type="text" defaultValue={user?.user_metadata?.full_name || "Alex Johnson"} style={{ width: "100%", background: "#0d1117", border: "1px solid #1e2333", padding: "12px 16px", borderRadius: 8, color: "#e8e4dc", outline: "none", fontSize: 14 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "#a0a8b8", marginBottom: 8, fontWeight: 500 }}>Email Address</label>
                    <input type="email" defaultValue={user?.email || "alex.j@example.com"} disabled style={{ width: "100%", background: "#0d1117", border: "1px solid #1e2333", padding: "12px 16px", borderRadius: 8, color: "#6b7280", outline: "none", fontSize: 14, cursor: "not-allowed" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "#a0a8b8", marginBottom: 8, fontWeight: 500 }}>Phone Number</label>
                    <input type="tel" defaultValue="+1 (555) 123-4567" style={{ width: "100%", background: "#0d1117", border: "1px solid #1e2333", padding: "12px 16px", borderRadius: 8, color: "#e8e4dc", outline: "none", fontSize: 14 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "#a0a8b8", marginBottom: 8, fontWeight: 500 }}>Location</label>
                    <input type="text" defaultValue="Austin, TX" style={{ width: "100%", background: "#0d1117", border: "1px solid #1e2333", padding: "12px 16px", borderRadius: 8, color: "#e8e4dc", outline: "none", fontSize: 14 }} />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32 }}>
                  <button type="submit" style={{ display: "flex", alignItems: "center", gap: 8, background: saved ? "#7EC8A4" : "#C8A96E", color: "#0a0d14", border: "none", padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .2s" }}>
                    {saved ? <><CheckCircle size={18} /> Saved successfully</> : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "payouts" && (
            <div className="fade-in">
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #1e2333" }}>Payout Settings</h2>
              
              <div style={{ background: "linear-gradient(135deg, #161b26, #111520)", border: "1px solid #2a2f3e", borderRadius: 12, padding: "24px", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 48, height: 48, background: "#635BFF20", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ArrowUpRight size={24} color="#635BFF" />
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "#e8e4dc" }}>Stripe Connected Account</div>
                      <div style={{ fontSize: 13, color: "#7EC8A4" }}>Active & Verified</div>
                    </div>
                  </div>
                  <button style={{ background: "transparent", border: "1px solid #2a2f3e", color: "#a0a8b8", padding: "8px 16px", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>Manage in Stripe</button>
                </div>
                <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
                  Your commissions are automatically routed to your connected Stripe account and deposited to your bank account ending in <strong>4092</strong> on a weekly schedule.
                </div>
              </div>

              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#a0a8b8" }}>Tax Information</h3>
                <div style={{ border: "1px solid #1e2333", borderRadius: 8, padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#e8e4dc", marginBottom: 4 }}>W-9 Tax Form</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Submitted on Oct 12, 2025</div>
                  </div>
                  <span className="pill" style={{ background: "#7EC8A420", color: "#7EC8A4" }}>Verified</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="fade-in">
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #1e2333" }}>Notification Preferences</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {[
                  { title: "New Sale Commissions", desc: "Get notified when you earn a commission from a new sale." },
                  { title: "Team Rank Advancements", desc: "Get notified when someone in your downline ranks up." },
                  { title: "Monthly Payouts", desc: "Receive a summary when your monthly payout is deposited." },
                  { title: "Platform Updates", desc: "News, announcements, and feature updates." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#e8e4dc", marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{item.desc}</div>
                    </div>
                    <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                      <div style={{ position: "relative" }}>
                        <input type="checkbox" defaultChecked={i < 3} style={{ opacity: 0, width: 0, height: 0 }} />
                        <div style={{ width: 44, height: 24, background: i < 3 ? "#C8A96E" : "#1e2333", borderRadius: 24, transition: "all .3s" }}>
                          <div style={{ width: 20, height: 20, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: i < 3 ? 22 : 2, transition: "all .3s" }} />
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="fade-in">
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #1e2333" }}>Security & Access</h2>
              <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>Change your password or manage two-factor authentication.</div>
              <button style={{ background: "#1e2333", color: "#e8e4dc", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginRight: 16 }}>Change Password</button>
              <button style={{ background: "transparent", color: "#C8A96E", border: "1px solid #C8A96E", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Enable 2FA</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
