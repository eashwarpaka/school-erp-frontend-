import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, Clock, Filter, Search } from 'lucide-react';

export const NotificationsList = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Assignment Posted', description: 'Mathematics Grade 10 - Algebra assignment has been published. Due next Friday.', time: '2 minutes ago', type: 'academic', isRead: false },
    { id: 2, title: 'Fee Payment Received', description: 'Term 1 fee paid for John Doe. Receipt #4892 generated.', time: '1 hour ago', type: 'finance', isRead: false },
    { id: 3, title: 'System Update', description: 'New rankings module is now live! Check out the updated leaderboard.', time: 'Yesterday', type: 'system', isRead: false },
    { id: 4, title: 'Staff Meeting Scheduled', description: 'Monthly all-hands meeting scheduled for tomorrow at 10 AM.', time: '2 days ago', type: 'hr', isRead: true },
    { id: 5, title: 'Term 2 Schedule', description: 'Timetable for Term 2 has been updated and finalized.', time: 'Last week', type: 'academic', isRead: true },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesTab = activeTab === 'all' || !n.isRead;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || n.type === filterType;
    return matchesTab && matchesSearch && matchesFilter;
  });
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-3">
            <Bell className="text-amber-600" />
            All Notifications
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your alerts and system updates</p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors text-sm font-medium"
          >
            <CheckCircle2 size={16} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header/Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'unread' 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'unread' ? 'bg-white/20' : 'bg-red-100 text-red-600'}`}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..." 
                className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`p-2 border rounded-xl transition-colors ${showFilterDropdown || filterType !== 'all' ? 'border-amber-500 text-amber-600 bg-amber-50' : 'border-slate-200 text-slate-500 hover:bg-slate-100'}`}
              >
                <Filter size={18} />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-10 py-2">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase">Filter by Type</div>
                  {['all', 'academic', 'finance', 'system', 'hr'].map(type => (
                    <button
                      key={type}
                      onClick={() => { setFilterType(type); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-sm capitalize hover:bg-slate-50 transition-colors ${filterType === type ? 'text-amber-600 bg-amber-50' : 'text-slate-700'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-slate-100">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                key={notification.id} 
                className={`p-5 flex gap-4 transition-colors ${notification.isRead ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/30 hover:bg-blue-50/50'}`}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${notification.isRead ? 'bg-transparent' : 'bg-amber-500'}`} />
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className={`font-medium ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
                      <Clock size={12} />
                      {notification.time}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                    {notification.description}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 capitalize">
                      {notification.type}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="text-slate-300" size={24} />
              </div>
              <p>No notifications found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
