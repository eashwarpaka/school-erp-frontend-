import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Bus, Navigation, Clock, Users, Phone,
  AlertTriangle, Shield, Fuel, Wifi, WifiOff,
  ChevronRight, Eye, Bell, Zap, Route, XCircle, MessageSquare
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
interface BusLocation {
  id: string;
  regNumber: string;
  routeName: string;
  driver: string;
  driverPhone: string;
  status: 'En Route' | 'At School' | 'Stopped' | 'Delayed';
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  studentsOnboard: number;
  capacity: number;
  eta: string;
  lastStop: string;
  nextStop: string;
  fuelPercent: number;
  isGpsOnline: boolean;
  geofenceAlert: string | null;
}

// ── Mock Data ──────────────────────────────────────────────
const BUS_LOCATIONS: BusLocation[] = [
  { id: 'V-001', regNumber: 'KA-01-AB-1234', routeName: 'Route 1 — Whitefield', driver: 'Raju Kumar', driverPhone: '+91 98765 43210', status: 'En Route', lat: 12.9716, lng: 77.5946, speed: 35, heading: 45, studentsOnboard: 32, capacity: 45, eta: '7:45 AM', lastStop: 'ITPL Main Gate', nextStop: 'Phoenix Mall', fuelPercent: 78, isGpsOnline: true, geofenceAlert: null },
  { id: 'V-002', regNumber: 'KA-01-CD-5678', routeName: 'Route 2 — Electronic City', driver: 'Suresh Babu', driverPhone: '+91 98765 43211', status: 'En Route', lat: 12.8440, lng: 77.6630, speed: 42, heading: 120, studentsOnboard: 28, capacity: 40, eta: '7:50 AM', lastStop: 'Infosys Gate', nextStop: 'Biocon Circle', fuelPercent: 65, isGpsOnline: true, geofenceAlert: null },
  { id: 'V-003', regNumber: 'KA-01-EF-9012', routeName: 'Route 3 — Marathahalli', driver: 'Venkatesh P', driverPhone: '+91 98765 43212', status: 'Delayed', lat: 12.9562, lng: 77.7009, speed: 8, heading: 90, studentsOnboard: 35, capacity: 40, eta: '8:10 AM', lastStop: 'Kalamandir', nextStop: 'Marathahalli Bridge', fuelPercent: 55, isGpsOnline: true, geofenceAlert: '⚠️ Bus delayed — heavy traffic on ORR' },
  { id: 'V-004', regNumber: 'KA-01-GH-3456', routeName: 'Route 4 — Bannerghatta', driver: 'Mohammed Ali', driverPhone: '+91 98765 43213', status: 'At School', lat: 12.9200, lng: 77.5800, speed: 0, heading: 0, studentsOnboard: 0, capacity: 45, eta: 'Arrived', lastStop: 'School', nextStop: '—', fuelPercent: 82, isGpsOnline: true, geofenceAlert: null },
  { id: 'V-005', regNumber: 'KA-01-IJ-7890', routeName: 'Route 5 — Yelahanka', driver: 'Prakash M', driverPhone: '+91 98765 43214', status: 'Stopped', lat: 13.1007, lng: 77.5963, speed: 0, heading: 180, studentsOnboard: 22, capacity: 35, eta: '7:55 AM', lastStop: 'Jakkur Cross', nextStop: 'Yelahanka New Town', fuelPercent: 91, isGpsOnline: false, geofenceAlert: '📡 GPS signal lost — last seen 3 min ago' },
];

const statusColors: Record<string, string> = {
  'En Route': 'bg-emerald-100 text-emerald-700',
  'At School': 'bg-blue-100 text-blue-700',
  'Stopped': 'bg-amber-100 text-amber-700',
  'Delayed': 'bg-red-100 text-red-700',
};

const statusDotColors: Record<string, string> = {
  'En Route': 'bg-emerald-500',
  'At School': 'bg-blue-500',
  'Stopped': 'bg-amber-500',
  'Delayed': 'bg-red-500',
};

