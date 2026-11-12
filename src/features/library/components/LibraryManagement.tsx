import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Plus, Clock, CheckCircle, AlertCircle,
  ChevronRight, Hash, Bookmark, Users, BarChart3,
  DollarSign, Filter, Calendar, Star, QrCode,
  ArrowDownToLine, ArrowUpFromLine, Eye, Edit3, Trash2,
  ScanLine, FileText, TrendingUp, AlertTriangle, RefreshCw
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
interface Book {
  id: string; isbn: string; title: string; author: string;
  category: string; publisher: string; edition: string;
  totalCopies: number; available: number;
  status: 'Available' | 'All Issued' | 'Low Stock';
  shelfLocation: string; addedDate: string;
}

interface Circulation {
  id: string; bookTitle: string; isbn: string; memberName: string;
  memberId: string; memberType: 'Student' | 'Staff';
  issueDate: string; dueDate: string; returnDate: string | null;
  fine: number; status: 'Issued' | 'Returned' | 'Overdue' | 'Lost';
}

interface Fine {
  id: string; memberName: string; memberId: string;
  bookTitle: string; amount: number; reason: string;
  status: 'Unpaid' | 'Paid' | 'Waived'; date: string;
}

interface Reservation {
  id: string; bookTitle: string; memberName: string; memberId: string;
  reservedDate: string; status: 'Waiting' | 'Available' | 'Expired' | 'Fulfilled';
  queuePosition: number;
}

