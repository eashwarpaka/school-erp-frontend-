import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bus, Map, BellRing, Navigation, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { checkGeofence } from '../services/GeofenceService';
import toast from 'react-hot-toast';

interface Location {
  lat: number;
  lng: number;
}

interface BusData {
  id: string;
  regNumber: string;
  route: string;
  status: string;
  speed: number;
  location: Location;
}

// Mock initial positions
const INITIAL_BUSES: BusData[] = [
  { id: 'VH-01', regNumber: 'TN-09-AB-1234', route: 'North Route', status: 'En Route', speed: 35, location: { lat: 30, lng: 35 } },
  { id: 'VH-02', regNumber: 'TN-09-CD-5678', route: 'South Route', status: 'At School', speed: 0, location: { lat: 50, lng: 50 } },
];

export const LiveBusTracker = () => {
  const [buses, setBuses] = useState<BusData[]>(INITIAL_BUSES);
  
  // Simulate 30s updates (using 3s for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prev => prev.map(bus => {
        if (bus.status !== 'En Route') return bus;
        
        // Simulate movement towards the geofence
        const newLat = bus.location.lat + 1.2;
        const newLng = bus.location.lng + 0.8;
        const newLocation = { lat: newLat, lng: newLng };
        
        // Check Geofence
        const geofenceResult = checkGeofence(bus.id, newLocation);
        if (geofenceResult.entered) {
          toast.success(`Bus ${bus.regNumber} is approaching ${geofenceResult.stopName}! ETA: 5 mins`, {
            icon: '🚌',
            duration: 5000,
          });
        }
        
        return {
          ...bus,
          location: newLocation,
          speed: Math.floor(Math.random() * 20) + 30
        };
      }));
    }, 3000); // 3 seconds instead of 30s for demo
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden border border-slate-200 min-h-[260px] w-full">
      {/* Fake map grid */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #64748b 0, #64748b 1px, transparent 0, transparent 50%),repeating-linear-gradient(90deg, #64748b 0, #64748b 1px, transparent 0, transparent 50%)', backgroundSize: '40px 40px' }} />

      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-slate-200 text-xs text-slate-600 flex flex-col gap-2 z-20">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <Navigation size={14} className="text-teal-500" />
          Live GPS Feed Active
        </div>
        <div>Updates every 30s</div>
        <div className="flex items-center gap-1 text-emerald-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Connected
        </div>
      </div>

      {/* Geofence Zones */}
      <div className="absolute left-[40%] top-[40%] w-32 h-32 rounded-full border-2 border-amber-400/50 bg-amber-400/10 flex items-center justify-center">
        <MapPin size={16} className="text-amber-600 absolute -top-4" />
        <span className="text-[10px] text-amber-700 font-medium absolute -top-8 bg-white/80 px-2 py-0.5 rounded shadow-sm">Annanagar Stop</span>
      </div>

      {/* Live Buses */}
      {buses.map((bus) => (
        <motion.div
          key={bus.id}
          animate={{ left: `${bus.location.lng}%`, top: `${bus.location.lat}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          className="absolute flex flex-col items-center z-10"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <div className={clsx(
            'w-10 h-10 rounded-full flex items-center justify-center shadow-lg',
            bus.status === 'En Route' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-slate-500 shadow-slate-200'
          )}>
            <Bus size={18} className="text-white" />
          </div>
          <div className="bg-white text-xs font-semibold text-slate-700 px-2 py-1 rounded-full shadow mt-2 whitespace-nowrap border border-slate-100 flex flex-col items-center">
            <span>{bus.regNumber}</span>
            {bus.status === 'En Route' && <span className="text-[10px] text-teal-600">{bus.speed} km/h</span>}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
