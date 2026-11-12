import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../lib/authContext';
import { ROLE_LABELS } from '../../../lib/permissions';
import { ROLE_DASHBOARD_CONFIG, type RoleDashboardConfig } from '../data/roleDashboardConfig';
import {
  TrendingUp, TrendingDown, ChevronRight, ArrowUpRight, Zap,
  Clock, CalendarDays, Activity,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';

// ── Accent colour maps ─────────────────────────────────────────
const ACCENT: Record<string, { gradient: string; gradientAlt: string; badge: string; btn: string; text: string; light: string; chartA: string; chartB: string; ring: string }> = {
  indigo: {
    gradient: 'from-indigo-600 via-indigo-700 to-purple-800',
    gradientAlt: 'from-indigo-500/10 to-purple-500/5',
    badge:    'bg-indigo-100 text-indigo-700',
    btn:      'bg-indigo-600 hover:bg-indigo-700 text-white',
    text:     'text-indigo-600',
    light:    'bg-indigo-50 border-indigo-100',
    chartA:   '#6366f1',
    chartB:   '#a5b4fc',
    ring:     'ring-indigo-200',
  },
  amber: {
    gradient: 'from-amber-500 via-amber-600 to-orange-700',
    gradientAlt: 'from-amber-500/10 to-orange-500/5',
    badge:    'bg-amber-100 text-amber-700',
    btn:      'bg-amber-500 hover:bg-amber-600 text-white',
    text:     'text-amber-600',
    light:    'bg-amber-50 border-amber-100',
    chartA:   '#f59e0b',
    chartB:   '#93c5fd',
    ring:     'ring-amber-200',
  },
  emerald: {
    gradient: 'from-emerald-500 via-emerald-600 to-teal-700',
    gradientAlt: 'from-emerald-500/10 to-teal-500/5',
    badge:    'bg-emerald-100 text-emerald-700',
    btn:      'bg-emerald-600 hover:bg-emerald-700 text-white',
    text:     'text-emerald-600',
    light:    'bg-emerald-50 border-emerald-100',
    chartA:   '#10b981',
    chartB:   '#f87171',
    ring:     'ring-emerald-200',
  },
  blue: {
    gradient: 'from-blue-500 via-blue-600 to-indigo-700',
    gradientAlt: 'from-blue-500/10 to-indigo-500/5',
    badge:    'bg-blue-100 text-blue-700',
    btn:      'bg-blue-600 hover:bg-blue-700 text-white',
    text:     'text-blue-600',
    light:    'bg-blue-50 border-blue-100',
    chartA:   '#3b82f6',
    chartB:   '#34d399',
    ring:     'ring-blue-200',
  },
  rose: {
    gradient: 'from-rose-500 via-rose-600 to-pink-700',
    gradientAlt: 'from-rose-500/10 to-pink-500/5',
    badge:    'bg-rose-100 text-rose-700',
    btn:      'bg-rose-600 hover:bg-rose-700 text-white',
    text:     'text-rose-600',
    light:    'bg-rose-50 border-rose-100',
    chartA:   '#f43f5e',
    chartB:   '#fbbf24',
    ring:     'ring-rose-200',
  },
  orange: {
    gradient: 'from-orange-500 via-orange-600 to-red-700',
    gradientAlt: 'from-orange-500/10 to-red-500/5',
    badge:    'bg-orange-100 text-orange-700',
    btn:      'bg-orange-600 hover:bg-orange-700 text-white',
    text:     'text-orange-600',
    light:    'bg-orange-50 border-orange-100',
    chartA:   '#f97316',
    chartB:   '#60a5fa',
    ring:     'ring-orange-200',
  },
  teal: {
    gradient: 'from-teal-500 via-teal-600 to-cyan-700',
    gradientAlt: 'from-teal-500/10 to-cyan-500/5',
    badge:    'bg-teal-100 text-teal-700',
    btn:      'bg-teal-600 hover:bg-teal-700 text-white',
    text:     'text-teal-600',
    light:    'bg-teal-50 border-teal-100',
    chartA:   '#14b8a6',
    chartB:   '#fbbf24',
    ring:     'ring-teal-200',
  },
  violet: {
    gradient: 'from-violet-500 via-violet-600 to-purple-800',
    gradientAlt: 'from-violet-500/10 to-purple-500/5',
    badge:    'bg-violet-100 text-violet-700',
    btn:      'bg-violet-600 hover:bg-violet-700 text-white',
    text:     'text-violet-600',
    light:    'bg-violet-50 border-violet-100',
    chartA:   '#8b5cf6',
    chartB:   '#34d399',
    ring:     'ring-violet-200',
  },
};

const ACTIVITY_COLORS: Record<string, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  info:    'bg-blue-500',
  danger:  'bg-red-500',
};

