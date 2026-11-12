import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, AlertTriangle, 
  Download, Filter, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';

const attendanceData = [
  { month: 'Jan', percentage: 92 },
  { month: 'Feb', percentage: 95 },
  { month: 'Mar', percentage: 88 },
  { month: 'Apr', percentage: 91 },
  { month: 'May', percentage: 96 },
  { month: 'Jun', percentage: 94 },
];

const gradeData = [
  { grade: 'A+', count: 45 },
  { grade: 'A', count: 85 },
  { grade: 'B', count: 120 },
  { grade: 'C', count: 50 },
  { grade: 'D', count: 15 },
  { grade: 'F', count: 5 },
];

const COLORS = ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#ef4444', '#b91c1c'];

const alerts = [
  { id: 1, type: 'attendance', student: 'Rohan Singh', class: '10-A', issue: 'Attendance dropped to 68%', date: 'Today' },
  { id: 2, type: 'academic', student: 'Ananya Gupta', class: '9-B', issue: 'Failed in Mathematics (Term 1)', date: 'Yesterday' },
  { id: 3, type: 'attendance', student: 'Kabir Das', class: '11-Sci', issue: 'Absent for 5 consecutive days', date: '2 days ago' },
];

export const Analytics = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Analytics & Alerts</h1>
          <p className="text-slate-500 mt-1">Monitor attendance, grade trends, and academic health.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={18} /> Filter
          </button>
          <button className="flex-1 md:flex-none inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-amber-500 rounded-xl text-sm font-semibold text-white hover:bg-amber-600 transition-colors shadow-sm shadow-amber-500/20">
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Avg Attendance</p>
              <h3 className="text-2xl font-semibold text-slate-800">92.4%</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
            <TrendingUp size={14} className="mr-1" /> +2.1% this month
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Overall Pass %</p>
              <h3 className="text-2xl font-semibold text-slate-800">94.8%</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-amber-600 bg-amber-50 w-fit px-2 py-0.5 rounded-full">
            <TrendingUp size={14} className="mr-1" /> +1.4% from last term
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Top Subject</p>
              <h3 className="text-xl font-semibold text-slate-800">Mathematics</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-slate-500">
            Avg Score: 88.5%
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-red-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Active Alerts</p>
              <h3 className="text-2xl font-semibold text-slate-800">12</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-red-600">
            Requires immediate attention
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attendance Trend */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Attendance Trends</h3>
            <div className="flex items-center text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 cursor-pointer">
              Last 6 Months <ChevronDown size={16} className="ml-2" />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[80, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="percentage" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Grade Distribution */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Grade Distribution</h3>
            <div className="flex items-center text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 cursor-pointer">
              Term 1 <ChevronDown size={16} className="ml-2" />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Alerts Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" /> Need Attention
          </h3>
          <button className="text-sm font-semibold text-amber-600 hover:text-amber-700">View All</button>
        </div>
        <div className="divide-y divide-slate-100">
          {alerts.map(alert => (
            <div key={alert.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-start gap-4">
              <div className={`mt-1 w-2 h-2 rounded-full ${alert.type === 'attendance' ? 'bg-amber-500' : 'bg-red-500'}`} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-slate-800">{alert.student} <span className="text-slate-400 font-normal text-sm ml-2">({alert.class})</span></h4>
                  <span className="text-xs font-medium text-slate-400">{alert.date}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{alert.issue}</p>
              </div>
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                Intervene
              </button>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
};
