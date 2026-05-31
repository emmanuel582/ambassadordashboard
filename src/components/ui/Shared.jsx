import { useState, useEffect, useRef } from "react";

export function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
      else setDisplayed(end);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <span>{prefix}{decimals > 0 ? displayed.toFixed(decimals) : displayed.toLocaleString()}{suffix}</span>;
}

export function ProgressRing({ pct, color, size = 72, stroke = 6 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1a1f2e" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)" }} />
    </svg>
  );
}
