import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Activity, ShieldAlert, CheckCircle, Clock, Search, Filter, 
  MapPin, LogIn, LogOut, ChevronRight, AlertTriangle, Fingerprint, 
  Smartphone, Signal, SignalHigh, Play, Pause
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
type PunchType = 'IN' | 'OUT';
type DeviceType = 'RFID_GATE' | 'BIOMETRIC_CLASS' | 'RFID_BUS';
type Status = 'Present' | 'Late' | 'Absent' | 'Anomaly';

interface AttendanceLog {
  id: string;
  studentId: string;
  name: string;
  grade: string;
  timestamp: string;
  type: PunchType;
  deviceType: DeviceType;
  location: string;
  status: Status;
  confidence: number;
}

// ── Mock Data Generation ───────────────────────────────────
const NAMES = ['Arjun Sharma', 'Fatima Ali', 'Kwame Boateng', 'Mei Lin', 'David Chen', 'Sarah Smith', 'Rohan Patel', 'Priya Singh'];
const GRADES = ['Grade 8 - A', 'Grade 9 - B', 'Grade 10 - A'];
const LOCATIONS = ['Main Gate 1', 'North Wing Bus', 'Library Entrance', 'Classroom 10A'];

const generateLog = (): AttendanceLog => {
  const type = Math.random() > 0.5 ? 'IN' : 'OUT';
  const deviceType = Math.random() > 0.6 ? 'RFID_GATE' : Math.random() > 0.5 ? 'BIOMETRIC_CLASS' : 'RFID_BUS';
  const isAnomaly = Math.random() > 0.9;
  
  return {
    id: `LOG-${Math.floor(Math.random() * 100000)}`,
    studentId: `STU-2026-${Math.floor(Math.random() * 900 + 100)}`,
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    grade: GRADES[Math.floor(Math.random() * GRADES.length)],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    type,
    deviceType,
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    status: isAnomaly ? 'Anomaly' : Math.random() > 0.8 ? 'Late' : 'Present',
    confidence: Math.floor(Math.random() * 10 + 90),
  };
};

