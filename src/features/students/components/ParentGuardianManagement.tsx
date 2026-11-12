import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Plus, Search, Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface LinkedParent {
  id: string;
  name: string;
  relationship: string;
  isPrimary: boolean;
  isBilling: boolean;
}

export const ParentGuardianManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [userId, setUserId] = useState('');
  const [relationship, setRelationship] = useState('');
  const [primaryContact, setPrimaryContact] = useState(false);
  const [billingContact, setBillingContact] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Dummy data matching the screenshot
  const [linkedParents, setLinkedParents] = useState<LinkedParent[]>([
    {
      id: 'USR-00451',
      name: 'Emmanuel Asante',
      relationship: 'Father',
      isPrimary: true,
      isBilling: true,
    },
    {
      id: 'USR-00452',
      name: 'Grace Asante',
      relationship: 'Mother',
      isPrimary: false,
      isBilling: false,
    },
  ]);

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const sortedParents = useMemo(() => {
    let sortableData = [...linkedParents];
    if (sortConfig !== null) {
      sortableData.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [linkedParents, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (parent: LinkedParent) => {
    setUserId(parent.id);
    setRelationship(parent.relationship);
    setPrimaryContact(parent.isPrimary);
    setBillingContact(parent.isBilling);
    setEditingId(parent.id);
    setShowAddForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setLinkedParents(linkedParents.filter(p => p.id !== deletingId));
      setDeletingId(null);
    }
  };

  const handleSave = () => {
    if (!userId || !relationship) return;

    if (editingId) {
      setLinkedParents(linkedParents.map(p =>
        p.id === editingId ? {
          ...p,
          id: userId,
          relationship,
          isPrimary: primaryContact,
          isBilling: billingContact
        } : p
      ));
    } else {
      setLinkedParents([...linkedParents, {
        id: userId,
        name: 'New Parent User', // Mock name
        relationship,
        isPrimary: primaryContact,
        isBilling: billingContact
      }]);
    }

    handleCancel();
  };

  const handleCancel = () => {
    setUserId('');
    setRelationship('');
    setPrimaryContact(false);
    setBillingContact(false);
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <div className="flex-1 w-full p-1 sm:p-2 text-slate-800">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center text-sm text-slate-500 mb-6"
      >
        <Link to="/students" className="hover:text-amber-600 transition-colors">Students & Parents</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to="/students" className="hover:text-amber-600 transition-colors">Students</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-slate-400">STU-2024-001</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="font-semibold text-slate-700">Parents</span>
      </motion.nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-xl font-normal text-slate-900 mb-1">Parent / Guardian Management</h1>
      </motion.div>

      {/* Student Notice Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-8 flex items-center shadow-sm"
      >
        <span className="text-amber-800">
          Student: <strong className="font-bold">Ama Asante</strong> - ID: STU-2024-001
        </span>
      </motion.div>

      {/* Linked Parents Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-medium text-slate-800">Linked Parents / Guardians</h2>
          <button
            onClick={() => {
              setEditingId(null);
              setUserId('');
              setRelationship('');
              setPrimaryContact(false);
              setBillingContact(false);
              setShowAddForm(true);
            }}
            className="flex items-center gap-2 px-2 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all font-medium text-sm shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Parent
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                {[
                  { label: 'User ID', key: 'id' },
                  { label: 'Name', key: 'name' },
                  { label: 'Relationship', key: 'relationship' }
                ].map(header => (
                  <th
                    key={header.key}
                    onClick={() => requestSort(header.key)}
                    className="px-4 py-3 font-medium uppercase tracking-wider text-xs cursor-pointer group hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {header.label}
                      <ArrowUpDown className={clsx("w-3 h-3 transition-colors", sortConfig?.key === header.key ? "text-amber-500" : "text-slate-300 group-hover:text-slate-500")} />
                    </div>
                  </th>
                ))}
                {[
                  { label: 'Primary Contact', key: 'isPrimary' },
                  { label: 'Billing Contact', key: 'isBilling' }
                ].map(header => (
                  <th
                    key={header.key}
                    onClick={() => requestSort(header.key)}
                    className="px-4 py-3 font-medium uppercase tracking-wider text-xs cursor-pointer group hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1">
                      {header.label}
                      <ArrowUpDown className={clsx("w-3 h-3 transition-colors", sortConfig?.key === header.key ? "text-amber-500" : "text-slate-300 group-hover:text-slate-500")} />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedParents.map((parent) => (
                <tr key={parent.id} className="hover:bg-amber-50/30 even:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-700">{parent.id}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium">{parent.name}</td>
                  <td className="px-4 py-3 text-slate-600">{parent.relationship}</td>
                  <td className="px-4 py-3 text-center">
                    {parent.isPrimary ? (
                      <span className="inline-flex items-center justify-center bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Yes
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {parent.isBilling ? (
                      <span className="inline-flex items-center justify-center bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Yes
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(parent)}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-md hover:bg-amber-100 transition-all shadow-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(parent.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-md hover:bg-red-100 transition-all shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between sm:flex-row flex-col gap-3">
          <div className="text-[13px] text-slate-500">
            Showing <span className="font-medium text-slate-700">1</span> to <span className="font-medium text-slate-700">2</span> of <span className="font-medium text-slate-700">2</span> results
          </div>
          <div className="flex gap-1">
            <button className="px-2 py-0.5 text-[13px] border border-slate-200 bg-white rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-2 py-0.5 text-[13px] border border-amber-500 bg-amber-50 text-amber-700 rounded font-medium">1</button>
            <button className="px-2 py-0.5 text-[13px] border border-slate-200 bg-white rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </motion.div>

      {/* Add Parent Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
            className="border-2 border-dashed border-amber-300 bg-amber-50/50 rounded-xl p-6 relative"
          >
            <div className="flex items-center gap-2 mb-6">
              <Plus className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-slate-800">{editingId ? 'Edit Parent / Guardian' : 'Add Parent / Guardian'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User ID Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  User ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Search user ID or name..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow bg-white text-sm"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Must exist in the Users table (USER001).
                </p>
              </div>

              {/* Relationship Type Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Relationship Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow bg-white text-sm appearance-none"
                >
                  <option value="">— Select —</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Toggles */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Primary Contact
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPrimaryContact(!primaryContact)}
                    className={clsx(
                      "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      primaryContact ? "bg-amber-500" : "bg-slate-200"
                    )}
                  >
                    <span
                      className={clsx(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        primaryContact ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </button>
                  <span className="text-sm text-slate-600">Primary</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">One primary contact per student.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Billing Contact
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBillingContact(!billingContact)}
                    className={clsx(
                      "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      billingContact ? "bg-amber-500" : "bg-slate-200"
                    )}
                  >
                    <span
                      className={clsx(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        billingContact ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </button>
                  <span className="text-sm text-slate-600">Receives invoices & receipts</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors shadow-sm focus:ring-4 focus:ring-amber-500/20"
              >
                {editingId ? 'Update' : 'Add for Authorization'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Remove Parent / Guardian?</h3>
                </div>
                <p className="text-slate-600 mb-6 pl-13">
                  Are you sure you want to remove this parent/guardian link? This action cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setDeletingId(null)}
                    className="px-2 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                  >
                    No, Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-2 py-1 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors shadow-sm focus:ring-4 focus:ring-red-500/20"
                  >
                    Yes, Remove
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
