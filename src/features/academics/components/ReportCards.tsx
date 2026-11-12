import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Filter, Download, Printer, Send, 
  ChevronDown, UserSquare2, CheckCircle2, AlertCircle,
  GraduationCap, CalendarDays, BookOpen, ChevronsUpDown, ChevronUp, ChevronLeft, ChevronRight,
  Brain, Bot
} from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { AiDraftReviewer } from '../../ai/components/AiDraftReviewer';
import { AIService } from '../../ai/services/aiService';

export const ReportCards = () => {
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [selectedClass, setSelectedClass] = useState('Grade 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data for students
  const students = useMemo(() => [
    { id: 1, name: 'Aarav Patel', rollNo: '10A01', attendance: 95, overallGrade: 'A', status: 'Generated' },
    { id: 2, name: 'Diya Sharma', rollNo: '10A02', attendance: 88, overallGrade: 'B+', status: 'Generated' },
    { id: 3, name: 'Rohan Singh', rollNo: '10A03', attendance: 92, overallGrade: 'A-', status: 'Pending' },
    { id: 4, name: 'Ananya Gupta', rollNo: '10A04', attendance: 78, overallGrade: 'C', status: 'Generated' },
    { id: 5, name: 'Vihaan Reddy', rollNo: '10A05', attendance: 98, overallGrade: 'A+', status: 'Generated' },
  ], []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredStudents = useMemo(() => {
    let result = [...students];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.rollNo.toLowerCase().includes(q)
      );
    }
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof typeof a];
        const bVal = b[sortConfig.key as keyof typeof b];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [students, searchQuery, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ChevronsUpDown className="w-4 h-4 text-slate-300 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 text-amber-500" /> : <ChevronDown className="w-4 h-4 text-amber-500" />;
  };

  // Mock data for a single student's report
  const [reportData, setReportData] = useState({
    studentName: 'Aarav Patel',
    rollNo: '10A01',
    dob: '15-May-2009',
    subjects: [
      { name: 'Mathematics', marks: 92, total: 100, grade: 'A', remarks: 'Excellent' },
      { name: 'Science', marks: 88, total: 100, grade: 'A-', remarks: 'Very Good' },
      { name: 'English', marks: 85, total: 100, grade: 'B+', remarks: 'Good progress' },
      { name: 'Social Studies', marks: 90, total: 100, grade: 'A', remarks: 'Consistent' },
      { name: 'Computer Science', marks: 95, total: 100, grade: 'A+', remarks: 'Outstanding' },
    ],
    attendance: { present: 85, total: 90, percentage: 94.4 },
    teacherRemarks: '',
    principalRemarks: 'Promoted to the next term with excellent grades.',
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [draftId, setDraftId] = useState<string | undefined>(undefined);

  const generateAINarrative = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await AIService.generateDraft({
        featureId: 'report_card',
        sourceData: reportData
      });
      setReportData(prev => ({ ...prev, teacherRemarks: response.content }));
      setDraftId(response.draftId);
      toast.success("AI Narrative generated successfully!", {
        icon: <Bot className="text-purple-500" />
      });
    } catch (e) {
      toast.error("Failed to generate AI narrative.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handlePublishRemarks = async (finalContent: string) => {
    if (draftId) {
      await AIService.publishReviewedDraft(draftId, finalContent, reportData.teacherRemarks);
    }
    setReportData(prev => ({ ...prev, teacherRemarks: finalContent }));
    toast.success("Remarks published successfully!");
  };

  const renderStudentList = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th onClick={() => handleSort('rollNo')} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2">Roll No <SortIcon columnKey="rollNo" /></div>
              </th>
              <th onClick={() => handleSort('name')} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2">Student Name <SortIcon columnKey="name" /></div>
              </th>
              <th onClick={() => handleSort('attendance')} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2">Attendance <SortIcon columnKey="attendance" /></div>
              </th>
              <th onClick={() => handleSort('overallGrade')} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2">Overall Grade <SortIcon columnKey="overallGrade" /></div>
              </th>
              <th onClick={() => handleSort('status')} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2">Status <SortIcon columnKey="status" /></div>
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No students found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{student.rollNo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={clsx(
                            "h-full rounded-full",
                            student.attendance >= 90 ? "bg-emerald-500" : student.attendance >= 75 ? "bg-amber-500" : "bg-red-500"
                          )}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-600">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {student.overallGrade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                      student.status === 'Generated' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                    )}>
                      {student.status === 'Generated' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedStudent(student.id)}
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-amber-600 transition-colors shadow-sm"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{filteredStudents.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-700">{Math.min(filteredStudents.length, currentPage * itemsPerPage)}</span> of <span className="font-medium text-slate-700">{filteredStudents.length}</span> results
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSingleReport = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden"
    >
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => setSelectedStudent(null)}
            className="text-sm font-medium text-slate-500 hover:text-amber-600 mb-4 inline-flex items-center transition-colors"
          >
            ← Back to Student List
          </button>
          <h2 className="text-2xl font-semibold text-slate-800">Academic Report Card</h2>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <CalendarDays size={16} /> {selectedYear} | <BookOpen size={16} className="ml-2" /> {selectedTerm}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Printer size={18} /> Print
          </button>
          <button className="flex-1 md:flex-none inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={18} /> PDF
          </button>
          <button className="flex-1 md:flex-none inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-amber-500 rounded-xl text-sm font-semibold text-white hover:bg-amber-600 transition-colors shadow-sm shadow-amber-500/20">
            <Send size={18} /> Send to Parent
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-amber-500/20">
              {reportData.studentName.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800">{reportData.studentName}</h3>
              <p className="text-slate-500 text-sm mt-1">Roll No: <span className="font-semibold text-slate-700">{reportData.rollNo}</span></p>
              <p className="text-slate-500 text-sm">Class: <span className="font-semibold text-slate-700">{selectedClass} - {selectedSection}</span></p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-around">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800">94.4%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase mt-1">Attendance</div>
            </div>
            <div className="w-px h-12 bg-slate-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500">A+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase mt-1">Overall Grade</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <GraduationCap size={20} className="text-amber-500" />
            Scholastic Performance
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">Subjects</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-center">Marks Obtained</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-center">Max Marks</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-center">Grade</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.subjects.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{sub.name}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-600 text-center">{sub.marks}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-500 text-center">{sub.total}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {sub.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{sub.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 relative group flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-emerald-800">Class Teacher's Remarks</h4>
              <button 
                onClick={generateAINarrative}
                disabled={isGeneratingAI}
                className="text-xs font-bold bg-white text-purple-600 border border-purple-200 hover:bg-purple-50 px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-all disabled:opacity-50"
              >
                {isGeneratingAI ? <Bot size={12} className="animate-bounce" /> : <Brain size={12} />}
                {isGeneratingAI ? 'Generating...' : 'AI Generate'}
              </button>
            </div>
            
            {reportData.teacherRemarks ? (
              <div className="mt-2 relative">
                {draftId ? (
                  <AiDraftReviewer
                    draftContent={reportData.teacherRemarks}
                    draftId={draftId}
                    sourceDataDetails={`Marks Avg: ${(reportData.subjects.reduce((sum, s) => sum + s.marks, 0) / reportData.subjects.length).toFixed(1)}, Attendance: ${reportData.attendance.percentage}%`}
                    onPublish={handlePublishRemarks}
                    onDiscard={() => {
                      setReportData(prev => ({ ...prev, teacherRemarks: '' }));
                      setDraftId(undefined);
                    }}
                  />
                ) : (
                  <textarea 
                    value={reportData.teacherRemarks}
                    onChange={(e) => setReportData(prev => ({...prev, teacherRemarks: e.target.value}))}
                    className="w-full h-24 text-sm text-emerald-800/90 leading-relaxed bg-transparent border border-emerald-200/50 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-300 resize-none"
                  />
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-emerald-200 rounded-lg mt-2">
                <p className="text-xs text-emerald-600/70 mb-2">No remarks written yet.</p>
                <button onClick={generateAINarrative} className="text-[10px] uppercase tracking-wider font-bold text-purple-500 hover:text-purple-700">Use AI to generate</button>
              </div>
            )}
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Principal's Remarks</h4>
            <p className="text-sm text-blue-700/90 leading-relaxed italic">"{reportData.principalRemarks}"</p>
          </div>
        </div>

      </div>
    </motion.div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Report Cards</h1>
          <p className="text-slate-500 mt-1">Generate, view, and distribute academic reports.</p>
        </div>
      </div>

      {/* Filters (Hidden when viewing single report) */}
      <AnimatePresence>
        {!selectedStudent && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end"
          >
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Academic Year</label>
              <div className="relative">
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  <option>2024-2025</option>
                  <option>2023-2024</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Term</label>
              <div className="relative">
                <select 
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  <option>Term 1</option>
                  <option>Term 2</option>
                  <option>Finals</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Class</label>
              <div className="relative">
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  <option>Grade 9</option>
                  <option>Grade 10</option>
                  <option>Grade 11</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Section</label>
              <div className="relative">
                <select 
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="w-full md:w-auto">
              <button className="w-full md:w-auto inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors shadow-sm shadow-amber-500/20">
                <Filter size={18} /> Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {selectedStudent ? (
          renderSingleReport()
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full sm:w-96">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search students by name or roll no..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
                />
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                  <Download size={16} /> Bulk PDF
                </button>
                <button className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors shadow-sm shadow-amber-500/20">
                  <FileText size={16} /> Generate All
                </button>
              </div>
            </div>
            
            {renderStudentList()}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
