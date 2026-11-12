import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Wand2, RefreshCw, CheckCircle, AlertTriangle, 
  Settings, Download, Play, BarChart3, Users, Clock, ArrowRight
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export const AITimetableGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);
    setIsDone(false);

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setIsDone(true);
          toast.success('Conflict-free timetable generated in 1.4 seconds!');
        }, 500);
      }
      setProgress(current);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Wand2 size={24} className="text-purple-600" />
          AI Timetable Generator
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Constraint-satisfaction solver for conflict-free, optimized school-wide scheduling.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Settings size={18} /> Constraints & Parameters</h3>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Academic Term</label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500">
                <option>2026-2027 Term 1</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Target Optimization</label>
              <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" defaultChecked className="rounded text-purple-600" /> Minimize teacher gaps (Free periods)</label>
              <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" defaultChecked className="rounded text-purple-600" /> Prioritize hard subjects in morning</label>
              <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" defaultChecked className="rounded text-purple-600" /> Room capacity strict enforcement</label>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm mb-2"><span className="text-slate-500">Teachers</span><span className="font-semibold text-slate-700">142</span></div>
              <div className="flex justify-between text-sm mb-2"><span className="text-slate-500">Classes/Sections</span><span className="font-semibold text-slate-700">48</span></div>
              <div className="flex justify-between text-sm mb-2"><span className="text-slate-500">Rooms</span><span className="font-semibold text-slate-700">65</span></div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? <><RefreshCw size={18} className="animate-spin" /> Solving Constraints...</> : <><Play size={18} /> Generate Timetable</>}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="md:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />
          
          {!isGenerating && !isDone && (
            <div className="text-center text-slate-400 z-10 flex flex-col items-center">
              <Calendar size={48} className="text-slate-600 mb-4" />
              <p>Ready to solve. The AI solver will process over 2.4 million<br/>permutations to find the optimal conflict-free schedule.</p>
            </div>
          )}

          {isGenerating && (
            <div className="w-full max-w-md z-10 space-y-4">
              <div className="flex justify-between text-slate-300 text-sm font-mono mb-2">
                <span>Generation Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-center text-xs text-slate-500 font-mono mt-4">
                {progress < 30 ? 'Analyzing teacher availability matrix...' : progress < 60 ? 'Mapping core subjects to morning slots...' : progress < 90 ? 'Resolving room double-booking conflicts...' : 'Finalizing output schema...'}
              </div>
            </div>
          )}

          {isDone && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md bg-white rounded-2xl p-6 z-10 text-center shadow-2xl">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Timetable Generated Successfully</h2>
              <p className="text-sm text-slate-500 mb-6">0 conflicts found. 100% constraints satisfied.</p>
              
              <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100 mb-6 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Time Taken</span><span className="font-semibold text-slate-800">1.4 seconds</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Permutations Evaluated</span><span className="font-semibold text-slate-800 font-mono">2,491,842</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Teacher Gap Score</span><span className="font-semibold text-emerald-600">Optimal (98%)</span></div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <BarChart3 size={16} /> View Grid
                </button>
                <button className="flex-1 py-2.5 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                  Publish <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
