import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bus, MapPin, Users, Route, Navigation, AlertTriangle,
  CheckCircle, Clock, Phone, User, Shield, Fuel, Calendar,
  Plus, Search, Edit2, Eye, ChevronRight, ArrowRight,
  Wifi, WifiOff, Activity, TrendingUp, Map, Star, XCircle
} from 'lucide-react';
import clsx from 'clsx';
import { LiveBusTracker } from './LiveBusTracker';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
type VehicleStatus = 'En Route' | 'At School' | 'Parked' | 'Maintenance' | 'Inactive';

interface Stop {
  id: string;
  name: string;
  time: string;
  studentsCount: number;
  lat?: number;
  lng?: number;
}

interface Vehicle {
  id: string;
  regNumber: string;
  model: string;
  capacity: number;
  driver: string;
  driverPhone: string;
  conductor?: string;
  route: string;
  routeId: string;
  status: VehicleStatus;
  lastLocation: string;
  speed: number; // km/h
  studentsOnboard: number;
  fuelPercent: number;
  insuranceExpiry: string;
  pucExpiry: string;
  gpsDevice: string;
  isGpsOnline: boolean;
  nextMaintenance: string;
  totalKm: number;
}

interface TransportRoute {
  id: string;
  name: string;
  area: string;
  stops: Stop[];
  vehicleId: string;
  morningDeparture: string;
  afternoonDeparture: string;
  distance: number;
  studentsCount: number;
  status: 'Active' | 'Inactive';
}

// ── Mock Data ──────────────────────────────────────────────
const ROUTES: TransportRoute[] = [
  {
    id: 'RT-01', name: 'North Route', area: 'Annanagar & Kilpauk', vehicleId: 'VH-01',
    morningDeparture: '07:15', afternoonDeparture: '15:45', distance: 18, studentsCount: 32, status: 'Active',
    stops: [
      { id: 's1', name: 'Annanagar Tower Park', time: '07:15', studentsCount: 8 },
      { id: 's2', name: 'Kilpauk Garden', time: '07:25', studentsCount: 6 },
      { id: 's3', name: 'Poonamallee High Road', time: '07:35', studentsCount: 10 },
      { id: 's4', name: 'Aminjikarai', time: '07:45', studentsCount: 8 },
    ]
  },
  {
    id: 'RT-02', name: 'South Route', area: 'Adyar & Velachery', vehicleId: 'VH-02',
    morningDeparture: '07:00', afternoonDeparture: '15:30', distance: 22, studentsCount: 38, status: 'Active',
    stops: [
      { id: 's5', name: 'Adyar Bus Stand', time: '07:00', studentsCount: 10 },
      { id: 's6', name: 'Velachery Signal', time: '07:15', studentsCount: 12 },
      { id: 's7', name: 'Thiruvanmiyur', time: '07:28', studentsCount: 9 },
      { id: 's8', name: 'Indira Nagar', time: '07:40', studentsCount: 7 },
    ]
  },
  {
    id: 'RT-03', name: 'East Route', area: 'T.Nagar & Nungambakkam', vehicleId: 'VH-03',
    morningDeparture: '07:20', afternoonDeparture: '15:50', distance: 14, studentsCount: 27, status: 'Active',
    stops: [
      { id: 's9', name: 'T.Nagar Bus Stand', time: '07:20', studentsCount: 9 },
      { id: 's10', name: 'Nungambakkam', time: '07:30', studentsCount: 10 },
      { id: 's11', name: 'Egmore', time: '07:40', studentsCount: 8 },
    ]
  },
  {
    id: 'RT-04', name: 'West Route', area: 'Porur & Vadapalani', vehicleId: 'VH-04',
    morningDeparture: '07:10', afternoonDeparture: '15:40', distance: 20, studentsCount: 25, status: 'Inactive',
    stops: [
      { id: 's12', name: 'Porur Junction', time: '07:10', studentsCount: 12 },
      { id: 's13', name: 'Vadapalani', time: '07:25', studentsCount: 13 },
    ]
  },
];

