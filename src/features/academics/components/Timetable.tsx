import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, Search, Filter, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, X, ChevronDown, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAcademicStore } from '../../admin/store/academicStore';

export const Timetable = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  
  const sections = useAcademicStore(s => s.sections);
  const subjects = useAcademicStore(s => s.subjects);
  const periods = useAcademicStore(s => s.periods);
  const timetable = useAcademicStore(s => s.timetable);
  const addTimetableEntry = useAcademicStore(s => s.addTimetableEntry);
  const deleteTimetableEntry = useAcademicStore(s => s.deleteTimetableEntry);

  const [selectedSection, setSelectedSection] = useState(sections[0]?.id || '');

  const selectedSectionName = sections.find(s => s.id === selectedSection)?.name || 'Unknown';

  const [newEntry, setNewEntry] = useState<{
    periodId: string;
    dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    subjectId: string;
    teacherId: string;
    teacherName: string;
    roomId: string;
  }>({
    periodId: '',
    dayOfWeek: 'Monday',
    subjectId: '',
    teacherId: '',
    teacherName: '',
    roomId: ''
  });

  const getDailySchedule = (date: Date, currentSectionId: string) => {
    const dayIndex = date.getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[dayIndex];
    
    if (dayIndex === 0) { // Sunday
      return [
        { id: '1', time: 'All Day', subject: 'Leave - Weekend', teacher: '-', room: '-', theme: 'slate', isBreak: true }
      ];
    }

    const dayEntries = timetable.filter(t => t.sectionId === currentSectionId && t.dayOfWeek === currentDay);
    
    if (dayEntries.length === 0) {
      return [
        { id: '1', time: 'No Classes', subject: 'Free Day', teacher: '-', room: '-', theme: 'slate', isBreak: true }
      ];
    }

    return dayEntries.map((entry, idx) => {
      const period = periods.find(p => p.id === entry.periodId);
      const subject = subjects.find(s => s.id === entry.subjectId);
      const themes = ['blue', 'emerald', 'rose', 'amber', 'violet', 'indigo'];
      return {
        id: entry.id,
        time: period ? `${period.startTime} - ${period.endTime}` : 'Unknown Time',
        subject: subject?.name || 'Unknown Subject',
        teacher: entry.teacherName || entry.teacherId,
        room: entry.roomId,
        theme: themes[idx % themes.length],
        isBreak: false
      };
    }).sort((a, b) => a.time.localeCompare(b.time));
  };
  const schedule = getDailySchedule(currentDate, selectedSection);

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setCurrentDate(new Date(e.target.value));
    }
  };

  const formattedDateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  const getThemeClasses = (theme: string, isBreak: boolean) => {
    if (isBreak) return 'bg-slate-50 border border-dashed border-slate-300';
    
    const themes: Record<string, string> = {
      blue: 'bg-gradient-to-br from-blue-50/50 to-white border-l-4 border-l-blue-500 border-y border-y-blue-200 border-r border-r-blue-200 hover:shadow-md hover:shadow-blue-500/10',
      indigo: 'bg-gradient-to-br from-indigo-50/50 to-white border-l-4 border-l-indigo-500 border-y border-y-indigo-200 border-r border-r-indigo-200 hover:shadow-md hover:shadow-indigo-500/10',
      violet: 'bg-gradient-to-br from-violet-50/50 to-white border-l-4 border-l-violet-500 border-y border-y-violet-200 border-r border-r-violet-200 hover:shadow-md hover:shadow-violet-500/10',
      rose: 'bg-gradient-to-br from-rose-50/50 to-white border-l-4 border-l-rose-500 border-y border-y-rose-200 border-r border-r-rose-200 hover:shadow-md hover:shadow-rose-500/10',
      emerald: 'bg-gradient-to-br from-emerald-50/50 to-white border-l-4 border-l-emerald-500 border-y border-y-emerald-200 border-r border-r-emerald-200 hover:shadow-md hover:shadow-emerald-500/10',
      amber: 'bg-gradient-to-br from-amber-50/50 to-white border-l-4 border-l-amber-500 border-y border-y-amber-200 border-r border-r-amber-200 hover:shadow-md hover:shadow-amber-500/10',
      slate: 'bg-slate-50 border border-dashed border-slate-300',
    };
    return themes[theme] || 'bg-white border-slate-200';
  };

  const getDotClasses = (theme: string, isBreak: boolean) => {
    if (isBreak) return 'bg-slate-300 border-white shadow-none';
    
    const themes: Record<string, string> = {
      blue: 'bg-blue-500 border-blue-100 shadow-blue-500/40',
      indigo: 'bg-indigo-500 border-indigo-100 shadow-indigo-500/40',
      violet: 'bg-violet-500 border-violet-100 shadow-violet-500/40',
      rose: 'bg-rose-500 border-rose-100 shadow-rose-500/40',
      emerald: 'bg-emerald-500 border-emerald-100 shadow-emerald-500/40',
      amber: 'bg-amber-500 border-amber-100 shadow-amber-500/40',
      slate: 'bg-slate-300 border-white shadow-none',
    };
    return themes[theme] || 'bg-amber-500 border-white';
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-slate-800 tracking-tight">Class Timetable</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and view daily class schedules.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm shadow-sm"
            >
              <Filter size={16} />
              Section: {selectedSectionName}
              <ChevronDown size={14} className="text-slate-400 ml-1" />
            </button>
            
            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 max-h-64 overflow-y-auto custom-scrollbar">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setSelectedSection(sec.id);
                      setIsFilterDropdownOpen(false);
                      toast.success(`Filtered for ${sec.name}`);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                      selectedSection === sec.id ? 'text-amber-600 font-medium bg-amber-50/50' : 'text-slate-600'
                    }`}
                  >
                    {sec.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all font-medium text-sm shadow-sm shadow-amber-500/20"
          >
            <Plus size={16} />
            Add Schedule
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
              <button onClick={handlePrevDay} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <div className="relative group">
                <span className="text-sm font-semibold text-slate-700 px-3 min-w-[140px] text-center inline-block cursor-pointer group-hover:text-amber-600 transition-colors">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
                <input 
                  type="date" 
                  value={formattedDateString}
                  onChange={handleDateChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
              <button onClick={handleNextDay} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200/50">
                <CalendarIcon size={18} />
              </button>
              <input 
                type="date" 
                value={formattedDateString}
                onChange={handleDateChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="p-6 relative">
          <div className="absolute left-[156px] top-8 bottom-8 w-1 bg-gradient-to-b from-blue-500/20 via-violet-500/20 to-rose-500/20 hidden sm:block rounded-full -translate-x-1/2"></div>
          <div className="space-y-6">
            {schedule.map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                key={idx} 
                className="flex items-start relative group"
              >
                {/* Time */}
                <div className="w-28 flex-shrink-0 text-right pt-[22px] hidden sm:block pr-4">
                  <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">{item.time.split('-')[0].trim()}</span>
                </div>
                
                {/* Timeline Dot */}
                <div className="w-10 flex-shrink-0 hidden sm:flex justify-center pt-[24px] relative z-10">
                  <div className={`w-4 h-4 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${getDotClasses(item.theme, item.subject === 'Break')}`}></div>
                </div>
                
                {/* Card */}
                <div className={`flex-1 ml-0 sm:ml-4 rounded-2xl p-5 transition-all duration-300 ${getThemeClasses(item.theme, item.isBreak)}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-bold text-amber-600 sm:hidden">{item.time}</span>
                        <h3 className={`text-lg font-bold ${(item.isBreak) ? 'text-slate-500' : 'text-slate-800'}`}>
                          {item.subject}
                        </h3>
                      </div>
                      {!item.isBreak && (
                        <div className="flex items-center gap-4 text-sm text-slate-600 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Users size={14} className="text-slate-400" />
                            {item.teacher}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} className="text-slate-400" />
                            {item.room}
                          </span>
                        </div>
                      )}
                    </div>
                    {!item.isBreak && (
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this schedule?')) {
                            deleteTimetableEntry(item.id);
                            toast.success('Schedule deleted');
                          }
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-200"
                        title="Delete Schedule"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
          >
            <form onSubmit={(e) => {
              e.preventDefault();
              addTimetableEntry({
                ...newEntry,
                id: `TT-${Date.now()}`,
                sectionId: selectedSection,
              });
              toast.success('Schedule added successfully!');
              setIsAddModalOpen(false);
            }}>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Add New Schedule</h2>
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Day of Week</label>
                    <select
                      required
                      value={newEntry.dayOfWeek}
                      onChange={e => setNewEntry({...newEntry, dayOfWeek: e.target.value as any})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white"
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Period</label>
                    <select
                      required
                      value={newEntry.periodId}
                      onChange={e => setNewEntry({...newEntry, periodId: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white"
                    >
                      <option value="">Select Period</option>
                      {periods.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.startTime}-{p.endTime})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <select
                    required
                    value={newEntry.subjectId}
                    onChange={e => setNewEntry({...newEntry, subjectId: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Teacher</label>
                    <input 
                      required
                      type="text" 
                      value={newEntry.teacherName}
                      onChange={e => setNewEntry({...newEntry, teacherName: e.target.value})}
                      placeholder="e.g. Mr. Smith"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
                    <input 
                      required
                      type="text" 
                      value={newEntry.roomId}
                      onChange={e => setNewEntry({...newEntry, roomId: e.target.value})}
                      placeholder="e.g. Room 101"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-sm shadow-amber-500/20 flex items-center gap-2"
                >
                  <Check size={16} />
                  Save Schedule
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
