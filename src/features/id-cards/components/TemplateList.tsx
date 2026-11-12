import React, { useState } from 'react';
import { useIDCardStore, CHENNAI_SCHOOLS } from '../store/idCardStore';
import { Plus, Edit2, Copy, Trash2, CheckCircle, LayoutTemplate, Archive, Eye, CreditCard, Users, Clock, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { TemplateDesigner } from './TemplateDesigner';
import { ConfirmDeleteModal } from '../../../components/common/ConfirmDeleteModal';
import { StudentCardPreview } from './StudentCardPreview';

// Scope badge colours
const SCOPE_COLORS: Record<string, { bg: string; text: string }> = {
  Global:  { bg: 'bg-slate-100',   text: 'text-slate-600'  },
  Grade:   { bg: 'bg-blue-50',     text: 'text-blue-700'   },
  Staff:   { bg: 'bg-purple-50',   text: 'text-purple-700' },
  Visitor: { bg: 'bg-amber-50',    text: 'text-amber-700'  },
  Campus:  { bg: 'bg-emerald-50',  text: 'text-emerald-700'},
};

const STATUS_DOT: Record<string, string> = {
  Published: 'bg-emerald-500',
  Draft: 'bg-amber-400',
  Archived: 'bg-slate-400',
};

// Dummy student for live preview
const PREVIEW_STUDENT = {
  id: 'PREV-001',
  name: 'Aarav Krishnamurthy',
  class: 'Grade 5 - Section A',
  standard: 'Grade 5',
  section: 'A',
  school: 'DAV Matriculation Higher Secondary School',
  schoolShort: 'DAV School',
  schoolId: 'SCH-001',
  classId: 'CLS-SCH-001-Grade5-A',
  photo: 'https://ui-avatars.com/api/?name=Aarav+K&background=d1e7f9&color=1d4ed8&size=128&bold=true',
  qr_code: 'PREV-QR-001',
  blood_group: 'O+',
  rollNumber: 'A01',
  dob: '2015-06-12',
  parentPhone: '+91 9876543210',
  admissionNo: 'ADM-001-2024-0001',
  busRoute: 'Route 3',
  houseColor: 'Blue',
};

const TemplateCard = ({
  template,
  onEdit,
  onDelete,
  onDuplicate,
  onPublish,
  onArchive,
}: {
  template: ReturnType<typeof useIDCardStore.getState>['templates'][0];
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onPublish: () => void;
  onArchive: () => void;
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');
  
  const school = CHENNAI_SCHOOLS.find(s => s.id === template.schoolId);
  const scopeColor = SCOPE_COLORS[template.scope] || SCOPE_COLORS.Global;

  // Scale to fit the 240-height preview area
  const previewScale = template.orientation === 'portrait' ? 140 / template.height : 220 / template.width;
  const previewStudent = { ...PREVIEW_STUDENT, schoolId: template.schoolId || 'SCH-001' };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 group flex flex-col"
    >
      {/* Live Card Preview */}
      <div
        className="relative bg-slate-100/70 flex items-center justify-center border-b border-slate-200 overflow-hidden"
        style={{ height: 180 }}
      >
        {/* Front/Back toggle for two-sided cards */}
        {template.hasBackSide && (template.backElements?.length ?? 0) > 0 && (
          <div className="absolute top-2 left-2 z-20 flex bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <button
              onClick={(e) => { e.stopPropagation(); setPreviewSide('front'); }}
              className={clsx('px-2 py-1 text-[10px] font-bold transition-colors', previewSide === 'front' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100')}
            >
              Front
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setPreviewSide('back'); }}
              className={clsx('px-2 py-1 text-[10px] font-bold transition-colors', previewSide === 'back' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100')}
            >
              Back
            </button>
          </div>
        )}

        {/* Status + version */}
        <div className="absolute top-2 right-2 z-20 flex gap-1 flex-wrap justify-end">
          <span className={clsx('px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 bg-white border border-slate-200 shadow-sm', 'text-slate-600')}>
            <span className={clsx('w-1.5 h-1.5 rounded-full', STATUS_DOT[template.status])} />
            {template.status}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white border border-slate-200 shadow-sm text-indigo-600">
            v{template.version}
          </span>
        </div>

        {/* The actual live preview */}
        <div
          className="pointer-events-none"
          style={{
            width: template.width * previewScale,
            height: template.height * previewScale,
          }}
        >
          <StudentCardPreview
            template={template}
            student={previewStudent}
            scale={previewScale}
            side={previewSide}
          />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-2 bg-white text-slate-800 text-xs font-bold rounded-lg hover:bg-amber-50 transition-colors shadow-lg"
          >
            <Edit2 size={13} /> Edit
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2" title={template.name}>
            {template.name}
          </h3>
          <span className={clsx('flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider', scopeColor.bg, scopeColor.text)}>
            {template.scope}
          </span>
        </div>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
            <CreditCard size={9} />
            {template.orientation === 'landscape' ? 'Landscape' : 'Portrait'} CR-80
          </span>
          {template.hasBackSide && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              <Shield size={9} /> Double-Sided
            </span>
          )}
          {template.cardStyle?.watermark && (
            <span className="flex items-center gap-1 text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              <Shield size={9} /> Watermark
            </span>
          )}
          {template.expiryMonths && template.expiryMonths > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              <Clock size={9} /> {template.expiryMonths}mo expiry
            </span>
          )}
          {school && (
            <span className="flex items-center gap-1 text-[10px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 truncate max-w-[120px]">
              {school.shortName}
            </span>
          )}
        </div>

        {/* Updated at */}
        <div className="text-[10px] text-slate-400 mb-3">
          Updated {new Date(template.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>

        {/* Actions */}
        <div className="mt-auto flex justify-between items-center pt-3 border-t border-slate-100">
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={onDuplicate}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Duplicate"
            >
              <Copy size={14} />
            </button>
            {template.status === 'Published' && (
              <button
                onClick={onArchive}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Archive"
              >
                <Archive size={14} />
              </button>
            )}
            <button
              onClick={onDelete}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {template.status === 'Draft' && (
            <button
              onClick={onPublish}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <CheckCircle size={12} />
              Publish
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const TemplateList = () => {
  const { templates, duplicateTemplate, deleteTemplate, publishTemplate, archiveTemplate } = useIDCardStore();
  const [designerOpen, setDesignerOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<{ id: string, name: string } | null>(null);
  const [scopeFilter, setScopeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const handleCreateNew = () => { setEditingTemplateId(null); setDesignerOpen(true); };
  const handleEdit = (id: string) => { setEditingTemplateId(id); setDesignerOpen(true); };
  const handleDeleteClick = (id: string, name: string) => { setTemplateToDelete({ id, name }); setDeleteModalOpen(true); };
  const confirmDelete = () => { if (templateToDelete) deleteTemplate(templateToDelete.id); };

  const filteredTemplates = templates.filter(t => {
    const matchScope = scopeFilter === 'All' || t.scope === scopeFilter;
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchScope && matchStatus;
  });

  if (designerOpen) {
    return <TemplateDesigner templateId={editingTemplateId} onClose={() => setDesignerOpen(false)} />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Card Templates</h2>
          <p className="text-xs text-slate-500 mt-0.5">{templates.length} templates • {templates.filter(t => t.status === 'Published').length} published</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <Plus size={16} />
          New Template
        </motion.button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Type:</span>
        {['All', 'Grade', 'Staff', 'Visitor', 'Global', 'Campus'].map(scope => (
          <button
            key={scope}
            onClick={() => setScopeFilter(scope)}
            className={clsx(
              'px-2.5 py-1 text-[11px] font-bold rounded-full border transition-all',
              scopeFilter === scope ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            )}
          >
            {scope}
          </button>
        ))}
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-3">Status:</span>
        {['All', 'Published', 'Draft', 'Archived'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={clsx(
              'px-2.5 py-1 text-[11px] font-bold rounded-full border transition-all',
              statusFilter === status ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={() => handleEdit(template.id)}
              onDelete={() => handleDeleteClick(template.id, template.name)}
              onDuplicate={() => duplicateTemplate(template.id)}
              onPublish={() => publishTemplate(template.id)}
              onArchive={() => archiveTemplate(template.id)}
            />
          ))}
        </AnimatePresence>

        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <LayoutTemplate className="w-14 h-14 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-slate-600">No templates found.</p>
            <p className="text-sm mt-1">Adjust filters or create a new template.</p>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={templateToDelete?.name}
        title="Delete Template"
      />
    </div>
  );
};
