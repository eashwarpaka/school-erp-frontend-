import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, ShoppingCart, TrendingDown, AlertTriangle, 
  Plus, Search, Filter, Box, ArrowDownToLine, ArrowUpFromLine
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Item {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  lastRestocked: string;
}

const DUMMY_INVENTORY: Item[] = [
  { id: 'INV-001', name: 'A4 Printer Paper (Ream)', category: 'Stationery', stock: 15, minStock: 20, unit: 'Ream', lastRestocked: '2026-07-15' },
  { id: 'INV-002', name: 'Whiteboard Markers (Pack)', category: 'Classroom', stock: 45, minStock: 10, unit: 'Pack', lastRestocked: '2026-08-01' },
  { id: 'INV-003', name: 'Chemistry Lab Beakers (500ml)', category: 'Laboratory', stock: 8, minStock: 15, unit: 'Unit', lastRestocked: '2026-06-20' },
  { id: 'INV-004', name: 'Basketballs', category: 'Sports', stock: 25, minStock: 10, unit: 'Unit', lastRestocked: '2026-07-10' },
  { id: 'INV-005', name: 'Student Chairs (Standard)', category: 'Furniture', stock: 120, minStock: 50, unit: 'Unit', lastRestocked: '2026-05-05' },
];

export const InventoryProcurementDashboard = () => {
  const [items, setItems] = useState<Item[]>(DUMMY_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const lowStockItems = items.filter(i => i.stock < i.minStock);

  const handleRestock = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: i.stock + 50, lastRestocked: new Date().toISOString().split('T')[0] } : i));
    toast.success('Restock workflow initiated & inventory updated.');
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package size={24} className="text-purple-600" />
            Inventory & Procurement
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Centralized stock tracking, low-balance alerts, and vendor PO workflows.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 shadow-md transition-all">
          <ShoppingCart size={16} /> Create Purchase Order
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Unique Items', value: items.length, icon: Box, color: 'bg-blue-500' },
          { label: 'Low Stock Alerts', value: lowStockItems.length, icon: TrendingDown, color: 'bg-amber-500', alert: lowStockItems.length > 0 },
          { label: 'Pending POs', value: 3, icon: AlertTriangle, color: 'bg-purple-500' },
        ].map(kpi => (
          <div key={kpi.label} className={clsx('bg-white rounded-2xl border p-5 shadow-sm transition-all', kpi.alert ? 'border-amber-300 ring-2 ring-amber-500/20' : 'border-slate-100')}>
            <div className="flex items-center justify-between mb-3">
              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', kpi.color)}>
                <kpi.icon size={20} className="text-white" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-800">{kpi.value.toLocaleString()}</div>
            <div className="text-sm font-medium text-slate-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h3 className="font-bold text-slate-800">Master Stock List</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search items..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"><Filter size={18} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 border-b border-slate-100 z-10">
              <tr>
                <th className="px-5 py-3 font-semibold">Item Info</th>
                <th className="px-5 py-3 font-semibold">Stock Level</th>
                <th className="px-5 py-3 font-semibold">Min. Threshold</th>
                <th className="px-5 py-3 font-semibold">Last Restocked</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => {
                const isLow = item.stock < item.minStock;
                return (
                  <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.category} · {item.id}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={clsx('px-2.5 py-1 rounded-full text-xs font-bold', isLow ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700')}>
                        {item.stock} {item.unit}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{item.minStock} {item.unit}</td>
                    <td className="px-5 py-4 text-slate-600">{item.lastRestocked}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"><ArrowDownToLine size={16} /></button>
                        <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"><ArrowUpFromLine size={16} /></button>
                        {isLow && (
                          <button onClick={() => handleRestock(item.id)} className="px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs font-semibold rounded-lg transition-colors">
                            Restock
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
