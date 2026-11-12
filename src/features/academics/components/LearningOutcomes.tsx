import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Target, Book, LayoutGrid, FileText, Activity as ActivityIcon, Users, Plus } from 'lucide-react';
import { useAcademicStore } from '../../admin/store/academicStore';

// Mock types for UI hierarchy demonstration
interface TreeItem {
  id: string;
  name: string;
  type: 'subject' | 'unit' | 'chapter' | 'outcome' | 'activity' | 'assessment';
  children?: TreeItem[];
  code?: string;
}

const mockNEPTree: TreeItem[] = [
  {
    id: 'subj-1',
    name: 'Mathematics Basic (v1.0)',
    type: 'subject',
    children: [
      {
        id: 'unit-1',
        name: 'Unit 1: Number Systems',
        type: 'unit',
        children: [
          {
            id: 'chap-1',
            name: 'Chapter 1: Rational Numbers',
            type: 'chapter',
            children: [
              {
                id: 'lo-1',
                name: 'LO 1.1: Understands properties of rational numbers',
                code: 'M-701',
                type: 'outcome',
                children: [
                  {
                    id: 'act-1',
                    name: 'Activity: Fraction Addition Game',
                    type: 'activity',
                    children: [
                      {
                        id: 'ass-1',
                        name: 'Assessment: Quick Quiz on Fractions',
                        type: 'assessment',
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

const TreeNode = ({ node, level = 0 }: { node: TreeItem, level?: number }) => {
  const [isExpanded, setIsExpanded] = useState(level < 3); // Auto-expand first few levels

  const getIcon = () => {
    switch (node.type) {
      case 'subject': return <Book className="w-4 h-4 text-amber-600" />;
      case 'unit': return <LayoutGrid className="w-4 h-4 text-indigo-600" />;
      case 'chapter': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'outcome': return <Target className="w-4 h-4 text-emerald-600" />;
      case 'activity': return <ActivityIcon className="w-4 h-4 text-purple-600" />;
      case 'assessment': return <Users className="w-4 h-4 text-rose-600" />;
      default: return <ChevronRight className="w-4 h-4" />;
    }
  };

  const getBadgeColor = () => {
    switch (node.type) {
      case 'subject': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'unit': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'chapter': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'outcome': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'activity': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'assessment': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="flex flex-col">
      <div 
        className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors ${node.children?.length ? 'cursor-pointer' : ''} ${level === 0 ? 'bg-slate-50/50 border border-slate-200' : ''}`}
        onClick={() => node.children?.length && setIsExpanded(!isExpanded)}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
      >
        <div className="flex items-center justify-center w-5 h-5">
          {node.children?.length ? (
            isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />
          ) : (
            <div className="w-4 h-4" /> // spacer
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white rounded-md border border-slate-200 shadow-sm">
            {getIcon()}
          </div>
          <span className="font-medium text-slate-800">{node.name}</span>
          {node.code && (
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {node.code}
            </span>
          )}
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getBadgeColor()}`}>
            {node.type}
          </span>
        </div>
        
        {level > 0 && (
          <div className="ml-auto opacity-0 hover:opacity-100 transition-opacity">
            <button className="p-1 text-slate-400 hover:text-amber-600 rounded">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {isExpanded && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children.map(child => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const LearningOutcomes = () => {
  const versions = useAcademicStore(s => s.subjectVersions);
  const [selectedVersion, setSelectedVersion] = useState(versions[0]?.id || '');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">NEP 2020 Learning Outcomes</h1>
          <p className="text-slate-500 mt-1">Manage competency-based learning outcomes and assessments</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 min-w-[200px]"
          >
            {versions.map(v => (
              <option key={v.id} value={v.id}>{v.name} (v{v.version})</option>
            ))}
          </select>
          <button className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Unit
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-4">
        <div className="flex items-center gap-3 mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          <Target className="w-5 h-5 flex-shrink-0" />
          <p>
            <strong>NEP 2020 Pedagogy Flow:</strong> Subject &rarr; Unit &rarr; Chapter &rarr; Learning Outcome &rarr; Activity &rarr; Assessment &rarr; Student Competency. 
            Build your curriculum hierarchy below to track competencies.
          </p>
        </div>

        <div className="border border-slate-100 rounded-lg p-2 bg-slate-50/30">
          {mockNEPTree.map(node => (
            <TreeNode key={node.id} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
};
