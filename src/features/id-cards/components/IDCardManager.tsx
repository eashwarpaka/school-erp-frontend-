import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { CreditCard, Printer, History, BarChart3, ShieldCheck } from 'lucide-react';
import { TemplateList } from './TemplateList';
import { BulkGeneration } from './BulkGeneration';
import { PrintManagement } from './PrintManagement';
import { SchoolClassSelector } from './SchoolClassSelector';
import { CardStatsOverview } from './CardStatsOverview';
import { IssuedCardsTracker } from './IssuedCardsTracker';
import { useIDCardStore } from '../store/idCardStore';

type Tab = 'overview' | 'templates' | 'generate' | 'tracker' | 'history';

const tabs: { id: Tab; label: string; icon: React.FC<any>; badge?: (counts: Record<string, number>) => number | null }[] = [
  { id: 'overview',   label: 'Overview',         icon: BarChart3   },
  { id: 'templates',  label: 'Template Designer', icon: CreditCard  },
  { id: 'generate',   label: 'Generate & Print',  icon: Printer     },
  {
    id: 'tracker',
    label: 'Card Tracker',
    icon: ShieldCheck,
    badge: (counts) => (counts.lost + counts.expired) > 0 ? counts.lost + counts.expired : null,
  },
  { id: 'history',    label: 'Print History',     icon: History     },
];

export const IDCardManager = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { issuedCards } = useIDCardStore();

  const counts = {
    lost: issuedCards.filter(c => c.status === 'Lost').length,
    expired: issuedCards.filter(c => c.status === 'Expired').length,
  };

  return (
    <div className="w-full p-2 sm:p-4 text-slate-800">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500 mb-4 flex-wrap">
        <NavLink to="/admin" className="hover:text-amber-600 transition-colors">School Admin</NavLink>
        <span className="mx-2">/</span>
        <span className="text-amber-600 font-medium">ID Card Management</span>
      </div>

      {/* Page Title */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">ID Card Management</h1>
          <p className="text-sm text-slate-500">Design templates, generate bulk cards, track issuance, and manage printing.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 font-semibold">
            <ShieldCheck size={13} />
            {issuedCards.filter(c => c.status === 'Active').length} Active Cards
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[600px] overflow-hidden flex flex-col">
        {/* School & Class Selector */}
        <SchoolClassSelector />

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100/70 p-1 mx-4 sm:mx-6 mt-4 rounded-xl w-fit max-w-full overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const badgeCount = tab.badge?.(counts);
            return (
              <button
                key={tab.id}
                id={`idcard-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap',
                  isActive ? 'text-amber-700' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="idcard-tab-active"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon size={16} className={isActive ? 'text-amber-600' : 'text-slate-400'} />
                  {tab.label}
                  {badgeCount != null && (
                    <span className="ml-0.5 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-black rounded-full min-w-[18px] text-center leading-none">
                      {badgeCount}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 mt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-6 h-full"
            >
              {activeTab === 'overview'   && <CardStatsOverview />}
              {activeTab === 'templates'  && <TemplateList />}
              {activeTab === 'generate'   && <BulkGeneration />}
              {activeTab === 'tracker'    && <IssuedCardsTracker />}
              {activeTab === 'history'    && <PrintManagement />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
