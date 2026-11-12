import React from 'react';
import { motion } from 'framer-motion';
import { LineChart as LineChartIcon, AlertTriangle, Users, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

export const PrincipalDashboard = () => {
  const stats = [
    { title: 'Academic Trend', value: '+4.2%', trend: '+0.5%', up: true, icon: LineChartIcon, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Attendance Anomalies', value: '12', trend: '+2', up: false, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100' },
    { title: 'Staff Performance', value: '8.4/10', trend: '+0.2', up: true, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Discipline Incidents', value: '3', trend: '-1', up: true, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-slate-800 tracking-tight">Principal Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Academic overview and early intervention flags.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-lg font-medium text-slate-700 w-full text-left mb-4">Class-wise Performance Heatmap</h3>
          <div className="w-full h-48 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
            <span className="text-slate-400">Heatmap Visualization Placeholder</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-medium text-slate-700 mb-4">Attendance Risk List</h3>
          <ul className="space-y-3">
            {[
              { class: 'Grade 10A', risk: 'High', students: 5 },
              { class: 'Grade 8B', risk: 'Medium', students: 3 },
              { class: 'Grade 12C', risk: 'Low', students: 1 },
            ].map(item => (
              <li key={item.class} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">{item.class}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.risk === 'High' ? 'bg-red-100 text-red-700' : 
                  item.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {item.students} at risk
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
