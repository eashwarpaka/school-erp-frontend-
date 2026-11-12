import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, AlertTriangle, XCircle, RefreshCw, Clock } from 'lucide-react';
import { useIDCardStore, CardStatus } from '../store/idCardStore';

const STATUS_CONFIG: Record<CardStatus, { label: string; color: string; bg: string; icon: React.FC<any>; ring: string }> = {
  Active:   { label: 'Active Cards',   color: '#16a34a', bg: 'from-emerald-50 to-green-50',   icon: ShieldCheck,  ring: 'ring-emerald-200' },
  Expired:  { label: 'Expired',        color: '#dc2626', bg: 'from-red-50 to-rose-50',         icon: Clock,        ring: 'ring-red-200' },
  Lost:     { label: 'Lost / Stolen',  color: '#d97706', bg: 'from-amber-50 to-yellow-50',     icon: AlertTriangle,ring: 'ring-amber-200' },
  Revoked:  { label: 'Revoked',        color: '#7c3aed', bg: 'from-purple-50 to-violet-50',    icon: XCircle,      ring: 'ring-purple-200' },
  Reissued: { label: 'Reissued',       color: '#0284c7', bg: 'from-sky-50 to-blue-50',         icon: RefreshCw,    ring: 'ring-sky-200' },
};

export const CardStatsOverview: React.FC = () => {
  const { issuedCards, printBatches, templates } = useIDCardStore();

  const totalIssued = issuedCards.length;
  const activeCount = issuedCards.filter(c => c.status === 'Active').length;
  const expiredCount = issuedCards.filter(c => c.status === 'Expired').length;
  const lostCount = issuedCards.filter(c => c.status === 'Lost').length;
  const revokedCount = issuedCards.filter(c => c.status === 'Revoked').length;
  const reissuedCount = issuedCards.filter(c => c.status === 'Reissued').length;
  const totalBatches = printBatches.length;
  const publishedTemplates = templates.filter(t => t.status === 'Published').length;
  const totalReprints = issuedCards.reduce((acc, c) => acc + c.reprints, 0);

  const statusCounts: Record<CardStatus, number> = {
    Active: activeCount,
    Expired: expiredCount,
    Lost: lostCount,
    Revoked: revokedCount,
    Reissued: reissuedCount,
  };

  return (
    <div className="space-y-4">
      {/* Top summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Issued', value: totalIssued, icon: CreditCard, color: '#1e3a5f', bg: 'bg-gradient-to-br from-slate-700 to-slate-900', textColor: 'text-white' },
          { label: 'Print Batches', value: totalBatches, icon: CreditCard, color: '#0284c7', bg: 'bg-gradient-to-br from-blue-500 to-blue-700', textColor: 'text-white' },
          { label: 'Active Templates', value: publishedTemplates, icon: CreditCard, color: '#16a34a', bg: 'bg-gradient-to-br from-emerald-500 to-emerald-700', textColor: 'text-white' },
          { label: 'Total Reprints', value: totalReprints, icon: RefreshCw, color: '#d97706', bg: 'bg-gradient-to-br from-amber-500 to-orange-600', textColor: 'text-white' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`${stat.bg} rounded-2xl p-4 shadow-sm`}
          >
            <div className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">{stat.label}</div>
            <div className="text-3xl font-black text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(Object.entries(STATUS_CONFIG) as [CardStatus, typeof STATUS_CONFIG[CardStatus]][]).map(([status, cfg], i) => {
          const count = statusCounts[status];
          const pct = totalIssued > 0 ? Math.round((count / totalIssued) * 100) : 0;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className={`bg-gradient-to-br ${cfg.bg} rounded-2xl p-4 ring-1 ${cfg.ring} shadow-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={18} style={{ color: cfg.color }} />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${cfg.color}18`, color: cfg.color }}>
                  {pct}%
                </span>
              </div>
              <div className="text-2xl font-black" style={{ color: cfg.color }}>{count}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{cfg.label}</div>

              {/* Mini bar */}
              <div className="mt-3 h-1.5 bg-white/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: cfg.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
