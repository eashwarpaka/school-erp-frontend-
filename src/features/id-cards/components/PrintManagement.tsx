import React, { useState, useMemo } from 'react';
import { useIDCardStore, PrintBatch } from '../store/idCardStore';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Printer, Calendar, Users, CheckCircle, Download, FileText, FileImage, FileSpreadsheet, XCircle, Clock, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const FORMAT_ICON: Record<string, React.FC<any>> = {
  PDF: FileText,
  PNG: FileImage,
  Excel: FileSpreadsheet,
};

const FORMAT_STYLE: Record<string, { bg: string; text: string }> = {
  PDF:   { bg: 'bg-red-50',    text: 'text-red-600'   },
  PNG:   { bg: 'bg-blue-50',   text: 'text-blue-600'  },
  Excel: { bg: 'bg-emerald-50',text: 'text-emerald-600' },
};

export const PrintManagement = () => {
  const { printBatches, templates } = useIDCardStore();
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof PrintBatch, direction: 'asc' | 'desc' } | null>(null);

  const filtered = useMemo(() => {
    let result = printBatches.filter(b => {
      if (!search) return true;
      const tmpl = templates.find(t => t.id === b.templateId);
      return (
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.printedBy.toLowerCase().includes(search.toLowerCase()) ||
        (tmpl?.name || '').toLowerCase().includes(search.toLowerCase())
      );
    });

    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;
        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  }, [printBatches, templates, search, sortConfig]);

  const requestSort = (key: keyof PrintBatch) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Summary stats
  const totalCards = printBatches.reduce((acc, b) => acc + b.studentCount, 0);
  const completed = printBatches.filter(b => b.status === 'Completed').length;
  const failed = printBatches.filter(b => b.status === 'Failed').length;

  const handleDownload = (id: string, format?: string) => {
    const batch = printBatches.find(b => b.id === id);
    if (!batch) return;

    if (format === 'PDF' || !format) {
      const doc = new jsPDF();
      const template = templates.find(t => t.id === batch.templateId);
      
      doc.setFontSize(18);
      doc.text('Print Batch Report', 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Batch ID: ${batch.id}`, 14, 32);
      doc.text(`Template: ${template?.name || 'Unknown'} (v${batch.templateVersion})`, 14, 40);
      doc.text(`Printed By: ${batch.printedBy}`, 14, 48);
      doc.text(`Date: ${new Date(batch.printedAt).toLocaleString('en-IN')}`, 14, 56);
      doc.text(`Total Cards: ${batch.studentCount}`, 14, 64);
      doc.text(`Status: ${batch.status}`, 14, 72);

      // We use autoTable to generate a mock list of students in the batch
      autoTable(doc, {
        startY: 85,
        head: [['#', 'Student Name', 'Card Number', 'Status']],
        body: Array.from({ length: Math.min(batch.studentCount, 50) }).map((_, i) => [
          (i + 1).toString(),
          `Student ${i + 1}`,
          `CARD-${new Date(batch.printedAt).getFullYear()}-${String(i + 1).padStart(4, '0')}`,
          'Printed'
        ]),
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 95] }
      });

      doc.save(`batch_${batch.id}.pdf`);
      toast.success(`Batch ${batch.id} downloaded successfully!`);
    } else if (format === 'PNG') {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, 600, 400);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(`Print Batch Report: ${batch.id}`, 40, 60);
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText(`Template: ${batch.templateId}`, 40, 100);
        ctx.fillText(`Printed By: ${batch.printedBy}`, 40, 130);
        ctx.fillText(`Total Cards: ${batch.studentCount}`, 40, 160);
        ctx.fillText(`Status: ${batch.status}`, 40, 190);
        
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(40, 240, 520, 100);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'italic 16px sans-serif';
        ctx.fillText('Generated batch images archive representation', 60, 295);

        const link = document.createElement('a');
        link.download = `batch_${batch.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success(`Batch ${batch.id} downloaded successfully!`);
      }
    } else if (format === 'Excel') {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Student Name,Card Number,Status\n" 
        + Array.from({length: Math.min(batch.studentCount, 100)}).map((_, i) => `Student ${i+1},CARD-${new Date(batch.printedAt).getFullYear()}-${String(i+1).padStart(4, '0')},Printed`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `batch_${batch.id}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Batch ${batch.id} downloaded successfully!`);
    } else {
      toast.success(`Downloading batch ${id} as ${format}...`);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-5">

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Batches', value: printBatches.length, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
          { label: 'Cards Printed', value: totalCards, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
          { label: 'Completed', value: completed, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        ].map(stat => (
          <div key={stat.label} className={clsx('rounded-xl px-4 py-3 border', stat.bg, stat.border)}>
            <div className={clsx('text-2xl font-black', stat.color)}>{stat.value}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Header + search */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-bold text-slate-800">Print History &amp; Batches</h2>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search batches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 outline-none w-52"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th onClick={() => requestSort('id')} className="px-5 py-3.5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                  Batch ID {sortConfig?.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('templateId')} className="px-5 py-3.5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                  Template {sortConfig?.key === 'templateId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('printedBy')} className="px-5 py-3.5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                  Printed By {sortConfig?.key === 'printedBy' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('printedAt')} className="px-5 py-3.5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                  Date &amp; Time {sortConfig?.key === 'printedAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('studentCount')} className="px-5 py-3.5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                  Cards {sortConfig?.key === 'studentCount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('exportFormat')} className="px-5 py-3.5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                  Format {sortConfig?.key === 'exportFormat' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('status')} className="px-5 py-3.5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                  Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-5 py-3.5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filtered.map((batch, index) => {
                  const template = templates.find(t => t.id === batch.templateId);
                  const templateName = template ? template.name : 'Unknown Template';
                  const FmtIcon = batch.exportFormat ? (FORMAT_ICON[batch.exportFormat] || FileText) : FileText;
                  const fmtStyle = batch.exportFormat ? (FORMAT_STYLE[batch.exportFormat] || FORMAT_STYLE.PDF) : FORMAT_STYLE.PDF;

                  return (
                    <motion.tr
                      key={batch.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-slate-400" />
                          <span className="font-mono text-xs font-bold text-slate-700">{batch.id}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-slate-800 font-semibold text-xs">{templateName}</div>
                        <div className="text-[10px] text-slate-400">v{batch.templateVersion}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 text-xs">{batch.printedBy}</td>
                      <td className="px-5 py-3.5 text-slate-600 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-400" />
                          {new Date(batch.printedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                          <Users size={12} className="text-slate-500" />
                          {batch.studentCount}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {batch.exportFormat && (
                          <div className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold', fmtStyle.bg, fmtStyle.text)}>
                            <FmtIcon size={10} />
                            {batch.exportFormat}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={clsx(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                          batch.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          batch.status === 'Failed' ? 'bg-red-50 text-red-700 border-red-100' :
                          'bg-amber-50 text-amber-700 border-amber-100'
                        )}>
                          {batch.status === 'Completed' && <CheckCircle size={10} />}
                          {batch.status === 'Failed' && <XCircle size={10} />}
                          {batch.status === 'Pending' && <Clock size={10} />}
                          {batch.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDownload(batch.id, batch.exportFormat)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all shadow-sm"
                          >
                            <Download size={12} />
                            {batch.exportFormat || 'PDF'}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-500">
                    <Printer className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="font-semibold">No print batches found.</p>
                    {search && <p className="text-sm mt-1 text-slate-400">Try clearing your search.</p>}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
            Showing {filtered.length} of {printBatches.length} batches • {totalCards} total cards printed
          </div>
        )}
      </div>
    </div>
  );
};
