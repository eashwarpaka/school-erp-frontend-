import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CreditCard, RotateCcw, XCircle, AlertTriangle, Clock, ShieldCheck, RefreshCw, ChevronDown, Printer, Download } from 'lucide-react';
import { useIDCardStore, CardStatus, IssuedCard } from '../store/idCardStore';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const STATUS_STYLES: Record<CardStatus, { label: string; class: string; icon: React.FC<any> }> = {
  Active:   { label: 'Active',   class: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: ShieldCheck },
  Expired:  { label: 'Expired',  class: 'bg-red-50 text-red-700 border-red-200',             icon: Clock },
  Lost:     { label: 'Lost',     class: 'bg-amber-50 text-amber-700 border-amber-200',       icon: AlertTriangle },
  Revoked:  { label: 'Revoked',  class: 'bg-purple-50 text-purple-700 border-purple-200',    icon: XCircle },
  Reissued: { label: 'Reissued', class: 'bg-sky-50 text-sky-700 border-sky-200',             icon: RefreshCw },
};

const STATUS_ACTIONS: Record<CardStatus, CardStatus[]> = {
  Active:   ['Lost', 'Revoked', 'Expired'],
  Expired:  ['Reissued'],
  Lost:     ['Reissued', 'Revoked'],
  Revoked:  [],
  Reissued: ['Active', 'Lost', 'Revoked'],
};

const StatusBadge = ({ status }: { status: CardStatus }) => {
  const cfg = STATUS_STYLES[status];
  const Icon = cfg.icon;
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border', cfg.class)}>
      <Icon size={10} />
      {cfg.label}
    </span>
  );
};

const CardActionsDropdown = ({ card }: { card: IssuedCard }) => {
  const [open, setOpen] = useState(false);
  const { updateCardStatus, reprintCard } = useIDCardStore();
  const actions = STATUS_ACTIONS[card.status];

  const handleAction = (newStatus: CardStatus) => {
    updateCardStatus(card.id, newStatus);
    toast.success(`Card status updated to ${newStatus}`);
    setOpen(false);
  };

  const handleReprint = () => {
    reprintCard(card.id);
    toast.success(`Reprint initiated for ${card.studentName}`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
      >
        Actions
        <ChevronDown size={12} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-20 min-w-[150px]"
            >
              {/* Reprint always available */}
              <button
                onClick={handleReprint}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                <Printer size={12} className="text-slate-400" /> Reprint Card
              </button>
              {actions.length > 0 && <div className="h-px bg-slate-100 mx-2" />}
              {actions.map((action) => {
                const cfg = STATUS_STYLES[action];
                const Icon = cfg.icon;
                return (
                  <button
                    key={action}
                    onClick={() => handleAction(action)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 transition-colors"
                  >
                    <Icon size={12} className="text-slate-400" />
                    <span>Mark as {action}</span>
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const IssuedCardsTracker: React.FC = () => {
  const { issuedCards } = useIDCardStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CardStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof IssuedCard, direction: 'asc' | 'desc' } | null>(null);

  const filtered = useMemo(() => {
    let result = issuedCards.filter((card) => {
      const matchesSearch = !search || 
        card.studentName.toLowerCase().includes(search.toLowerCase()) ||
        card.cardNumber.toLowerCase().includes(search.toLowerCase()) ||
        card.studentClass.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || card.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key] as any;
        const bVal = b[sortConfig.key] as any;
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
  }, [issuedCards, search, statusFilter, sortConfig]);

  const requestSort = (key: keyof IssuedCard) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleExport = () => {
    toast.success('Exporting card registry to Excel...');
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, card no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['All', 'Active', 'Expired', 'Lost', 'Revoked', 'Reissued'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={clsx(
                  'px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border',
                  statusFilter === s
                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
        >
          <Download size={13} />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th onClick={() => requestSort('cardNumber')} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-100">
                  Card No. {sortConfig?.key === 'cardNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('studentName')} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-100">
                  Student {sortConfig?.key === 'studentName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('studentClass')} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-100">
                  Class {sortConfig?.key === 'studentClass' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('issuedAt')} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-100">
                  Issued On {sortConfig?.key === 'issuedAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('expiresAt')} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-100">
                  Expires {sortConfig?.key === 'expiresAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('reprints')} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-100 text-center">
                  Reprints {sortConfig?.key === 'reprints' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('status')} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-100">
                  Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filtered.map((card, idx) => (
                  <motion.tr
                    key={card.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard size={14} className="text-slate-400 flex-shrink-0" />
                        <span className="font-mono text-xs font-bold text-slate-700">{card.cardNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800 text-xs">{card.studentName}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{card.studentClass}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(card.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {card.expiresAt
                        ? <span className={clsx(new Date(card.expiresAt) < new Date() ? 'text-red-600 font-semibold' : 'text-slate-500')}>
                            {new Date(card.expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        : <span className="text-slate-400">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-center">
                      {card.reprints > 0
                        ? <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">{card.reprints}x</span>
                        : <span className="text-xs text-slate-400">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={card.status} />
                    </td>
                    <td className="px-4 py-3">
                      <CardActionsDropdown card={card} />
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-medium text-sm">No cards found matching your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
            Showing {filtered.length} of {issuedCards.length} issued cards
          </div>
        )}
      </div>
    </div>
  );
};
