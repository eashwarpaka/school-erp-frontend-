import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, ShoppingCart, TrendingDown, AlertTriangle,
  Plus, Search, Filter, Box, Truck, Users, CheckCircle,
  ClipboardList, Settings, BarChart3, ArrowUpFromLine,
  ArrowDownToLine, Edit3, Trash2, Eye, DollarSign,
  FileText, Clock, Star, Building2, ChevronRight, Tag
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
interface InventoryItem {
  id: string; name: string; category: string; sku: string;
  stock: number; minStock: number; maxStock: number; unit: string;
  unitCost: number; totalValue: number; location: string;
  lastRestocked: string; status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface PurchaseOrder {
  id: string; vendor: string; items: number; totalAmount: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Delivered' | 'Cancelled';
  createdDate: string; expectedDelivery: string;
}

interface Vendor {
  id: string; name: string; category: string; phone: string;
  email: string; rating: number; totalOrders: number; lastOrder: string;
}

interface AssetItem {
  id: string; name: string; category: string; assignedTo: string;
  purchaseDate: string; purchaseCost: number; currentValue: number;
  condition: 'Good' | 'Fair' | 'Needs Repair' | 'Condemned';
  location: string;
}

interface IssueRecord {
  id: string; itemName: string; issuedTo: string; department: string;
  quantity: number; issueDate: string; returnDate: string | null;
  status: 'Issued' | 'Returned' | 'Lost';
}

// ── Mock Data ──────────────────────────────────────────────
const INVENTORY: InventoryItem[] = [
  { id: 'INV-001', name: 'A4 Printer Paper (Ream)', category: 'Stationery', sku: 'STN-001', stock: 15, minStock: 20, maxStock: 100, unit: 'Ream', unitCost: 350, totalValue: 5250, location: 'Store Room A', lastRestocked: '2026-07-15', status: 'Low Stock' },
  { id: 'INV-002', name: 'Whiteboard Markers (Pack)', category: 'Classroom', sku: 'CLS-001', stock: 45, minStock: 10, maxStock: 60, unit: 'Pack', unitCost: 150, totalValue: 6750, location: 'Store Room A', lastRestocked: '2026-08-01', status: 'In Stock' },
  { id: 'INV-003', name: 'Chemistry Lab Beakers (500ml)', category: 'Laboratory', sku: 'LAB-001', stock: 8, minStock: 15, maxStock: 50, unit: 'Unit', unitCost: 280, totalValue: 2240, location: 'Lab Store', lastRestocked: '2026-06-20', status: 'Low Stock' },
  { id: 'INV-004', name: 'Basketballs', category: 'Sports', sku: 'SPT-001', stock: 25, minStock: 10, maxStock: 30, unit: 'Unit', unitCost: 900, totalValue: 22500, location: 'Sports Room', lastRestocked: '2026-07-10', status: 'In Stock' },
  { id: 'INV-005', name: 'Student Chairs (Standard)', category: 'Furniture', sku: 'FUR-001', stock: 0, minStock: 50, maxStock: 200, unit: 'Unit', unitCost: 2500, totalValue: 0, location: 'Classroom', lastRestocked: '2026-05-05', status: 'Out of Stock' },
  { id: 'INV-006', name: 'Projector Bulbs', category: 'Electronics', sku: 'ELT-001', stock: 5, minStock: 3, maxStock: 10, unit: 'Unit', unitCost: 4500, totalValue: 22500, location: 'IT Room', lastRestocked: '2026-08-15', status: 'In Stock' },
];

const PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-2026-001', vendor: 'Office Supplies India', items: 5, totalAmount: 45000, status: 'Delivered', createdDate: '2026-08-10', expectedDelivery: '2026-08-20' },
  { id: 'PO-2026-002', vendor: 'Lab Equipment Co.', items: 3, totalAmount: 28000, status: 'Approved', createdDate: '2026-09-05', expectedDelivery: '2026-09-25' },
  { id: 'PO-2026-003', vendor: 'SportZone Ltd.', items: 8, totalAmount: 15000, status: 'Submitted', createdDate: '2026-09-15', expectedDelivery: '2026-10-01' },
  { id: 'PO-2026-004', vendor: 'Furniture World', items: 10, totalAmount: 125000, status: 'Draft', createdDate: '2026-09-18', expectedDelivery: '' },
];