// ── Mock Data ──────────────────────────────────────────────
const BOOKS: Book[] = [
  { id: 'B-1001', isbn: '978-0131103627', title: 'The C Programming Language', author: 'Brian W. Kernighan', category: 'Computer Science', publisher: 'Prentice Hall', edition: '2nd', totalCopies: 5, available: 3, status: 'Available', shelfLocation: 'CS-A-12', addedDate: '2023-06-15' },
  { id: 'B-1002', isbn: '978-0201896831', title: 'The Art of Computer Programming', author: 'Donald E. Knuth', category: 'Computer Science', publisher: 'Addison-Wesley', edition: '3rd', totalCopies: 3, available: 0, status: 'All Issued', shelfLocation: 'CS-A-15', addedDate: '2022-01-10' },
  { id: 'B-1003', isbn: '978-1420959828', title: 'The Republic', author: 'Plato', category: 'Philosophy', publisher: 'Dover', edition: '1st', totalCopies: 4, available: 2, status: 'Available', shelfLocation: 'PH-B-03', addedDate: '2024-03-20' },
  { id: 'B-1004', isbn: '978-0385490818', title: 'The Handmaid\'s Tale', author: 'Margaret Atwood', category: 'Fiction', publisher: 'Anchor', edition: '1st', totalCopies: 6, available: 5, status: 'Available', shelfLocation: 'FI-C-08', addedDate: '2024-09-05' },
  { id: 'B-1005', isbn: '978-0141439518', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Literature', publisher: 'Penguin', edition: '1st', totalCopies: 8, available: 1, status: 'Low Stock', shelfLocation: 'LI-A-22', addedDate: '2023-11-01' },
  { id: 'B-1006', isbn: '978-0547928227', title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fiction', publisher: 'Mariner', edition: '1st', totalCopies: 4, available: 4, status: 'Available', shelfLocation: 'FI-C-12', addedDate: '2025-01-15' },
];

const CIRCULATIONS: Circulation[] = [
  { id: 'CIR-001', bookTitle: 'The Art of Computer Programming', isbn: '978-0201896831', memberName: 'Arjun Patel', memberId: 'STU-001', memberType: 'Student', issueDate: '2026-09-01', dueDate: '2026-09-15', returnDate: null, fine: 30, status: 'Overdue' },
  { id: 'CIR-002', bookTitle: 'Pride and Prejudice', isbn: '978-0141439518', memberName: 'Ms. Anita Desai', memberId: 'STF-015', memberType: 'Staff', issueDate: '2026-09-10', dueDate: '2026-10-10', returnDate: null, fine: 0, status: 'Issued' },
  { id: 'CIR-003', bookTitle: 'The C Programming Language', isbn: '978-0131103627', memberName: 'Rohit Sharma', memberId: 'STU-056', memberType: 'Student', issueDate: '2026-08-20', dueDate: '2026-09-03', returnDate: '2026-09-02', fine: 0, status: 'Returned' },
  { id: 'CIR-004', bookTitle: 'The Republic', isbn: '978-1420959828', memberName: 'Fatima Ali', memberId: 'STU-089', memberType: 'Student', issueDate: '2026-09-05', dueDate: '2026-09-19', returnDate: null, fine: 0, status: 'Issued' },
  { id: 'CIR-005', bookTitle: 'The Art of Computer Programming', isbn: '978-0201896831', memberName: 'Mr. Arun Patel', memberId: 'STF-022', memberType: 'Staff', issueDate: '2026-09-08', dueDate: '2026-10-08', returnDate: null, fine: 0, status: 'Issued' },
];

const FINES: Fine[] = [
  { id: 'FN-001', memberName: 'Arjun Patel', memberId: 'STU-001', bookTitle: 'The Art of Computer Programming', amount: 30, reason: 'Overdue by 3 days', status: 'Unpaid', date: '2026-09-18' },
  { id: 'FN-002', memberName: 'Sneha Gupta', memberId: 'STU-024', bookTitle: 'Introduction to Algorithms', amount: 50, reason: 'Overdue by 5 days', status: 'Paid', date: '2026-09-10' },
  { id: 'FN-003', memberName: 'Vikram Singh', memberId: 'STU-032', bookTitle: 'Physics for Engineers', amount: 500, reason: 'Book lost', status: 'Unpaid', date: '2026-09-15' },
];

const RESERVATIONS: Reservation[] = [
  { id: 'RES-001', bookTitle: 'The Art of Computer Programming', memberName: 'Kavya Nair', memberId: 'STU-045', reservedDate: '2026-09-12', status: 'Waiting', queuePosition: 1 },
  { id: 'RES-002', bookTitle: 'The Art of Computer Programming', memberName: 'Divya Sharma', memberId: 'STU-067', reservedDate: '2026-09-14', status: 'Waiting', queuePosition: 2 },
  { id: 'RES-003', bookTitle: 'Pride and Prejudice', memberName: 'Ananya Reddy', memberId: 'STU-034', reservedDate: '2026-09-16', status: 'Available', queuePosition: 0 },
];

type TabKey = 'catalog' | 'circulation' | 'fines' | 'reservations' | 'reports';

const tabItems: { key: TabKey; label: string; icon: typeof BookOpen }[] = [
  { key: 'catalog', label: 'Catalog', icon: BookOpen },
  { key: 'circulation', label: 'Circulation', icon: RefreshCw },
  { key: 'fines', label: 'Fines', icon: DollarSign },
  { key: 'reservations', label: 'Reservations', icon: Bookmark },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
];

const bookStatusColors = { Available: 'bg-emerald-100 text-emerald-700', 'All Issued': 'bg-red-100 text-red-700', 'Low Stock': 'bg-amber-100 text-amber-700' };
const circulationStatusColors: Record<string, string> = { Issued: 'bg-blue-100 text-blue-700', Returned: 'bg-emerald-100 text-emerald-700', Overdue: 'bg-red-100 text-red-700', Lost: 'bg-slate-100 text-slate-600' };
const fineStatusColors = { Unpaid: 'bg-red-100 text-red-700', Paid: 'bg-emerald-100 text-emerald-700', Waived: 'bg-slate-100 text-slate-600' };
const reservationStatusColors: Record<string, string> = { Waiting: 'bg-amber-100 text-amber-700', Available: 'bg-emerald-100 text-emerald-700', Expired: 'bg-red-100 text-red-700', Fulfilled: 'bg-blue-100 text-blue-700' };

// ── Component ──────────────────────────────────────────────
export const LibraryManagement = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [returnBookData, setReturnBookData] = useState<Circulation | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [collectFineData, setCollectFineData] = useState<Fine | null>(null);
  const [waiveFineData, setWaiveFineData] = useState<Fine | null>(null);
  const [issueReservationData, setIssueReservationData] = useState<Reservation | null>(null);
  const [notifyReservationData, setNotifyReservationData] = useState<Reservation | null>(null);

  const stats = {
    totalBooks: BOOKS.reduce((s, b) => s + b.totalCopies, 0),
    available: BOOKS.reduce((s, b) => s + b.available, 0),
    issued: CIRCULATIONS.filter(c => c.status === 'Issued').length,
    overdue: CIRCULATIONS.filter(c => c.status === 'Overdue').length,
    pendingFines: FINES.filter(f => f.status === 'Unpaid').reduce((s, f) => s + f.amount, 0),
    reservations: RESERVATIONS.filter(r => r.status === 'Waiting').length,
  };

  const filteredBooks = BOOKS.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.isbn.includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen size={26} className="text-orange-600" /> Library Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Book catalog, circulation, fines, reservations & reports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowIssueModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-orange-200">
            <ArrowUpFromLine size={15} /> Issue Book
          </button>
          <button onClick={() => setShowAddBookModal(true)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm hover:bg-slate-50">
            <Plus size={15} /> Add Book
          </button>
          <button onClick={() => setShowScanModal(true)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm hover:bg-slate-50">
            <ScanLine size={15} /> Scan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: 'text-blue-600' },
          { label: 'Available', value: stats.available, icon: CheckCircle, color: 'text-emerald-600' },
          { label: 'Issued', value: stats.issued, icon: ArrowUpFromLine, color: 'text-amber-600' },
          { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: stats.overdue > 0 ? 'text-red-600' : 'text-slate-400' },
          { label: 'Pending Fines', value: `₹${stats.pendingFines}`, icon: DollarSign, color: stats.pendingFines > 0 ? 'text-red-600' : 'text-slate-400' },
          { label: 'Reservations', value: stats.reservations, icon: Bookmark, color: 'text-purple-600' },
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
            {tab.key === 'fines' && stats.pendingFines > 0 && <span className="ml-1 text-[9px] px-1.5 py-0.5 bg-red-500 text-white rounded-full">{FINES.filter(f => f.status === 'Unpaid').length}</span>}
          </button>
        ))}
      </div>

      {/* Catalog Tab */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by title, author, or ISBN..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book, i) => (
              <motion.div key={book.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                whileHover={{ y: -2 }} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setSelectedBook(book)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-2xl flex-shrink-0">📖</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2">{book.title}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">{book.author}</div>
                    <div className="text-[11px] text-slate-400">{book.publisher} • {book.edition} Edition</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{book.isbn}</span>
                    <span>📍 {book.shelfLocation}</span>
                  </div>
                  <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full', bookStatusColors[book.status])}>{book.available}/{book.totalCopies}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Circulation Tab */}
      {activeTab === 'circulation' && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Book</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Member</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Issue Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Due Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Action</th>
            </tr></thead>
            <tbody>
              {CIRCULATIONS.map(c => (
                <tr key={c.id} className={clsx('border-b border-slate-50 hover:bg-slate-50/50', c.status === 'Overdue' && 'bg-red-50/30')}>
                  <td className="px-4 py-3"><div className="text-sm font-medium text-slate-800">{c.bookTitle}</div><div className="text-[11px] text-slate-500">{c.isbn}</div></td>
                  <td className="px-4 py-3"><div className="text-sm text-slate-700">{c.memberName}</div><div className="text-[11px] text-slate-500">{c.memberId} • {c.memberType}</div></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{c.issueDate}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{c.dueDate}</td>
                  <td className="px-4 py-3"><span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full', circulationStatusColors[c.status])}>{c.status}</span>
                    {c.fine > 0 && <span className="ml-1 text-[10px] text-red-600 font-medium">₹{c.fine}</span>}</td>
                  <td className="px-4 py-3 text-right">
                    {c.status !== 'Returned' && <button onClick={() => setReturnBookData(c)} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[11px] font-medium hover:bg-emerald-200">Return</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Fines Tab */}
      {activeTab === 'fines' && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3"><AlertTriangle size={20} className="text-red-500" /><div><div className="text-sm font-semibold text-red-800">Total Pending Fines: ₹{stats.pendingFines}</div><div className="text-xs text-red-600">{FINES.filter(f => f.status === 'Unpaid').length} members have outstanding fines</div></div></div>
          </div>
          {FINES.map(f => (
            <div key={f.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-800">{f.memberName} <span className="text-slate-400">({f.memberId})</span></div>
                <div className="text-xs text-slate-500 mt-0.5">{f.bookTitle} — {f.reason}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{f.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-slate-800">₹{f.amount}</div>
                <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full', fineStatusColors[f.status])}>{f.status}</span>
                {f.status === 'Unpaid' && (
                  <div className="flex gap-1">
                    <button onClick={() => setCollectFineData(f)} className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-medium">Collect</button>
                    <button onClick={() => setWaiveFineData(f)} className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-[10px] font-medium">Waive</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reservations Tab */}
      {activeTab === 'reservations' && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Book</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Reserved By</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Queue</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Action</th>
            </tr></thead>
            <tbody>
              {RESERVATIONS.map(r => (
                <tr key={r.id} className="border-b border-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{r.bookTitle}</td>
                  <td className="px-4 py-3"><div className="text-sm text-slate-700">{r.memberName}</div><div className="text-[11px] text-slate-500">{r.memberId}</div></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{r.reservedDate}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{r.queuePosition > 0 ? `#${r.queuePosition}` : '—'}</td>
                  <td className="px-4 py-3"><span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full', reservationStatusColors[r.status])}>{r.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    {r.status === 'Available' && <button onClick={() => setIssueReservationData(r)} className="px-2 py-1 bg-orange-600 text-white rounded text-[10px] font-medium">Issue</button>}
                    {r.status === 'Waiting' && <button onClick={() => setNotifyReservationData(r)} className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-[10px] font-medium">Notify</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Most Borrowed Books', icon: TrendingUp, items: ['The Art of Computer Programming (24)', 'Pride and Prejudice (19)', 'The C Programming Language (16)'] },
            { title: 'Top Borrowers', icon: Users, items: ['Arjun Patel — 12 books', 'Fatima Ali — 9 books', 'Rohit Sharma — 8 books'] },
            { title: 'Overdue Summary', icon: AlertTriangle, items: [`${stats.overdue} books overdue`, `Total fines: ₹${stats.pendingFines}`, 'Avg delay: 4.2 days'] },
            { title: 'Collection Stats', icon: BarChart3, items: [`${BOOKS.length} unique titles`, `${stats.totalBooks} total copies`, `${BOOKS.map(b => b.category).filter((v, i, a) => a.indexOf(v) === i).length} categories`] },
          ].map(report => (
            <div key={report.title} className="bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2 mb-3">
                <report.icon size={16} className="text-orange-600" /> {report.title}
              </h3>
              <div className="space-y-2">
                {report.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600 py-1 border-b border-slate-50 last:border-0">
                    <span className="text-xs text-slate-400 w-4">{i + 1}.</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Issue Book Modal */}
      <AnimatePresence>
        {showIssueModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowIssueModal(false)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-4">Issue Book</h2>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Book ISBN / Title</label>
                <input className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="Scan or type ISBN..." /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Member ID / Name</label>
                <input className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="Student or staff ID..." /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input type="date" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" /></div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowIssueModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={() => { setShowIssueModal(false); toast.success('Book issued successfully!'); }}
                  className="px-4 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-xl hover:bg-orange-700">Issue Book</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add Book Modal */}
        {showAddBookModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddBookModal(false)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><BookOpen className="text-orange-600" size={20} /> Add New Book</h2>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="Book Title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                    <input className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="Author Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ISBN</label>
                    <input className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="ISBN Number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <input className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="e.g. Science" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Publisher</label>
                    <input className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="Publisher" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Copies</label>
                    <input type="number" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Shelf Location</label>
                    <input className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="e.g. A-12" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowAddBookModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={() => { setShowAddBookModal(false); toast.success('Book added successfully!'); }}
                  className="px-4 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-xl hover:bg-orange-700">Save Book</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Scan Modal */}
        {showScanModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowScanModal(false)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center" onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-2">Scan Barcode/QR</h2>
              <p className="text-sm text-slate-500 mb-6 text-center">Place the barcode inside the frame</p>
              
              <div className="w-64 h-48 bg-slate-900 rounded-xl relative overflow-hidden mb-6 flex items-center justify-center border-4 border-orange-500/30">
                {/* Mock scanning animation */}
                <motion.div 
                  initial={{ top: 0 }} 
                  animate={{ top: '100%' }} 
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="absolute w-full h-1 bg-orange-500 shadow-[0_0_10px_2px_rgba(249,115,22,0.8)]"
                />
                <ScanLine size={48} className="text-slate-600 opacity-50" />
              </div>

              <div className="w-full space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Or enter manually</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="flex gap-2">
                  <input className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="Enter barcode..." />
                  <button onClick={() => { setShowScanModal(false); toast.success('Barcode entered manually!'); }} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 text-sm font-medium">Submit</button>
                </div>
              </div>
              
              <button onClick={() => setShowScanModal(false)} className="mt-6 px-4 py-2 w-full text-sm text-slate-600 hover:bg-slate-100 rounded-xl">Cancel Scan</button>
            </motion.div>
          </motion.div>
        )}

        {/* Book Details Modal */}
        {selectedBook && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBook(null)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-3xl flex-shrink-0">📖</div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedBook.title}</h2>
                    <p className="text-sm text-slate-500 font-medium">{selectedBook.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', bookStatusColors[selectedBook.status])}>{selectedBook.status}</span>
                      <span className="text-xs text-slate-500">{selectedBook.available} of {selectedBook.totalCopies} available</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">ISBN</p>
                  <p className="text-sm font-medium text-slate-800 font-mono">{selectedBook.isbn}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Publisher</p>
                  <p className="text-sm font-medium text-slate-800">{selectedBook.publisher} • {selectedBook.edition} Ed</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Category</p>
                  <p className="text-sm font-medium text-slate-800">{selectedBook.category}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Location</p>
                  <p className="text-sm font-medium text-slate-800">📍 {selectedBook.shelfLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Added Date</p>
                  <p className="text-sm font-medium text-slate-800">{selectedBook.addedDate}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setSelectedBook(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Close</button>
                <button onClick={() => { setSelectedBook(null); setShowIssueModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">
                   <ArrowUpFromLine size={15} /> Issue Book
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Return Book Modal */}
        {returnBookData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setReturnBookData(null)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><ArrowDownToLine className="text-emerald-600" size={20} /> Return Book</h2>
              
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-4">
                <p className="font-semibold text-slate-800 text-sm mb-1">{returnBookData.bookTitle}</p>
                <p className="text-xs text-slate-500">Issued to: <span className="font-medium text-slate-700">{returnBookData.memberName}</span> ({returnBookData.memberId})</p>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-500">Due: {returnBookData.dueDate}</span>
                  {returnBookData.fine > 0 && <span className="text-xs font-medium text-red-600">Pending Fine: ₹{returnBookData.fine}</span>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Return Date</label>
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reason / Remarks (if any)</label>
                  <textarea 
                    value={returnReason} 
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none h-24" 
                    placeholder="e.g. Normal return, Book damaged, Lost..." 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => { setReturnBookData(null); setReturnReason(''); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={() => { setReturnBookData(null); setReturnReason(''); toast.success('Book returned successfully!'); }}
                  className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700">Confirm Return</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Collect Fine Modal */}
        {collectFineData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setCollectFineData(null)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><DollarSign className="text-emerald-600" size={20} /> Collect Fine</h2>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-4 text-center">
                <div className="text-sm text-slate-500 mb-1">Amount to Collect</div>
                <div className="text-3xl font-bold text-emerald-700">₹{collectFineData.amount}</div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Member</span>
                  <span className="font-medium text-slate-800">{collectFineData.memberName} ({collectFineData.memberId})</span>
                </div>
                <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Book</span>
                  <span className="font-medium text-slate-800 text-right">{collectFineData.bookTitle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Reason</span>
                  <span className="font-medium text-slate-800">{collectFineData.reason}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-white">
                  <option>Cash</option>
                  <option>Card / POS</option>
                  <option>UPI</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setCollectFineData(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={() => { setCollectFineData(null); toast.success('Fine collected successfully!'); }}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700">Confirm Payment</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Waive Fine Modal */}
        {waiveFineData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setWaiveFineData(null)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle className="text-amber-600" size={20} /> Waive Fine</h2>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl mb-4">
                <p className="text-sm text-amber-800">Are you sure you want to waive the fine of <strong>₹{waiveFineData.amount}</strong> for <strong>{waiveFineData.memberName}</strong>?</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Waiving</label>
                <input className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="e.g. Approved by Principal" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setWaiveFineData(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={() => { setWaiveFineData(null); toast.success('Fine waived successfully!'); }}
                  className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-xl hover:bg-amber-700">Confirm Waive</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Issue Reservation Modal */}
        {issueReservationData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIssueReservationData(null)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><BookOpen className="text-orange-600" size={20} /> Issue Reserved Book</h2>
              <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 mb-5">
                <div className="text-sm font-medium text-slate-800 mb-1">{issueReservationData.bookTitle}</div>
                <div className="text-xs text-slate-600">Reserved by: <strong>{issueReservationData.memberName}</strong> ({issueReservationData.memberId})</div>
                <div className="text-xs text-slate-500 mt-1">Reserved on: {issueReservationData.reservedDate}</div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Set Due Date</label>
                  <input type="date" defaultValue={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setIssueReservationData(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={() => { setIssueReservationData(null); toast.success('Book issued to reserved member!'); }}
                  className="px-4 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-xl hover:bg-orange-700">Confirm Issue</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Notify Member Modal */}
        {notifyReservationData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setNotifyReservationData(null)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock className="text-blue-600" size={20} /> Notify Member</h2>
              <p className="text-sm text-slate-600 mb-4">Send an alert to <strong>{notifyReservationData.memberName}</strong> regarding their reservation for <strong>{notifyReservationData.bookTitle}</strong>.</p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea 
                  defaultValue={`Dear ${notifyReservationData.memberName},\n\nThe book "${notifyReservationData.bookTitle}" you reserved is expected to be available soon. You are currently #${notifyReservationData.queuePosition} in the queue.\n\nRegards,\nLibrary`}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none h-32 text-slate-700" 
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setNotifyReservationData(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={() => { setNotifyReservationData(null); toast.success('Notification sent!'); }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700">Send Notice</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
