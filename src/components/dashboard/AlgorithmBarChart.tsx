import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CryptoFinding } from '../../types/crypto';

interface AlgorithmBarChartProps {
  findings: CryptoFinding[];
}

export const AlgorithmBarChart: React.FC<AlgorithmBarChartProps> = ({ findings }) => {
  const algoCount: Record<string, number> = {};

  findings.forEach((f) => {
    algoCount[f.algorithm] = (algoCount[f.algorithm] || 0) + 1;
  });

  const data = Object.entries(algoCount)
    .map(([algorithm, count]) => ({
      algorithm,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No algorithm data to display.
      </div>
    );
  }

  // Color mapping based on quantum vulnerability
  const getBarColor = (name: string) => {
    if (name.includes('RSA') || name.includes('ECC') || name.includes('ECD') || name.includes('Diffie')) {
      return '#f43f5e'; // Shor vulnerable
    }
    if (name.includes('MD5') || name.includes('SHA-1') || name.includes('DES')) {
      return '#f59e0b'; // Broken classical
    }
    if (name.includes('AES-128')) {
      return '#eab308'; // Grover key halving
    }
    return '#10b981'; // Quantum safe
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis type="number" stroke="#64748b" tickLine={false} fontSize={11} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="algorithm"
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
            fontSize={11}
            width={95}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-cyber-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs font-mono">
                    <p className="font-semibold text-white">{item.algorithm}</p>
                    <p className="text-cyan-400 mt-1">{item.count} instances detected</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.algorithm)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