const VENDORS: Vendor[] = [
  { id: 'VND-001', name: 'Office Supplies India', category: 'Stationery', phone: '+91 98765 11111', email: 'orders@officesupplies.in', rating: 4.5, totalOrders: 24, lastOrder: '2026-08-10' },
  { id: 'VND-002', name: 'Lab Equipment Co.', category: 'Laboratory', phone: '+91 98765 22222', email: 'sales@labequip.co', rating: 4.2, totalOrders: 12, lastOrder: '2026-09-05' },
  { id: 'VND-003', name: 'SportZone Ltd.', category: 'Sports', phone: '+91 98765 33333', email: 'bulk@sportzone.com', rating: 4.8, totalOrders: 8, lastOrder: '2026-09-15' },
  { id: 'VND-004', name: 'Furniture World', category: 'Furniture', phone: '+91 98765 44444', email: 'orders@furworld.in', rating: 3.9, totalOrders: 6, lastOrder: '2026-05-05' },
];

const ASSETS: AssetItem[] = [
  { id: 'AST-001', name: 'Dell Laptop (Latitude)', category: 'IT', assignedTo: 'Computer Lab 1', purchaseDate: '2024-06-15', purchaseCost: 65000, currentValue: 45000, condition: 'Good', location: 'CS Lab' },
  { id: 'AST-002', name: 'Epson Projector', category: 'AV Equipment', assignedTo: 'Conference Hall', purchaseDate: '2023-01-10', purchaseCost: 85000, currentValue: 50000, condition: 'Fair', location: 'Hall A' },
  { id: 'AST-003', name: 'Air Conditioner (1.5T)', category: 'HVAC', assignedTo: 'Principal Office', purchaseDate: '2022-04-20', purchaseCost: 42000, currentValue: 25000, condition: 'Needs Repair', location: 'Admin Block' },
];

const ISSUES: IssueRecord[] = [
  { id: 'ISS-001', itemName: 'Whiteboard Markers (10 pack)', issuedTo: 'Mr. Rajesh Kumar', department: 'Physics', quantity: 2, issueDate: '2026-09-10', returnDate: null, status: 'Issued' },
  { id: 'ISS-002', itemName: 'Basketballs', issuedTo: 'Sports Department', department: 'Sports', quantity: 5, issueDate: '2026-09-12', returnDate: '2026-09-14', status: 'Returned' },
  { id: 'ISS-003', itemName: 'Chemistry Beakers', issuedTo: 'Dr. Meera Nair', department: 'Chemistry Lab', quantity: 10, issueDate: '2026-09-08', returnDate: null, status: 'Issued' },
];

type TabKey = 'stock' | 'orders' | 'vendors' | 'assets' | 'issues';

const tabItems: { key: TabKey; label: string; icon: typeof Package }[] = [
  { key: 'stock', label: 'Stock', icon: Package },
  { key: 'orders', label: 'Purchase Orders', icon: ShoppingCart },
  { key: 'vendors', label: 'Vendors', icon: Building2 },
  { key: 'assets', label: 'Assets', icon: Box },
  { key: 'issues', label: 'Issue / Return', icon: ArrowUpFromLine },
];

const stockStatusColors = { 'In Stock': 'bg-emerald-100 text-emerald-700', 'Low Stock': 'bg-amber-100 text-amber-700', 'Out of Stock': 'bg-red-100 text-red-700' };
const poStatusColors: Record<string, string> = { Draft: 'bg-slate-100 text-slate-600', Submitted: 'bg-blue-100 text-blue-700', Approved: 'bg-emerald-100 text-emerald-700', Delivered: 'bg-purple-100 text-purple-700', Cancelled: 'bg-red-100 text-red-700' };
const conditionColors: Record<string, string> = { Good: 'bg-emerald-100 text-emerald-700', Fair: 'bg-amber-100 text-amber-700', 'Needs Repair': 'bg-red-100 text-red-700', Condemned: 'bg-slate-100 text-slate-600' };

