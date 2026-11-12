import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Search, Filter } from 'lucide-react';
import { useAcademicStore } from '../../admin/store/academicStore';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export const Electives = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Using mock data from academic store for display purposes
  // In a real scenario, this would be `useAcademicStore(s => s.electivePreferences)`
  const enrollments = useAcademicStore(s => s.enrollments);
  const subjects = useAcademicStore(s => s.subjects);
  const groups = useAcademicStore(s => s.subjectGroups).filter(g => g.classification === 'Elective');

  // Generating mock elective preferences based on enrollments for demo
  const [preferences, setPreferences] = useState(
    enrollments.map((enr, idx) => {
      const isApproved = idx % 3 === 0;
      const isPending = idx % 3 === 1;
      
      const electiveSubjects = subjects.filter(s => groups.some(g => g.id === s.subjectGroupId));
      const firstPref = electiveSubjects[0];
      const secondPref = electiveSubjects[1];

      return {
        id: `PREF-${enr.id}`,
        studentId: enr.studentId,
        studentName: enr.studentName,
        subjectGroupId: groups[0]?.id,
        groupName: groups[0]?.name,
        preferences: [firstPref?.name, secondPref?.name].filter(Boolean),
        status: isApproved ? 'Approved' : isPending ? 'Pending' : 'Validated',
        approvedSubjectId: isApproved ? firstPref?.id : undefined,
        approvedSubjectName: isApproved ? firstPref?.name : undefined,
      };
    })
  );

  const filteredPreferences = preferences.filter(p => {
    const matchesSearch = p.studentName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string, subjectName: string) => {
    setPreferences(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'Approved', approvedSubjectName: subjectName } : p
    ));
    toast.success('Elective preference approved');
  };

  const handleReject = (id: string) => {
    setPreferences(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'Rejected' } : p
    ));
    toast.error('Elective preference rejected');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Approved</span>;
      case 'Validated':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Validated</span>;
      case 'Pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Pending</span>;
      case 'Rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Elective Flow Management</h1>
          <p className="text-slate-500 mt-1">Manage and approve student elective preferences</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Validated">Validated</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Elective Group</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Preferences (Ordered)</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPreferences.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No elective preferences found.
                  </td>
                </tr>
              ) : (
                filteredPreferences.map((pref) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={pref.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{pref.studentName}</div>
                      <div className="text-xs text-slate-500">{pref.studentId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {pref.groupName || 'General Electives'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {pref.preferences.map((p, i) => (
                          <div key={i} className="text-sm">
                            <span className="text-slate-400 mr-2">{i + 1}.</span>
                            <span className={clsx("font-medium", pref.approvedSubjectName === p ? "text-amber-600" : "text-slate-700")}>{p}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(pref.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {pref.status !== 'Approved' && (
                          <button
                            onClick={() => handleApprove(pref.id, pref.preferences[0] || 'Unknown')}
                            className="p-1.5 text-emerald-600 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors"
                            title="Approve 1st Preference"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {pref.status !== 'Rejected' && (
                          <button
                            onClick={() => handleReject(pref.id)}
                            className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
