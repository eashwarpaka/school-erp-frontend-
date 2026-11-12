import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SubjectGroup, SubjectType, useAcademicStore } from '../../store/academicStore';
import toast from 'react-hot-toast';

interface SubjectGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SubjectGroup, 'id'>) => void;
  initialData?: SubjectGroup | null;
}

const classificationTypes: SubjectType[] = ['Core', 'Elective', 'Practical', 'Language', 'Co-Scholastic'];

export const SubjectGroupModal: React.FC<SubjectGroupModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const curriculums = useAcademicStore(s => s.curriculums);
  
  const [formData, setFormData] = useState<{
    name: string;
    curriculumId: string;
    classification: SubjectType;
    maxSubjects?: number;
    isActive: boolean;
  }>({
    name: '',
    curriculumId: '',
    classification: 'Core',
    maxSubjects: undefined,
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        curriculumId: initialData.curriculumId,
        classification: initialData.classification,
        maxSubjects: initialData.maxSubjects,
        isActive: initialData.isActive,
      });
    } else {
      setFormData({ name: '', curriculumId: '', classification: 'Core', maxSubjects: undefined, isActive: true });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.curriculumId) {
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
            {initialData ? 'Edit Subject Group' : 'Add Subject Group'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Group Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              placeholder="e.g. Science Stream Core"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Curriculum *</label>
            <select
              value={formData.curriculumId}
              onChange={(e) => setFormData({ ...formData, curriculumId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              required
            >
              <option value="">Select Curriculum</option>
              {curriculums.map(curr => (
                <option key={curr.id} value={curr.id}>{curr.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Classification *</label>
            <select
              value={formData.classification}
              onChange={(e) => setFormData({ ...formData, classification: e.target.value as SubjectType })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              required
            >
              {classificationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {formData.classification === 'Elective' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Maximum Subjects per Student</label>
              <input
                type="number"
                min="1"
                value={formData.maxSubjects || ''}
                onChange={(e) => setFormData({ ...formData, maxSubjects: parseInt(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                placeholder="e.g. 2"
              />
              <p className="text-xs text-slate-500 mt-1">Leave empty for unlimited.</p>
            </div>
          )}

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
              {initialData ? 'Update Group' : 'Add Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
