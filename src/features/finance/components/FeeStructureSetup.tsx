import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, ChevronDown, CalendarIcon } from 'lucide-react';
import clsx from 'clsx';

export const FeeStructureSetup = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);

  const [lines, setLines] = useState([
    { id: 1, category: 'Tuition Fee', currency: 'INR', amount: '850.00', taxId: '-', taxAmt: '0.00', mandatory: 'Yes', applyDate: '', dueDate: '' },
    { id: 2, category: 'Activity Fee', currency: 'INR', amount: '120.00', taxId: '-', taxAmt: '0.00', mandatory: 'Yes', applyDate: '', dueDate: '' },
    { id: 3, category: 'Bus / Transport', currency: 'INR', amount: '200.00', taxId: '-', taxAmt: '0.00', mandatory: 'No', applyDate: '', dueDate: '' },
  ]);

  const addLine = () => {
    setLines([...lines, { id: Date.now(), category: 'Select...', currency: 'INR', amount: '0.00', taxId: '-', taxAmt: '0.00', mandatory: 'Yes', applyDate: '', dueDate: '' }]);
  };

  const removeLine = (id: number) => {
    setLines(lines.filter(line => line.id !== id));
  };

  const NativeSelect = ({ value, options, className }: { value: string, options: string[], className?: string }) => (
    <div className={clsx("relative", className)}>
      <select
        value={value}
        onChange={() => { }}
        className="w-full appearance-none bg-white border border-slate-200 px-3 py-1.5 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-700 font-medium shadow-sm transition-colors"
      >
        <option value={value}>{value}</option>
        {options.filter(o => o !== value).map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>
  );

  return (
    <div className="w-full p-1 sm:p-2 text-slate-800">
      {/* Breadcrumb Area */}
      <div className="mb-4">
        <div className="text-sm text-amber-600 hover:underline cursor-pointer mb-1 inline-block">
          School Finance <span className="text-slate-400 mx-1">/</span> Fee Structures <span className="text-slate-400 mx-1">/</span> New
        </div>
        <h1 className="text-xl font-normal text-slate-900 mb-1">Fee Structure Setup</h1>
      </div>

      {/* Structure Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-medium text-slate-800">Structure Header</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <NativeSelect value="2025-2026" options={['2024-2025', '2025-2026', '2026-2027']} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Term
              </label>
              <NativeSelect value="All Terms" options={['All Terms', 'Term 1', 'Term 2', 'Term 3']} />
              <p className="text-[11px] text-slate-400 mt-1">Leave blank to apply to all terms.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Class
              </label>
              <NativeSelect value="All Classes" options={['All Classes', 'Grade 6', 'Grade 7', 'Grade 8']} />
              <p className="text-[11px] text-slate-400 mt-1">Leave blank to apply to all classes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Fee Structure Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Grade 6 Term 2 Fees 2025"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Active
              </label>
              <div className="flex items-center mt-1.5">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  onClick={() => setIsActive(!isActive)}
                  className={clsx(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
                    isActive ? "bg-amber-500" : "bg-slate-200"
                  )}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      isActive ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
                <span className="text-sm text-slate-600 font-medium ml-2">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Breakup Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-800">Fee Breakup / Line Items </h2>
          <button
            onClick={addLine}
            className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1 rounded-md text-xs font-medium transition-colors shadow-sm flex items-center gap-1"
          >
            <Plus size={14} /> Add Line
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3 w-48">FEE CATEGORY</th>
                <th className="px-4 py-3 w-28">CURRENCY</th>
                <th className="px-4 py-3 w-32">AMOUNT</th>
                <th className="px-4 py-3 w-24">TAX ID</th>
                <th className="px-4 py-3 w-32">TAX AMT</th>
                <th className="px-4 py-3 w-32">MANDATORY</th>
                <th className="px-4 py-3 w-40">APPLY DATE</th>
                <th className="px-4 py-3 w-40">DUE DATE</th>
                <th className="px-4 py-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lines.map((line) => (
                <tr key={line.id} className="hover:bg-slate-50/20 transition-colors">
                  <td className="px-4 py-3">
                    <NativeSelect value={line.category} options={['Tuition Fee', 'Activity Fee', 'Bus / Transport', 'Boarding Fee', 'Uniform Fee']} />
                  </td>
                  <td className="px-4 py-3">
                    <NativeSelect value={line.currency} options={['INR', 'USD']} />
                  </td>
                  <td className="px-4 py-3">
                    <input type="text" defaultValue={line.amount} className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="text" defaultValue={line.taxId} disabled className="w-full px-3 py-1.5 border border-slate-100 bg-slate-50 text-slate-400 rounded-md text-sm cursor-not-allowed shadow-inner" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="text" defaultValue={line.taxAmt} disabled className="w-full px-3 py-1.5 border border-slate-100 bg-slate-50 text-slate-400 rounded-md text-sm cursor-not-allowed shadow-inner" />
                  </td>
                  <td className="px-4 py-3">
                    <NativeSelect value={line.mandatory} options={['Yes', 'No']} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <input type="date" className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:cursor-pointer" />
                      <CalendarIcon size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <input type="date" className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:cursor-pointer" />
                      <CalendarIcon size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => removeLine(line.id)}
                      className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100 hover:text-red-600 transition-colors border border-red-100 shadow-sm"
                    >
                      <X size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end text-sm">
          <div className="text-slate-600">
            Total (mandatory): <span className="font-semibold text-slate-900">INR 970.00</span>
            <span className="mx-3 text-slate-300">|</span>
            With optional: <span className="font-semibold text-slate-900">INR 1,170.00</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
          Save for Authorization
        </button>
        <button
          onClick={() => navigate('/finance/structures')}
          className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          Cancel
        </button>
      </div>

    </div>
  );
};
