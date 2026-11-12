import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useAcademicStore } from '../../store/academicStore';
import clsx from 'clsx';

interface SubjectMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const SubjectMappingModal: React.FC<SubjectMappingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [subjectId, setSubjectId] = useState('');
  const [classYearOfferingId, setClassYearOfferingId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [teacherName, setTeacherName] = useState('');

  const subjects = useAcademicStore(s => s.subjects);
  const offerings = useAcademicStore(s => s.classYearOfferings);
  const classMasters = useAcademicStore(s => s.classMasters);
  const sections = useAcademicStore(s => s.sections);

  useEffect(() => {
    if (isOpen) {
      setSubjectId(subjects[0]?.id || '');
      setClassYearOfferingId(offerings[0]?.id || '');
      setSectionId('');
      setTeacherName('');
    }
  }, [isOpen, subjects, offerings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      subjectId,
      classYearOfferingId,
      sectionId: sectionId || undefined,
      teacherName,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">Assign Subject</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Subject</label>
              <select
                required
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Class Year Offering</label>
              <select
                required
                value={classYearOfferingId}
                onChange={e => {
                  setClassYearOfferingId(e.target.value);
                  setSectionId('');
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              >
                {offerings.map(o => {
                  const cm = classMasters.find(c => c.id === o.classMasterId);
                  return <option key={o.id} value={o.id}>{cm?.name} {o.stream ? `- ${o.stream}` : ''}</option>;
                })}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Section (Optional)</label>
              <select
                value={sectionId}
                onChange={e => setSectionId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              >
                <option value="">All Sections</option>
                {sections.filter(s => s.classYearOfferingId === classYearOfferingId).map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Teacher Name</label>
              <input
                required
                type="text"
                value={teacherName}
                onChange={e => setTeacherName(e.target.value)}
                placeholder="e.g. Mr. Smith"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-sm shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Check size={16} />
              Save Assignment
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