const VEHICLES: Vehicle[] = [
  { id: 'VH-01', regNumber: 'TN-09-AB-1234', model: 'TATA Starbus 50', capacity: 50, driver: 'Murugan K',    driverPhone: '+91 98765 11111', conductor: 'Ravi S', route: 'North Route', routeId: 'RT-01', status: 'En Route',    lastLocation: 'Poonamallee High Road', speed: 35, studentsOnboard: 28, fuelPercent: 72, insuranceExpiry: '2027-03-15', pucExpiry: '2026-09-20', gpsDevice: 'GPS-NP-001', isGpsOnline: true,  nextMaintenance: '2026-08-20', totalKm: 48230 },
  { id: 'VH-02', regNumber: 'TN-09-CD-5678', model: 'TATA Starbus 60', capacity: 60, driver: 'Selvam P',    driverPhone: '+91 87654 22222', conductor: 'Kumar R', route: 'South Route', routeId: 'RT-02', status: 'At School',   lastLocation: 'School Gate',           speed: 0,  studentsOnboard: 0,  fuelPercent: 45, insuranceExpiry: '2026-11-30', pucExpiry: '2026-10-15', gpsDevice: 'GPS-SP-002', isGpsOnline: true,  nextMaintenance: '2026-09-10', totalKm: 62150 },
  { id: 'VH-03', regNumber: 'TN-09-EF-9012', model: 'Eicher School Bus', capacity: 40, driver: 'Ganesh M',  driverPhone: '+91 76543 33333', route: 'East Route', routeId: 'RT-03', status: 'Parked',      lastLocation: 'School Parking',        speed: 0,  studentsOnboard: 0,  fuelPercent: 88, insuranceExpiry: '2027-01-28', pucExpiry: '2027-01-10', gpsDevice: 'GPS-EP-003', isGpsOnline: true,  nextMaintenance: '2026-10-05', totalKm: 31890 },
  { id: 'VH-04', regNumber: 'TN-09-GH-3456', model: 'TATA Starbus 45', capacity: 45, driver: 'Balan V',    driverPhone: '+91 65432 44444', route: 'West Route',  routeId: 'RT-04', status: 'Maintenance', lastLocation: 'Service Center',        speed: 0,  studentsOnboard: 0,  fuelPercent: 20, insuranceExpiry: '2026-08-31', pucExpiry: '2026-08-15', gpsDevice: 'GPS-WP-004', isGpsOnline: false, nextMaintenance: '2026-08-03', totalKm: 75340 },
];

// ── Helpers ────────────────────────────────────────────────
const STATUS_CONFIG: Record<VehicleStatus, { color: string; dot: string; label: string }> = {
  'En Route':    { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', label: 'En Route' },
  'At School':   { color: 'text-blue-700 bg-blue-50 border-blue-200',         dot: 'bg-blue-500',    label: 'At School' },
  'Parked':      { color: 'text-slate-600 bg-slate-100 border-slate-200',     dot: 'bg-slate-400',   label: 'Parked' },
  'Maintenance': { color: 'text-red-700 bg-red-50 border-red-200',            dot: 'bg-red-500',     label: 'Maintenance' },
  'Inactive':    { color: 'text-slate-400 bg-slate-50 border-slate-200',      dot: 'bg-slate-300',   label: 'Inactive' },
};

const FuelBar = ({ percent }: { percent: number }) => {
  const color = percent > 60 ? 'bg-emerald-500' : percent > 30 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.5 }} className={clsx('h-full rounded-full', color)} />
      </div>
      <span className={clsx('text-xs font-semibold', percent <= 30 ? 'text-red-600' : 'text-slate-600')}>{percent}%</span>
    </div>
  );
};

// ── Vehicle Card ───────────────────────────────────────────
const VehicleCard = ({ vehicle, onSelect, isSelected }: { vehicle: Vehicle; onSelect: (v: Vehicle) => void; isSelected: boolean }) => {
  const sc = STATUS_CONFIG[vehicle.status];
  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      onClick={() => onSelect(vehicle)}
      className={clsx(
        'bg-white rounded-2xl border p-4 cursor-pointer shadow-sm transition-all',
        isSelected ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-100 hover:border-amber-200 hover:shadow-md'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', vehicle.status === 'En Route' ? 'bg-emerald-100' : vehicle.status === 'Maintenance' ? 'bg-red-100' : 'bg-slate-100')}>
            <Bus size={20} className={vehicle.status === 'En Route' ? 'text-emerald-600' : vehicle.status === 'Maintenance' ? 'text-red-500' : 'text-slate-500'} />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-sm">{vehicle.regNumber}</div>
            <div className="text-xs text-slate-500">{vehicle.model}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={clsx('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border', sc.color)}>
            <span className={clsx('w-1.5 h-1.5 rounded-full', sc.dot, vehicle.status === 'En Route' && 'animate-pulse')} />
            {sc.label}
          </span>
          {vehicle.isGpsOnline
            ? <span className="flex items-center gap-1 text-[10px] text-emerald-600"><Wifi size={9} /> GPS Live</span>
            : <span className="flex items-center gap-1 text-[10px] text-red-400"><WifiOff size={9} /> GPS Off</span>
          }
        </div>
      </div>

      {/* Route */}
      <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
        <Route size={11} className="text-amber-500" />
        <span className="font-medium">{vehicle.route}</span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
        <MapPin size={11} className="text-slate-400" />
        {vehicle.lastLocation}
        {vehicle.speed > 0 && <span className="ml-auto text-blue-600 font-semibold">{vehicle.speed} km/h</span>}
      </div>

      {/* Stats Row */}
      <div className="flex gap-3 text-xs text-slate-500 mb-3">
        <div className="flex items-center gap-1"><Users size={11} />{vehicle.studentsOnboard}/{vehicle.capacity}</div>
        <div className="flex items-center gap-1"><User size={11} />{vehicle.driver}</div>
      </div>

      {/* Fuel */}
      <FuelBar percent={vehicle.fuelPercent} />

      {/* Alerts */}
      {(vehicle.fuelPercent <= 30 || vehicle.status === 'Maintenance') && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 rounded-lg px-2 py-1.5">
          <AlertTriangle size={11} /> {vehicle.status === 'Maintenance' ? 'In maintenance service' : 'Low fuel — refill required'}
        </div>
      )}
    </motion.div>
  );
};

