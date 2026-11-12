import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Calendar, Filter, Phone, 
  Mail, MessageSquare, AlertCircle, Check, 
  UserMinus, UserX, ArrowUpDown, ChevronLeft, ChevronRight, SearchX,
  X, Send, PhoneCall, PhoneOff
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

import { useAcademicStore } from '../../admin/store/academicStore';

export const Absentees = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'mark'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [callModalOpen, setCallModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Global store
  const attendances = useAcademicStore(s => s.attendances);
  const enrollments = useAcademicStore(s => s.enrollments);
  const timetable = useAcademicStore(s => s.timetable);
  const sections = useAcademicStore(s => s.sections);
  const periods = useAcademicStore(s => s.periods);
  const saveAttendance = useAcademicStore(s => s.saveAttendance);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Convert attendances to absentees list
  const absenteesList = attendances
    .filter(a => a.status === 'Absent' || a.status === 'Late')
    .map(a => {
      const student = enrollments.find(e => e.studentId === a.studentId);
      const section = sections.find(s => s.id === student?.sectionId);
      return {
        id: a.id,
        name: student?.studentName || 'Unknown',
        class: section?.name || 'Unknown',
        date: a.date,
        reason: a.remarks || 'Unknown',
        status: a.status === 'Late' ? 'Excused' : 'Unexcused',
        contact: 'Parent: 555-0000',
        studentId: a.studentId,
        timetableEntryId: a.timetableEntryId
      };
    });

  const filteredAbsentees = absenteesList.filter(absentee => {
    const matchesSearch = absentee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          absentee.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || absentee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedAbsentees = [...filteredAbsentees].sort((a: any, b: any) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedAbsentees.length / itemsPerPage) || 1;
  const paginatedAbsentees = sortedAbsentees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Mark Attendance State
  const [markDate, setMarkDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimetableId, setSelectedTimetableId] = useState('');
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, {status: string, remarks: string}>>({});

  const handleTimetableSelect = (id: string) => {
    setSelectedTimetableId(id);
    const sectionId = timetable.find(t => t.id === id)?.sectionId;
    if (!sectionId) return;
    
    // Initialize attendance for all students in section
    const studentsInSection = enrollments.filter(e => e.sectionId === sectionId);
    const newAtt: Record<string, {status: string, remarks: string}> = {};
    studentsInSection.forEach(s => {
      // Check if already marked
      const existing = attendances.find(a => a.timetableEntryId === id && a.date === markDate && a.studentId === s.studentId);
      if (existing) {
        newAtt[s.studentId] = { status: existing.status, remarks: existing.remarks || '' };
      } else {
        newAtt[s.studentId] = { status: 'Present', remarks: '' };
      }
    });
    setCurrentAttendance(newAtt);
  };

  const handleSaveAttendance = () => {
    if (!selectedTimetableId) return;
    const records = Object.entries(currentAttendance).map(([studentId, data]) => ({
      id: `ATT-${Date.now()}-${studentId}`,
      timetableEntryId: selectedTimetableId,
      date: markDate,
      studentId,
      status: data.status as any,
      remarks: data.remarks
    }));
    saveAttendance(records);
    toast.success('Attendance saved successfully');
  };

  return (
    <div className="flex flex-col h-full w-full max-w-full">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
            <UserX className="text-amber-500" />
            Attendance Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Track absentees and mark daily attendance.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('list')}
              className={clsx("px-4 py-2 text-sm font-medium rounded-lg transition-all", activeTab === 'list' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-800')}
            >
              Absentees List
            </button>
            <button
              onClick={() => setActiveTab('mark')}
              className={clsx("px-4 py-2 text-sm font-medium rounded-lg transition-all", activeTab === 'mark' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-800')}
            >
              Mark Attendance
            </button>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-600 ml-2">
            <Calendar size={16} className="text-amber-500" />
            Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {activeTab === 'list' ? (
        <>
          {/* Filters Area */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search students or class..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Excused', 'Unexcused'].map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    statusFilter === status
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Data Table Area */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Student & Class <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-2">Date <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => handleSort('reason')}>
                  <div className="flex items-center gap-2">Reason <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-2">Status <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {paginatedAbsentees.length > 0 ? (
                  paginatedAbsentees.map((absentee, index) => (
                    <motion.tr
                      key={absentee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-slate-50/80 transition-colors even:bg-slate-50/50 group"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200">
                            {absentee.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{absentee.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{absentee.class}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-600">{absentee.date}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-600 font-medium">{absentee.reason}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                          absentee.status === 'Excused' && "bg-green-50 text-green-700 border-green-200",
                          absentee.status === 'Unexcused' && "bg-red-50 text-red-700 border-red-200"
                        )}>
                          {absentee.status === 'Excused' && <Check size={12} />}
                          {absentee.status === 'Unexcused' && <AlertCircle size={12} />}
                          {absentee.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            title="Call Parent" 
                            onClick={() => {
                              setSelectedStudent(absentee);
                              setCallModalOpen(true);
                              setIsCalling(false);
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-md hover:bg-blue-100 transition-all shadow-sm"
                          >
                            <Phone size={14} />
                            Call
                          </button>
                          <button 
                            title="Send Message" 
                            onClick={() => {
                              setSelectedStudent(absentee);
                              setMessageModalOpen(true);
                              setMessageText('');
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-md hover:bg-amber-100 transition-all shadow-sm"
                          >
                            <MessageSquare size={14} />
                            Message
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-0"
                  >
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="flex flex-col items-center justify-center text-slate-400"
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, -5, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <SearchX size={48} className="mb-4 text-slate-300" />
                        </motion.div>
                        <p className="text-slate-600 font-medium mb-1">No absentees found</p>
                        <p className="text-sm text-slate-400">We couldn't find any student absences matching your criteria.</p>
                      </motion.div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <div className="text-sm text-slate-500">
            Showing {sortedAbsentees.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedAbsentees.length)} of {sortedAbsentees.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={clsx(
                    "w-7 h-7 flex items-center justify-center rounded-md text-sm transition-colors",
                    currentPage === idx + 1 
                      ? "bg-amber-100 text-amber-700 font-medium" 
                      : "text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 p-6 flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input 
                type="date" 
                value={markDate}
                onChange={e => setMarkDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Class/Period Schedule</label>
              <select 
                value={selectedTimetableId}
                onChange={e => handleTimetableSelect(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              >
                <option value="">Select a schedule</option>
                {timetable.map(t => {
                  const section = sections.find(s => s.id === t.sectionId);
                  const period = periods.find(p => p.id === t.periodId);
                  return (
                    <option key={t.id} value={t.id}>
                      {section?.name} - {period?.name} ({t.dayOfWeek})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {selectedTimetableId ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="overflow-y-auto custom-scrollbar flex-1 border border-slate-200 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase font-semibold sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enrollments.filter(e => e.sectionId === timetable.find(t => t.id === selectedTimetableId)?.sectionId).map(student => (
                      <tr key={student.studentId} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium text-slate-800">{student.studentName}</td>
                        <td className="px-4 py-3">
                          <select
                            value={currentAttendance[student.studentId]?.status || 'Present'}
                            onChange={(e) => setCurrentAttendance({
                              ...currentAttendance,
                              [student.studentId]: { ...currentAttendance[student.studentId], status: e.target.value }
                            })}
                            className={clsx(
                              "px-3 py-1.5 rounded-lg border text-sm font-medium focus:outline-none",
                              currentAttendance[student.studentId]?.status === 'Present' ? 'bg-green-50 text-green-700 border-green-200' :
                              currentAttendance[student.studentId]?.status === 'Absent' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            )}
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Late">Late</option>
                            <option value="HalfDay">Half Day</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            placeholder="Optional remarks"
                            value={currentAttendance[student.studentId]?.remarks || ''}
                            onChange={(e) => setCurrentAttendance({
                              ...currentAttendance,
                              [student.studentId]: { ...currentAttendance[student.studentId], remarks: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pt-4 flex justify-end">
                <button 
                  onClick={handleSaveAttendance}
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2"
                >
                  <Check size={16} />
                  Save Attendance
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 flex-col">
              <Calendar size={48} className="mb-4 text-slate-300" />
              <p>Select a class schedule to mark attendance</p>
            </div>
          )}
        </div>
      )}

      {/* Call Modal */}
      <AnimatePresence>
        {callModalOpen && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200 p-6 text-center"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800 opacity-0">Call</h2>
                <button onClick={() => { setCallModalOpen(false); setIsCalling(false); }} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
                   <X size={20} />
                </button>
              </div>
              
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 relative">
                 {isCalling && (
                   <motion.div
                     animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                     transition={{ duration: 1.5, repeat: Infinity }}
                     className="absolute inset-0 bg-blue-100 rounded-full"
                   />
                 )}
                 <PhoneCall className={clsx("text-blue-600 relative z-10", isCalling ? "animate-pulse" : "")} size={32} />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-1">{selectedStudent.name}</h2>
              <p className="text-slate-500 text-sm mb-1">{selectedStudent.class}</p>
              <p className="text-slate-600 text-sm font-medium mb-6">Contact: {selectedStudent.contact}</p>

              <div className="flex items-center justify-center gap-3">
                {isCalling ? (
                  <button
                    onClick={() => setIsCalling(false)}
                    className="px-4 py-2 w-full bg-red-50 text-red-600 text-sm font-medium rounded-md border border-red-200 shadow-sm hover:bg-red-100 focus:outline-none transition-all flex items-center justify-center gap-2"
                  >
                    <PhoneOff size={16} />
                    End Call
                  </button>
                ) : (
                  <button
                    onClick={() => setIsCalling(true)}
                    className="px-4 py-2 w-full bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none transition-all flex items-center justify-center gap-2"
                  >
                    <Phone size={16} />
                    Start Call
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Message Modal */}
      <AnimatePresence>
        {messageModalOpen && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <MessageSquare size={18} className="text-amber-500" />
                  Send Message
                </h2>
                <button onClick={() => setMessageModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 font-medium flex justify-between items-center">
                    <span>{selectedStudent.name} <span className="text-slate-400 font-normal">({selectedStudent.class})</span></span>
                    <span className="text-slate-500 font-normal">{selectedStudent.contact}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea 
                    rows={4} 
                    placeholder="Type your message here..." 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-shadow resize-none"
                  ></textarea>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setMessageModalOpen(false)}
                  className="px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-md border border-slate-300 shadow-sm hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if(!messageText.trim()) {
                      toast.error('Please enter a message');
                      return;
                    }
                    toast.success('Message sent successfully!');
                    setMessageModalOpen(false);
                    setMessageText('');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-md shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2"
                >
                  <Send size={16} />
                  Send
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
