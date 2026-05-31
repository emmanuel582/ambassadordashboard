import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ProgressRing, AnimatedNumber } from '../components/ui/Shared';
import { Copy, Check, Activity, Link as LinkIcon } from 'lucide-react';
import { RanksTab, BundlesTab, CalculatorTab, TeamTab, CommissionsTab, LeaderboardTab } from '../components/DashboardTabs';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user } = useAuth();
  const { RANKS, sales, setSales, recruits, setRecruits, selectedRank, setSelectedRank, volume, setVolume, rank, salesPct, recruitPct, overallPct, estimatedCommission, activities } = useAppContext();
  
  const [copied, setCopied] = useState(false);
  const referralLink = "https://remotefitlabs.com/join?ref=ambassador123";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Ambassador';

  return (
    <div className="fade-in">
      {/* Welcome Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          {user?.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="" style={{ width: 48, height: 48, borderRadius: "50%", border: `2px solid ${rank.color}40` }} />
          ) : (
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${rank.color}30, ${rank.color}10)`, border: `2px solid ${rank.color}40`, display: "flex", alignItems: "center", justifyContent: "center", color: rank.color, fontSize: 20, fontWeight: 700 }}>
              {firstName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#e8e4dc", lineHeight: 1.2 }}>
              Welcome back, <span style={{ color: rank.color }}>{firstName}</span>
            </h1>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              {rank.badge} {rank.title} · Level {rank.level}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 8 }}>
        {["dashboard", "team", "commissions", "ranks", "bundles", "calculator", "leaderboard"].map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" && (
        <div className="fade-in">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }} className="volume-container">
            <div className="metric-box" style={{ background: "linear-gradient(135deg, #111520, #161b26)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <LinkIcon size={16} color="#C8A96E" />
                <div style={{ fontSize: 11, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase" }}>Your Referral Link</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, background: "#0a0d14", border: "1px solid #1e2333", borderRadius: 8, padding: "12px 16px", color: "#a0a8b8", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {referralLink}
                </div>
                <button onClick={handleCopy} style={{ background: copied ? "#7EC8A4" : "#e8e4dc", color: "#0a0d14", border: "none", borderRadius: 8, padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, transition: "background 0.2s" }}>
                  {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, overflowX: "auto", alignItems: "center" }}>
              {RANKS.map((r, i) => (
                <button key={i} className={`rank-card ${selectedRank === i ? "active" : ""}`}
                  style={{ "--rc": r.color, "--rcg": r.glow, flex: "1 0 auto", minWidth: 120, padding: "12px 16px", textAlign: "left" }}
                  onClick={() => setSelectedRank(i)}>
                  <div style={{ fontSize: 16, color: r.color, marginBottom: 4 }}>{r.badge}</div>
                  <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 2 }}>Level {r.level}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: selectedRank === i ? r.color : "#a0a8b8", fontWeight: 600 }}>{r.title}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 24 }} className="volume-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="metric-box-container">
              <div className="metric-box">
                <div style={{ fontSize: 11, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>Sales Progress</div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ position: "relative" }}>
                    <ProgressRing pct={salesPct} color={rank.color} size={72} stroke={5} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: rank.color }}>{Math.round(salesPct)}%</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: rank.color, lineHeight: 1 }}>{sales}<span style={{ fontSize: 14, color: "#4b5563" }}>/{rank.customers}</span></div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>customers</div>
                    <div style={{ marginTop: 8, "--rank-color": rank.color }}>
                      <input type="range" min={0} max={rank.customers} value={sales} onChange={e => setSales(+e.target.value)} style={{ "--rank-color": rank.color }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="metric-box">
                <div style={{ fontSize: 11, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>Recruit Progress</div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ position: "relative" }}>
                    <ProgressRing pct={recruitPct} color={rank.color} size={72} stroke={5} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: rank.color }}>{Math.round(recruitPct)}%</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: rank.color, lineHeight: 1 }}>{recruits}<span style={{ fontSize: 14, color: "#4b5563" }}>/{rank.ambassadors || "—"}</span></div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>ambassadors</div>
                    {rank.ambassadors > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <input type="range" min={0} max={rank.ambassadors} value={recruits} onChange={e => setRecruits(+e.target.value)} style={{ "--rank-color": rank.color }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="metric-box" style={{ background: `linear-gradient(135deg, #111520, ${rank.glow})`, borderColor: rank.color + "30" }}>
                <div style={{ fontSize: 11, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>Rank Score</div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ position: "relative" }}>
                    <ProgressRing pct={overallPct} color={rank.color} size={72} stroke={6} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: rank.color }}>{Math.round(overallPct)}%</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: rank.color, fontWeight: 700, lineHeight: 1.2 }}>{rank.badge} {rank.title}</div>
                    <div style={{ marginTop: 8, fontSize: 11, color: "#6b7280" }}>
                      <div>Sales ×.70 = <span style={{ color: "#a0a8b8" }}>{(salesPct * 0.7).toFixed(1)}%</span></div>
                      <div>Recruits ×.30 = <span style={{ color: "#a0a8b8" }}>{(recruitPct * 0.3).toFixed(1)}%</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="metric-box" style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Activity size={16} color="#a0a8b8" />
                <div style={{ fontSize: 11, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase" }}>Recent Activity</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {activities.map(a => (
                  <div key={a.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, marginTop: 4, flexShrink: 0, boxShadow: `0 0 8px ${a.color}80` }} />
                    <div>
                      <div style={{ fontSize: 13, color: "#e8e4dc", lineHeight: 1.4 }}>{a.text}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }} className="volume-container">
            <div className="metric-box">
              <div style={{ fontSize: 11, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 16 }}>Monthly Volume Estimator</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8 }}>Personal + Team Volume: <span style={{ color: "#e8e4dc" }}>${volume.toLocaleString()}</span></div>
              <input type="range" min={0} max={rank.volume * 1.5} step={500} value={volume}
                onChange={e => setVolume(+e.target.value)}
                style={{ "--rank-color": rank.color, marginBottom: 16 }} />
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>Direct ({rank.directPct}%)</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: rank.color }}>${estimatedCommission.toLocaleString()}</div>
                </div>
                {rank.overrides.map((o, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>{o.label} ({o.pct}%)</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: rank.color + "aa" }}>${(volume * o.pct / 100).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="metric-box">
              <div style={{ fontSize: 11, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 16 }}>Est. Monthly Earnings Range</div>
              <div style={{ fontSize: 40, fontFamily: "'Playfair Display', serif", color: rank.color, fontWeight: 700, lineHeight: 1 }}>
                ${rank.estRevenue[0].toLocaleString()}
                <span style={{ fontSize: 20, color: "#4b5563" }}> – </span>
                ${rank.estRevenue[1].toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>at {rank.customers} customers · avg $1,500/program</div>
              <div style={{ marginTop: 16 }}>
                {rank.overrides.map((o, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: rank.color, opacity: 0.6 }} />
                    <span style={{ fontSize: 12, color: "#6b7280" }}>{o.label}: <span style={{ color: "#a0a8b8" }}>{o.pct}%</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="difference-card" style={{ background: "linear-gradient(135deg, #111520 60%, #1a1f2e)", border: "1px solid #2a2f3e", borderRadius: 12, padding: "24px 28px", display: "flex", gap: 32, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#4b5563", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>The RFL Difference</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#e8e4dc", fontWeight: 600, marginBottom: 12 }}>Customer-First, Not Recruit-First</div>
              <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>Most MLMs reward the recruit → recruit → recruit loop. RFL rewards the full cycle: <span style={{ color: "#C8A96E" }}>Bloodwork → Data → Personalized Program → Monthly Optimization</span>. The customer becomes the asset. Recurring revenue becomes the moat.</div>
            </div>
            <div className="difference-diagram" style={{ display: "flex", gap: 12 }}>
              <div style={{ background: "#0d1117", border: "1px solid #1e2333", borderRadius: 10, padding: "16px 20px", textAlign: "center", minWidth: 110 }}>
                <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>Traditional MLM</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Recruit</div>
                <div style={{ fontSize: 16, color: "#4b5563" }}>↓</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Recruit</div>
                <div style={{ fontSize: 16, color: "#4b5563" }}>↓</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Recruit</div>
              </div>
              <div style={{ background: "#0d1117", border: `1px solid ${rank.color}40`, borderRadius: 10, padding: "16px 20px", textAlign: "center", minWidth: 110 }}>
                <div style={{ fontSize: 10, color: rank.color, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>RFL Model</div>
                <div style={{ fontSize: 12, color: "#C8A96E" }}>Bloodwork</div>
                <div style={{ fontSize: 14, color: rank.color }}>↓</div>
                <div style={{ fontSize: 12, color: "#A8C4D4" }}>Data</div>
                <div style={{ fontSize: 14, color: rank.color }}>↓</div>
                <div style={{ fontSize: 12, color: "#7EC8A4" }}>Recurring</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "team" && <TeamTab RANKS={RANKS} />}
      {activeTab === "commissions" && <CommissionsTab />}
      {activeTab === "ranks" && <RanksTab RANKS={RANKS} />}
      {activeTab === "bundles" && <BundlesTab />}
      {activeTab === "calculator" && <CalculatorTab RANKS={RANKS} />}
      {activeTab === "leaderboard" && <LeaderboardTab RANKS={RANKS} />}
    </div>
  );
}