// ── Main Component ─────────────────────────────────────────
export const LiveAttendanceDashboard = () => {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [anomalies, setAnomalies] = useState<AttendanceLog[]>([]);

  // Simulation effect
  useEffect(() => {
    if (!isLive) return;

    // Initial load
    setLogs(Array.from({ length: 5 }).map(generateLog));

    const interval = setInterval(() => {
      const newLog = generateLog();
      setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
      
      if (newLog.status === 'Anomaly') {
        setAnomalies(prev => [newLog, ...prev]);
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-red-500/20 overflow-hidden`}>
            <div className="bg-red-50 w-2" />
            <div className="flex-1 p-4 flex items-start gap-3">
              <div className="bg-red-100 rounded-full p-2"><AlertTriangle size={20} className="text-red-600" /></div>
              <div>
                <p className="text-sm font-bold text-slate-800">Security Anomaly Detected</p>
                <p className="text-xs text-slate-500 mt-0.5">{newLog.name} punched {newLog.type} at {newLog.location} but is marked absent in class.</p>
              </div>
            </div>
          </div>
        ), { duration: 4000 });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isLive]);

  const stats = {
    totalExpected: 1250,
    presentNow: 1142,
    absent: 108,
    late: 45,
  };

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'RFID_GATE': return <SignalHigh size={14} className="text-blue-500" />;
      case 'BIOMETRIC_CLASS': return <Fingerprint size={14} className="text-emerald-500" />;
      case 'RFID_BUS': return <MapPin size={14} className="text-amber-500" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            RFID & Biometric Attendance
            <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 border', isLive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200')}>
              <span className={clsx('w-1.5 h-1.5 rounded-full', isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400')} />
              {isLive ? 'Live Feed' : 'Paused'}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time hardware integration monitor across gates, buses, and classes.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {isLive ? <><Pause size={16} /> Pause Feed</> : <><Play size={16} /> Resume Feed</>}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 shadow-md">
            Hardware Status
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Expected Today', value: stats.totalExpected, icon: Users, color: 'bg-blue-500' },
          { label: 'Present in Campus', value: stats.presentNow, icon: CheckCircle, color: 'bg-emerald-500' },
          { label: 'Late Arrivals', value: stats.late, icon: Clock, color: 'bg-amber-500' },
          { label: 'Anomalies Detected', value: anomalies.length, icon: ShieldAlert, color: 'bg-red-500', alert: anomalies.length > 0 },
        ].map(kpi => (
          <div key={kpi.label} className={clsx('bg-white rounded-2xl border p-5 shadow-sm transition-all', kpi.alert ? 'border-red-300 ring-2 ring-red-500/20' : 'border-slate-100')}>
            <div className="flex items-center justify-between mb-3">
              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', kpi.color)}>
                <kpi.icon size={20} className="text-white" />
              </div>
              {kpi.alert && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
            </div>
            <div className="text-2xl font-black text-slate-800">{kpi.value.toLocaleString()}</div>
            <div className="text-sm font-medium text-slate-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Live Feed Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <Activity size={16} className="text-blue-500" /> Live Hardware Logs
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Filter size={14} /> Filter by Device
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-white sticky top-0 border-b border-slate-100 z-10 shadow-sm">
                <tr>
                  <th className="px-5 py-3 font-semibold">Timestamp</th>
                  <th className="px-5 py-3 font-semibold">Student</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                  <th className="px-5 py-3 font-semibold">Device Source</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence initial={false}>
                  {logs.map((log) => (
                    <motion.tr 
                      key={log.id}
                      initial={{ opacity: 0, y: -20, backgroundColor: '#f0fdf4' }}
                      animate={{ opacity: 1, y: 0, backgroundColor: '#ffffff' }}
                      transition={{ duration: 0.5 }}
                      className="hover:bg-slate-50 group"
                    >
                      <td className="px-5 py-3 text-slate-500 font-mono text-xs">{log.timestamp}</td>
                      <td className="px-5 py-3">
                        <div className="font-semibold text-slate-800">{log.name}</div>
                        <div className="text-[10px] text-slate-400">{log.studentId} · {log.grade}</div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={clsx('flex items-center gap-1 text-xs font-bold w-fit px-2 py-0.5 rounded', log.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')}>
                          {log.type === 'IN' ? <LogIn size={12} /> : <LogOut size={12} />} {log.type}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 text-slate-600">
                          {getDeviceIcon(log.deviceType)}
                          <span className="text-xs">{log.location}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={clsx(
                          'px-2 py-1 rounded-full text-[10px] font-bold uppercase',
                          log.status === 'Present' ? 'text-emerald-600 bg-emerald-50' :
                          log.status === 'Late' ? 'text-amber-600 bg-amber-50' :
                          'text-red-600 bg-red-50 border border-red-200'
                        )}>
                          {log.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Security & Action Center */}
        <div className="flex flex-col gap-6 min-h-0">
          
          {/* Hardware Connection Status */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Gateway Links</h3>
            <div className="space-y-4">
              {[
                { name: 'Main Campus Gates (RFID)', status: 'Online', ms: '12ms', ip: '192.168.1.104' },
                { name: 'Classroom Biometrics', status: 'Online', ms: '24ms', ip: '192.168.2.0/24' },
                { name: 'Bus GPS/RFID Units', status: 'Syncing', ms: '154ms', ip: 'Cellular WAN' },
              ].map(hw => (
                <div key={hw.name} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{hw.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{hw.ip}</div>
                  </div>
                  <div className="text-right">
                    <div className={clsx('text-xs font-bold flex items-center justify-end gap-1', hw.status === 'Online' ? 'text-emerald-400' : 'text-amber-400')}>
                      <span className={clsx('w-1.5 h-1.5 rounded-full', hw.status === 'Online' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse')} />
                      {hw.status}
                    </div>
                    <div className="text-[10px] text-slate-500">{hw.ms} ping</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anomaly Feed */}
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm flex-1 flex flex-col min-h-0">
            <div className="px-5 py-4 border-b border-red-50 bg-red-50/30 flex items-center justify-between">
              <h3 className="font-bold text-red-700 flex items-center gap-2">
                <ShieldAlert size={16} /> Required Actions
              </h3>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{anomalies.length}</span>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              {anomalies.length === 0 ? (
                <div className="text-center text-sm text-slate-500 mt-10">No active anomalies.</div>
              ) : (
                anomalies.map(a => (
                  <div key={a.id} className="p-3 bg-red-50 border border-red-100 rounded-xl relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                    <div className="pl-2">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-semibold text-slate-800 text-sm">{a.name}</div>
                        <div className="text-xs text-slate-500">{a.timestamp}</div>
                      </div>
                      <div className="text-xs text-slate-600 mb-3">
                        Punched {a.type} at {a.location} but is marked as Absent by Class Teacher.
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1">
                          <Smartphone size={12} /> Notify Parent
                        </button>
                        <button className="flex-1 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
