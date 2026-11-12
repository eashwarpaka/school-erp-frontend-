import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, School, BookOpen, MapPin, Award, Users, Search, Check } from 'lucide-react';
import clsx from 'clsx';
import {
  useIDCardStore,
  CHENNAI_SCHOOLS,
  SCHOOL_CLASSES,
  ChennaiSchool,
} from '../store/idCardStore';

// ── Helpers ───────────────────────────────────────────────────────────────────

const StyledSelect = ({
  value,
  onChange,
  children,
  accentColor,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  accentColor?: string;
  id?: string;
}) => (
  <div className="relative">
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-white border-2 border-slate-200 text-slate-800 py-2.5 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none transition-all cursor-pointer"
      style={
        value
          ? { borderColor: accentColor || '#f59e0b', boxShadow: `0 0 0 3px ${accentColor || '#f59e0b'}22` }
          : {}
      }
    >
      {children}
    </select>
    <ChevronDown
      size={16}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
    />
  </div>
);

// ── Searchable School Select ──────────────────────────────────────────────────

const SearchableSchoolSelect = ({
  value,
  onChange,
  schools,
  accentColor,
}: {
  value: string;
  onChange: (v: string) => void;
  schools: typeof CHENNAI_SCHOOLS;
  accentColor?: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSchools = React.useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return schools.filter(s => 
      s.name.toLowerCase().includes(lower) || 
      s.shortName.toLowerCase().includes(lower) ||
      s.board.toLowerCase().includes(lower)
    );
  }, [searchTerm, schools]);

  const selectedSchool = schools.find(s => s.id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-2 border-slate-200 text-slate-800 py-2.5 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none transition-all flex items-center justify-between text-left"
        style={value ? { borderColor: accentColor || '#f59e0b', boxShadow: `0 0 0 3px ${accentColor || '#f59e0b'}22` } : {}}
      >
        <span className="truncate">
          {selectedSchool ? `${selectedSchool.shortName} (${selectedSchool.board})` : '— Choose a School —'}
        </span>
        <ChevronDown size={16} className="text-slate-400 flex-shrink-0 ml-2" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="p-2 border-b border-slate-100 flex items-center bg-slate-50">
              <Search size={14} className="text-slate-400 ml-2 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-sm focus:outline-none focus:ring-0 p-1 placeholder:text-slate-400"
                autoFocus
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
              />
            </div>
            <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
              <button
                type="button"
                onClick={() => { onChange(''); setIsOpen(false); }}
                className={clsx(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1",
                  !value ? "bg-amber-50 text-amber-700 font-semibold" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                — Choose a School —
              </button>
              {filteredSchools.map(school => {
                const isSelected = value === school.id;
                return (
                  <button
                    type="button"
                    key={school.id}
                    onClick={() => { onChange(school.id); setIsOpen(false); }}
                    className={clsx(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between mb-1",
                      isSelected ? "bg-amber-50 text-amber-700 font-semibold" : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <span className="truncate pr-2">{school.shortName} <span className="text-xs text-slate-400 ml-1 font-normal">({school.board})</span></span>
                    {isSelected && <Check size={14} className="text-amber-600 flex-shrink-0" />}
                  </button>
                )
              })}
              {filteredSchools.length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-slate-400">
                  No schools found.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── School Badge ──────────────────────────────────────────────────────────────

const SchoolBadge = ({ school }: { school: ChennaiSchool }) => (
  <motion.div
    key={school.id}
    initial={{ opacity: 0, y: 8, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -8, scale: 0.97 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
    className="mt-4 rounded-2xl overflow-hidden border border-slate-200 shadow-md"
  >
    {/* Header strip with school color */}
    <div
      className="px-5 py-4 flex items-center gap-4"
      style={{ background: `linear-gradient(135deg, ${school.theme.primaryColor}, ${school.theme.primaryColor}dd)` }}
    >
      {/* Logo circle */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg border-2 border-white/30 flex-shrink-0 overflow-hidden"
        style={{ background: school.theme.secondaryColor }}
      >
        <img
          src={school.logoUrl}
          alt={school.shortName}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-white text-sm leading-tight truncate">{school.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${school.theme.secondaryColor}`, color: school.theme.primaryColor }}
          >
            {school.board}
          </span>
          <span className="text-[10px] text-white/70">Est. {school.established}</span>
        </div>
      </div>
    </div>

    {/* Details row */}
    <div className="px-5 py-3 bg-white grid grid-cols-2 gap-3">
      <div className="flex items-start gap-2 text-xs text-slate-600">
        <MapPin size={12} className="mt-0.5 flex-shrink-0 text-slate-400" />
        <span>{school.address}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Award size={12} className="flex-shrink-0 text-slate-400" />
        <span>{school.board} Affiliated</span>
      </div>
    </div>
  </motion.div>
);

// ── Class Info Banner ─────────────────────────────────────────────────────────

const ClassBanner = ({
  school,
  classId,
}: {
  school: ChennaiSchool;
  classId: string;
}) => {
  const cls = SCHOOL_CLASSES.find((c) => c.id === classId);
  if (!cls) return null;

  return (
    <motion.div
      key={classId}
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.2 }}
      className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl border"
      style={{
        background: `${school.theme.primaryColor}12`,
        borderColor: `${school.theme.primaryColor}40`,
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: school.theme.primaryColor }}
      >
        <BookOpen size={16} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-800 text-sm truncate">{cls.label}</div>
        <div className="text-xs text-slate-500 mt-0.5">
          Class Teacher: {cls.classTeacher} • {cls.room}
        </div>
      </div>
      <div
        className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
        style={{ background: `${school.theme.primaryColor}22`, color: school.theme.primaryColor }}
      >
        <Users size={11} />
        {cls.studentCount}
      </div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export const SchoolClassSelector: React.FC = () => {
  const { selectedSchoolId, selectedClassId, setSelectedSchool, setSelectedClass } =
    useIDCardStore();

  const selectedSchool = CHENNAI_SCHOOLS.find((s) => s.id === selectedSchoolId) ?? null;

  const classesForSchool = useMemo(
    () => (selectedSchoolId ? SCHOOL_CLASSES.filter((c) => c.schoolId === selectedSchoolId) : []),
    [selectedSchoolId]
  );

  // Group classes by standard
  const groupedClasses = useMemo(() => {
    const map = new Map<string, typeof classesForSchool>();
    classesForSchool.forEach((c) => {
      if (!map.has(c.standard)) map.set(c.standard, []);
      map.get(c.standard)!.push(c);
    });
    return map;
  }, [classesForSchool]);

  const accentColor = selectedSchool?.theme.primaryColor;

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
      {/* Section title */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-amber-100 rounded-lg">
          <School size={16} className="text-amber-600" />
        </div>
        <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          School &amp; Class Filter
        </span>
        {selectedSchoolId && (
          <button
            onClick={() => setSelectedSchool(null)}
            className="ml-auto text-xs text-slate-400 hover:text-red-500 transition-colors font-medium"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Two dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* School dropdown */}
        <div>
          <label
            htmlFor="school-select"
            className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
          >
            Select School (Chennai)
          </label>
          <SearchableSchoolSelect
            value={selectedSchoolId || ''}
            onChange={(v) => setSelectedSchool(v || null)}
            schools={CHENNAI_SCHOOLS}
            accentColor={accentColor}
          />
        </div>

        {/* Class dropdown */}
        <div>
          <label
            htmlFor="class-select"
            className={clsx(
              'block text-xs font-semibold uppercase tracking-wider mb-1.5 transition-colors',
              selectedSchoolId ? 'text-slate-500' : 'text-slate-300'
            )}
          >
            Select Class &amp; Section
          </label>
          <div className={clsx('transition-opacity', !selectedSchoolId && 'opacity-40 pointer-events-none')}>
            <StyledSelect
              id="class-select"
              value={selectedClassId || ''}
              onChange={(v) => setSelectedClass(v || null)}
              accentColor={accentColor}
            >
              <option value="">— All Classes —</option>
              {Array.from(groupedClasses.entries()).map(([standard, classes]) => (
                <optgroup key={standard} label={standard}>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.label} ({cls.studentCount} students)
                    </option>
                  ))}
                </optgroup>
              ))}
            </StyledSelect>
          </div>
        </div>
      </div>

      {/* School badge + class info */}
      <AnimatePresence mode="wait">
        {selectedSchool && (
          <div key={selectedSchool.id}>
            <SchoolBadge school={selectedSchool} />
            <AnimatePresence mode="wait">
              {selectedClassId && (
                <ClassBanner
                  key={selectedClassId}
                  school={selectedSchool}
                  classId={selectedClassId}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      {/* Empty hint */}
      {!selectedSchoolId && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-4 py-2.5 rounded-xl border border-dashed border-slate-200">
          <School size={13} />
          Select a school to filter ID cards and apply its official branding &amp; theme to templates.
        </div>
      )}
    </div>
  );
};
