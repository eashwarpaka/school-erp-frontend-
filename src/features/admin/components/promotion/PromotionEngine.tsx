import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowUp, RotateCcw, GraduationCap, LogOut, ChevronDown, CheckCircle,
  AlertTriangle, ArrowUpDown, ChevronLeft, ChevronRight, X, Info,
  Building2, CalendarDays, FileText, BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useAcademicStore } from '../../store/academicStore';

const ROWS_PER_PAGE = 10;

// ── Types ─────────────────────────────────────────────────────
type PromotionAction = 'Promoted' | 'Retained' | 'Graduated' | 'TransferredOut';

interface DecisionDetail {
  action: PromotionAction;
  // Promoted
  targetOfferingId?: string;
  targetSectionId?: string;
  effectiveDate?: string;
  // Retained
  retainReason?: string;
  retainSectionId?: string;
  retainDate?: string;
  // Graduated
  graduationDate?: string;
  certificateNo?: string;
  // TransferredOut
  destinationSchool?: string;
  transferDate?: string;
  transferReason?: string;
}

const actionConfig: Record<PromotionAction, { icon: React.ElementType; color: string; bg: string; border: string; label: string }> = {
  Promoted:      { icon: ArrowUp,       color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   label: 'Promoted' },
  Retained:      { icon: RotateCcw,     color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  label: 'Retained' },
  Graduated:     { icon: GraduationCap, color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Graduated' },
  TransferredOut:{ icon: LogOut,        color: 'text-slate-600',  bg: 'bg-slate-50',  border: 'border-slate-300',  label: 'Transferred' },
};

const RETAIN_REASONS = [
  'Failed examinations', 'Attendance below 75%', 'Parent request',
  'Medical reasons', 'Discipline issues', 'Learning disability support',
];
const TRANSFER_REASONS = [
  'Family relocation', 'Parental preference', 'School closure',
  'Better facilities', 'Sibling enrollment', 'Other',
];

// ── Helper: field label ────────────────────────────────────────
const Field: React.FC<{ label: string; children: React.ReactNode; required?: boolean }> = ({ label, children, required }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 mb-1">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white placeholder-slate-400';
const selectCls = `${inputCls} appearance-none`;

// ── Main Component ─────────────────────────────────────────────
export const PromotionEngine = () => {
  const {
    enrollments, sections, classYearOfferings, classMasters,
    academicYears, updateEnrollment, bulkPromote, selectedYearId,
  } = useAcademicStore();

  const [decisions, setDecisions] = useState<Record<string, DecisionDetail>>({});
  const [detailPanel, setDetailPanel] = useState<{ enrollmentId: string; action: PromotionAction } | null>(null);
  const [draft, setDraft] = useState<Partial<DecisionDetail>>({});

  const [sectionFilter, setSectionFilter] = useState('');
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Helpers ──
  const getSectionLabel = (secId: string) => sections.find((s) => s.id === secId)?.name || '—';
  const getClassLabel = (offeringId: string) => {
    const o = classYearOfferings.find((x) => x.id === offeringId);
    const cm = classMasters.find((c) => c.id === o?.classMasterId);
    return `${cm?.name || '?'}${o?.stream ? ` (${o.stream})` : ''}`;
  };

  // ── Data ──
  const activeEnrollments = useMemo(() => {
    let data = enrollments.filter((e) => e.academicYearId === selectedYearId && e.status === 'Active');
    if (sectionFilter) data = data.filter((e) => e.sectionId === sectionFilter);
    if (sortConfig) {
      data = [...data].sort((a, b) => {
        let aVal: string = '', bVal: string = '';
        switch (sortConfig.key) {
          case 'roll':     aVal = a.rollNumber || ''; bVal = b.rollNumber || ''; break;
          case 'student':  aVal = a.studentName; bVal = b.studentName; break;
          case 'section':  aVal = getSectionLabel(a.sectionId); bVal = getSectionLabel(b.sectionId); break;
          case 'class':    aVal = getClassLabel(a.classYearOfferingId); bVal = getClassLabel(b.classYearOfferingId); break;
          case 'decision': aVal = decisions[a.id]?.action || ''; bVal = decisions[b.id]?.action || ''; break;
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [enrollments, selectedYearId, sectionFilter, sortConfig, decisions]);

  const yearOfferings = classYearOfferings.filter((o) => o.academicYearId === selectedYearId);
  const yearSections  = sections.filter((s) => yearOfferings.some((o) => o.id === s.classYearOfferingId));
  const nextYear = academicYears.find((y) => y.status === 'Draft');
  const nextYearOfferings = nextYear ? classYearOfferings.filter((o) => o.academicYearId === nextYear.id) : [];
  const nextYearSections  = sections.filter((s) => nextYearOfferings.some((o) => o.id === s.classYearOfferingId));

  const totalPages   = Math.max(1, Math.ceil(activeEnrollments.length / ROWS_PER_PAGE));
  const paginatedData = activeEnrollments.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
  const startIndex   = (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endIndex     = Math.min(currentPage * ROWS_PER_PAGE, activeEnrollments.length);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // ── Panel open/close ──
  const openPanel = (enrollmentId: string, action: PromotionAction) => {
    const existing = decisions[enrollmentId];
    if (existing && existing.action === action) {
      // toggle off
      setDecisions((prev) => { const n = { ...prev }; delete n[enrollmentId]; return n; });
      return;
    }
    setDetailPanel({ enrollmentId, action });
    // pre-fill draft from existing if same action
    if (existing && existing.action === action) {
      setDraft(existing);
    } else {
      setDraft({ action, effectiveDate: new Date().toISOString().slice(0, 10), retainDate: new Date().toISOString().slice(0, 10), graduationDate: new Date().toISOString().slice(0, 10), transferDate: new Date().toISOString().slice(0, 10) });
    }
  };

  const confirmDetail = () => {
    if (!detailPanel) return;
    const { enrollmentId, action } = detailPanel;

    // Validate required fields per action
    if (action === 'Promoted') {
      if (!draft.targetOfferingId || !draft.targetSectionId) { toast.error('Select a target class and section'); return; }
    }
    if (action === 'Retained') {
      if (!draft.retainReason) { toast.error('Select a retention reason'); return; }
    }
    if (action === 'Graduated') {
      if (!draft.graduationDate) { toast.error('Enter graduation date'); return; }
    }
    if (action === 'TransferredOut') {
      if (!draft.destinationSchool) { toast.error('Enter destination school'); return; }
    }

    setDecisions((prev) => ({ ...prev, [enrollmentId]: { ...draft, action } as DecisionDetail }));
    setDetailPanel(null);
    setDraft({});
    toast.success(`Decision set: ${actionConfig[action].label}`);
  };

  const clearDecision = (enrollmentId: string) => {
    setDecisions((prev) => { const n = { ...prev }; delete n[enrollmentId]; return n; });
  };

  // ── Summary ──
  const summary = {
    total:      activeEnrollments.length,
    decided:    Object.keys(decisions).filter((id) => activeEnrollments.some((e) => e.id === id)).length,
    promoted:   Object.values(decisions).filter((d) => d.action === 'Promoted').length,
    retained:   Object.values(decisions).filter((d) => d.action === 'Retained').length,
    graduated:  Object.values(decisions).filter((d) => d.action === 'Graduated').length,
    transferred:Object.values(decisions).filter((d) => d.action === 'TransferredOut').length,
  };

  // ── Execute ──
  const handleExecute = () => {
    const today = new Date().toISOString().slice(0, 10);

    Object.entries(decisions).forEach(([id, detail]) => {
      switch (detail.action) {
        case 'Promoted':
          if (detail.targetOfferingId && detail.targetSectionId) {
            bulkPromote([id], detail.targetOfferingId, detail.targetSectionId);
          }
          break;
        case 'Retained':
          updateEnrollment(id, {
            status: 'Retained',
            sectionId: detail.retainSectionId || undefined,
          });
          break;
        case 'Graduated':
          updateEnrollment(id, { status: 'Graduated', exitDate: detail.graduationDate || today });
          break;
        case 'TransferredOut':
          updateEnrollment(id, { status: 'TransferredOut', exitDate: detail.transferDate || today });
          break;
      }
    });

    const msg = [
      summary.promoted   && `${summary.promoted} promoted`,
      summary.retained   && `${summary.retained} retained`,
      summary.graduated  && `${summary.graduated} graduated`,
      summary.transferred && `${summary.transferred} transferred`,
    ].filter(Boolean).join(', ');

    toast.success(`Promotion run complete: ${msg}`);
    setShowConfirm(false);
    setDecisions({});
  };

  const activeYear = academicYears.find((y) => y.id === selectedYearId);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  // ── Panel form for detail panel ──
  const panelEnrollment = detailPanel ? activeEnrollments.find((e) => e.id === detailPanel.enrollmentId) : null;

  // ── Row detail summary ──
  const getRowDetailText = (detail: DecisionDetail): string => {
    switch (detail.action) {
      case 'Promoted':
        return [
          detail.targetOfferingId ? getClassLabel(detail.targetOfferingId) : '',
          detail.targetSectionId ? getSectionLabel(detail.targetSectionId) : '',
        ].filter(Boolean).join(' › ');
      case 'Retained':
        return detail.retainReason || '';
      case 'Graduated':
        return detail.graduationDate ? `Grad: ${detail.graduationDate}` : '';
      case 'TransferredOut':
        return detail.destinationSchool || '';
      default: return '';
    }
  };

  return (
    <div className="w-full p-1 sm:p-2 text-slate-800">
      <div className="flex items-center text-sm text-slate-500 mb-4">
        <NavLink to="/admin/academic-years" className="hover:text-amber-600">School Admin</NavLink>
        <span className="mx-2">/</span><span className="text-slate-700">Promotion Engine</span>
      </div>
      <h1 className="text-xl font-normal text-slate-900 mb-1">Promotion Engine — {activeYear?.name || ''}</h1>
      <p className="text-sm text-slate-500 mb-4">Year-end run: click an action button on each student to set their decision with full details, then execute.</p>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800">High-Risk Operation</p>
          <p className="text-xs text-amber-600">Promotion is irreversible. Click each action to set per-student details, then Execute to apply all decisions.</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-xs font-bold text-slate-500 uppercase">Total</div>
          <div className="text-2xl font-bold text-slate-700">{summary.total}</div>
        </div>
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="text-xs font-bold text-blue-600 uppercase">Promote</div>
          <div className="text-2xl font-bold text-blue-700">{summary.promoted}</div>
        </div>
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div className="text-xs font-bold text-amber-600 uppercase">Retain</div>
          <div className="text-2xl font-bold text-amber-700">{summary.retained}</div>
        </div>
        <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
          <div className="text-xs font-bold text-purple-600 uppercase">Graduate</div>
          <div className="text-2xl font-bold text-purple-700">{summary.graduated}</div>
        </div>
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="text-xs font-bold text-emerald-600 uppercase">Decided</div>
          <div className="text-2xl font-bold text-emerald-700">{summary.decided}/{summary.total}</div>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs font-semibold text-slate-400 uppercase">Filter:</span>
        <div className="flex-1" />
        <div className="relative" onMouseLeave={() => setIsSectionOpen(false)}>
          <button onClick={() => setIsSectionOpen(!isSectionOpen)} className="flex items-center justify-between bg-white border border-slate-200 px-3 py-1 rounded-md text-xs text-slate-700 font-medium w-36">
            <span className="truncate">{sectionFilter ? getSectionLabel(sectionFilter) : 'All Sections'}</span>
            <ChevronDown size={14} className={clsx('text-slate-400 transition-transform', isSectionOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {isSectionOpen && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto right-0">
                <div onClick={() => { setSectionFilter(''); setIsSectionOpen(false); setCurrentPage(1); }} className="px-3 py-2 text-xs cursor-pointer hover:bg-slate-50">All Sections</div>
                {yearSections.map((s) => (
                  <div key={s.id} onClick={() => { setSectionFilter(s.id); setIsSectionOpen(false); setCurrentPage(1); }} className="px-3 py-2 text-xs cursor-pointer hover:bg-slate-50">{s.name}</div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-3 flex-wrap text-xs text-slate-500">
        <span className="font-semibold text-slate-600">Actions:</span>
        {(['Promoted', 'Retained', 'Graduated', 'TransferredOut'] as PromotionAction[]).map((a) => {
          const cfg = actionConfig[a];
          return (
            <span key={a} className={clsx('flex items-center gap-1 px-2 py-0.5 rounded border font-medium', cfg.bg, cfg.color, cfg.border)}>
              <cfg.icon className="w-3 h-3" />{cfg.label}
            </span>
          );
        })}
        <span className="text-slate-400 ml-2 italic">Click a button → fill details → confirm</span>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto mb-4">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {[
                { label: 'Roll #', key: 'roll' },
                { label: 'Student', key: 'student' },
                { label: 'Current Section', key: 'section' },
                { label: 'Class', key: 'class' },
              ].map((h) => (
                <th key={h.key} onClick={() => requestSort(h.key)} className="px-4 py-3 cursor-pointer group hover:bg-slate-100 transition-colors whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {h.label}
                    <ArrowUpDown className={clsx('w-3 h-3', sortConfig?.key === h.key ? 'text-amber-500' : 'text-slate-300 group-hover:text-slate-500')} />
                  </div>
                </th>
              ))}
              <th onClick={() => requestSort('decision')} className="px-4 py-3 cursor-pointer group hover:bg-slate-100 transition-colors text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-1">
                  Decision <ArrowUpDown className={clsx('w-3 h-3', sortConfig?.key === 'decision' ? 'text-amber-500' : 'text-slate-300 group-hover:text-slate-500')} />
                </div>
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((e) => {
              const detail = decisions[e.id];
              const action = detail?.action;
              const cfg = action ? actionConfig[action] : null;
              const rowDetailText = detail ? getRowDetailText(detail) : '';
              return (
                <motion.tr
                  key={e.id}
                  layout
                  className={clsx(
                    'transition-colors',
                    action ? `${cfg!.bg} border-l-4 ${cfg!.border}` : 'hover:bg-slate-50/50 border-l-4 border-transparent',
                  )}
                >
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{e.rollNumber || '—'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700">{e.studentName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{getSectionLabel(e.sectionId)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{getClassLabel(e.classYearOfferingId)}</td>

                  {/* Action buttons */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {(['Promoted', 'Retained', 'Graduated', 'TransferredOut'] as PromotionAction[]).map((act) => {
                        const c = actionConfig[act];
                        const isSelected = action === act;
                        return (
                          <button
                            key={act}
                            onClick={() => openPanel(e.id, act)}
                            title={isSelected ? `Click to clear (${c.label})` : `Set as ${c.label} — click to add details`}
                            className={clsx(
                              'p-1.5 rounded-md border transition-all duration-150 flex items-center justify-center',
                              isSelected
                                ? `${c.bg} ${c.color} ${c.border} shadow-md ring-2 ring-offset-1 scale-110`
                                : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:scale-105 hover:border-slate-300',
                              isSelected && act === 'Promoted'       && 'ring-blue-300',
                              isSelected && act === 'Retained'       && 'ring-amber-300',
                              isSelected && act === 'Graduated'      && 'ring-purple-300',
                              isSelected && act === 'TransferredOut' && 'ring-slate-300',
                            )}
                          >
                            <c.icon className="w-3.5 h-3.5" />
                          </button>
                        );
                      })}
                      {action && (
                        <button onClick={() => clearDecision(e.id)} title="Clear decision" className="ml-0.5 p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Detail summary inline */}
                  <td className="px-4 py-3 min-w-[180px]">
                    {detail ? (() => {
                      const IconComp = cfg!.icon;
                      return (
                        <button
                          onClick={() => openPanel(e.id, detail.action)}
                          className={clsx('text-left w-full group', cfg!.color)}
                        >
                          <div className="flex items-start gap-1.5">
                            <IconComp className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <div>
                              <div className={clsx('text-[11px] font-bold uppercase tracking-wide', cfg!.color)}>
                                {cfg!.label}
                              </div>
                              <div className="text-[11px] text-slate-500 group-hover:text-slate-700 leading-tight">
                                {rowDetailText || <span className="italic">click to edit</span>}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })() : (
                      <span className="text-[11px] text-slate-300 italic">No decision yet</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
            {activeEnrollments.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500">No active enrollments found for this year.</td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between sm:flex-row flex-col gap-3">
          <div className="text-[13px] text-slate-500">
            Showing <span className="font-medium text-slate-700">{activeEnrollments.length > 0 ? startIndex : 0}</span> to <span className="font-medium text-slate-700">{endIndex}</span> of <span className="font-medium text-slate-700">{activeEnrollments.length}</span> results
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-2 py-0.5 text-[13px] border border-slate-200 bg-white rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50 flex items-center gap-1 transition-colors">
                <ChevronLeft className="w-3 h-3" /> Previous
              </button>
              {getPageNumbers().map((page, idx) =>
                typeof page === 'string'
                  ? <span key={`e-${idx}`} className="px-2 py-0.5 text-[13px] text-slate-400">…</span>
                  : <button key={page} onClick={() => setCurrentPage(page)}
                      className={clsx('px-2 py-0.5 text-[13px] border rounded font-medium transition-colors',
                        currentPage === page ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')}>
                      {page}
                    </button>
              )}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-2 py-0.5 text-[13px] border border-slate-200 bg-white rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50 flex items-center gap-1 transition-colors">
                Next <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Execute */}
      <div className="flex justify-end">
        <button
          onClick={() => summary.decided > 0 ? setShowConfirm(true) : toast.error('No decisions made yet')}
          disabled={summary.decided === 0}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-md disabled:opacity-40"
        >
          <CheckCircle size={18} /> Execute Promotion Run ({summary.decided} students)
        </button>
      </div>

      {/* ── Detail Side Panel ──────────────────────────────────── */}
      <AnimatePresence>
        {detailPanel && panelEnrollment && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-slate-900/40 backdrop-blur-sm"
              onClick={() => { setDetailPanel(null); setDraft({}); }}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 z-[100] w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Panel header */}
              {(() => {
                const cfg = actionConfig[detailPanel.action];
                return (
                  <div className={clsx('px-6 py-4 border-b flex items-center justify-between', cfg.bg, cfg.border, 'border-b')}>
                    <div className="flex items-center gap-3">
                      <div className={clsx('w-9 h-9 rounded-full flex items-center justify-center border-2', cfg.bg, cfg.border)}>
                        <cfg.icon className={clsx('w-5 h-5', cfg.color)} />
                      </div>
                      <div>
                        <div className={clsx('text-xs font-bold uppercase tracking-widest', cfg.color)}>{cfg.label}</div>
                        <div className="text-sm font-semibold text-slate-800">{panelEnrollment.studentName}</div>
                        <div className="text-xs text-slate-500">{panelEnrollment.rollNumber} · {getClassLabel(panelEnrollment.classYearOfferingId)} · {getSectionLabel(panelEnrollment.sectionId)}</div>
                      </div>
                    </div>
                    <button onClick={() => { setDetailPanel(null); setDraft({}); }} className="p-2 rounded-full hover:bg-white/60 text-slate-500 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                );
              })()}

              {/* Panel body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                {/* ── PROMOTED ── */}
                {detailPanel.action === 'Promoted' && (
                  <>
                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                      <Info className="w-4 h-4 shrink-0" />
                      Student will be enrolled in the next academic year in the class and section you choose below.
                    </div>
                    <Field label="Target Academic Year" required>
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        {nextYear?.name || 'No draft year found'}
                      </div>
                    </Field>
                    <Field label="Target Class" required>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                          value={draft.targetOfferingId || ''}
                          onChange={(e) => setDraft((d) => ({ ...d, targetOfferingId: e.target.value, targetSectionId: '' }))}
                          className={clsx(selectCls, 'pl-9')}
                        >
                          <option value="">Select class…</option>
                          {nextYearOfferings.map((o) => (
                            <option key={o.id} value={o.id}>{getClassLabel(o.id)}</option>
                          ))}
                        </select>
                      </div>
                    </Field>
                    <Field label="Target Section" required>
                      <select
                        value={draft.targetSectionId || ''}
                        onChange={(e) => setDraft((d) => ({ ...d, targetSectionId: e.target.value }))}
                        className={selectCls}
                        disabled={!draft.targetOfferingId}
                      >
                        <option value="">Select section…</option>
                        {nextYearSections
                          .filter((s) => !draft.targetOfferingId || s.classYearOfferingId === draft.targetOfferingId)
                          .map((s) => (
                            <option key={s.id} value={s.id}>{s.name} ({s.enrolled}/{s.capacity} enrolled)</option>
                          ))}
                      </select>
                    </Field>
                    <Field label="Effective Date">
                      <input type="date" value={draft.effectiveDate || ''} onChange={(e) => setDraft((d) => ({ ...d, effectiveDate: e.target.value }))} className={inputCls} />
                    </Field>

                    {/* Preview */}
                    {draft.targetOfferingId && draft.targetSectionId && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                        <div className="text-xs font-bold text-blue-700 mb-1 uppercase">Promotion Preview</div>
                        <div className="text-slate-700">
                          <span className="font-medium">{panelEnrollment.studentName}</span> will move from{' '}
                          <span className="font-semibold text-slate-800">{getClassLabel(panelEnrollment.classYearOfferingId)} › {getSectionLabel(panelEnrollment.sectionId)}</span>
                          {' '}to{' '}
                          <span className="font-semibold text-blue-700">{getClassLabel(draft.targetOfferingId)} › {getSectionLabel(draft.targetSectionId)}</span>
                          {' '}in <span className="font-semibold">{nextYear?.name}</span>.
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ── RETAINED ── */}
                {detailPanel.action === 'Retained' && (
                  <>
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
                      <Info className="w-4 h-4 shrink-0" />
                      Student will repeat the same academic year. Select the reason and the section they'll be retained in.
                    </div>
                    <Field label="Reason for Retention" required>
                      <select value={draft.retainReason || ''} onChange={(e) => setDraft((d) => ({ ...d, retainReason: e.target.value }))} className={selectCls}>
                        <option value="">Select reason…</option>
                        {RETAIN_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </Field>
                    <Field label="Retain in Section (next year)">
                      <select
                        value={draft.retainSectionId || ''}
                        onChange={(e) => setDraft((d) => ({ ...d, retainSectionId: e.target.value }))}
                        className={selectCls}
                      >
                        <option value="">Same section as current</option>
                        {yearSections.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.enrolled}/{s.capacity})</option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-400 mt-1">Leave blank to keep them in their current section.</p>
                    </Field>
                    <Field label="Effective Date">
                      <input type="date" value={draft.retainDate || ''} onChange={(e) => setDraft((d) => ({ ...d, retainDate: e.target.value }))} className={inputCls} />
                    </Field>

                    {draft.retainReason && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                        <div className="text-xs font-bold text-amber-700 mb-1 uppercase">Retention Preview</div>
                        <div className="text-slate-700">
                          <span className="font-medium">{panelEnrollment.studentName}</span> will be retained in{' '}
                          <span className="font-semibold text-slate-800">{getClassLabel(panelEnrollment.classYearOfferingId)}</span> due to{' '}
                          <span className="font-semibold text-amber-700">"{draft.retainReason}"</span>.
                          {draft.retainSectionId && <> Section: <span className="font-semibold">{getSectionLabel(draft.retainSectionId)}</span>.</>}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ── GRADUATED ── */}
                {detailPanel.action === 'Graduated' && (
                  <>
                    <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-100 rounded-lg text-xs text-purple-700">
                      <Info className="w-4 h-4 shrink-0" />
                      Student has completed their schooling. Record the graduation date and certificate number.
                    </div>
                    <Field label="Graduation Date" required>
                      <input type="date" value={draft.graduationDate || ''} onChange={(e) => setDraft((d) => ({ ...d, graduationDate: e.target.value }))} className={inputCls} />
                    </Field>
                    <Field label="Certificate Number">
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. CERT-2026-001"
                          value={draft.certificateNo || ''}
                          onChange={(e) => setDraft((d) => ({ ...d, certificateNo: e.target.value }))}
                          className={clsx(inputCls, 'pl-9')}
                        />
                      </div>
                    </Field>

                    {draft.graduationDate && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm">
                        <div className="text-xs font-bold text-purple-700 mb-1 uppercase">Graduation Preview</div>
                        <div className="text-slate-700">
                          <span className="font-medium">{panelEnrollment.studentName}</span> will graduate from{' '}
                          <span className="font-semibold text-slate-800">{getClassLabel(panelEnrollment.classYearOfferingId)}</span> on{' '}
                          <span className="font-semibold text-purple-700">{draft.graduationDate}</span>.
                          {draft.certificateNo && <> Cert No: <span className="font-semibold">{draft.certificateNo}</span>.</>}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ── TRANSFERRED OUT ── */}
                {detailPanel.action === 'TransferredOut' && (
                  <>
                    <div className="flex items-center gap-2 p-3 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600">
                      <Info className="w-4 h-4 shrink-0" />
                      Student is leaving to another school. Record the destination and reason for transfer.
                    </div>
                    <Field label="Destination School" required>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. St. Mary's Academy"
                          value={draft.destinationSchool || ''}
                          onChange={(e) => setDraft((d) => ({ ...d, destinationSchool: e.target.value }))}
                          className={clsx(inputCls, 'pl-9')}
                        />
                      </div>
                    </Field>
                    <Field label="Transfer Date" required>
                      <input type="date" value={draft.transferDate || ''} onChange={(e) => setDraft((d) => ({ ...d, transferDate: e.target.value }))} className={inputCls} />
                    </Field>
                    <Field label="Reason for Transfer">
                      <select value={draft.transferReason || ''} onChange={(e) => setDraft((d) => ({ ...d, transferReason: e.target.value }))} className={selectCls}>
                        <option value="">Select reason…</option>
                        {TRANSFER_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </Field>

                    {draft.destinationSchool && (
                      <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-sm">
                        <div className="text-xs font-bold text-slate-600 mb-1 uppercase">Transfer Preview</div>
                        <div className="text-slate-700">
                          <span className="font-medium">{panelEnrollment.studentName}</span> will be transferred to{' '}
                          <span className="font-semibold text-slate-800">{draft.destinationSchool}</span>
                          {draft.transferDate && <> on <span className="font-semibold">{draft.transferDate}</span></>}.
                          {draft.transferReason && <> Reason: <span className="font-semibold">{draft.transferReason}</span>.</>}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Panel footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button
                  onClick={() => { setDetailPanel(null); setDraft({}); }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDetail}
                  className={clsx(
                    'flex-1 px-4 py-2.5 rounded-xl text-white font-semibold text-sm transition-all active:scale-95 shadow-sm',
                    detailPanel.action === 'Promoted'       && 'bg-blue-600 hover:bg-blue-700',
                    detailPanel.action === 'Retained'       && 'bg-amber-500 hover:bg-amber-600',
                    detailPanel.action === 'Graduated'      && 'bg-purple-600 hover:bg-purple-700',
                    detailPanel.action === 'TransferredOut' && 'bg-slate-600 hover:bg-slate-700',
                  )}
                >
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Confirm {actionConfig[detailPanel.action].label}
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Confirm Execute Modal ──────────────────────────────── */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 m-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 text-center mb-3">Confirm Promotion Run</h3>

              {/* Decision breakdown */}
              <div className="space-y-2 mb-4">
                {([
                  { action: 'Promoted'       as PromotionAction, count: summary.promoted },
                  { action: 'Retained'       as PromotionAction, count: summary.retained },
                  { action: 'Graduated'      as PromotionAction, count: summary.graduated },
                  { action: 'TransferredOut' as PromotionAction, count: summary.transferred },
                ] as { action: PromotionAction; count: number }[]).filter(({ count }) => count > 0).map(({ action, count }) => {
                  const cfg = actionConfig[action];
                  return (
                    <div key={action} className={clsx('flex items-center justify-between px-3 py-2 rounded-lg border', cfg.bg, cfg.border)}>
                      <span className={clsx('flex items-center gap-2 text-sm font-medium', cfg.color)}>
                        <cfg.icon className="w-4 h-4" /> {cfg.label}
                      </span>
                      <span className={clsx('text-sm font-bold', cfg.color)}>{count} student{count > 1 ? 's' : ''}</span>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-red-500 text-center mb-5">This action is irreversible. All statuses will be updated immediately.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold">Cancel</button>
                <button onClick={handleExecute} className="flex-1 px-4 py-2.5 rounded-xl text-white bg-red-600 hover:bg-red-700 font-semibold shadow-sm">Execute Now</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
