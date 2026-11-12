import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  Award, FileText, Download, Eye, Plus, Search, Filter,
  Copy, Printer, ChevronRight, CheckCircle, Clock, Users,
  Star, Settings, Zap, Layers, GraduationCap, Shield,
  BookOpen, Medal, Palette, Edit3, Trash2, Send
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
type CertificateType = 'Transfer' | 'Bonafide' | 'Character' | 'Merit' | 'Sports' | 'Participation' | 'Custom';
type CertStatus = 'Draft' | 'Generated' | 'Issued' | 'Revoked';

interface CertificateTemplate {
  id: string;
  name: string;
  type: CertificateType;
  description: string;
  thumbnail: string;
  usageCount: number;
  lastUsed: string;
  isDefault: boolean;
}

interface IssuedCertificate {
  id: string;
  studentName: string;
  studentId: string;
  certificateType: CertificateType;
  templateId: string;
  issuedDate: string;
  status: CertStatus;
  serialNumber: string;
  grade: string;
  reason: string;
}

// ── Mock Data ──────────────────────────────────────────────
const TEMPLATES: CertificateTemplate[] = [
  { id: 'TPL-001', name: 'Transfer Certificate', type: 'Transfer', description: 'Official TC for student transfer to another institution', thumbnail: '📜', usageCount: 245, lastUsed: '2026-09-15', isDefault: true },
  { id: 'TPL-002', name: 'Bonafide Certificate', type: 'Bonafide', description: 'Proof of enrollment and attendance for official purposes', thumbnail: '📋', usageCount: 389, lastUsed: '2026-09-17', isDefault: true },
  { id: 'TPL-003', name: 'Character Certificate', type: 'Character', description: 'Character and conduct certificate for students', thumbnail: '🏅', usageCount: 167, lastUsed: '2026-09-12', isDefault: true },
  { id: 'TPL-004', name: 'Merit Certificate', type: 'Merit', description: 'Academic excellence and achievement recognition', thumbnail: '🏆', usageCount: 524, lastUsed: '2026-09-18', isDefault: true },
  { id: 'TPL-005', name: 'Sports Achievement', type: 'Sports', description: 'Sports and athletic achievement recognition', thumbnail: '⚽', usageCount: 98, lastUsed: '2026-08-20', isDefault: true },
  { id: 'TPL-006', name: 'Event Participation', type: 'Participation', description: 'Participation certificate for school events', thumbnail: '🎪', usageCount: 312, lastUsed: '2026-09-10', isDefault: true },
];

const ISSUED_CERTS: IssuedCertificate[] = [
  { id: 'CERT-001', studentName: 'Arjun Patel', studentId: 'STU-001', certificateType: 'Transfer', templateId: 'TPL-001', issuedDate: '2026-09-15', status: 'Issued', serialNumber: 'TC/2026/0451', grade: 'Grade 10-A', reason: 'Family relocation to Mumbai' },
  { id: 'CERT-002', studentName: 'Sneha Gupta', studentId: 'STU-024', certificateType: 'Bonafide', templateId: 'TPL-002', issuedDate: '2026-09-17', status: 'Issued', serialNumber: 'BC/2026/1234', grade: 'Grade 11-B', reason: 'Passport application' },
  { id: 'CERT-003', studentName: 'Rohit Sharma', studentId: 'STU-056', certificateType: 'Merit', templateId: 'TPL-004', issuedDate: '2026-09-18', status: 'Generated', serialNumber: 'MC/2026/0089', grade: 'Grade 12-A', reason: 'Science Olympiad — 1st Place' },
  { id: 'CERT-004', studentName: 'Fatima Ali', studentId: 'STU-089', certificateType: 'Character', templateId: 'TPL-003', issuedDate: '2026-09-12', status: 'Issued', serialNumber: 'CC/2026/0567', grade: 'Grade 10-B', reason: 'Higher studies application' },
  { id: 'CERT-005', studentName: 'Vikram Singh', studentId: 'STU-032', certificateType: 'Sports', templateId: 'TPL-005', issuedDate: '2026-08-20', status: 'Issued', serialNumber: 'SC/2026/0023', grade: 'Grade 9-C', reason: 'Inter-school Cricket Tournament — MVP' },
  { id: 'CERT-006', studentName: 'Ananya Reddy', studentId: 'STU-045', certificateType: 'Transfer', templateId: 'TPL-001', issuedDate: '2026-09-14', status: 'Draft', serialNumber: 'TC/2026/0452', grade: 'Grade 8-A', reason: 'Transfer to international school' },
];

