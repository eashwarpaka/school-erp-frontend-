import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, GraduationCap, Coins, BookOpen, TrendingUp, TrendingDown, Bell, X, Brain, Bot, Sparkles, Send } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard = () => {
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [biQuery, setBiQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [biResponse, setBiResponse] = useState<any>(null);

  const stats = [
    { title: 'Total Students', value: '1,245', trend: '+5%', up: true, icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Total Teachers', value: '84', trend: '+2', up: true, icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Revenue (Term 1)', value: '$124,500', trend: '-2%', up: false, icon: Coins, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Active Classes', value: '42', trend: '0', up: true, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const chartData = [
    { name: 'Jan', revenue: 4000, expenses: 2400 },
    { name: 'Feb', revenue: 3000, expenses: 1398 },
    { name: 'Mar', revenue: 5000, expenses: 3800 },
    { name: 'Apr', revenue: 4780, expenses: 3908 },
    { name: 'May', revenue: 5890, expenses: 4800 },
    { name: 'Jun', revenue: 4390, expenses: 3800 },
    { name: 'Jul', revenue: 6490, expenses: 4300 },
  ];

  const activities = [
    { id: 1, title: 'New admission recorded for Grade 10.', time: '2 hours ago', type: 'admission' },
    { id: 2, title: 'Term 1 Fee collected from John Doe.', time: '4 hours ago', type: 'finance' },
    { id: 3, title: 'Teacher Staff Meeting scheduled.', time: '6 hours ago', type: 'system' },
    { id: 4, title: 'Library inventory updated.', time: '8 hours ago', type: 'system' },
  ];

  const allActivities = [
    ...activities,
    { id: 5, title: 'New bus route assigned for downtown.', time: '12 hours ago', type: 'system' },
    { id: 6, title: 'Parent-teacher meeting notes uploaded.', time: '1 day ago', type: 'admission' },
    { id: 7, title: 'Exam schedules for mid-terms released.', time: '2 days ago', type: 'system' },
    { id: 8, title: 'Term 1 Fee collected from Jane Smith.', time: '3 days ago', type: 'finance' },
    { id: 9, title: 'Maintenance request for Lab 3 resolved.', time: '3 days ago', type: 'system' },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-slate-800 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back! Here is what's happening at your school today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm shadow-sm">
            <Bell size={16} />
            Notifications
            <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] ml-1">3</span>
          </button>
        </div>
      </div>

      {/* AI BI Query Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full blur-3xl -mr-20 -mt-20 opacity-40"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 w-full">
            <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-3">
              <Brain className="text-indigo-600" size={20} /> Ask your AI Data Assistant
            </h2>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-indigo-400"><Sparkles size={18} /></div>
              <input
                type="text"
                value={biQuery}
                onChange={e => setBiQuery(e.target.value)}
                placeholder="e.g., 'Show me fee defaults by grade this term' or 'Which class has the lowest attendance?'"
                className="w-full pl-11 pr-32 py-4 bg-white border border-indigo-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 shadow-inner"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && biQuery.trim()) {
                    setIsQuerying(true);
                    setTimeout(() => {
                      setBiResponse({
                        title: 'Fee Defaults by Grade (Term 1)',
                        insight: 'Grade 10 currently has the highest default rate (14%) compared to the school average (5%). It is recommended to send automated SMS reminders to Grade 10 parents.',
                        data: [
                          { label: 'Grade 10', value: '14%' },
                          { label: 'Grade 9', value: '8%' },
                          { label: 'Grade 12', value: '6%' },
                          { label: 'Grade 8', value: '4%' },
                        ]
                      });
                      setIsQuerying(false);
                    }, 1500);
                  }
                }}
              />
              <button
                onClick={() => {
                  if (biQuery.trim()) {
                    setIsQuerying(true);
                    setTimeout(() => {
                      setBiResponse({
                        title: 'Fee Defaults by Grade (Term 1)',
                        insight: 'Grade 10 currently has the highest default rate (14%) compared to the school average (5%). It is recommended to send automated SMS reminders to Grade 10 parents.',
                        data: [
                          { label: 'Grade 10', value: '14%' },
                          { label: 'Grade 9', value: '8%' },
                          { label: 'Grade 12', value: '6%' },
                          { label: 'Grade 8', value: '4%' },
                        ]
                      });
                      setIsQuerying(false);
                    }, 1500);
                  }
                }}
                disabled={!biQuery.trim() || isQuerying}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isQuerying ? <Bot size={16} className="animate-spin" /> : <Send size={16} />}
                {isQuerying ? 'Analyzing...' : 'Ask'}
              </button>
            </div>
            
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2 custom-scrollbar">
              {["What's the overall attendance today?", "Show me top performing teachers", "Compare revenue vs last year"].map(q => (
                <button key={q} onClick={() => setBiQuery(q)} className="text-xs font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
          
          <AnimatePresence>
            {biResponse && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full md:w-96 bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden flex-shrink-0">
                <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-3 flex items-center gap-2">
                  <Bot size={18} className="text-indigo-600" />
                  <span className="text-sm font-bold text-indigo-900">{biResponse.title}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-700 mb-4 leading-relaxed">{biResponse.insight}</p>
                  <div className="space-y-2">
                    {biResponse.data.map((d: any) => (
                      <div key={d.label} className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-medium">{d.label}</span>
                        <span className="font-bold text-slate-800">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-50 to-transparent rounded-bl-full -mr-4 -mt-4`}></div>
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

      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="font-medium text-slate-800">Revenue & Expenses Overview</h3>
            <select className="text-sm px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-medium text-slate-800 mb-6">Recent Activities</h3>
          <div className="space-y-6">
            {activities.map((activity, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={activity.id} 
                className="flex items-start gap-4 relative"
              >
                {idx !== activities.length - 1 && (
                  <div className="absolute top-6 left-2.5 w-[2px] h-full bg-slate-100 -ml-[1px] z-0"></div>
                )}
                <div className={`w-5 h-5 mt-0.5 rounded-full flex-shrink-0 z-10 border-4 border-white shadow-sm ${
                  activity.type === 'admission' ? 'bg-amber-500' : 
                  activity.type === 'finance' ? 'bg-emerald-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{activity.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button 
            onClick={() => setIsActivityModalOpen(true)}
            className="w-full mt-6 py-2.5 text-sm font-medium text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
          >
            View All Activity
          </button>
        </div>
      </div>

      {/* Activity Modal */}
      <AnimatePresence>
        {isActivityModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsActivityModalOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">All Activities</h2>
                  <p className="text-sm text-slate-500 mt-1">Complete log of recent system events</p>
                </div>
                <button
                  onClick={() => setIsActivityModalOpen(false)}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-6">
                  {allActivities.map((activity, idx) => (
                    <div key={activity.id} className="flex items-start gap-4 relative">
                      {idx !== allActivities.length - 1 && (
                        <div className="absolute top-6 left-2.5 w-[2px] h-full bg-slate-100 -ml-[1px] z-0"></div>
                      )}
                      <div className={`w-5 h-5 mt-0.5 rounded-full flex-shrink-0 z-10 border-4 border-white shadow-sm ${
                        activity.type === 'admission' ? 'bg-amber-500' : 
                        activity.type === 'finance' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{activity.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
