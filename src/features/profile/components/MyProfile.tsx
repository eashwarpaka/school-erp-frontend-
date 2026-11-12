import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Briefcase, 
  Shield, Camera, Key, Bell, ShieldCheck, 
  Edit, CheckCircle2, ChevronRight, Settings,
  Eye, EyeOff
} from 'lucide-react';
import { useAuthStore } from '../../auth/store';

export const MyProfile = () => {
  const { session } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header / Cover Section */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="h-32 bg-slate-50 relative border-b border-slate-100">
          {/* Clean background as requested */}
        </div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            <div className="flex items-end gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-slate-900/5 relative z-10">
                  <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-4xl font-bold text-slate-700 overflow-hidden relative">
                    {session?.userScd?.charAt(0)?.toUpperCase() || 'A'}
                    
                    {/* Hover overlay for avatar */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                </div>
                
                {/* Active Indicator */}
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full z-20 shadow-sm" title="Online"></div>
              </div>
              
              <div className="pb-2">
                <h1 className="text-3xl font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  Admin User
                  <CheckCircle2 className="text-blue-500" size={20} />
                </h1>
                <p className="text-slate-500 font-medium flex items-center gap-2">
                  <Briefcase size={16} />
                  System Administrator
                </p>
              </div>
            </div>
            
            <div className="pb-2 flex gap-3">
              <motion.button 
                onClick={() => setIsPasswordModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Key size={16} />
                Change Password
              </motion.button>
              <motion.button 
                onClick={() => setIsEditModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2"
              >
                <Edit size={16} />
                Edit Profile
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
              <User className="text-slate-500" size={20} />
              About Me
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-0.5">Email Address</div>
                  <div className="text-sm font-medium text-slate-900">{session?.userScd || 'admin@school.com'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Phone size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-0.5">Phone Number</div>
                  <div className="text-sm font-medium text-slate-900">+1 (555) 123-4567</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-0.5">Location</div>
                  <div className="text-sm font-medium text-slate-900">New York, USA</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-5 text-slate-900">
              <Shield size={100} />
            </div>
            <div className="relative z-10">
              <h2 className="text-lg font-medium text-slate-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="text-green-500" size={20} />
                Security Status
              </h2>
              <p className="text-slate-500 text-sm mb-4">Your account is fully secured with two-factor authentication.</p>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="text-xs font-medium text-slate-500 text-right">100% Secured</div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Activity & Settings */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-slate-900">Recent Activity</h2>
              <button onClick={() => setIsActivityModalOpen(true)} className="text-sm text-slate-600 font-medium hover:text-slate-900 transition-colors">View All</button>
            </div>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {[
                { title: 'Updated System Settings', time: '2 hours ago', icon: Settings, color: 'text-blue-500', bg: 'bg-blue-50' },
                { title: 'Added new Fee Category', time: '5 hours ago', icon: Briefcase, color: 'text-slate-500', bg: 'bg-slate-100' },
                { title: 'Login from new device', time: '1 day ago', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              ].map((activity, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${activity.bg} text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}>
                    <activity.icon className={activity.color} size={16} />
                  </div>
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-semibold text-slate-900 text-sm">{activity.title}</div>
                      <time className="font-medium text-xs text-slate-500">{activity.time}</time>
                    </div>
                    <div className="text-slate-500 text-xs">Performed by Administrator</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-6">Preferences</h2>
            
            <div className="space-y-4">
              {[
                { title: 'Email Notifications', desc: 'Receive updates about system activities', icon: Bell },
                { title: 'Two-Factor Auth', desc: 'Add an extra layer of security', icon: Shield },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 group-hover:bg-slate-200/50 rounded-xl transition-colors">
                      <pref.icon className="text-slate-600 group-hover:text-slate-900 transition-colors" size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{pref.title}</div>
                      <div className="text-xs text-slate-500">{pref.desc}</div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-medium text-slate-900">Edit Profile</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" defaultValue="Admin User" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" defaultValue={session?.userScd || 'admin@school.com'} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input type="text" defaultValue="+1 (555) 123-4567" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-medium text-slate-900">Change Password</h3>
                <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input type={showCurrentPassword ? "text" : "password"} placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10" />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors">
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                  <div className="relative">
                    <input type={showNewPassword ? "text" : "password"} placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10" />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors">
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                <button onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all">Update Password</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* All Activity Modal */}
      <AnimatePresence>
        {isActivityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="text-lg font-medium text-slate-900">All Recent Activity</h3>
                <button onClick={() => setIsActivityModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-2">
                {[
                  { title: 'Updated System Settings', time: '2 hours ago', icon: Settings, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { title: 'Added new Fee Category', time: '5 hours ago', icon: Briefcase, color: 'text-slate-500', bg: 'bg-slate-100' },
                  { title: 'Login from new device', time: '1 day ago', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  { title: 'Password changed successfully', time: '2 days ago', icon: Key, color: 'text-amber-500', bg: 'bg-amber-50' },
                  { title: 'Updated profile information', time: '3 days ago', icon: Edit, color: 'text-purple-500', bg: 'bg-purple-50' },
                  { title: 'Viewed financial reports', time: '1 week ago', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className={`p-2 rounded-lg ${activity.bg}`}>
                      <activity.icon className={activity.color} size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{activity.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Performed by Administrator • {activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
                <button onClick={() => setIsActivityModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
