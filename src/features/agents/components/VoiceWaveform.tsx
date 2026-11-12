import React from 'react';
import { motion } from 'framer-motion';

interface VoiceWaveformProps {
  levels?: number[];
  isActive?: boolean;
  color?: 'cyan' | 'emerald' | 'purple' | 'amber' | 'indigo';
  height?: number;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  levels = [15, 30, 65, 80, 95, 70, 50, 85, 90, 60, 40, 75, 55, 30, 20, 10],
  isActive = false,
  color = 'indigo',
  height = 36,
}) => {
  const colorMap = {
    cyan: 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]',
    emerald: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]',
    purple: 'bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.3)]',
    amber: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]',
    indigo: 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)]',
  };

  return (
    <div className="flex items-center gap-[3px] px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
      {levels.map((lvl, idx) => {
        const barHeight = isActive ? Math.max(15, (lvl / 100) * height) : 6;
        return (
          <motion.div
            key={idx}
            animate={{
              height: barHeight,
              opacity: isActive ? 1 : 0.4,
            }}
            transition={{
              duration: 0.15,
              repeat: isActive ? Infinity : 0,
              repeatType: 'reverse',
              delay: idx * 0.02,
            }}
            className={`w-1 rounded-full ${colorMap[color]} transition-all duration-150`}
            style={{ minHeight: '4px' }}
          />
        );
      })}
    </div>
  );
};
