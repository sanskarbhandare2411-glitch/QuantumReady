import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CryptoFinding } from '../../types/crypto';

interface RiskDistributionChartProps {
  findings: CryptoFinding[];
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ findings }) => {
  const counts = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
    'Quantum-Resistant': 0,
  };

  findings.forEach((f) => {
    if (counts[f.riskLevel] !== undefined) {
      counts[f.riskLevel]++;
    }
  });

  const data = [
    { name: 'Critical', value: counts.Critical, color: '#f43f5e' },
    { name: 'High Risk', value: counts.High, color: '#f59e0b' },
    { name: 'Medium Risk', value: counts.Medium, color: '#eab308' },
    { name: 'Low Risk', value: counts.Low, color: '#38bdf8' },
    { name: 'Quantum-Safe', value: counts['Quantum-Resistant'], color: '#10b981' },
  ].filter((item) => item.value > 0);

  if (findings.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No cryptographic findings recorded yet.
      </div>
    );
  }

  return (
    <div className="h-64 flex flex-col justify-between">
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const entry = payload[0];
                  return (
                    <div className="bg-cyber-900 border border-slate-700 p-2 rounded-lg shadow-xl text-xs font-mono">
                      <span className="font-semibold text-white">{entry.name}:</span>{' '}
                      <span className="text-cyan-400 font-bold">{entry.value}</span> findings
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B0F19" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 truncate max-w-[90px]">{item.name}</span>
            </div>
            <span className="font-mono text-slate-400 font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
