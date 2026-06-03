import { Users, TrendingUp, DollarSign, Award, ArrowUpRight, Clock, Star, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function RanksTab({ RANKS }) {
  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Rank Structure</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>Five levels. Each unlocks deeper earning layers through customer acquisition and team building.</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {RANKS.map((r, i) => (
          <div key={i} className="rank-structure-item" style={{ background: "#111520", border: `1px solid #1e2333`, borderLeft: `3px solid ${r.color}`, borderRadius: 12, padding: "20px 24px", transition: "all .25s", cursor: "default", display: "flex", alignItems: "flex-start", gap: 24 }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 32px ${r.glow}`; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ minWidth: 160 }}>
              <div style={{ fontSize: 24, color: r.color, marginBottom: 4 }}>{r.badge}</div>
              <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: ".1em", textTransform: "uppercase" }}>Level {r.level}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: r.color, fontWeight: 600 }}>{r.title}</div>
            </div>
            <div className="responsive-grid-3" style={{ flex: 1 }}>
              <div>
                <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>Qualification</div>
                <div style={{ fontSize: 12, color: "#a0a8b8" }}>{r.customers} customers</div>
                {r.ambassadors > 0 && <div style={{ fontSize: 12, color: "#a0a8b8" }}>{r.ambassadors} ambassadors</div>}
                <div style={{ fontSize: 12, color: "#a0a8b8" }}>${r.volume.toLocaleString()} volume</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>Earnings</div>
                <div style={{ fontSize: 12, color: r.color, fontWeight: 600 }}>{r.directPct}% Direct</div>
                {r.overrides.map((o, j) => (
                  <div key={j} style={{ fontSize: 12, color: "#7EC8A4" }}>{o.pct}% {o.label}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>Est. Monthly</div>
                <div style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", color: r.color, fontWeight: 700 }}>${r.estRevenue[0].toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "#4b5563" }}>to ${r.estRevenue[1].toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, marginBottom: 20 }}>The Growth Math</div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {RANKS.map((r, i) => (
            <div key={i} style={{ flex: 1, minWidth: 140, background: "#111520", borderTop: `2px solid ${r.color}`, padding: "20px 16px", borderRight: i < 4 ? "1px solid #1a1f2e" : "none", transition: "all .2s" }}>
              <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Level {r.level}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: r.color, fontWeight: 600, marginBottom: 12 }}>{r.title}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#e8e4dc" }}>{r.customers}</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8 }}>customers</div>
              <div style={{ height: 1, background: "#1e2333", marginBottom: 8 }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: r.color }}>${(r.customers * 1500).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "#4b5563" }}>revenue</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const BUNDLES = [
  { name: "Weight Loss Accelerator", price: 1500, color: "#C8A96E", items: ["Bloodwork", "Medical Review", "Retatrutide Program", "Progress Tracking"] },
  { name: "Elite Transformation", price: 3000, color: "#A8C4D4", items: ["Bloodwork", "Retatrutide", "Tesamorelin", "Recovery Stack", "Coaching"] },
  { name: "Longevity Optimization", price: 2500, color: "#7EC8A4", items: ["Bloodwork", "Epitalon", "MOTS-C", "GHK-Cu", "Quarterly Reviews"] },
  { name: "Recovery & Performance", price: 1500, color: "#E8845C", items: ["Bloodwork", "BPC-157", "TB-500", "GHK-Cu"] },
];

const PANELS = [
  { name: "Essential Panel", price: 199 },
  { name: "Advanced Panel", price: 299 },
  { name: "Performance Panel", price: 399 },
];

export function BundlesTab() {
  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Program Bundles</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>Sell outcomes, not peptides. Every bundle anchors on bloodwork — creating a data-driven, defensible customer relationship.</div>
      </div>
      <div className="responsive-grid-2" style={{ marginBottom: 32 }}>
        {BUNDLES.map((b, i) => (
          <div key={i} className="bundle-card" style={{ "--bc": b.color, "--bcg": b.color + "20" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: b.color, fontWeight: 600, lineHeight: 1.3, maxWidth: 200 }}>{b.name}</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#e8e4dc" }}>${b.price.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: ".06em" }}>avg revenue</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {b.items.map((item, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#a0a8b8" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: b.color, opacity: 0.7 }} />
                  {item}
                  {item === "Bloodwork" && <span className="pill" style={{ background: b.color + "20", color: b.color }}>anchor</span>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1e2333", display: "flex", gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".06em" }}>@ 10% (L1)</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: b.color }}>${(b.price * 0.1).toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".06em" }}>@ 15% (L3+)</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: b.color }}>${(b.price * 0.15).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Bloodwork Panels</div>
      <div className="bloodwork-panels" style={{ display: "flex", gap: 16 }}>
        {PANELS.map((p, i) => (
          <div key={i} style={{ flex: 1, background: "#111520", border: "1px solid #1e2333", borderRadius: 10, padding: "20px", textAlign: "center", transition: "all .2s", cursor: "default" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#C8A96E50"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2333"; }}>
            <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>{p.name}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#C8A96E" }}>${p.price}</div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>entry point</div>
            <div style={{ marginTop: 12, fontSize: 12, color: "#4b5563" }}>Commission: <span style={{ color: "#C8A96E" }}>${(p.price * 0.1).toFixed(0)}–${(p.price * 0.15).toFixed(0)}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalculatorTab({ RANKS }) {
  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Income Calculator</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>Model your earnings at each rank with adjustable personal and team volume.</div>
      </div>
      <div className="responsive-grid-2" style={{ marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {RANKS.map((r, i) => {
              const personal = r.customers * 1500;
              const teamMult = i === 0 ? 0 : (i === 1 ? 1 : i === 2 ? 2.3 : i === 3 ? 8 : i === 4 ? 18 : i === 5 ? 30 : i === 6 ? 50 : 100);
              const team = personal * teamMult;
              const directEarning = personal * r.directPct / 100;
              const overrideEarning = r.overrides.reduce((acc, o) => acc + (team * o.pct / 100), 0);
              const total = directEarning + overrideEarning;
              return (
                <div key={i} style={{ background: "#111520", border: "1px solid #1e2333", borderLeft: `3px solid ${r.color}`, borderRadius: 10, padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".06em" }}>L{r.level} · </span>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: r.color, fontWeight: 600 }}>{r.title}</span>
                    </div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: r.color }}>
                      ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      <span style={{ fontSize: 10, color: "#4b5563" }}>/mo</span>
                    </div>
                  </div>
                  <div className="responsive-grid-3">
                    <div style={{ fontSize: 11 }}>
                      <div style={{ color: "#4b5563", marginBottom: 2 }}>Personal</div>
                      <div style={{ color: "#a0a8b8" }}>${personal.toLocaleString()}</div>
                    </div>
                    <div style={{ fontSize: 11 }}>
                      <div style={{ color: "#4b5563", marginBottom: 2 }}>Direct {r.directPct}%</div>
                      <div style={{ color: r.color }}>${directEarning.toLocaleString()}</div>
                    </div>
                    {overrideEarning > 0 && (
                      <div style={{ fontSize: 11 }}>
                        <div style={{ color: "#4b5563", marginBottom: 2 }}>Overrides</div>
                        <div style={{ color: "#7EC8A4" }}>${overrideEarning.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="metric-box">
            <div style={{ fontSize: 11, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 16 }}>Recurring Revenue Power</div>
            <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: 16 }}>
              At <span style={{ color: "#C8A96E" }}>$99–$149/mo memberships</span>, each customer retained creates compounding residual income. 15 retained customers at $124/avg = <span style={{ color: "#7EC8A4", fontWeight: 600 }}>$1,860/mo recurring</span> before any new sales.
            </div>
            {[10, 25, 50, 100].map(n => (
              <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1a1f2e" }}>
                <span style={{ fontSize: 13, color: "#a0a8b8" }}>{n} retained members</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#7EC8A4" }}>${(n * 124 * 0.1).toLocaleString()}–${(n * 124 * 0.15).toLocaleString()}/mo</span>
              </div>
            ))}
          </div>

          <div className="metric-box" style={{ background: "linear-gradient(135deg, #111520, #161b26)" }}>
            <div style={{ fontSize: 11, color: "#4b5563", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 16 }}>The Bloodwork Flywheel</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { step: "01", label: "Bloodwork Completed", sub: "$199–$399 per panel", color: "#C8A96E" },
                { step: "02", label: "Medical Data Captured", sub: "Personalization unlocked", color: "#A8C4D4" },
                { step: "03", label: "Program Enrolled", sub: "$1,500–$3,000 bundle", color: "#7EC8A4" },
                { step: "04", label: "Monthly Membership", sub: "$99–$149/mo recurring", color: "#C47DB8" },
                { step: "05", label: "Quarterly Optimization", sub: "Retention + upsell cycle", color: "#E8845C" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: s.color + "20", border: `1px solid ${s.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.step}</div>
                  <div>
                    <div style={{ fontSize: 13, color: "#e8e4dc", fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "#4b5563" }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeamTab({ RANKS }) {
    // Replace hardcoded data with an empty array until real data is pulled from the backend
    const teamMembers = [];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Team & Network</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>Manage your direct recruits and view downline volume.</div>
      </div>
      
      <div className="metric-box" style={{ padding: 0, overflow: "hidden", marginBottom: 24 }}>
        <div className="table-container">
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 600 }}>
            <thead>
              <tr style={{ background: "#161b26", borderBottom: "1px solid #1e2333" }}>
                <th style={{ padding: "16px 20px", fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Ambassador</th>
                <th style={{ padding: "16px 20px", fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Rank Level</th>
                <th style={{ padding: "16px 20px", fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Total Volume</th>
                <th style={{ padding: "16px 20px", fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "16px 20px", fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "32px 20px", textAlign: "center", color: "#6b7280", fontSize: 13 }}>
                    You don't have any team members yet.
                  </td>
                </tr>
              ) : (
                teamMembers.map(m => {
                  const r = RANKS[m.rank - 1] || RANKS[0];
                  return (
                    <tr key={m.id} style={{ borderBottom: "1px solid #1e2333", transition: "background .2s" }} className="table-row-hover">
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#161b26", border: `1px solid ${r.color}40`, display: "flex", alignItems: "center", justifyContent: "center", color: r.color, fontWeight: 700, fontSize: 14 }}>
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e4dc", marginBottom: 2 }}>{m.name}</div>
                            <div style={{ fontSize: 12, color: "#6b7280" }}>{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ color: r.color }}>{r.badge}</div>
                          <div style={{ fontSize: 13, color: "#a0a8b8" }}>{r.title}</div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 600, color: "#e8e4dc" }}>
                        ${m.volume.toLocaleString()}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span className="pill" style={{ 
                          background: m.status === 'Active' ? '#7EC8A420' : m.status === 'Pending' ? '#C8A96E20' : '#4b556320', 
                          color: m.status === 'Active' ? '#7EC8A4' : m.status === 'Pending' ? '#C8A96E' : '#a0a8b8' 
                        }}>
                          {m.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 13, color: "#6b7280" }}>
                        {m.joined}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function CommissionsTab() {
  const { commissions, transactions } = useAppContext();

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Commissions & Payouts</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>Track your earnings, overrides, and payout history.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }} className="metric-box-container">
        <div className="metric-box" style={{ background: "linear-gradient(135deg, #111520, #161b26)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: "#4b5563" }}>
            <DollarSign size={16} />
            <div style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase" }}>Available Balance</div>
          </div>
          <div style={{ fontSize: 36, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#7EC8A4", lineHeight: 1 }}>${(commissions?.available || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <button style={{ marginTop: 16, width: "100%", background: "#7EC8A4", color: "#0a0d14", border: "none", padding: "10px", borderRadius: 8, fontWeight: 600, cursor: "pointer", transition: "opacity .2s" }} className="hover-opacity">
            Request Payout
          </button>
        </div>
        
        <div className="metric-box">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: "#4b5563" }}>
            <Clock size={16} />
            <div style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase" }}>Pending Approval</div>
          </div>
          <div style={{ fontSize: 36, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#C8A96E", lineHeight: 1 }}>${(commissions?.pending || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 16 }}>Clears in ~3 days</div>
        </div>

        <div className="metric-box" style={{ border: "1px dashed #2a2f3e", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: 40, height: 40, background: "#635BFF20", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <ArrowUpRight size={20} color="#635BFF" />
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e4dc", marginBottom: 4 }}>Stripe Connected</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>Payouts route to Bank ****4092</div>
          <button style={{ background: "transparent", border: "1px solid #2a2f3e", color: "#a0a8b8", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Manage Settings</button>
        </div>
      </div>

      <div className="metric-box" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #1e2333" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Recent Transactions</div>
        </div>
        <div className="table-container">
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 500 }}>
            <tbody>
              {(!transactions || transactions.length === 0) ? (
                <tr>
                  <td colSpan={2} style={{ padding: "32px 20px", textAlign: "center", color: "#6b7280", fontSize: 13 }}>
                    No recent transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((t, idx) => (
                  <tr key={t.id || idx} style={{ borderBottom: "1px solid #1e2333" }} className="table-row-hover">
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#e8e4dc", marginBottom: 2 }}>{t.description || t.desc}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : t.date}</div>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: t.amount > 0 ? "#7EC8A4" : "#e8e4dc" }}>
                        {t.amount > 0 ? "+" : ""}{t.amount < 0 ? `-$${Math.abs(t.amount).toFixed(2)}` : `$${(t.amount || 0).toFixed(2)}`}
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <span className="pill" style={{ 
                          background: (t.status === 'succeeded' || t.status === 'Available' || t.status === 'Completed') ? '#7EC8A420' : '#C8A96E20', 
                          color: (t.status === 'succeeded' || t.status === 'Available' || t.status === 'Completed') ? '#7EC8A4' : '#C8A96E',
                          fontSize: 10
                        }}>
                          {t.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function LeaderboardTab({ RANKS }) {
    // Replace hardcoded leaders with empty array until real data is pulled from backend
    const leaders = [];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Top Ambassadors</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>Global leaderboard based on 30-day team volume.</div>
      </div>

      <div className="metric-box" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-container">
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 500 }}>
            <thead>
              <tr style={{ background: "#161b26", borderBottom: "1px solid #1e2333" }}>
                <th style={{ padding: "16px 20px", fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600, width: 60 }}>Rank</th>
                <th style={{ padding: "16px 20px", fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Ambassador</th>
                <th style={{ padding: "16px 20px", fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Current Level</th>
                <th style={{ padding: "16px 20px", fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600, textAlign: "right" }}>30-Day Volume</th>
              </tr>
            </thead>
            <tbody>
              {leaders.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "32px 20px", textAlign: "center", color: "#6b7280", fontSize: 13 }}>
                    Leaderboard data is currently unavailable.
                  </td>
                </tr>
              ) : (
                leaders.map((l, idx) => {
                  const r = RANKS[l.level - 1] || RANKS[0];
                  return (
                    <tr key={idx} style={{ borderBottom: "1px solid #1e2333", transition: "background .2s" }} className="table-row-hover">
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: idx < 3 ? l.color + "20" : "#1a1f2e", color: idx < 3 ? l.color : "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, border: idx < 3 ? `1px solid ${l.color}50` : "none" }}>
                          #{l.rank}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 600, color: "#e8e4dc" }}>
                        {l.name}
                        {idx === 0 && <Star size={12} color="#FFE082" fill="#FFE082" style={{ marginLeft: 8, verticalAlign: "text-top" }} />}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: r.color }}>{r.badge}</span>
                          <span style={{ fontSize: 13, color: "#a0a8b8" }}>{r.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right", fontSize: 14, fontWeight: 700, color: r.color }}>
                        ${l.volume.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
