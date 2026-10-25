import React from 'react';
import { RiskLevel } from '../../types/crypto';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showDot = true }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-medium',
  };

  const config: Record<RiskLevel, { bg: string; text: string; border: string; dot: string; label: string }> = {
    Critical: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      dot: 'bg-rose-500 shadow-[0_0_8px_#f43f5e]',
      label: 'Critical',
    },
    High: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      dot: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',
      label: 'High Risk',
    },
    Medium: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-300',
      border: 'border-yellow-500/30',
      dot: 'bg-yellow-400 shadow-[0_0_6px_#facc15]',
      label: 'Medium Risk',
    },
    Low: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-300',
      border: 'border-blue-500/30',
      dot: 'bg-blue-400 shadow-[0_0_6px_#60a5fa]',
      label: 'Low Risk',
    },
    'Quantum-Resistant': {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-500 shadow-[0_0_8px_#10b981]',
      label: 'Quantum-Safe',
    },
  };

  const current = config[level] || config.Low;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wide ${current.bg} ${current.text} ${current.border} ${sizeClasses[size]}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />}
      {current.label}
    </span>
  );
};
