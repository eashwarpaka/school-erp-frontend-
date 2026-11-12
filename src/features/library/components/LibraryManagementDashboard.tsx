import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Filter, Plus, Clock, CheckCircle, 
  AlertCircle, ChevronRight, Hash, Bookmark, BookKey
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  status: 'AVAILABLE' | 'ISSUED' | 'OVERDUE' | 'LOST';
  dueDate?: string;
  issuedTo?: string;
}

const DUMMY_BOOKS: Book[] = [
  { id: 'B-1001', isbn: '978-0131103627', title: 'The C Programming Language', author: 'Brian W. Kernighan', category: 'Computer Science', status: 'AVAILABLE' },
  { id: 'B-1002', isbn: '978-0201896831', title: 'The Art of Computer Programming', author: 'Donald E. Knuth', category: 'Computer Science', status: 'ISSUED', dueDate: '2026-08-10', issuedTo: 'Arjun Sharma (STU-001)' },
  { id: 'B-1003', isbn: '978-1420959828', title: 'The Republic', author: 'Plato', category: 'Philosophy', status: 'OVERDUE', dueDate: '2026-07-28', issuedTo: 'Fatima Ali (STU-089)' },
  { id: 'B-1004', isbn: '978-0385490818', title: 'The Handmaid\'s Tale', author: 'Margaret Atwood', category: 'Fiction', status: 'AVAILABLE' },
  { id: 'B-1005', isbn: '978-0141439518', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Literature', status: 'AVAILABLE' },
];

export const LibraryManagementDashboard = () => {
  const [books, setBooks] = useState<Book[]>(DUMMY_BOOKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'AVAILABLE' | 'ISSUED' | 'OVERDUE'>('ALL');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filteredBooks = books.filter(b => {
    if (activeTab !== 'ALL' && b.status !== activeTab) return false;
    return b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
           b.isbn.includes(searchTerm);
  });

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;
    
    setBooks(prev => prev.map(b => 
      b.id === selectedBook.id 
        ? { ...b, status: 'ISSUED', dueDate: '2026-08-17', issuedTo: 'New Student' } 
        : b
    ));
    toast.success(`Book "${selectedBook.title}" issued successfully`);
    setShowIssueModal(false);
  };

  const handleReturn = (bookId: string) => {
    setBooks(prev => prev.map(b => 
      b.id === bookId ? { ...b, status: 'AVAILABLE', dueDate: undefined, issuedTo: undefined } : b
    ));
    toast.success('Book returned successfully');
  };

  const stats = {
    total: books.length,
    available: books.filter(b => b.status === 'AVAILABLE').length,
    issued: books.filter(b => b.status === 'ISSUED').length,
    overdue: books.filter(b => b.status === 'OVERDUE').length,
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen size={24} className="text-blue-600" />
            Library Management System
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Digital catalogue, barcode issue/return, and fine management.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md transition-all">
          <Plus size={16} /> Add New Book
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Catalogue', value: stats.total, icon: BookOpen, color: 'bg-blue-500 text-blue-50' },
          { label: 'Available', value: stats.available, icon: CheckCircle, color: 'bg-emerald-500 text-emerald-50' },
          { label: 'Currently Issued', value: stats.issued, icon: BookKey, color: 'bg-amber-500 text-amber-50' },
          { label: 'Overdue Returns', value: stats.overdue, icon: AlertCircle, color: 'bg-red-500 text-red-50', alert: stats.overdue > 0 },
        ].map(kpi => (
          <div key={kpi.label} className={clsx('bg-white rounded-2xl border p-5 shadow-sm transition-all', kpi.alert ? 'border-red-300 ring-2 ring-red-500/20' : 'border-slate-100')}>
            <div className="flex items-center justify-between mb-3">
              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', kpi.color)}>
                <kpi.icon size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-800">{kpi.value.toLocaleString()}</div>
            <div className="text-sm font-medium text-slate-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['ALL', 'AVAILABLE', 'ISSUED', 'OVERDUE'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'px-4 py-1.5 text-sm font-semibold rounded-lg transition-all capitalize',
                  activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {tab.toLowerCase()}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Title, Author, ISBN..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 border-b border-slate-100 z-10">
              <tr>
                <th className="px-5 py-3 font-semibold">Book Details</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Issue Info</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">No books found matching your criteria.</td></tr>
              ) : (
                filteredBooks.map(book => (
                  <motion.tr 
                    key={book.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">{book.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{book.author} · {book.isbn}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{book.id}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Bookmark size={14} className="text-slate-400" /> {book.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={clsx(
                        'px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                        book.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' :
                        book.status === 'ISSUED' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      )}>
                        {book.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {book.status !== 'AVAILABLE' ? (
                        <div>
                          <div className="font-medium text-slate-800 text-xs">{book.issuedTo}</div>
                          <div className={clsx('text-[10px] mt-0.5 flex items-center gap-1', book.status === 'OVERDUE' ? 'text-red-600 font-bold' : 'text-slate-500')}>
                            <Clock size={12} /> Due: {book.dueDate}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {book.status === 'AVAILABLE' ? (
                        <button 
                          onClick={() => { setSelectedBook(book); setShowIssueModal(true); }}
                          className="px-3 py-1.5 bg-white border border-slate-200 text-blue-600 hover:border-blue-300 hover:bg-blue-50 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Issue Book
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleReturn(book.id)}
                          className="px-3 py-1.5 bg-slate-800 text-white hover:bg-slate-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Return Book
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Book Modal */}
      <AnimatePresence>
        {showIssueModal && selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowIssueModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800">Issue Book</h3>
              </div>
              <form onSubmit={handleIssueBook} className="p-6 space-y-4">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <div className="font-semibold text-blue-900 text-sm">{selectedBook.title}</div>
                  <div className="text-xs text-blue-700 mt-1">{selectedBook.author} · {selectedBook.isbn}</div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Student / Staff ID</label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input autoFocus required type="text" placeholder="e.g. STU-001 or Scan Barcode" className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Due Date</label>
                  <input required type="date" defaultValue="2026-08-17" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowIssueModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">Issue Book</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
