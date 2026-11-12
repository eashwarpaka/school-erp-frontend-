import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, ClipboardList, CheckCircle, Clock, Calendar, FileText, Bell, TrendingUp, Award, MapPin, Plus } from 'lucide-react';

export const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schedule');

  const stats = [
    { label: 'Total Students', value: '145', icon: <Users size={20} />, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5% this month' },
    { label: 'Classes Today', value: '4', icon: <BookOpen size={20} />, color: 'text-amber-600', bg: 'bg-amber-50', trend: '2 remaining' },
    { label: 'Pending Grades', value: '28', icon: <ClipboardList size={20} />, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Needs attention' },
    { label: 'Avg Attendance', value: '94%', icon: <TrendingUp size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Above average' },
  ];

  const classes = [
    { name: 'Mathematics 10-A', topic: 'Quadratic Equations', time: '08:00 AM - 09:30 AM', room: 'Room 101', students: 32, status: 'completed' },
    { name: 'Physics 12-Sci', topic: 'Quantum Mechanics Intro', time: '10:30 AM - 12:00 PM', room: 'Lab 2', students: 28, status: 'ongoing' },
    { name: 'Mathematics 11-B', topic: 'Trigonometry', time: '01:00 PM - 02:30 PM', room: 'Room 105', students: 30, status: 'upcoming' },
    { name: 'Science Club', topic: 'Project Reviews', time: '03:00 PM - 04:30 PM', room: 'Lab 1', students: 15, status: 'upcoming' },
  ];

  const tasks = [
    { title: 'Grade Mid-term Papers', subject: 'Physics 12-Sci', due: 'Today, 5:00 PM', priority: 'High', type: 'grading' },
    { title: 'Submit Attendance Report', subject: 'General', due: 'Completed', priority: 'Normal', type: 'done' },
    { title: 'Prepare Lab Materials', subject: 'Physics 12-Sci', due: 'Tomorrow', priority: 'Medium', type: 'prep' },
    { title: 'Parent-Teacher Meeting', subject: 'Mathematics 10-A', due: 'Friday', priority: 'High', type: 'meeting' },
  ];
  
  const announcements = [
    { title: 'Faculty Meeting Rescheduled', date: 'Oct 24, 2026', sender: 'Principal Office' },
    { title: 'New Lab Equipment Arrival', date: 'Oct 23, 2026', sender: 'Science Dept' },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-slate-800 tracking-tight">Teacher Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back! Here's an overview of your schedule and tasks.</p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => navigate('/academics/timetable')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm">
             <Calendar size={16} />
             View Calendar
           </button>
           <button onClick={() => navigate('/academics/assignments')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-colors text-sm font-medium shadow-sm shadow-amber-500/20">
             <Plus size={16} />
             Create Assignment
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-medium text-slate-800">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-medium text-slate-800 text-lg flex items-center gap-2">
                  <Clock size={18} className="text-amber-500" />
                  Today's Classes
                </h3>
                <button onClick={() => navigate('/academics/timetable')} className="text-sm font-medium text-amber-600 hover:text-amber-700">View All</button>
             </div>
             <div className="p-6 space-y-4">
              {classes.map((c, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className={`relative p-5 rounded-2xl border ${c.status === 'ongoing' ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100 bg-slate-50'} flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-slate-300 transition-colors`}
                >
                  {c.status === 'ongoing' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-2xl"></div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-semibold text-sm ${c.status === 'completed' ? 'bg-slate-200 text-slate-600' : c.status === 'ongoing' ? 'bg-amber-100 text-amber-700' : 'bg-white border border-slate-200 text-slate-700'}`}>
                      <span>{c.time.split(' ')[0]}</span>
                      <span className="text-[10px] uppercase opacity-75">{c.time.split(' ')[1]}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{c.name}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{c.topic}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {c.room}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {c.students} Students</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col md:flex-row gap-2 mt-4 sm:mt-0">
                    <button onClick={() => navigate('/academics/absentees')} className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors shadow-sm">
                      Attendance
                    </button>
                    <button onClick={() => navigate('/academics/assignments')} className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 rounded-lg text-sm font-medium transition-all shadow-sm shadow-amber-500/20">
                      Materials
                    </button>
                  </div>
                </motion.div>
              ))}
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-medium text-slate-800 text-lg flex items-center gap-2">
                  <ClipboardList size={18} className="text-rose-500" />
                  Action Items
                </h3>
             </div>
            <div className="p-6 space-y-4">
              {tasks.map((task, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {task.type === 'done' ? (
                      <CheckCircle size={18} className="text-emerald-500" />
                    ) : task.type === 'grading' ? (
                      <Award size={18} className="text-rose-500" />
                    ) : task.type === 'meeting' ? (
                      <Users size={18} className="text-blue-500" />
                    ) : (
                      <FileText size={18} className="text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${task.type === 'done' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-slate-500">{task.subject}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        task.priority === 'High' ? 'bg-rose-50 text-rose-600' :
                        task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {task.due}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => navigate('/academics/assignments')} className="w-full mt-4 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-amber-600 transition-colors text-sm font-medium">
                + Add Task
              </button>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-medium text-slate-800 text-lg flex items-center gap-2">
                  <Bell size={18} className="text-blue-500" />
                  Announcements
                </h3>
             </div>
             <div className="p-6 space-y-4">
                {announcements.map((announcement, i) => (
                  <div key={i} className="border-l-2 border-blue-500 pl-4 py-1">
                    <p className="text-sm font-medium text-slate-700">{announcement.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{announcement.sender}</span>
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-xs text-slate-400">{announcement.date}</span>
                    </div>
                  </div>
                ))}
                <button onClick={() => navigate('/communication/noticeboard')} className="text-sm font-medium text-amber-600 hover:text-amber-700 mt-2 block">
                  View All Noticeboard →
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
