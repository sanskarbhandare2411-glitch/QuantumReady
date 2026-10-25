import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface QuantumScoreGaugeProps {
  score: number;
  size?: number;
  showDetails?: boolean;
}

export const QuantumScoreGauge: React.FC<QuantumScoreGaugeProps> = ({
  score,
  size = 180,
  showDetails = true,
}) => {
  // SVG circular progress parameters
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Score mapping (0 to 100)
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let color = '#f43f5e'; // rose
  let glowColor = 'rgba(244, 63, 94, 0.4)';
  let rating = 'Critical Vulnerability';
  let badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  let Icon = ShieldAlert;

  if (clampedScore >= 80) {
    color = '#10b981'; // emerald
    glowColor = 'rgba(16, 185, 129, 0.4)';
    rating = 'Quantum Resilient';
    badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    Icon = ShieldCheck;
  } else if (clampedScore >= 60) {
    color = '#06b6d4'; // cyan
    glowColor = 'rgba(6, 182, 212, 0.4)';
    rating = 'Agile Transitioning';
    badgeBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    Icon = ShieldCheck;
  } else if (clampedScore >= 40) {
    color = '#f59e0b'; // amber
    glowColor = 'rgba(245, 158, 11, 0.4)';
    rating = 'Moderate Exposure';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    Icon = AlertTriangle;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
              filter: `drop-shadow(0 0 8px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
            {clampedScore}
            <span className="text-xl text-slate-400 font-sans">%</span>
          </span>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
            Readiness
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 flex flex-col items-center">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${badgeBg}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{rating}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 text-center max-w-[200px]">
            Target threshold: &gt;85% for post-2028 federal compliance
          </p>
        </div>
      )}
    </div>
  );
};
