import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Activity, Ticket, DollarSign, TrendingUp, TrendingDown, Map } from 'lucide-react';

export const SuperAdminDashboard = () => {
  const stats = [
    { title: 'Active Tenants', value: '42', trend: '+3', up: true, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Platform MRR', value: '$24,500', trend: '+12%', up: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'System Uptime', value: '99.99%', trend: '0%', up: true, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Support Tickets', value: '18', trend: '-5', up: true, icon: Ticket, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-slate-800 tracking-tight">Super Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Cross-tenant insights and platform health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-semibold text-slate-800 mt-1">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm relative z-10">
              <span className={`flex items-center font-medium ${stat.up ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.up ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {stat.trend}
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px]">
          <Map size={48} className="text-slate-200 mb-4" />
          <h3 className="text-lg font-medium text-slate-700">Tenant Map</h3>
          <p className="text-sm text-slate-500 text-center max-w-sm mt-2">Geographical distribution of active schools. Map integration pending configuration.</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px]">
          <DollarSign size={48} className="text-slate-200 mb-4" />
          <h3 className="text-lg font-medium text-slate-700">Revenue Chart</h3>
          <p className="text-sm text-slate-500 text-center max-w-sm mt-2">Cross-tenant revenue aggregation pending.</p>
        </div>
      </div>
    </div>
  );
};
