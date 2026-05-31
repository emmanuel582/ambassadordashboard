import { CheckCircle, PlayCircle, BookOpen } from 'lucide-react';

export default function Onboarding() {
  const modules = [
    { id: 1, title: "Welcome to RFL", duration: "5 mins", completed: true },
    { id: 2, title: "Understanding Bloodwork", duration: "12 mins", completed: true },
    { id: 3, title: "How to Pitch the Programs", duration: "18 mins", completed: false },
    { id: 4, title: "Using Your Dashboard", duration: "8 mins", completed: false },
    { id: 5, title: "Compliance & Best Practices", duration: "15 mins", completed: false },
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Ambassador Training</h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Complete your training modules to unlock Level 2: Senior Ambassador.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 32 }} className="volume-container">
        {/* Main Video Area */}
        <div>
          <div style={{ background: "#000", border: "1px solid #1e2333", borderRadius: 12, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(45deg, #C8A96E20, transparent)", opacity: 0.5 }} />
            <PlayCircle size={64} color="#C8A96E" style={{ cursor: "pointer", zIndex: 10, transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Module 3: How to Pitch the Programs</h2>
          <p style={{ color: "#a0a8b8", fontSize: 14, lineHeight: 1.6 }}>Learn the core value proposition of Remote Fit Labs. We focus on selling outcomes, not just peptides. This module covers how to position bloodwork as the ultimate anchor for long-term customer retention.</p>
        </div>

        {/* Course Modules Sidebar */}
        <div>
          <div className="metric-box">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <BookOpen size={18} color="#C8A96E" />
              <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>Course Modules</h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {modules.map(m => (
                <div key={m.id} style={{ 
                  display: "flex", alignItems: "center", gap: 12, padding: "12px", 
                  background: m.completed ? "#161b26" : "#0d1117", 
                  border: `1px solid ${m.id === 3 ? "#C8A96E" : "#1e2333"}`, 
                  borderRadius: 8, cursor: "pointer" 
                }}>
                  {m.completed ? <CheckCircle size={18} color="#7EC8A4" /> : <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #4b5563" }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: m.id === 3 ? "#C8A96E" : (m.completed ? "#a0a8b8" : "#e8e4dc"), fontWeight: 500 }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>{m.duration}</div>
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
