import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SubjectVersion, SubjectStatus, useAcademicStore } from '../../store/academicStore';
import toast from 'react-hot-toast';

interface SubjectVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SubjectVersion, 'id'>) => void;
  initialData?: SubjectVersion | null;
}

export const SubjectVersionModal: React.FC<SubjectVersionModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const subjects = useAcademicStore(s => s.subjects);
  
  const [formData, setFormData] = useState<{
    name: string;
    subjectMasterId: string;
    version: string;
    status: SubjectStatus;
    isActive: boolean;
  }>({
    name: '',
    subjectMasterId: '',
    version: '',
    status: 'Draft',
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        subjectMasterId: initialData.subjectMasterId,
        version: initialData.version,
        status: initialData.status || 'Draft',
        isActive: initialData.isActive,
      });
    } else {
      setFormData({ name: '', subjectMasterId: '', version: '', status: 'Draft', isActive: true });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.subjectMasterId || !formData.version.trim()) {
      toast.error('All fields are required');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-medium text-slate-800">
            {initialData ? 'Edit Subject Version' : 'Add Subject Version'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Version Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              placeholder="e.g. Mathematics Basic"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject Master *</label>
            <select
              value={formData.subjectMasterId}
              onChange={(e) => setFormData({ ...formData, subjectMasterId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Version Number *</label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              placeholder="e.g. 1.0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as SubjectStatus })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
            >
              <option value="Draft">Draft</option>
              <option value="Review">Review</option>
              <option value="Approved">Approved</option>
              <option value="Published">Published</option>
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Note: No subject should be edited directly once published. Create a new Subject Version instead.</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Active Status</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
            >
              {initialData ? 'Update Version' : 'Add Version'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