const typeColors: Record<CertificateType, { bg: string; text: string; border: string }> = {
  Transfer: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Bonafide: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Character: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Merit: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Sports: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  Participation: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  Custom: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

const statusColors: Record<CertStatus, string> = {
  Draft: 'bg-slate-100 text-slate-600',
  Generated: 'bg-blue-100 text-blue-700',
  Issued: 'bg-emerald-100 text-emerald-700',
  Revoked: 'bg-red-100 text-red-700',
};

// ── Component ──────────────────────────────────────────────
export const CertificatesDashboard = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'issued' | 'bulk'>('templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [templates, setTemplates] = useState<CertificateTemplate[]>(TEMPLATES);
  const [issuedCerts, setIssuedCerts] = useState<IssuedCertificate[]>(ISSUED_CERTS);
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null>(null);
  const [generateForm, setGenerateForm] = useState({ studentName: '', reason: '' });
  const [showPreview, setShowPreview] = useState(false);
  const [previewCert, setPreviewCert] = useState<IssuedCertificate | null>(null);

  const filteredCerts = issuedCerts.filter(c =>
    c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.certificateType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalIssued: issuedCerts.filter(c => c.status === 'Issued').length,
    pending: issuedCerts.filter(c => c.status === 'Draft' || c.status === 'Generated').length,
    templates: templates.length,
    thisMonth: issuedCerts.filter(c => c.issuedDate.startsWith('2026-09')).length,
  };

  const handleDownloadPDF = async (cert: IssuedCertificate, elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    try {
      toast.loading('Generating PDF...', { id: 'pdf' });
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cert.serialNumber.replace(/\//g, '-')}.pdf`);
      toast.success('PDF downloaded successfully!', { id: 'pdf' });
    } catch (error) {
      toast.error('Failed to generate PDF', { id: 'pdf' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePreviewTemplate = (tpl: CertificateTemplate) => {
    setPreviewCert({
      id: 'preview',
      studentName: 'Student Name',
      studentId: 'STU-000',
      certificateType: tpl.type,
      templateId: tpl.id,
      issuedDate: new Date().toISOString().split('T')[0],
      status: 'Draft',
      serialNumber: 'XX/2026/0000',
      grade: 'Grade X',
      reason: 'Sample Reason'
    });
    setShowPreview(true);
  };

  const submitGenerate = () => {
    if (!selectedTemplate) return;
    const newCert: IssuedCertificate = {
      id: `CERT-${Date.now()}`,
      studentName: generateForm.studentName || 'Unknown Student',
      studentId: `STU-${Math.floor(Math.random() * 900) + 100}`,
      certificateType: selectedTemplate.type,
      templateId: selectedTemplate.id,
      issuedDate: new Date().toISOString().split('T')[0],
      status: 'Generated',
      serialNumber: `${selectedTemplate.type.charAt(0)}C/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      grade: 'Grade 10',
      reason: generateForm.reason || 'Requested'
    };
    setIssuedCerts([newCert, ...issuedCerts]);
    setShowGenerateModal(false);
    setGenerateForm({ studentName: '', reason: '' });
    toast.success('Certificate generated successfully!');
    setPreviewCert(newCert);
    setShowPreview(true);
  };

  const handleGenerate = (template: CertificateTemplate) => {
    setSelectedTemplate(template);
    setShowGenerateModal(true);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto print:p-0 print:m-0 print:block">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-preview, #certificate-preview * {
            visibility: visible;
          }
          #certificate-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: none !important;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Award size={28} className="text-amber-500" />
            Certificate Generator
          </h1>
          <p className="text-sm text-slate-500 mt-1">Generate, manage, and issue official school certificates</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-amber-200"
          >
            <Plus size={16} /> Generate Certificate
          </motion.button>
          <button
            onClick={() => toast.success('Opening bulk generation...')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
          >
            <Layers size={15} /> Bulk Generate
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Issued This Month', value: stats.thisMonth, icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
          { label: 'Pending / Draft', value: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-600' },
          { label: 'Total Issued', value: stats.totalIssued, icon: Award, color: 'from-blue-500 to-indigo-600' },
          { label: 'Templates', value: stats.templates, icon: Palette, color: 'from-purple-500 to-pink-600' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-slate-100 p-4"
          >
            <div className={clsx('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3', stat.color)}>
              <stat.icon size={18} className="text-white" />
            </div>
            <div className="text-xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 w-fit">
        {(['templates', 'issued', 'bulk'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-5 py-2 text-sm font-medium rounded-lg capitalize transition-all',
              activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {tab === 'templates' ? '📜 Templates' : tab === 'issued' ? '📋 Issued' : '📦 Bulk Generate'}
          </button>
        ))}
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tpl, i) => {
            const colors = typeColors[tpl.type];
            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className={clsx('bg-white rounded-xl border p-5 cursor-pointer group hover:shadow-lg transition-all', colors.border)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center text-2xl', colors.bg)}>
                    {tpl.thumbnail}
                  </div>
                  {tpl.isDefault && (
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full font-medium">Default</span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">{tpl.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tpl.description}</p>

                <div className="flex items-center gap-3 mt-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><FileText size={11} /> {tpl.usageCount} issued</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {tpl.lastUsed}</span>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={e => { e.stopPropagation(); handleGenerate(tpl); }}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors"
                  >
                    <Zap size={12} /> Generate
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setEditingTemplate({ ...tpl }); }}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handlePreviewTemplate(tpl); }}
                    className="py-2 px-3 bg-slate-50 text-slate-600 rounded-lg text-xs hover:bg-slate-100 transition-colors"
                  >
                    <Eye size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* Add Custom Template */}
          <motion.div
            whileHover={{ y: -3 }}
            className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:border-amber-300 hover:bg-amber-50/30 transition-all min-h-[200px]"
            onClick={() => toast.success('Opening template designer...')}
          >
            <Plus size={32} className="text-slate-300 mb-3" />
            <span className="text-sm font-medium text-slate-500">Create Custom Template</span>
            <span className="text-xs text-slate-400 mt-1">Design your own certificate</span>
          </motion.div>
        </div>
      )}

      {/* Issued Certificates Tab */}
      {activeTab === 'issued' && (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, serial number, or type..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Serial No.</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Student</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Reason</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCerts.map(cert => {
                    const colors = typeColors[cert.certificateType];
                    return (
                      <tr key={cert.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="text-sm font-mono font-medium text-slate-700">{cert.serialNumber}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-slate-800">{cert.studentName}</div>
                          <div className="text-xs text-slate-500">{cert.studentId} • {cert.grade}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={clsx('text-xs font-medium px-2 py-1 rounded-full', colors.bg, colors.text)}>
                            {cert.certificateType}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-slate-600 truncate max-w-[200px] block">{cert.reason}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{cert.issuedDate}</td>
                        <td className="px-4 py-3">
                          <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full', statusColors[cert.status])}>
                            {cert.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => { setPreviewCert(cert); setShowPreview(true); }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="Preview"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setPreviewCert(cert);
                                setShowPreview(true);
                                setTimeout(() => handleDownloadPDF(cert, 'certificate-preview'), 300);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Download PDF"
                            >
                              <Download size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setPreviewCert(cert);
                                setShowPreview(true);
                                setTimeout(handlePrint, 300);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Print"
                            >
                              <Printer size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Generate Tab */}
      {activeTab === 'bulk' && (
        <div className="bg-white rounded-xl border border-slate-100 p-8">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Layers size={32} className="text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Bulk Certificate Generation</h2>
            <p className="text-sm text-slate-500 mb-6">Generate certificates for entire classes or sections at once</p>

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Certificate Type</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200">
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Grade</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200">
                    {Array.from({ length: 12 }, (_, i) => <option key={i}>Grade {i + 1}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200">
                    <option>All Sections</option>
                    <option>Section A</option>
                    <option>Section B</option>
                    <option>Section C</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason / Occasion</label>
                <input
                  type="text"
                  placeholder="e.g., Annual Day Awards 2026"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-3">
                <Users size={20} className="text-amber-600 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <strong>45 students</strong> will receive this certificate based on your selection.
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toast.success('Generating 45 certificates... This may take a moment.')}
              className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-amber-200"
            >
              <Zap size={16} /> Generate All Certificates
            </motion.button>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {showPreview && previewCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Preview Content */}
              <div id="certificate-preview" className="bg-gradient-to-br from-amber-50 via-white to-amber-50 p-8 border-8 border-amber-200 m-4 rounded-xl relative print:m-0 print:border-8 print:border-amber-200">
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-amber-400" />
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-amber-400" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-amber-400" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-amber-400" />

                <div className="text-center">
                  <div className="text-3xl mb-2">🏫</div>
                  <h2 className="text-lg font-bold text-amber-800">Smart School ERP Academy</h2>
                  <p className="text-xs text-amber-600">Affiliated to CBSE, New Delhi</p>

                  <div className="mt-6 mb-4">
                    <Award size={40} className="mx-auto text-amber-500 mb-2" />
                    <h3 className="text-xl font-bold text-slate-800 uppercase tracking-widest">
                      {previewCert.certificateType} Certificate
                    </h3>
                    <div className="text-xs text-slate-500 mt-1">Serial No: {previewCert.serialNumber}</div>
                  </div>

                  <div className="mt-6 text-sm text-slate-700 leading-relaxed max-w-md mx-auto">
                    This is to certify that <strong className="text-slate-900">{previewCert.studentName}</strong> (ID: {previewCert.studentId}),
                    a student of <strong>{previewCert.grade}</strong>, has been studying in this institution.
                    {previewCert.certificateType === 'Character' && ' Their character and conduct have been found satisfactory during the entire period of study.'}
                    {previewCert.certificateType === 'Merit' && ` They have been awarded this certificate in recognition of: ${previewCert.reason}.`}
                    {previewCert.certificateType === 'Transfer' && ` This certificate is issued on account of: ${previewCert.reason}.`}
                  </div>

                  <div className="mt-8 flex justify-between items-end px-4">
                    <div className="text-left">
                      <div className="text-xs text-slate-500">Date of Issue</div>
                      <div className="text-sm font-medium text-slate-800">{previewCert.issuedDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="w-32 border-b border-slate-400 mb-1" />
                      <div className="text-xs text-slate-500">Principal's Signature</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadPDF(previewCert, 'certificate-preview')}
                    className="print-hidden flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
                  >
                    <Download size={14} /> Download PDF
                  </button>
                  <button
                    onClick={handlePrint}
                    className="print-hidden flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                  >
                    <Printer size={14} /> Print
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Modal */}
      <AnimatePresence>
        {showGenerateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowGenerateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-1">Generate Certificate</h2>
              <p className="text-sm text-slate-500 mb-5">{selectedTemplate?.name || 'Select a template type'}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Certificate Type</label>
                  <select 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                    value={selectedTemplate?.id || ''}
                    onChange={(e) => setSelectedTemplate(templates.find(t => t.id === e.target.value) || null)}
                  >
                    <option value="" disabled>Select a template</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
                  <input 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" 
                    placeholder="Enter student name..." 
                    value={generateForm.studentName}
                    onChange={(e) => setGenerateForm({ ...generateForm, studentName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reason / Purpose</label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none"
                    placeholder="e.g., Family relocation, passport application, etc."
                    value={generateForm.reason}
                    onChange={(e) => setGenerateForm({ ...generateForm, reason: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowGenerateModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button
                  onClick={submitGenerate}
                  className="px-4 py-2.5 bg-amber-600 text-white text-sm font-medium rounded-xl hover:bg-amber-700"
                >
                  Generate & Preview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Edit Template Modal */}
      <AnimatePresence>
        {editingTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:hidden"
            onClick={() => setEditingTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-5">Edit Template</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input 
                    value={editingTemplate.name}
                    onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingTemplate.description}
                    onChange={e => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setEditingTemplate(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button
                  onClick={() => {
                    setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
                    setEditingTemplate(null);
                    toast.success('Template updated successfully!');
                  }}
                  className="px-4 py-2.5 bg-amber-600 text-white text-sm font-medium rounded-xl hover:bg-amber-700"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