// ── Component ──────────────────────────────────────────────
export const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPOModal, setShowNewPOModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);
  const [restockItemData, setRestockItemData] = useState<InventoryItem | null>(null);

  const lowStockCount = INVENTORY.filter(i => i.status !== 'In Stock').length;
  const totalValue = INVENTORY.reduce((s, i) => s + i.totalValue, 0);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package size={26} className="text-purple-600" /> Inventory & Procurement
          </h1>
          <p className="text-sm text-slate-500 mt-1">Stock management, purchase orders, vendor directory, and asset tracking</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowNewPOModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-purple-200">
            <Plus size={15} /> New PO
          </button>
          <button onClick={() => setShowAddItemModal(true)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm hover:bg-slate-50">
            <Plus size={15} /> Add Item
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Items', value: INVENTORY.length, icon: Package, color: 'text-blue-600' },
          { label: 'Low Stock', value: lowStockCount, icon: AlertTriangle, color: lowStockCount > 0 ? 'text-red-600' : 'text-slate-400' },
          { label: 'Stock Value', value: `₹${(totalValue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-emerald-600' },
          { label: 'Open POs', value: PURCHASE_ORDERS.filter(p => !['Delivered', 'Cancelled'].includes(p.status)).length, icon: ShoppingCart, color: 'text-purple-600' },
          { label: 'Vendors', value: VENDORS.length, icon: Building2, color: 'text-amber-600' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="bg-white rounded-xl border border-slate-100 p-3 text-center"
          >
            <stat.icon size={18} className={clsx('mx-auto mb-1.5', stat.color)} />
            <div className="text-lg font-bold text-slate-800">{stat.value}</div>
            <div className="text-[10px] text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto bg-slate-100 rounded-xl p-1">
        {tabItems.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={clsx('flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all',
              activeTab === tab.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <tab.icon size={13} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Stock Tab */}
      {activeTab === 'stock' && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search items..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200" /></div>
          </div>
          <table className="w-full">
            <thead><tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Item</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">SKU</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Stock</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Value</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Location</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Actions</th>
            </tr></thead>
            <tbody>
              {INVENTORY.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3"><div className="text-sm font-medium text-slate-800">{item.name}</div><div className="text-[11px] text-slate-500">{item.category}</div></td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-600">{item.sku}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-slate-800">{item.stock} {item.unit}s</div>
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                      <div className={clsx('h-full rounded-full', item.stock === 0 ? 'bg-red-500' : item.stock < item.minStock ? 'bg-amber-500' : 'bg-emerald-500')}
                        style={{ width: `${Math.min(100, (item.stock / item.maxStock) * 100)}%` }} />
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full', stockStatusColors[item.status])}>{item.status}</span></td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">₹{item.totalValue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.location}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setRestockItemData(item)} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-[11px] font-medium hover:bg-purple-200">Restock</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Purchase Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {PURCHASE_ORDERS.map(po => (
            <motion.div key={po.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -1 }}
              className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={() => toast.success(`Opening ${po.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold text-indigo-600">{po.id}</div>
                  <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full', poStatusColors[po.status])}>{po.status}</span>
                </div>
                <div className="text-lg font-bold text-slate-800">₹{po.totalAmount.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Building2 size={11} /> {po.vendor}</span>
                <span className="flex items-center gap-1"><Package size={11} /> {po.items} items</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {po.createdDate}</span>
                {po.expectedDelivery && <span className="flex items-center gap-1"><Truck size={11} /> ETA: {po.expectedDelivery}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Vendors Tab */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VENDORS.map(v => (
            <div key={v.id} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div><div className="font-semibold text-slate-800">{v.name}</div><div className="text-xs text-slate-500">{v.category}</div></div>
                <div className="flex items-center gap-0.5 text-amber-500">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={12} fill={i < Math.round(v.rating) ? 'currentColor' : 'none'} />)}<span className="text-xs text-slate-600 ml-1">{v.rating}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg">
                <div>📧 {v.email}</div><div>📞 {v.phone}</div>
                <div>📦 {v.totalOrders} orders</div><div>📅 Last: {v.lastOrder}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Asset</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Assigned To</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Purchase Cost</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Current Value</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Condition</th>
            </tr></thead>
            <tbody>
              {ASSETS.map(a => (
                <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3"><div className="text-sm font-medium text-slate-800">{a.name}</div><div className="text-[11px] text-slate-500">{a.category} • {a.location}</div></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{a.assignedTo}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">₹{a.purchaseCost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">₹{a.currentValue.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full', conditionColors[a.condition])}>{a.condition}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Issue/Return Tab */}
      {activeTab === 'issues' && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 text-sm">Issue / Return Log</h3>
            <button onClick={() => setShowNewIssueModal(true)} className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium"><Plus size={12} /> New Issue</button>
          </div>
          <table className="w-full">
            <thead><tr className="bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Item</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Issued To</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Qty</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Issue Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Return Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
            </tr></thead>
            <tbody>
              {ISSUES.map(i => (
                <tr key={i.id} className="border-b border-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{i.itemName}</td>
                  <td className="px-4 py-3"><div className="text-sm text-slate-700">{i.issuedTo}</div><div className="text-[11px] text-slate-500">{i.department}</div></td>
                  <td className="px-4 py-3 text-sm text-slate-700">{i.quantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{i.issueDate}</td>
                  <td className="px-4 py-3 text-sm">{i.returnDate || <span className="text-amber-600">Pending</span>}</td>
                  <td className="px-4 py-3"><span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full', i.status === 'Returned' ? 'bg-emerald-100 text-emerald-700' : i.status === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')}>{i.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AnimatePresence>
        {/* New PO Modal */}
        {showNewPOModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewPOModal(false)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><ShoppingCart className="text-purple-600" size={20} /> Create Purchase Order</h2>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Vendor</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white">
                      <option value="">-- Choose Vendor --</option>
                      {VENDORS.map(v => <option key={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Items to Order</label>
                    <textarea className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none h-24" placeholder="List items or link to requisitions..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expected Delivery</label>
                    <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Total (₹)</label>
                    <input type="number" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="0" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowNewPOModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={() => { setShowNewPOModal(false); toast.success('Purchase Order created as Draft!'); }}
                  className="px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700">Save as Draft</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add Item Modal */}
        {showAddItemModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddItemModal(false)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Package className="text-purple-600" size={20} /> Add Inventory Item</h2>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                    <input className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="e.g. Notebooks" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <input className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="e.g. Stationery" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                    <input className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="Auto-generated if empty" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Initial Stock</label>
                    <input type="number" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                    <input className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="e.g. Pack, Unit, Kg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unit Cost (₹)</label>
                    <input type="number" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="e.g. Store Room A" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowAddItemModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={() => { setShowAddItemModal(false); toast.success('Item added successfully!'); }}
                  className="px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700">Save Item</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Restock Modal */}
        {restockItemData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setRestockItemData(null)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><ArrowDownToLine className="text-emerald-600" size={20} /> Restock Item</h2>
              
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-5">
                <div className="font-semibold text-slate-800 text-sm mb-1">{restockItemData.name}</div>
                <div className="text-xs text-slate-500 mb-2">SKU: <span className="font-mono">{restockItemData.sku}</span> • Current Stock: {restockItemData.stock} {restockItemData.unit}s</div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-500">Min Stock: {restockItemData.minStock}</span>
                  <span className="text-xs text-slate-500">Max Stock: {restockItemData.maxStock}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity to Order</label>
                  <input type="number" defaultValue={restockItemData.maxStock > restockItemData.stock ? restockItemData.maxStock - restockItemData.stock : 0} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Add to PO</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white">
                    <option>Create New PO</option>
                    {PURCHASE_ORDERS.filter(p => p.status === 'Draft').map(p => (
                      <option key={p.id}>Add to {p.id}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setRestockItemData(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={() => { setRestockItemData(null); toast.success('Restock request processed!'); }}
                  className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700">Confirm Restock</button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* New Issue Modal */}
        {showNewIssueModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewIssueModal(false)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><ArrowUpFromLine className="text-purple-600" size={20} /> Issue Inventory Item</h2>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Item to Issue</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white">
                      <option value="">-- Choose Item --</option>
                      {INVENTORY.filter(i => i.stock > 0).map(i => <option key={i.id}>{i.name} (Stock: {i.stock})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Issue To</label>
                    <input className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="Name or ID" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                    <input className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="e.g. Physics, Admin" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                    <input type="number" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expected Return (Optional)</label>
                    <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
                    <textarea className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none h-16" placeholder="Purpose or condition of item..." />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowNewIssueModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={() => { setShowNewIssueModal(false); toast.success('Item issued successfully!'); }}
                  className="px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700">Confirm Issue</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
