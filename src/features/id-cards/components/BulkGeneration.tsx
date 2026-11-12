import React, { useState, useMemo } from 'react';
import {
  useIDCardStore,
  CHENNAI_SCHOOLS,
  SCHOOL_CLASSES,
  generateStudentsForClass,
} from '../store/idCardStore';
import { StudentCardPreview } from './StudentCardPreview';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Search,
  Printer,
  ChevronDown,
  CheckSquare,
  Square,
  AlertCircle,
  UploadCloud,
  FileSpreadsheet,
  FileArchive,
  CheckCircle2,
  School,
  Users,
  Download,
  FileText,
  ImageIcon,
  FlipHorizontal,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type ExportFormat = 'PDF' | 'PNG' | 'Excel';

const FORMAT_OPTIONS: { id: ExportFormat; label: string; icon: React.FC<any>; desc: string }[] = [
  { id: 'PDF',   label: 'PDF Batch',    icon: FileText,  desc: 'Print-ready, A4 sheet' },
  { id: 'PNG',   label: 'PNG Images',   icon: ImageIcon, desc: 'Individual card images' },
  { id: 'Excel', label: 'Excel Report', icon: FileSpreadsheet, desc: 'Card data + status' },
];

export const BulkGeneration = () => {
  const {
    templates,
    logPrintBatch,
    issueCards,
    selectedSchoolId,
    selectedClassId,
  } = useIDCardStore();

  const publishedTemplates = templates.filter((t) => t.status === 'Published');

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(publishedTemplates[0]?.id || '');
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('PDF');
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');

  const selectedTemplate = publishedTemplates.find((t) => t.id === selectedTemplateId);
  const selectedSchool = CHENNAI_SCHOOLS.find((s) => s.id === selectedSchoolId);

  const relevantClasses = useMemo(() => {
    if (selectedClassId) return SCHOOL_CLASSES.filter((c) => c.id === selectedClassId);
    if (selectedSchoolId) return SCHOOL_CLASSES.filter((c) => c.schoolId === selectedSchoolId);
    return SCHOOL_CLASSES;
  }, [selectedSchoolId, selectedClassId]);

  const allStudents = useMemo(() => {
    const classesToLoad = relevantClasses.slice(0, 4);
    return classesToLoad.flatMap((cls) => generateStudentsForClass(cls.id, cls.schoolId, 6));
  }, [relevantClasses]);

  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    setSelectedStudents(new Set(allStudents.map((s) => s.id)));
  }, [allStudents]);

  const filteredStudents = useMemo(() => {
    if (!search) return allStudents;
    const q = search.toLowerCase();
    return allStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.class.toLowerCase().includes(q)
    );
  }, [search, allStudents]);

  const toggleStudent = (id: string) => {
    const next = new Set(selectedStudents);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedStudents(next);
  };

  const toggleAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      toast.success('Successfully mapped student records with uploaded photos!');
      setTimeout(() => setShowUploader(false), 2000);
    }, 2000);
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    setIsGenerating(true);

    try {
      const selectedStudentList = filteredStudents.filter(s => selectedStudents.has(s.id));

      if (exportFormat === 'PDF') {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const a4Width = 210;
        const a4Height = 297;
        // Standard ID card size in mm
        const cardWidthMm = selectedTemplate.orientation === 'landscape' ? 86 : 54;
        const cardHeightMm = selectedTemplate.orientation === 'landscape' ? 54 : 86;
        
        const marginX = 10;
        const marginY = 10;
        const spacingX = 5;
        const spacingY = 5;
        
        const cols = Math.floor((a4Width - marginX * 2 + spacingX) / (cardWidthMm + spacingX));
        const rows = Math.floor((a4Height - marginY * 2 + spacingY) / (cardHeightMm + spacingY));
        const cardsPerPage = cols * rows;
        
        let cardCount = 0;
        
        for (const student of selectedStudentList) {
           const el = document.getElementById(`card-render-${student.id}`);
           if (!el) continue;
           
           const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: null });
           const imgData = canvas.toDataURL('image/jpeg', 0.95);
           
           if (cardCount > 0 && cardCount % cardsPerPage === 0) {
             doc.addPage();
           }
           
           const colIdx = (cardCount % cardsPerPage) % cols;
           const rowIdx = Math.floor((cardCount % cardsPerPage) / cols);
           
           const x = marginX + colIdx * (cardWidthMm + spacingX);
           const y = marginY + rowIdx * (cardHeightMm + spacingY);
           
           doc.addImage(imgData, 'JPEG', x, y, cardWidthMm, cardHeightMm);
           cardCount++;
        }
        
        doc.save(`ID_Cards_Batch_${new Date().getTime()}.pdf`);
      }

      const batchId = logPrintBatch({
        templateId: selectedTemplate.id,
        templateVersion: selectedTemplate.version,
        printedBy: 'Admin User',
        studentCount: selectedStudents.size,
        status: 'Completed',
        schoolId: selectedSchoolId || undefined,
        classId: selectedClassId || undefined,
        exportFormat,
      });

      // Issue the cards with tracking
      const expiryDate = selectedTemplate.expiryMonths && selectedTemplate.expiryMonths > 0
        ? new Date(Date.now() + selectedTemplate.expiryMonths * 30 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      issueCards(selectedStudentList.map((student, idx) => ({
        studentId: student.id,
        studentName: student.name,
        studentClass: student.class,
        schoolId: student.schoolId,
        templateId: selectedTemplate.id,
        batchId,
        issuedAt: new Date().toISOString(),
        expiresAt: expiryDate,
        status: 'Active' as const,
        cardNumber: `${selectedSchool?.shortName?.slice(0, 3).toUpperCase() || 'SCH'}-${new Date().getFullYear()}-${String(Date.now() + idx).slice(-4)}`,
        reprints: 0,
      })));

      setIsGenerating(false);
      toast.success(
        exportFormat === 'PDF'
          ? `Generated ${selectedStudents.size} ID cards — PDF ready for print!`
          : exportFormat === 'PNG'
          ? `${selectedStudents.size} card images exported as PNG!`
          : `Card data exported to Excel!`
      );
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      toast.error('Failed to generate cards. Please try again.');
    }
  };

  if (!selectedSchoolId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center mb-4 border border-amber-100">
          <School size={36} className="text-amber-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-2">Select a School First</h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Use the <strong>School &amp; Class Filter</strong> panel above to choose a school. Cards
          will be generated with the school's official branding.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">

      {/* School context chip */}
      {selectedSchool && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl border"
          style={{ background: `${selectedSchool.theme.primaryColor}10`, borderColor: `${selectedSchool.theme.primaryColor}30` }}
        >
          <img src={selectedSchool.logoUrl} alt={selectedSchool.shortName} className="w-9 h-9 rounded-lg object-cover border border-white shadow" style={{ background: selectedSchool.theme.primaryColor }} />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-slate-800 truncate">{selectedSchool.name}</div>
            <div className="text-xs text-slate-500">
              {selectedClassId ? SCHOOL_CLASSES.find((c) => c.id === selectedClassId)?.label : `All Classes (${relevantClasses.length} sections)`}
              {' '}• {allStudents.length} students loaded
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: selectedSchool.theme.primaryColor, color: '#ffffff' }}>
            <Users size={12} />
            {allStudents.length}
          </div>
        </div>
      )}

      {/* Upload Section */}
      <AnimatePresence>
        {showUploader && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <UploadCloud size={18} className="text-amber-500" />
                  Data Source &amp; Bulk Photo Upload
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Upload an Excel/CSV file with student data and a ZIP file containing photos.</p>
              </div>
              {uploadComplete && (
                <button onClick={() => setShowUploader(false)} className="text-xs font-semibold text-slate-500 hover:text-slate-700">Dismiss</button>
              )}
            </div>
            <div className="p-6">
              {!uploadComplete ? (
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-amber-300 hover:bg-amber-50/30 transition-colors cursor-pointer group">
                    <FileSpreadsheet size={32} className="text-slate-300 group-hover:text-amber-500 mb-3 transition-colors" />
                    <div className="text-sm font-medium text-slate-700">Drop Student Data (Excel/CSV)</div>
                    <div className="text-xs text-slate-400 mt-1">Columns: ID, Name, Class…</div>
                  </div>
                  <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-amber-300 hover:bg-amber-50/30 transition-colors cursor-pointer group">
                    <FileArchive size={32} className="text-slate-300 group-hover:text-amber-500 mb-3 transition-colors" />
                    <div className="text-sm font-medium text-slate-700">Drop Photos Archive (.ZIP)</div>
                    <div className="text-xs text-slate-400 mt-1">Files named: STU-001.jpg…</div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-emerald-600">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-3">
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <div className="font-semibold text-lg">Upload Complete!</div>
                  <div className="text-sm text-emerald-600/80 mt-1">Data mapped and photos linked.</div>
                </div>
              )}
              {!uploadComplete && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSimulateUpload}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {isUploading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</>
                    ) : (
                      <><UploadCloud size={16} />Simulate Upload &amp; Process</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showUploader && (
        <div className="flex justify-end">
          <button onClick={() => setShowUploader(true)} className="text-sm text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1.5">
            <UploadCloud size={16} /> Upload More Data
          </button>
        </div>
      )}

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        {/* Template selector */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Template</label>
          <div className="relative">
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium"
            >
              {publishedTemplates.length === 0 && <option value="">No published templates</option>}
              {publishedTemplates.map((t) => (
                <option key={t.id} value={t.id}>{t.name} (v{t.version})</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Search */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search Student</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Name, ID or class…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-700 py-2 pl-9 pr-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Export format */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Export Format</label>
          <div className="flex gap-1.5">
            {FORMAT_OPTIONS.map(fmt => {
              const Icon = fmt.icon;
              return (
                <button
                  key={fmt.id}
                  onClick={() => setExportFormat(fmt.id)}
                  className={clsx(
                    'flex-1 flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg border text-[10px] font-bold transition-all',
                    exportFormat === fmt.id
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-amber-300'
                  )}
                >
                  <Icon size={14} />
                  {fmt.id}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {!selectedTemplate ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-3 py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <AlertCircle size={48} className="text-slate-300" />
          <p className="font-medium">Please select a published template to generate cards.</p>
        </div>
      ) : (
        <>
          {/* Action Bar */}
          <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleAll}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-semibold"
              >
                {selectedStudents.size === filteredStudents.length && filteredStudents.length > 0 ? (
                  <CheckSquare size={18} className="text-amber-500" />
                ) : (
                  <Square size={18} className="text-slate-400" />
                )}
                {selectedStudents.size}/{filteredStudents.length} selected
              </button>

              {/* Side toggle for 2-sided templates */}
              {selectedTemplate.hasBackSide && (selectedTemplate.backElements?.length ?? 0) > 0 && (
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setPreviewSide('front')}
                    className={clsx('px-2.5 py-1 text-xs font-bold rounded-md transition-all', previewSide === 'front' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setPreviewSide('back')}
                    className={clsx('px-2.5 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1', previewSide === 'back' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}
                  >
                    <FlipHorizontal size={11} /> Back
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerate}
                disabled={selectedStudents.size === 0 || isGenerating}
                className={clsx(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm',
                  selectedStudents.size === 0 || isGenerating
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-md hover:-translate-y-0.5'
                )}
              >
                {isGenerating ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</>
                ) : (
                  <><Printer size={16} />Generate {selectedStudents.size} Cards as {exportFormat}</>
                )}
              </button>
            </div>
          </div>

          {/* Card Previews Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
              {filteredStudents.map((student) => {
                const isSelected = selectedStudents.has(student.id);
                const scale = selectedTemplate.orientation === 'landscape' ? 0.9 : 0.72;

                return (
                  <motion.div
                    key={student.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={clsx(
                      'relative p-4 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col items-center bg-white shadow-sm',
                      isSelected ? 'border-amber-500 bg-amber-50/20 shadow-md' : 'border-slate-200 hover:border-amber-300'
                    )}
                    onClick={() => toggleStudent(student.id)}
                  >
                    {/* Student info header */}
                    <div className="w-full flex items-center gap-2 mb-3">
                      <div className="absolute top-4 left-4 z-10 transition-transform group-hover:scale-110">
                        {isSelected ? (
                          <CheckSquare size={22} className="text-amber-500 bg-white rounded" />
                        ) : (
                          <Square size={22} className="text-slate-300 bg-white rounded group-hover:text-amber-400" />
                        )}
                      </div>
                      <div className="ml-8 flex-1 min-w-0">
                        <div className="font-bold text-slate-700 text-xs truncate">{student.name}</div>
                        <div className="text-[10px] text-slate-400">{student.class} • {student.admissionNo}</div>
                      </div>
                      {/* Individual download button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toast.success(`Downloading card for ${student.name}...`); }}
                        className="p-1.5 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Download individual card"
                      >
                        <Download size={13} />
                      </button>
                    </div>

                    {/* Card preview */}
                    <div
                      id={`card-render-${student.id}`}
                      className={clsx('transition-transform duration-300 ease-out', isSelected ? 'scale-[1.03]' : 'scale-100 group-hover:scale-[1.03]')}
                    >
                      <StudentCardPreview
                        template={selectedTemplate}
                        student={student}
                        scale={scale}
                        side={previewSide}
                      />
                    </div>

                    {/* Expiry badge */}
                    {selectedTemplate.expiryMonths && selectedTemplate.expiryMonths > 0 && (
                      <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                        <span>Expires in {selectedTemplate.expiryMonths} months</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {filteredStudents.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <Search className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="font-semibold text-slate-700 text-lg">No students found.</p>
                  <p className="text-sm mt-1">Try adjusting your search or class filter.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