// ── Live Clock Hook ───────────────────────────────────────────
function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  return now;
}

// ── KPI Card ──────────────────────────────────────────────────
function KpiCard({ kpi, accent, index }: { kpi: RoleDashboardConfig['kpis'][0]; accent: typeof ACCENT[string]; index: number }) {
  const Icon = kpi.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 relative overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Corner accent blob */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-15 ${kpi.iconBg} blur-sm`} />
      <div className={`absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-10 ${kpi.iconBg}`} />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{kpi.title}</p>
          <h3 className="text-2xl font-bold text-slate-800 leading-tight truncate">{kpi.value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 ${kpi.iconBg} ${kpi.iconColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={22} />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3.5 relative z-10">
        {kpi.trendUp
          ? <TrendingUp size={14} className="text-emerald-500 flex-shrink-0" />
          : <TrendingDown size={14} className="text-red-500 flex-shrink-0" />
        }
        <span className={`text-xs font-medium ${kpi.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
          {kpi.trend}
        </span>
      </div>
    </motion.div>
  );
}

// ── Chart Section ────────────────────────────────────────────
function ChartSection({ cfg, accent }: { cfg: RoleDashboardConfig; accent: typeof ACCENT[string] }) {
  const useBar = cfg.role === 'teacher' || cfg.role === 'student';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-800 text-base">{cfg.chartTitle}</h3>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${accent.badge}`}>
          <Activity size={10} className="inline mr-1" />
          Live data
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {useBar ? (
            <BarChart data={cfg.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barCategoryGap="30%">
              <defs>
                <linearGradient id={`grad-a-${cfg.role}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={accent.chartA} stopOpacity={0.9} />
                  <stop offset="95%" stopColor={accent.chartA} stopOpacity={0.6} />
                </linearGradient>
                {cfg.chartSecondaryLabel && (
                  <linearGradient id={`grad-b-${cfg.role}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={accent.chartB} stopOpacity={0.9} />
                    <stop offset="95%" stopColor={accent.chartB} stopOpacity={0.6} />
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                cursor={{ fill: 'rgba(148,163,184,0.08)' }}
              />
              {cfg.chartSecondaryLabel && <Legend wrapperStyle={{ fontSize: 12 }} />}
              <Bar dataKey="primary" name={cfg.chartPrimaryLabel} fill={`url(#grad-a-${cfg.role})`} radius={[6, 6, 0, 0]} />
              {cfg.chartSecondaryLabel && (
                <Bar dataKey="secondary" name={cfg.chartSecondaryLabel} fill={`url(#grad-b-${cfg.role})`} radius={[6, 6, 0, 0]} />
              )}
            </BarChart>
          ) : (
            <AreaChart data={cfg.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`area-a-${cfg.role}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={accent.chartA} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={accent.chartA} stopOpacity={0} />
                </linearGradient>
                {cfg.chartSecondaryLabel && (
                  <linearGradient id={`area-b-${cfg.role}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={accent.chartB} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={accent.chartB} stopOpacity={0} />
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              {cfg.chartSecondaryLabel && <Legend wrapperStyle={{ fontSize: 12 }} />}
              <Area
                type="monotone"
                dataKey="primary"
                name={cfg.chartPrimaryLabel}
                stroke={accent.chartA}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#area-a-${cfg.role})`}
                dot={false}
                activeDot={{ r: 5, fill: accent.chartA }}
              />
              {cfg.chartSecondaryLabel && (
                <Area
                  type="monotone"
                  dataKey="secondary"
                  name={cfg.chartSecondaryLabel}
                  stroke={accent.chartB}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#area-b-${cfg.role})`}
                  dot={false}
                  activeDot={{ r: 5, fill: accent.chartB }}
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// ── Summary Stats Donut ──────────────────────────────────────
function SummaryDonut({ cfg, accent }: { cfg: RoleDashboardConfig; accent: typeof ACCENT[string] }) {
  const total = cfg.summaryStats.reduce((sum, s) => sum + s.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full flex flex-col"
    >
      <h3 className="font-semibold text-slate-800 text-base mb-4">Distribution Overview</h3>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-44 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={cfg.summaryStats}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                animationDuration={800}
                animationBegin={300}
              >
                {cfg.summaryStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(value: any, name: any) => [`${value} (${Math.round((Number(value) / total) * 100)}%)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {cfg.summaryStats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-50">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: stat.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 truncate">{stat.label}</p>
              <p className="text-sm font-bold text-slate-700">{stat.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Today's Schedule ─────────────────────────────────────────
function TodaySchedule({ cfg, accent }: { cfg: RoleDashboardConfig; accent: typeof ACCENT[string] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full flex flex-col"
    >
      <div className="flex items-center gap-2 mb-5">
        <CalendarDays size={16} className={accent.text} />
        <h3 className="font-semibold text-slate-800 text-base">Today's Schedule</h3>
      </div>

      <div className="flex-1 space-y-0">
        {cfg.todaySchedule.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 + 0.4 }}
            className="flex items-start gap-3 relative py-3 group"
          >
            {/* Timeline line */}
            {idx < cfg.todaySchedule.length - 1 && (
              <div className="absolute top-10 left-[19px] w-[2px] h-[calc(100%-16px)] bg-slate-100" />
            )}
            {/* Timeline dot */}
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 z-10 ring-[3px] ring-white ${item.color}`} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Clock size={10} />
                  {item.time}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">{item.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Activity Feed ─────────────────────────────────────────────
function ActivityFeed({ cfg }: { cfg: RoleDashboardConfig }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full flex flex-col"
    >
      <h3 className="font-semibold text-slate-800 text-base mb-5">Recent Activity</h3>
      <div className="flex-1 space-y-4 overflow-hidden">
        {cfg.activities.map((act, idx) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06 + 0.3 }}
            className="flex items-start gap-3 relative"
          >
            {idx < cfg.activities.length - 1 && (
              <div className="absolute top-5 left-[7px] w-[2px] h-full bg-slate-100" />
            )}
            <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 mt-0.5 z-10 ring-2 ring-white ${ACTIVITY_COLORS[act.type]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 leading-snug">{act.text}</p>
              <p className="text-xs text-slate-400 mt-1">{act.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Quick Actions ─────────────────────────────────────────────
function QuickActions({ cfg, accent }: { cfg: RoleDashboardConfig; accent: typeof ACCENT[string] }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className={accent.text} />
        <h3 className="font-semibold text-slate-800 text-base">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {cfg.quickActions.map((qa, i) => {
          const Icon = qa.icon;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 + 0.4 }}
              onClick={() => navigate(qa.path)}
              className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all group
                ${qa.variant === 'primary'
                  ? `${accent.btn} shadow-sm hover:shadow-md hover:-translate-y-0.5`
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100 hover:-translate-y-0.5'
                }`}
            >
              <Icon size={15} className="flex-shrink-0" />
              <span className="truncate text-left flex-1">{qa.label}</span>
              <ChevronRight size={13} className="flex-shrink-0 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────
export const RoleDashboard = () => {
  const { activeRole } = useAuth();
  const navigate = useNavigate();
  const cfg = ROLE_DASHBOARD_CONFIG[activeRole];
  const ac = ACCENT[cfg.accentColor] ?? ACCENT.amber;
  const now = useLiveClock();

  // Greeting based on time of day
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeRole}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="p-4 sm:p-6 md:p-8 w-full space-y-6"
      >
        {/* ── Hero Header ─────────────────────────────────────── */}
        <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${ac.gradient} p-6 sm:p-8 shadow-xl`}>
          {/* Decorative elements */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full blur-xl" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">{greeting} 👋</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {cfg.dashboardTitle}
              </h1>
              <p className="text-white/70 text-sm mt-1.5 max-w-xl">{cfg.subtitle}</p>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-right">
                <p className="text-white/60 text-xs font-medium">Viewing as</p>
                <p className="text-white font-bold text-base">{ROLE_LABELS[activeRole]}</p>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
                <CalendarDays size={12} />
                <span>{dateStr}</span>
                <span className="text-white/40">•</span>
                <Clock size={12} />
                <span>{timeStr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cfg.kpis.map((kpi, i) => (
            <KpiCard key={kpi.title} kpi={kpi} accent={ac} index={i} />
          ))}
        </div>

        {/* ── Chart + Donut ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartSection cfg={cfg} accent={ac} />
          </div>
          <div className="lg:col-span-1">
            <SummaryDonut cfg={cfg} accent={ac} />
          </div>
        </div>

        {/* ── Schedule + Activity + Quick Actions ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TodaySchedule cfg={cfg} accent={ac} />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed cfg={cfg} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <QuickActions cfg={cfg} accent={ac} />

            {/* ── Role Insight Badge ─────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className={`rounded-2xl border ${ac.light} p-5 bg-gradient-to-br ${ac.gradientAlt}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <ArrowUpRight size={14} className={ac.text} />
                <h3 className="font-semibold text-slate-800 text-sm">Role Permissions</h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                As <span className="font-semibold text-slate-700">{ROLE_LABELS[activeRole]}</span>, 
                you have access to:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cfg.quickActions.map(qa => (
                  <button
                    key={qa.path}
                    onClick={() => navigate(qa.path)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${ac.badge} hover:opacity-80 transition-opacity`}
                  >
                    {qa.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