// ── Route Detail Panel ─────────────────────────────────────
const RouteDetailPanel = ({ route, vehicle, onClose }: { route: TransportRoute; vehicle?: Vehicle; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5"
  >
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-bold text-slate-800">{route.name}</h3>
        <p className="text-xs text-slate-500">{route.area} · {route.distance} km · {route.studentsCount} students</p>
      </div>
      <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', route.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
        {route.status}
      </span>
    </div>

    {/* Schedule */}
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
        <div className="text-xs text-amber-600 font-medium">Morning Pick-up</div>
        <div className="text-lg font-bold text-amber-700">{route.morningDeparture}</div>
      </div>
      <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
        <div className="text-xs text-blue-600 font-medium">Afternoon Drop</div>
        <div className="text-lg font-bold text-blue-700">{route.afternoonDeparture}</div>
      </div>
    </div>

    {/* Stop Timeline */}
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Stops</h4>
      <div className="space-y-0">
        {route.stops.map((stop, idx) => (
          <div key={stop.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={clsx('w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0', idx === 0 ? 'bg-amber-500 text-white' : idx === route.stops.length - 1 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600')}>
                {idx + 1}
              </div>
              {idx < route.stops.length - 1 && <div className="w-0.5 h-6 bg-slate-200 my-0.5" />}
            </div>
            <div className="pb-3 flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium text-slate-700 text-sm">{stop.name}</div>
                <div className="text-xs text-slate-400">{stop.time}</div>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Users size={10} />{stop.studentsCount} students</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Vehicle Info */}
    {vehicle && (
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Assigned Vehicle</h4>
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="font-semibold text-slate-800">{vehicle.regNumber}</div>
            <div className="text-xs text-slate-500">{vehicle.model}</div>
          </div>
          <div className="text-right">
            <div className="font-medium text-slate-700">{vehicle.driver}</div>
            <a href={`tel:${vehicle.driverPhone}`} className="text-xs text-blue-600 flex items-center gap-1 justify-end hover:underline">
              <Phone size={10} />{vehicle.driverPhone}
            </a>
          </div>
        </div>
      </div>
    )}
  </motion.div>
);

// ── Main Component ─────────────────────────────────────────
export const TransportDashboard = () => {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(VEHICLES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'fleet' | 'routes'>('fleet');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [isLiveTracking, setIsLiveTracking] = useState(false);

  const handleLiveTrack = () => {
    setIsLiveTracking(true);
    toast.loading('Initializing secure GPS feed and requesting location...', { id: 'gps' });
    
    // Simulate location permission and acquisition
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast.success('Location acquired. Connecting to live fleet...', { id: 'gps' });
          setTimeout(() => {
            navigate('/transport/gps-tracker');
          }, 1500);
        },
        (error) => {
          toast.error('Location access denied. Connecting using default center...', { id: 'gps' });
          setTimeout(() => {
            navigate('/transport/gps-tracker');
          }, 1500);
        }
      );
    } else {
      toast.success('Connecting to live fleet...', { id: 'gps' });
      setTimeout(() => {
        navigate('/transport/gps-tracker');
      }, 1500);
    }
  };

  const selectedRoute = selectedVehicle ? ROUTES.find(r => r.vehicleId === selectedVehicle.id) : null;

  const filtered = activeTab === 'fleet'
    ? VEHICLES.filter(v => v.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) || v.driver.toLowerCase().includes(searchQuery.toLowerCase()) || v.route.toLowerCase().includes(searchQuery.toLowerCase()))
    : ROUTES.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.area.toLowerCase().includes(searchQuery.toLowerCase()));

  const stats = {
    total: VEHICLES.length,
    enRoute: VEHICLES.filter(v => v.status === 'En Route').length,
    studentsOnboard: VEHICLES.reduce((s, v) => s + v.studentsOnboard, 0),
    maintenance: VEHICLES.filter(v => v.status === 'Maintenance').length,
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transport Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time fleet tracking & route management</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAddVehicleModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Plus size={14} /> Add Vehicle
          </button>
          <button 
            onClick={handleLiveTrack}
            disabled={isLiveTracking}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-all",
              isLiveTracking 
                ? "bg-slate-800 text-white shadow-slate-200" 
                : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-teal-200 hover:from-teal-600 hover:to-cyan-600"
            )}
          >
            <Navigation size={14} className={clsx(isLiveTracking && "animate-pulse")} /> 
            {isLiveTracking ? 'Connecting...' : 'Live Track'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Vehicles', value: stats.total, icon: Bus, color: 'bg-blue-500' },
          { label: 'En Route Now', value: stats.enRoute, icon: Navigation, color: 'bg-emerald-500', extra: 'animate-pulse' },
          { label: 'Students Onboard', value: stats.studentsOnboard, icon: Users, color: 'bg-amber-500' },
          { label: 'In Maintenance', value: stats.maintenance, icon: AlertTriangle, color: 'bg-red-500' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <motion.div key={item.label} whileHover={{ y: -2 }} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
              <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', item.color)}>
                <Icon size={20} className={clsx('text-white', item.extra)} />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">{item.value}</div>
                <div className="text-xs text-slate-500 font-medium">{item.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Map Placeholder + Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1 min-h-0">

        {/* Left: Vehicle/Route List */}
        <div className="lg:col-span-2 flex flex-col gap-3 min-h-0">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {(['fleet', 'routes'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={clsx('flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all', activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500')}>
                {tab === 'fleet' ? `Fleet (${VEHICLES.length})` : `Routes (${ROUTES.length})`}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder={activeTab === 'fleet' ? "Search vehicles or drivers…" : "Search routes or areas…"} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {activeTab === 'fleet' && (filtered as Vehicle[]).map(v => (
              <VehicleCard key={v.id} vehicle={v} onSelect={setSelectedVehicle} isSelected={selectedVehicle?.id === v.id} />
            ))}
            {activeTab === 'routes' && (filtered as TransportRoute[]).map(r => {
              const rv = VEHICLES.find(v => v.routeId === r.id);
              return (
                <motion.div key={r.id} whileHover={{ y: -2 }} onClick={() => { const v = VEHICLES.find(vv => vv.routeId === r.id); if (v) setSelectedVehicle(v); }} className="bg-white rounded-2xl border border-slate-100 p-4 cursor-pointer shadow-sm hover:border-teal-200 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-slate-800 text-sm">{r.name}</div>
                    <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', r.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')}>{r.status}</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-2">{r.area}</div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Users size={10} />{r.studentsCount}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} />{r.stops.length} stops</span>
                    <span className="flex items-center gap-1"><Navigation size={10} />{r.distance} km</span>
                    {rv && <span className="flex items-center gap-1"><Bus size={10} />{rv.regNumber}</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Map + Detail */}
        <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
          {/* Live Bus Tracker Component */}
          <LiveBusTracker />

          {/* Route Detail */}
          <AnimatePresence mode="wait">
            {selectedRoute && selectedVehicle && (
              <RouteDetailPanel key={selectedRoute.id} route={selectedRoute} vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {showAddVehicleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowAddVehicleModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg">Register New Vehicle</h3>
                <button onClick={() => setShowAddVehicleModal(false)} className="text-slate-400 hover:text-slate-600">
                  <XCircle size={20} />
                </button>
              </div>
              <form 
                className="p-5 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success('New vehicle registered successfully!');
                  setShowAddVehicleModal(false);
                }}
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Registration Number</label>
                  <input required type="text" placeholder="e.g. TN-09-XX-9999" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Make & Model</label>
                    <input required type="text" placeholder="e.g. TATA Starbus" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Seating Capacity</label>
                    <input required type="number" placeholder="45" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Driver Name</label>
                    <input type="text" placeholder="Driver name" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">GPS Device ID</label>
                    <input required type="text" placeholder="GPS-XX-001" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                  <button type="button" onClick={() => setShowAddVehicleModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-sm shadow-teal-200">Register Vehicle</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
