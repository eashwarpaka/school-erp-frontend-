import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, Clock, Bus, CheckCircle2, AlertCircle } from 'lucide-react';

export const ParentStudentDashboard = ({ role = 'student' }: { role?: 'parent' | 'student' }) => {
  const stats = [
    { title: "Attendance", value: "94%", detail: "Present 42/45 days", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Next Class", value: "Physics", detail: "In 15 mins (Room 302)", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Pending HW", value: "3 Tasks", detail: "Due this week", icon: BookOpen, color: "text-amber-600", bg: "bg-amber-100" },
    ...(role === 'parent' ? [{ title: "Bus ETA", value: "4:15 PM", detail: "Arriving at Stop A", icon: Bus, color: "text-purple-600", bg: "bg-purple-100" }] : []),
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-slate-800 tracking-tight capitalize">{role} Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Here's your academic overview for today.</p>
        </div>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${role === 'parent' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
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
            <p className="text-sm text-slate-400 mt-4 relative z-10">{stat.detail}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-medium text-slate-700 mb-4">Today's Timetable</h3>
          <ul className="space-y-4">
            {[
              { time: '09:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith', status: 'completed' },
              { time: '10:30 AM', subject: 'Physics', teacher: 'Mrs. Davis', status: 'current' },
              { time: '12:00 PM', subject: 'Chemistry', teacher: 'Dr. Johnson', status: 'upcoming' },
            ].map(item => (
              <li key={item.time} className="flex gap-4 items-start">
                <span className="text-xs font-bold text-slate-400 w-16 pt-1">{item.time}</span>
                <div className={`flex-1 p-3 rounded-xl border ${
                  item.status === 'current' ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'
                }`}>
                  <h4 className={`font-semibold ${item.status === 'current' ? 'text-indigo-800' : 'text-slate-700'}`}>{item.subject}</h4>
                  <p className="text-sm text-slate-500">{item.teacher}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-medium text-slate-700 mb-4">Pending Assignments</h3>
          <ul className="space-y-3">
            {[
              { title: 'Algebra Worksheet', subject: 'Mathematics', due: 'Tomorrow', urgent: true },
              { title: 'Physics Lab Report', subject: 'Physics', due: 'In 3 days', urgent: false },
              { title: 'History Essay', subject: 'History', due: 'Next week', urgent: false },
            ].map(item => (
              <li key={item.title} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {item.urgent ? <AlertCircle size={18} className="text-amber-500" /> : <CheckCircle2 size={18} className="text-slate-300" />}
                  <div>
                    <p className="font-medium text-slate-700 text-sm">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.subject}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-medium ${item.urgent ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                  {item.due}
                </span>
              </li>
            ))}
          </ul>
          
          {role === 'parent' && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-medium text-slate-700 mb-4">Fee Status</h3>
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-800">Term 2 Fee Due</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">$450.00</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                  Pay Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
