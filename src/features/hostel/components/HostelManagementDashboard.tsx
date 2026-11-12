import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bed, Users, AlertTriangle, Coffee, ChevronRight, 
  Search, Filter, Plus, Home, UserCheck, ShieldAlert
} from 'lucide-react';
import clsx from 'clsx';

interface Room {
  id: string;
  roomNo: string;
  block: string;
  capacity: number;
  occupancy: number;
  type: 'AC' | 'NON-AC';
  status: 'AVAILABLE' | 'FULL' | 'MAINTENANCE';
}

const DUMMY_ROOMS: Room[] = [
  { id: 'RM-101', roomNo: 'A-101', block: 'Boys Block A', capacity: 2, occupancy: 2, type: 'AC', status: 'FULL' },
  { id: 'RM-102', roomNo: 'A-102', block: 'Boys Block A', capacity: 2, occupancy: 1, type: 'NON-AC', status: 'AVAILABLE' },
  { id: 'RM-103', roomNo: 'A-103', block: 'Boys Block A', capacity: 3, occupancy: 0, type: 'NON-AC', status: 'MAINTENANCE' },
  { id: 'RM-201', roomNo: 'B-201', block: 'Girls Block B', capacity: 4, occupancy: 3, type: 'AC', status: 'AVAILABLE' },
  { id: 'RM-202', roomNo: 'B-202', block: 'Girls Block B', capacity: 2, occupancy: 2, type: 'AC', status: 'FULL' },
];

export const HostelManagementDashboard = () => {
  const [rooms] = useState<Room[]>(DUMMY_ROOMS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = rooms.filter(r => 
    r.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.block.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalBeds: rooms.reduce((sum, r) => sum + r.capacity, 0),
    occupied: rooms.reduce((sum, r) => sum + r.occupancy, 0),
    maintenance: rooms.filter(r => r.status === 'MAINTENANCE').length,
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Home size={24} className="text-teal-600" />
            Hostel Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Room allocation, mess billing, and visitor logs.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 shadow-md transition-all">
          <Plus size={16} /> Allocate Room
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Capacity (Beds)', value: stats.totalBeds, icon: Bed, color: 'bg-blue-500' },
          { label: 'Occupied Beds', value: stats.occupied, icon: UserCheck, color: 'bg-teal-500' },
          { label: 'Rooms in Maintenance', value: stats.maintenance, icon: AlertTriangle, color: 'bg-amber-500', alert: stats.maintenance > 0 },
          { label: 'Active Visitor Passes', value: 12, icon: Users, color: 'bg-indigo-500' },
        ].map(kpi => (
          <div key={kpi.label} className={clsx('bg-white rounded-2xl border p-5 shadow-sm transition-all', kpi.alert ? 'border-amber-300 ring-2 ring-amber-500/20' : 'border-slate-100')}>
            <div className="flex items-center justify-between mb-3">
              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', kpi.color)}>
                <kpi.icon size={20} className="text-white" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-800">{kpi.value.toLocaleString()}</div>
            <div className="text-sm font-medium text-slate-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h3 className="font-bold text-slate-800">Room Directory</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Room or Block..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 border-b border-slate-100 z-10">
              <tr>
                <th className="px-5 py-3 font-semibold">Room No & Block</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Occupancy</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRooms.map(room => (
                <motion.tr key={room.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-800 text-lg">{room.roomNo}</div>
                    <div className="text-[10px] text-slate-500">{room.block}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-semibold">{room.type}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={clsx('h-full', room.occupancy === room.capacity ? 'bg-red-500' : 'bg-teal-500')} 
                          style={{ width: `${(room.occupancy / room.capacity) * 100}%` }} 
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{room.occupancy}/{room.capacity}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={clsx(
                      'px-2.5 py-1 rounded-full text-xs font-bold uppercase',
                      room.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' :
                      room.status === 'FULL' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    )}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold rounded-lg transition-colors">
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
