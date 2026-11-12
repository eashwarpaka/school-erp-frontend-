import React from 'react';
import { motion } from 'framer-motion';
import { Book, Bus, Home, Calculator, AlertCircle, CheckCircle, TrendingUp, AlertTriangle, Users } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden"
  >
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-semibold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  </motion.div>
);

export const AccountantDashboard = () => (
  <div className="p-4 sm:p-6 md:p-8 space-y-6">
    <div>
      <h1 className="text-2xl font-medium text-slate-800">Accountant Dashboard</h1>
      <p className="text-sm text-slate-500">Financial overview and pending actions.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard title="Daily Collections" value="$4,250" icon={Calculator} color="text-emerald-600" bg="bg-emerald-100" />
      <StatCard title="Overdue Fees" value="12 Accounts" icon={AlertTriangle} color="text-amber-600" bg="bg-amber-100" />
      <StatCard title="Payroll Status" value="Pending Approval" icon={CheckCircle} color="text-blue-600" bg="bg-blue-100" />
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] flex items-center justify-center">
      <p className="text-slate-400">Collections Trend Chart Placeholder</p>
    </div>
  </div>
);

export const LibrarianDashboard = () => (
  <div className="p-4 sm:p-6 md:p-8 space-y-6">
    <div>
      <h1 className="text-2xl font-medium text-slate-800">Librarian Dashboard</h1>
      <p className="text-sm text-slate-500">Library health and circulation.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard title="Books Issued Today" value="45" icon={Book} color="text-indigo-600" bg="bg-indigo-100" />
      <StatCard title="Overdue Books" value="18" icon={AlertCircle} color="text-rose-600" bg="bg-rose-100" />
      <StatCard title="Fine Collections" value="$12.50" icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-100" />
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] flex items-center justify-center">
      <p className="text-slate-400">Circulation Chart Placeholder</p>
    </div>
  </div>
);

export const TransportManagerDashboard = () => (
  <div className="p-4 sm:p-6 md:p-8 space-y-6">
    <div>
      <h1 className="text-2xl font-medium text-slate-800">Transport Manager Dashboard</h1>
      <p className="text-sm text-slate-500">Fleet status and live tracking.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard title="Active Trips" value="8" icon={Bus} color="text-teal-600" bg="bg-teal-100" />
      <StatCard title="On-Time %" value="92%" icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-100" />
      <StatCard title="Maintenance Alerts" value="2" icon={AlertTriangle} color="text-amber-600" bg="bg-amber-100" />
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] flex items-center justify-center">
      <p className="text-slate-400">Live Fleet Map Placeholder (GPS Integration API)</p>
    </div>
  </div>
);

export const HostelWardenDashboard = () => (
  <div className="p-4 sm:p-6 md:p-8 space-y-6">
    <div>
      <h1 className="text-2xl font-medium text-slate-800">Hostel Warden Dashboard</h1>
      <p className="text-sm text-slate-500">Occupancy and daily logs.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard title="Occupancy %" value="88%" icon={Home} color="text-blue-600" bg="bg-blue-100" />
      <StatCard title="Open Incidents" value="1" icon={AlertCircle} color="text-rose-600" bg="bg-rose-100" />
      <StatCard title="Visitors Today" value="14" icon={Users} color="text-indigo-600" bg="bg-indigo-100" />
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] flex items-center justify-center">
      <p className="text-slate-400">Occupancy Gauge Placeholder</p>
    </div>
  </div>
);