// ── Component ──────────────────────────────────────────────
export const LiveGPSTracker = () => {
  const [buses, setBuses] = useState<BusLocation[]>(BUS_LOCATIONS);
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(BUS_LOCATIONS[0]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showCallDriverModal, setShowCallDriverModal] = useState<BusLocation | null>(null);
  const [showAlertParentsModal, setShowAlertParentsModal] = useState<BusLocation | null>(null);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Simulate live GPS updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prev => prev.map(bus => ({
        ...bus,
        speed: bus.status === 'At School' ? 0 : Math.max(0, bus.speed + (Math.random() * 10 - 5)),
        lat: bus.lat + (Math.random() * 0.001 - 0.0005),
        lng: bus.lng + (Math.random() * 0.001 - 0.0005),
      })));
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeVehicles = buses.filter(b => b.status !== 'At School').length;
  const totalStudents = buses.reduce((s, b) => s + b.studentsOnboard, 0);
  const alerts = buses.filter(b => b.geofenceAlert).length;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] p-4 md:p-6 max-w-7xl mx-auto gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Navigation size={22} className="text-blue-600" />
            Live GPS Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
            Real-time fleet tracking and geofencing alerts
            <span className="flex items-center gap-1 text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live</span>
            <span className="text-slate-400">Updated {lastUpdate.toLocaleTimeString()}</span>
          </p>
        </div>
        <div className="flex gap-2">
          {alerts > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              <AlertTriangle size={13} /> {alerts} Alert{alerts > 1 ? 's' : ''}
            </div>
          )}
          <button
            onClick={() => setShowNotifyModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Bell size={13} /> Notify Parents
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Active Vehicles', value: activeVehicles, total: buses.length, color: 'text-emerald-600' },
          { label: 'Students in Transit', value: totalStudents, total: null, color: 'text-blue-600' },
          { label: 'Geofence Alerts', value: alerts, total: null, color: alerts > 0 ? 'text-red-600' : 'text-slate-400' },
          { label: 'GPS Online', value: buses.filter(b => b.isGpsOnline).length, total: buses.length, color: 'text-emerald-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-100 p-3 text-center">
            <div className={clsx('text-lg font-bold', stat.color)}>
              {stat.value}{stat.total !== null ? `/${stat.total}` : ''}
            </div>
            <div className="text-[10px] text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Layout: Map + Bus List */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Map Area */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 overflow-hidden relative">
          {/* Simulated Map */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-cyan-50">
            {/* Grid lines to simulate a map */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Simulated roads */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <line x1="10%" y1="30%" x2="90%" y2="30%" stroke="#64748b" strokeWidth="3" strokeDasharray="8,4" />
              <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#64748b" strokeWidth="3" strokeDasharray="8,4" />
              <line x1="20%" y1="60%" x2="80%" y2="60%" stroke="#64748b" strokeWidth="2" strokeDasharray="6,3" />
              <line x1="30%" y1="10%" x2="70%" y2="90%" stroke="#64748b" strokeWidth="2" strokeDasharray="6,3" />
            </svg>

            {/* School marker */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 border-2 border-white">
                <span className="text-lg">🏫</span>
              </div>
              <div className="text-[9px] font-bold text-indigo-800 bg-white/90 px-1.5 py-0.5 rounded mt-1 text-center shadow-sm">School</div>
            </div>

            {/* Bus markers */}
            {buses.map((bus, i) => {
              const positions = [
                { left: '20%', top: '25%' },
                { left: '75%', top: '70%' },
                { left: '65%', top: '20%' },
                { left: '50%', top: '50%' },
                { left: '30%', top: '75%' },
              ];
              const pos = positions[i] || positions[0];
              return (
                <motion.div
                  key={bus.id}
                  animate={{
                    left: pos.left,
                    top: pos.top,
                    x: Math.sin(Date.now() / 3000 + i) * 3,
                    y: Math.cos(Date.now() / 3000 + i) * 3,
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute z-10 cursor-pointer"
                  style={{ left: pos.left, top: pos.top }}
                  onClick={() => setSelectedBus(bus)}
                >
                  <div className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all',
                    selectedBus?.id === bus.id ? 'scale-125 ring-4 ring-blue-200' : '',
                    bus.status === 'En Route' ? 'bg-emerald-500' :
                    bus.status === 'Delayed' ? 'bg-red-500' :
                    bus.status === 'Stopped' ? 'bg-amber-500' : 'bg-blue-500'
                  )}>
                    <Bus size={14} className="text-white" />
                  </div>
                  <div className="text-[8px] font-bold text-slate-700 bg-white/90 px-1 py-0.5 rounded mt-0.5 text-center shadow-sm whitespace-nowrap">
                    {bus.routeName.split('—')[0].trim()}
                  </div>
                  {bus.geofenceAlert && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white animate-pulse">!</span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-2.5 shadow-sm border border-slate-200 z-20">
            <div className="text-[10px] font-semibold text-slate-600 mb-1.5">Legend</div>
            <div className="space-y-1 text-[9px]">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> En Route</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Stopped</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Delayed</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> At School</div>
            </div>
          </div>

          {/* Integration note */}
          <div className="absolute top-3 right-3 bg-indigo-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[10px] font-medium z-20">
            🗺️ Integrate with Leaflet / Google Maps for production
          </div>
        </div>

        {/* Bus List */}
        <div className="bg-white rounded-xl border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 text-sm">Fleet Status</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {buses.map(bus => (
              <div
                key={bus.id}
                onClick={() => setSelectedBus(bus)}
                className={clsx(
                  'p-3 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50',
                  selectedBus?.id === bus.id && 'bg-blue-50 border-l-4 border-l-blue-500'
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800">{bus.routeName}</span>
                  <span className={clsx('text-[9px] font-medium px-1.5 py-0.5 rounded-full', statusColors[bus.status])}>
                    {bus.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Bus size={10} /> {bus.regNumber}
                    <span className="text-slate-300">•</span>
                    {bus.isGpsOnline ? <Wifi size={10} className="text-emerald-500" /> : <WifiOff size={10} className="text-red-400" />}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={10} /> {bus.studentsOnboard}/{bus.capacity}
                    <span className="text-slate-300">•</span>
                    <Navigation size={10} /> {Math.round(bus.speed)} km/h
                    <span className="text-slate-300">•</span>
                    <span>ETA: {bus.eta}</span>
                  </div>
                </div>
                {bus.geofenceAlert && (
                  <div className="mt-1.5 text-[10px] text-red-600 bg-red-50 px-2 py-1 rounded font-medium">
                    {bus.geofenceAlert}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Selected Bus Detail */}
          {selectedBus && (
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <div className="text-xs font-semibold text-slate-700 mb-2">Driver: {selectedBus.driver}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCallDriverModal(selectedBus)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-medium shadow-sm hover:bg-emerald-700 transition-colors"
                >
                  <Phone size={11} /> Call Driver
                </button>
                <button
                  onClick={() => setShowAlertParentsModal(selectedBus)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-blue-600 text-white rounded-lg text-[11px] font-medium shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Bell size={11} /> Alert Parents
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {/* Broadcast Notify Modal */}
        {showNotifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowNotifyModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Broadcast to Parents</h3>
                <button onClick={() => setShowNotifyModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={20} /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Select Audience</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Parents (In Transit)</option>
                    <option>Delayed Routes Only</option>
                    {buses.map(b => <option key={b.id}>{b.routeName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Message</label>
                  <textarea 
                    rows={3} 
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Enter alert message..."
                  />
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setShowNotifyModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button 
                  onClick={() => {
                    toast.success('Broadcast message sent to selected parents!');
                    setShowNotifyModal(false);
                    setNotificationMessage('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm"
                >
                  Send Broadcast
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Call Driver Modal */}
        {showCallDriverModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCallDriverModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs overflow-hidden text-center p-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Phone size={32} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">Calling {showCallDriverModal.driver}</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">{showCallDriverModal.driverPhone}</p>
              
              <button 
                onClick={() => {
                  toast.success('Call ended.');
                  setShowCallDriverModal(null);
                }}
                className="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-md shadow-red-200 transition-colors"
              >
                End Call
              </button>
            </motion.div>
          </div>
        )}

        {/* Route-Specific Alert Parents Modal */}
        {showAlertParentsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAlertParentsModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare size={18} className="text-blue-600" />
                  Alert Route Parents
                </h3>
                <button onClick={() => setShowAlertParentsModal(null)} className="text-slate-400 hover:text-slate-600"><XCircle size={20} /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg flex gap-2">
                  <AlertTriangle size={16} className="shrink-0 text-amber-600" />
                  <div>
                    <span className="font-bold block mb-0.5">{showAlertParentsModal.routeName}</span>
                    This will send an immediate SMS and App Push Notification to the parents of all {showAlertParentsModal.studentsOnboard} students currently onboard.
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Message</label>
                  <textarea 
                    rows={4} 
                    defaultValue={`Important update regarding ${showAlertParentsModal.routeName}. The bus is currently experiencing delays.`}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setShowAlertParentsModal(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button 
                  onClick={() => {
                    toast.success('Alert sent successfully to parents on this route.');
                    setShowAlertParentsModal(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200"
                >
                  Send Alert
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
