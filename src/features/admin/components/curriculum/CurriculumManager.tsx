import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Globe, Layers, BookType, Hash, Plus, 
  Search, Edit2, Trash2, ChevronUp, ChevronDown, 
  ChevronsUpDown, SearchX, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAcademicStore } from '../../store/academicStore';
import clsx from 'clsx';
import { ConfirmDeleteModal } from '../../../../components/common/ConfirmDeleteModal';
import toast from 'react-hot-toast';
import { BoardModal } from './BoardModal';
import { CurriculumModal } from './CurriculumModal';
import { SubjectGroupModal } from './SubjectGroupModal';
import { SubjectMasterModal } from './SubjectMasterModal';
import { SubjectVersionModal } from './SubjectVersionModal';
import { SubjectMappingModal } from './SubjectMappingModal';
import { Users } from 'lucide-react';

type Tab = 'boards' | 'curriculums' | 'groups' | 'subjects' | 'versions' | 'assignments';
type SortDirection = 'asc' | 'desc';

export const CurriculumManager = () => {
  const [activeTab, setActiveTab] = useState<Tab>('boards');
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Data from store
  const boards = useAcademicStore(s => s.boards);
  const curriculums = useAcademicStore(s => s.curriculums);
  const subjectGroups = useAcademicStore(s => s.subjectGroups);
  const subjects = useAcademicStore(s => s.subjects);
  const subjectVersions = useAcademicStore(s => s.subjectVersions);
  const subjectMappings = useAcademicStore(s => s.subjectMappings);
  const classYearOfferings = useAcademicStore(s => s.classYearOfferings);
  const classMasters = useAcademicStore(s => s.classMasters);
  const sections = useAcademicStore(s => s.sections);

  // Store actions
  const deleteBoard = useAcademicStore(s => s.deleteBoard);
  const deleteCurriculum = useAcademicStore(s => s.deleteCurriculum);
  const deleteSubjectGroup = useAcademicStore(s => s.deleteSubjectGroup);
  const deleteSubject = useAcademicStore(s => s.deleteSubject);
  const deleteSubjectVersion = useAcademicStore(s => s.deleteSubjectVersion);
  const deleteSubjectMapping = useAcademicStore(s => s.deleteSubjectMapping);

  const addBoard = useAcademicStore(s => s.addBoard);
  const updateBoard = useAcademicStore(s => s.updateBoard);
  const addCurriculum = useAcademicStore(s => s.addCurriculum);
  const updateCurriculum = useAcademicStore(s => s.updateCurriculum);
  const addSubjectGroup = useAcademicStore(s => s.addSubjectGroup);
  const updateSubjectGroup = useAcademicStore(s => s.updateSubjectGroup);
  const addSubject = useAcademicStore(s => s.addSubject);
  const updateSubject = useAcademicStore(s => s.updateSubject);
  const addSubjectVersion = useAcademicStore(s => s.addSubjectVersion);
  const updateSubjectVersion = useAcademicStore(s => s.updateSubjectVersion);
  const addSubjectMapping = useAcademicStore(s => s.addSubjectMapping);

  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string, type: Tab } | null>(null);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: Tab | null;
    editData: any | null;
  }>({ isOpen: false, type: null, editData: null });

  const tabs = [
    { id: 'boards', label: 'Boards', icon: Globe },
    { id: 'curriculums', label: 'Curriculums', icon: BookOpen },
    { id: 'groups', label: 'Subject Groups', icon: Layers },
    { id: 'subjects', label: 'Subject Master', icon: BookType },
    { id: 'versions', label: 'Subject Versions', icon: Hash },
    { id: 'assignments', label: 'Subject Assignments', icon: Users },
  ] as const;

  const handleTabChange = (tabId: Tab) => {
    setActiveTab(tabId);
    setSearch('');
    setSortConfig(null);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (id: string, name: string, type: Tab) => {
    setItemToDelete({ id, name, type });
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    switch (itemToDelete.type) {
      case 'boards': deleteBoard(itemToDelete.id); break;
      case 'curriculums': deleteCurriculum(itemToDelete.id); break;
      case 'groups': deleteSubjectGroup(itemToDelete.id); break;
      case 'subjects': deleteSubject(itemToDelete.id); break;
      case 'versions': deleteSubjectVersion(itemToDelete.id); break;
      case 'assignments': deleteSubjectMapping(itemToDelete.id); break;
    }
    toast.success(`${itemToDelete.name} deleted successfully`);
    setDeleteModalOpen(false);
  };

  const getStatusBadge = (isActive: boolean) => (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase', isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );

  const processedData = useMemo(() => {
    let data: any[] = [];
    switch(activeTab) {
      case 'boards': 
        data = [...boards]; 
        break;
      case 'curriculums': 
        data = [...curriculums].map(c => ({ 
          ...c, 
          boardCode: boards.find(b => b.id === c.boardId)?.code 
        })); 
        break;
      case 'groups': 
        data = [...subjectGroups].map(g => ({ 
          ...g, 
          currName: curriculums.find(c => c.id === g.curriculumId)?.name 
        })); 
        break;
      case 'subjects': 
        data = [...subjects].map(s => ({ 
          ...s, 
          groupName: subjectGroups.find(g => g.id === s.subjectGroupId)?.name 
        })); 
        break;
      case 'versions': 
        data = [...subjectVersions].map(v => {
          const subject = subjects.find(s => s.id === v.subjectMasterId);
          return { ...v, subjectName: subject?.name, subjectCode: subject?.code };
        }); 
        break;
      case 'assignments':
        data = [...subjectMappings].map(m => {
          const subject = subjects.find(s => s.id === m.subjectId);
          const offering = classYearOfferings.find(o => o.id === m.classYearOfferingId);
          const cMaster = classMasters.find(c => c.id === offering?.classMasterId);
          const section = sections.find(s => s.id === m.sectionId);
          return {
            ...m,
            subjectName: subject?.name,
            className: cMaster?.name,
            sectionName: section?.name || 'All Sections'
          };
        });
        break;
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      data = data.filter(item => {
        return Object.values(item).some(val => 
          val !== null && val !== undefined && String(val).toLowerCase().includes(lowerSearch)
        );
      });
    }

    if (sortConfig) {
      data.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === bValue) return 0;
        
        const isAsc = sortConfig.direction === 'asc';
        
        if (aValue === undefined || aValue === null) return isAsc ? 1 : -1;
        if (bValue === undefined || bValue === null) return isAsc ? -1 : 1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return isAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        return isAsc ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1);
      });
    }

    return data;
  }, [activeTab, search, sortConfig, boards, curriculums, subjectGroups, subjects, subjectVersions]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ChevronsUpDown className="w-3 h-3 text-slate-300 ml-1 inline-block" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-3 h-3 text-amber-500 ml-1 inline-block" />
      : <ChevronDown className="w-3 h-3 text-amber-500 ml-1 inline-block" />;
  };

  const SortableHeader = ({ label, columnKey, className }: { label: string, columnKey: string, className?: string }) => (
    <th className={clsx("px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors select-none outline-none focus:outline-none", className)} onClick={() => handleSort(columnKey)}>
      <div className="flex items-center">
        {label}
        <SortIcon columnKey={columnKey} />
      </div>
    </th>
  );

  return (
    <div className="w-full p-1 sm:p-2 text-slate-800 pb-12">
      <div className="flex items-center text-sm text-slate-500 mb-4">
        <NavLink to="/admin/academic-years" className="hover:text-amber-600 transition-colors">School Admin</NavLink>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Curriculum Setup</span>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-normal text-slate-900 mb-1">Curriculum Setup</h1>
          <p className="text-sm text-slate-500">Manage boards, curriculums, and subject hierarchies</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-1 flex overflow-x-auto custom-scrollbar mb-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as Tab)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                isActive 
                  ? "bg-amber-50 text-amber-700 shadow-sm border border-amber-200" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button 
          onClick={() => setModalState({ isOpen: true, type: activeTab, editData: null })}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <Plus size={16} /> Add {tabs.find(t => t.id === activeTab)?.label.split(' ')[0]}
        </button>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`} 
            value={search} 
            onChange={handleSearchChange} 
            className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-64" 
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-medium text-slate-500 uppercase tracking-wider">
              {activeTab === 'boards' && (
                <>
                  <SortableHeader label="Code" columnKey="code" />
                  <SortableHeader label="Board Name" columnKey="name" />
                  <SortableHeader label="Status" columnKey="isActive" />
                  <th className="px-4 py-3 text-center">Actions</th>
                </>
              )}
              {activeTab === 'curriculums' && (
                <>
                  <SortableHeader label="Curriculum Name" columnKey="name" />
                  <SortableHeader label="Board" columnKey="boardCode" />
                  <SortableHeader label="Version" columnKey="version" />
                  <SortableHeader label="Status" columnKey="isActive" />
                  <th className="px-4 py-3 text-center">Actions</th>
                </>
              )}
              {activeTab === 'groups' && (
                <>
                  <SortableHeader label="Group Name" columnKey="name" />
                  <SortableHeader label="Curriculum" columnKey="currName" />
                  <SortableHeader label="Classification" columnKey="classification" />
                  <SortableHeader label="Max Subjects" columnKey="maxSubjects" />
                  <SortableHeader label="Status" columnKey="isActive" />
                  <th className="px-4 py-3 text-center">Actions</th>
                </>
              )}
              {activeTab === 'subjects' && (
                <>
                  <SortableHeader label="Code" columnKey="code" />
                  <SortableHeader label="Subject Name" columnKey="name" />
                  <SortableHeader label="Group" columnKey="groupName" />
                  <SortableHeader label="Credits" columnKey="credits" />
                  <SortableHeader label="Status" columnKey="isActive" />
                  <th className="px-4 py-3 text-center">Actions</th>
                </>
              )}
              {activeTab === 'versions' && (
                <>
                  <SortableHeader label="Version Name" columnKey="name" />
                  <SortableHeader label="Subject" columnKey="subjectName" />
                  <SortableHeader label="Version" columnKey="version" />
                  <SortableHeader label="Status" columnKey="status" />
                  <SortableHeader label="Active" columnKey="isActive" />
                  <th className="px-4 py-3 text-center">Actions</th>
                </>
              )}
              {activeTab === 'assignments' && (
                <>
                  <SortableHeader label="Subject" columnKey="subjectName" />
                  <SortableHeader label="Class" columnKey="className" />
                  <SortableHeader label="Section" columnKey="sectionName" />
                  <SortableHeader label="Teacher" columnKey="teacherName" />
                  <th className="px-4 py-3 text-center">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <SearchX className="w-12 h-12 mb-3 text-slate-300" />
                    <p className="text-base font-medium text-slate-600">No results found</p>
                    {search ? (
                      <p className="text-sm mt-1">We couldn't find any data matching "{search}"</p>
                    ) : (
                      <p className="text-sm mt-1">No data available.</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {activeTab === 'boards' && paginatedData.map((board: any) => (
                  <motion.tr key={`boards-${board.id}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-slate-800">{board.code}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{board.name}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(board.isActive)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setModalState({ isOpen: true, type: 'boards', editData: board })} className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded hover:bg-amber-100 text-xs font-medium"><Edit2 className="w-3 h-3" /> Edit</button>
                        <button onClick={() => handleDeleteClick(board.id, board.name, 'boards')} className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 text-xs font-medium"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {activeTab === 'curriculums' && paginatedData.map((curr: any) => (
                  <motion.tr key={`curr-${curr.id}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-slate-800">{curr.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600"><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase border bg-blue-50 text-blue-700 border-blue-200">{curr.boardCode}</span></td>
                    <td className="px-4 py-3 text-sm text-slate-600">v{curr.version}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(curr.isActive)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setModalState({ isOpen: true, type: 'curriculums', editData: curr })} className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded hover:bg-amber-100 text-xs font-medium"><Edit2 className="w-3 h-3" /> Edit</button>
                        <button onClick={() => handleDeleteClick(curr.id, curr.name, 'curriculums')} className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 text-xs font-medium"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {activeTab === 'groups' && paginatedData.map((group: any) => (
                  <motion.tr key={`group-${group.id}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-slate-800">{group.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{group.currName}</td>
                    <td className="px-4 py-3 text-sm"><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border bg-indigo-50 text-indigo-700 border-indigo-200">{group.classification}</span></td>
                    <td className="px-4 py-3 text-sm text-slate-600">{group.maxSubjects ? group.maxSubjects : 'Unlimited'}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(group.isActive)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setModalState({ isOpen: true, type: 'groups', editData: group })} className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded hover:bg-amber-100 text-xs font-medium"><Edit2 className="w-3 h-3" /> Edit</button>
                        <button onClick={() => handleDeleteClick(group.id, group.name, 'groups')} className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 text-xs font-medium"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {activeTab === 'subjects' && paginatedData.map((subject: any) => (
                  <motion.tr key={`subject-${subject.id}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-slate-800">{subject.code}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{subject.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{subject.groupName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{subject.credits}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(subject.isActive)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setModalState({ isOpen: true, type: 'subjects', editData: subject })} className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded hover:bg-amber-100 text-xs font-medium"><Edit2 className="w-3 h-3" /> Edit</button>
                        <button onClick={() => handleDeleteClick(subject.id, subject.name, 'subjects')} className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 text-xs font-medium"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {activeTab === 'versions' && paginatedData.map((version: any) => (
                  <motion.tr key={`version-${version.id}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-slate-800">{version.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{version.subjectName} <span className="text-[11px] text-slate-400">({version.subjectCode})</span></td>
                    <td className="px-4 py-3 text-sm text-slate-600">v{version.version}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border', 
                        version.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        version.status === 'Published' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        version.status === 'Draft' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      )}>
                        {version.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(version.isActive)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setModalState({ isOpen: true, type: 'versions', editData: version })} className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded hover:bg-amber-100 text-xs font-medium"><Edit2 className="w-3 h-3" /> Edit</button>
                        <button onClick={() => handleDeleteClick(version.id, version.name, 'versions')} className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 text-xs font-medium"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {activeTab === 'assignments' && paginatedData.map((assignment: any) => (
                  <motion.tr key={`assignment-${assignment.id}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-slate-800">{assignment.subjectName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{assignment.className}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{assignment.sectionName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{assignment.teacherName || 'Unassigned'}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => handleDeleteClick(assignment.id, assignment.subjectName, 'assignments')} className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 text-xs font-medium"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-700">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-slate-700">{Math.min(currentPage * itemsPerPage, processedData.length)}</span> of <span className="font-medium text-slate-700">{processedData.length}</span> entries
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    "w-7 h-7 rounded-md text-sm font-medium transition-colors",
                    currentPage === page 
                      ? "bg-amber-500 text-white shadow-sm" 
                      : "text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${itemToDelete?.name}? This action cannot be undone.`}
        itemName={itemToDelete?.name || ''}
      />

      <BoardModal
        isOpen={modalState.isOpen && modalState.type === 'boards'}
        onClose={() => setModalState({ isOpen: false, type: null, editData: null })}
        initialData={modalState.editData}
        onSubmit={(data) => {
          if (modalState.editData) {
            updateBoard(modalState.editData.id, data);
            toast.success('Board updated successfully');
          } else {
            addBoard({ ...data, id: `BRD-${Date.now()}` });
            toast.success('Board added successfully');
          }
          setModalState({ isOpen: false, type: null, editData: null });
        }}
      />

      <CurriculumModal
        isOpen={modalState.isOpen && modalState.type === 'curriculums'}
        onClose={() => setModalState({ isOpen: false, type: null, editData: null })}
        initialData={modalState.editData}
        onSubmit={(data) => {
          if (modalState.editData) {
            updateCurriculum(modalState.editData.id, data);
            toast.success('Curriculum updated successfully');
          } else {
            addCurriculum({ ...data, id: `CUR-${Date.now()}` });
            toast.success('Curriculum added successfully');
          }
          setModalState({ isOpen: false, type: null, editData: null });
        }}
      />

      <SubjectGroupModal
        isOpen={modalState.isOpen && modalState.type === 'groups'}
        onClose={() => setModalState({ isOpen: false, type: null, editData: null })}
        initialData={modalState.editData}
        onSubmit={(data) => {
          if (modalState.editData) {
            updateSubjectGroup(modalState.editData.id, data);
            toast.success('Subject Group updated successfully');
          } else {
            addSubjectGroup({ ...data, id: `SG-${Date.now()}` });
            toast.success('Subject Group added successfully');
          }
          setModalState({ isOpen: false, type: null, editData: null });
        }}
      />

      <SubjectMasterModal
        isOpen={modalState.isOpen && modalState.type === 'subjects'}
        onClose={() => setModalState({ isOpen: false, type: null, editData: null })}
        initialData={modalState.editData}
        onSubmit={(data) => {
          if (modalState.editData) {
            updateSubject(modalState.editData.id, data);
            toast.success('Subject updated successfully');
          } else {
            addSubject({ ...data, id: `SUB-${Date.now()}` });
            toast.success('Subject added successfully');
          }
          setModalState({ isOpen: false, type: null, editData: null });
        }}
      />

      <SubjectVersionModal
        isOpen={modalState.isOpen && modalState.type === 'versions'}
        onClose={() => setModalState({ isOpen: false, type: null, editData: null })}
        initialData={modalState.editData}
        onSubmit={(data) => {
          if (modalState.editData) {
            updateSubjectVersion(modalState.editData.id, data);
            toast.success('Subject Version updated successfully');
          } else {
            addSubjectVersion({ ...data, id: `SV-${Date.now()}` });
            toast.success('Subject Version added successfully');
          }
          setModalState({ isOpen: false, type: null, editData: null });
        }}
      />

      <SubjectMappingModal
        isOpen={modalState.isOpen && modalState.type === 'assignments'}
        onClose={() => setModalState({ isOpen: false, type: null, editData: null })}
        onSubmit={(data) => {
          addSubjectMapping({ ...data, id: `SM-${Date.now()}` });
          toast.success('Assignment added successfully');
          setModalState({ isOpen: false, type: null, editData: null });
        }}
      />
    </div>
  );
};
