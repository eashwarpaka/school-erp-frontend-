import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, Bed, Coffee, Calendar, AlertTriangle,
  CheckCircle, Search, Plus, ClipboardList, CreditCard,
  UserCheck, Eye, Bell, Shield, Utensils, Clock,
  Settings, BarChart3, Phone, ChevronRight, Star, Edit3, X
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
interface Room {
  id: string; roomNo: string; block: string; floor: number;
  capacity: number; occupancy: number; type: 'AC' | 'Non-AC';
  status: 'Available' | 'Full' | 'Maintenance'; monthlyFee: number;
}

interface HostelStudent {
  id: string; name: string; avatar: string; roomNo: string; grade: string;
  parentPhone: string; allergies: string; checkInDate: string;
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
}

interface MessMenu {
  day: string; breakfast: string; lunch: string; snacks: string; dinner: string;
}

interface Complaint {
  id: string; studentName: string; roomNo: string; subject: string;
  description: string; status: 'Open' | 'In Progress' | 'Resolved'; date: string; priority: 'Low' | 'Medium' | 'High';
}

interface VisitorEntry {
  id: string; visitorName: string; phone: string; studentName: string;
  roomNo: string; purpose: string; checkIn: string; checkOut: string | null; idType: string;
}

// ── Initial Mock Data ──────────────────────────────────────────────
const INITIAL_ROOMS: Room[] = [
  { id: 'RM-101', roomNo: 'A-101', block: 'Boys Block A', floor: 1, capacity: 2, occupancy: 2, type: 'AC', status: 'Full', monthlyFee: 8000 },
  { id: 'RM-102', roomNo: 'A-102', block: 'Boys Block A', floor: 1, capacity: 2, occupancy: 1, type: 'Non-AC', status: 'Available', monthlyFee: 5000 },
  { id: 'RM-103', roomNo: 'A-103', block: 'Boys Block A', floor: 1, capacity: 3, occupancy: 0, type: 'Non-AC', status: 'Maintenance', monthlyFee: 5000 },
  { id: 'RM-201', roomNo: 'B-201', block: 'Girls Block B', floor: 2, capacity: 4, occupancy: 3, type: 'AC', status: 'Available', monthlyFee: 7500 },
  { id: 'RM-202', roomNo: 'B-202', block: 'Girls Block B', floor: 2, capacity: 2, occupancy: 2, type: 'AC', status: 'Full', monthlyFee: 8000 },
  { id: 'RM-301', roomNo: 'C-301', block: 'Boys Block C', floor: 3, capacity: 3, occupancy: 2, type: 'Non-AC', status: 'Available', monthlyFee: 4500 },
];

const INITIAL_HOSTEL_STUDENTS: HostelStudent[] = [
  { id: 'HS-001', name: 'Rahul Verma', avatar: '👦', roomNo: 'A-101', grade: 'Grade 10', parentPhone: '+91 98765 43210', allergies: 'None', checkInDate: '2026-06-01', feeStatus: 'Paid' },
  { id: 'HS-002', name: 'Sunil Kumar', avatar: '👦', roomNo: 'A-101', grade: 'Grade 10', parentPhone: '+91 98765 43211', allergies: 'Lactose', checkInDate: '2026-06-01', feeStatus: 'Pending' },
  { id: 'HS-003', name: 'Kavya Nair', avatar: '👧', roomNo: 'B-201', grade: 'Grade 11', parentPhone: '+91 98765 43212', allergies: 'None', checkInDate: '2026-06-05', feeStatus: 'Paid' },
  { id: 'HS-004', name: 'Divya Sharma', avatar: '👧', roomNo: 'B-202', grade: 'Grade 9', parentPhone: '+91 98765 43213', allergies: 'Nuts', checkInDate: '2026-06-03', feeStatus: 'Overdue' },
];

const INITIAL_MESS_MENU: MessMenu[] = [
  { day: 'Monday', breakfast: 'Idli, Sambar, Chutney', lunch: 'Rice, Dal, Sabzi, Curd', snacks: 'Tea, Biscuits', dinner: 'Roti, Paneer, Dal' },
  { day: 'Tuesday', breakfast: 'Poha, Jalebi, Milk', lunch: 'Biryani, Raita, Salad', snacks: 'Samosa, Juice', dinner: 'Roti, Chole, Rice' },
  { day: 'Wednesday', breakfast: 'Dosa, Chutney, Coffee', lunch: 'Rice, Rajma, Sabzi', snacks: 'Bread Pakora, Tea', dinner: 'Noodles, Manchurian' },
  { day: 'Thursday', breakfast: 'Paratha, Curd, Pickle', lunch: 'Rice, Fish Curry, Sabzi', snacks: 'Cake, Milk', dinner: 'Roti, Dal Makhani' },
  { day: 'Friday', breakfast: 'Upma, Vada, Sambar', lunch: 'Rice, Chicken Curry, Salad', snacks: 'Cutlet, Juice', dinner: 'Roti, Mix Veg, Kheer' },
];

const INITIAL_COMPLAINTS: Complaint[] = [
  { id: 'CMP-001', studentName: 'Rahul Verma', roomNo: 'A-101', subject: 'AC not working', description: 'AC in room A-101 is making noise and not cooling properly.', status: 'In Progress', date: '2026-09-16', priority: 'High' },
  { id: 'CMP-002', studentName: 'Kavya Nair', roomNo: 'B-201', subject: 'Water leakage', description: 'Bathroom tap has a slow leak, wasting water.', status: 'Open', date: '2026-09-17', priority: 'Medium' },
  { id: 'CMP-003', studentName: 'Divya Sharma', roomNo: 'B-202', subject: 'WiFi connectivity', description: 'WiFi signal is very weak in Block B second floor.', status: 'Resolved', date: '2026-09-14', priority: 'Low' },
];

const INITIAL_VISITORS: VisitorEntry[] = [
  { id: 'VIS-001', visitorName: 'Mr. Verma', phone: '+91 98765 43210', studentName: 'Rahul Verma', roomNo: 'A-101', purpose: 'Parent visit', checkIn: '10:00 AM', checkOut: '12:30 PM', idType: 'Aadhaar' },
  { id: 'VIS-002', visitorName: 'Mrs. Nair', phone: '+91 98765 43212', studentName: 'Kavya Nair', roomNo: 'B-201', purpose: 'Dropping supplies', checkIn: '2:00 PM', checkOut: null, idType: 'Driving License' },
];

const tabItems = [
  { key: 'rooms', label: 'Rooms', icon: Bed },
  { key: 'students', label: 'Residents', icon: Users },
  { key: 'attendance', label: 'Attendance', icon: UserCheck },
  { key: 'mess', label: 'Mess Menu', icon: Utensils },
  { key: 'fees', label: 'Fees', icon: CreditCard },
  { key: 'complaints', label: 'Complaints', icon: AlertTriangle },
  { key: 'visitors', label: 'Visitors', icon: Eye },
] as const;

type TabKey = typeof tabItems[number]['key'];

const roomStatusColors = {
  Available: 'bg-emerald-100 text-emerald-700',
  Full: 'bg-blue-100 text-blue-700',
  Maintenance: 'bg-red-100 text-red-700',
};

const feeColors = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Overdue: 'bg-red-100 text-red-700',
};

const priorityColors = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-red-100 text-red-700',
};

const complaintStatusColors = {
  Open: 'bg-red-100 text-red-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
};

// ── Modal Wrapper ──────────────────────────────────────────────
const Modal = ({ isOpen, onClose, title, children }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-slate-800">{title}</h3>
              <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ── Main Component ──────────────────────────────────────────────
export const HostelManagement = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('rooms');
  
  // State for data
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [students, setStudents] = useState<HostelStudent[]>(INITIAL_HOSTEL_STUDENTS);
  const [messMenu, setMessMenu] = useState<MessMenu[]>(INITIAL_MESS_MENU);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [visitors, setVisitors] = useState<VisitorEntry[]>(INITIAL_VISITORS);
  
  // State for modals
  const [isAddResidentModalOpen, setAddResidentModalOpen] = useState(false);
  const [isVisitorModalOpen, setVisitorModalOpen] = useState(false);
  const [isEditMenuModalOpen, setEditMenuModalOpen] = useState(false);
  const [isComplaintModalOpen, setComplaintModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<string>('Monday');

  // State for attendance and fees
  const [attendanceRecord, setAttendanceRecord] = useState<Record<string, 'Present'|'Absent'>>({});
  const [remindersSent, setRemindersSent] = useState<Set<string>>(new Set());

  const stats = {
    totalBeds: rooms.reduce((s, r) => s + r.capacity, 0),
    occupied: rooms.reduce((s, r) => s + r.occupancy, 0),
    available: rooms.filter(r => r.status === 'Available').reduce((s, r) => s + (r.capacity - r.occupancy), 0),
    maintenance: rooms.filter(r => r.status === 'Maintenance').length,
    openComplaints: complaints.filter(c => c.status !== 'Resolved').length,
    pendingFees: students.filter(s => s.feeStatus !== 'Paid').length,
  };

  const handleMarkAttendance = (id: string, status: 'Present' | 'Absent') => {
    setAttendanceRecord(prev => ({ ...prev, [id]: status }));
    toast.success(`Student marked ${status}!`);
  };

  const handleAddResidentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roomNo = formData.get('roomNo') as string;
    
    // Check if room has capacity
    const room = rooms.find(r => r.roomNo === roomNo);
    if (!room || room.occupancy >= room.capacity) {
      toast.error('Selected room is full!');
      return;
    }

    const newStudent: HostelStudent = {
      id: `HS-00${students.length + 1}`,
      name: formData.get('name') as string,
      avatar: '🧑',
      roomNo,
      grade: formData.get('grade') as string,
      parentPhone: formData.get('phone') as string,
      allergies: formData.get('allergies') as string || 'None',
      checkInDate: new Date().toISOString().split('T')[0],
      feeStatus: 'Paid'
    };

    setStudents([...students, newStudent]);
    setRooms(rooms.map(r => r.roomNo === roomNo ? { 
      ...r, 
      occupancy: r.occupancy + 1,
      status: r.occupancy + 1 >= r.capacity ? 'Full' : 'Available' 
    } : r));
    
    toast.success('Resident added successfully!');
    setAddResidentModalOpen(false);
  };

  const handleAddVisitorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newVisitor: VisitorEntry = {
      id: `VIS-00${visitors.length + 1}`,
      visitorName: formData.get('visitorName') as string,
      phone: formData.get('phone') as string,
      studentName: formData.get('studentName') as string,
      roomNo: formData.get('roomNo') as string,
      purpose: formData.get('purpose') as string,
      idType: formData.get('idType') as string,
      checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkOut: null
    };

    setVisitors([newVisitor, ...visitors]);
    toast.success('Visitor registered successfully!');
    setVisitorModalOpen(false);
  };

  const handleVisitorCheckout = (id: string) => {
    setVisitors(visitors.map(v => v.id === id ? { 
      ...v, 
      checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    } : v));
    toast.success('Visitor checked out!');
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Home size={26} className="text-teal-600" /> Hostel Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Room allocation, mess, attendance, fees & visitor management</p>
        </div>
        <button
          onClick={() => setAddResidentModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-teal-200 hover:shadow-teal-300 transition-all hover:-translate-y-0.5"
        >
          <Plus size={16} /> Add Resident
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Beds', value: stats.totalBeds, icon: Bed, color: 'text-blue-600' },
          { label: 'Occupied', value: stats.occupied, icon: Users, color: 'text-emerald-600' },
          { label: 'Available', value: stats.available, icon: CheckCircle, color: 'text-teal-600' },
          { label: 'Maintenance', value: stats.maintenance, icon: Settings, color: 'text-red-600' },
          { label: 'Open Issues', value: stats.openComplaints, icon: AlertTriangle, color: 'text-amber-600' },
          { label: 'Fee Pending', value: stats.pendingFees, icon: CreditCard, color: 'text-red-600' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="bg-white rounded-xl border border-slate-100 p-4 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <stat.icon size={20} className={clsx('mx-auto mb-2', stat.color)} />
            <div className="text-xl font-black text-slate-800">{stat.value}</div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto bg-slate-100/50 p-1.5 rounded-xl border border-slate-100">
        {tabItems.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={clsx('flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200',
              activeTab === tab.key ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            )}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* ────────────────── Tab Contents ────────────────── */}
      
      {/* Rooms Tab */}
      {activeTab === 'rooms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room, i) => (
            <motion.div key={room.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              whileHover={{ y: -4 }} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center text-2xl border border-teal-100/50 shadow-sm">
                    🏠
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-lg leading-tight">{room.roomNo}</div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">{room.block} • Floor {room.floor}</div>
                  </div>
                </div>
                <span className={clsx('text-xs font-bold px-3 py-1 rounded-full border', 
                  room.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  room.status === 'Full' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-red-50 text-red-700 border-red-200'
                )}>
                  {room.status}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center bg-slate-50 rounded-xl p-3 mb-4">
                <div>
                  <div className="text-sm font-black text-slate-800">{room.occupancy}/{room.capacity}</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Occupancy</div>
                </div>
                <div>
                  <div className="text-sm font-black text-slate-800">{room.type}</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Type</div>
                </div>
                <div>
                  <div className="text-sm font-black text-slate-800">₹{(room.monthlyFee / 1000).toFixed(1)}K</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">/month</div>
                </div>
              </div>
              
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={clsx('h-full rounded-full transition-all duration-500', 
                  room.occupancy === room.capacity ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 
                  room.occupancy === 0 ? 'bg-slate-300' : 
                  'bg-gradient-to-r from-teal-400 to-emerald-500')}
                  style={{ width: `${(room.occupancy / room.capacity) * 100}%` }} 
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Residents Tab */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Resident</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fee Status</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Allergies</th>
                <th className="text-right px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Parent</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">{s.avatar}</div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{s.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">Check-in: {s.checkInDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-slate-700">{s.roomNo}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{s.grade}</td>
                    <td className="px-5 py-3">
                      <span className={clsx('text-xs font-bold px-2.5 py-1 rounded-md border', 
                        s.feeStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        s.feeStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      )}>{s.feeStatus}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600">{s.allergies}</td>
                    <td className="px-5 py-3 text-right">
                      <a href={`tel:${s.parentPhone}`} onClick={() => toast.success(`Calling ${s.parentPhone}...`)} 
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm border border-slate-100"
                      >
                        <Phone size={16} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-5">
            <UserCheck size={36} className="text-teal-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Night Roll Call</h3>
          <p className="text-sm text-slate-500 mt-2 mb-8 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <div className="max-w-2xl mx-auto space-y-3">
            {students.map(s => {
              const status = attendanceRecord[s.id];
              return (
                <div key={s.id} className={clsx(
                  "flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
                  status === 'Present' ? 'bg-emerald-50/50 border-emerald-100' :
                  status === 'Absent' ? 'bg-red-50/50 border-red-100' :
                  'bg-slate-50 border-slate-100 hover:border-slate-200'
                )}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{s.avatar}</span>
                    <div className="text-left">
                      <div className="text-sm font-bold text-slate-800">{s.name}</div>
                      <div className="text-xs font-medium text-slate-500">Room {s.roomNo}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleMarkAttendance(s.id, 'Present')} 
                      className={clsx("px-4 py-2 rounded-lg text-sm font-bold transition-all", 
                        status === 'Present' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                      )}
                    >
                      Present
                    </button>
                    <button onClick={() => handleMarkAttendance(s.id, 'Absent')} 
                      className={clsx("px-4 py-2 rounded-lg text-sm font-bold transition-all", 
                        status === 'Absent' ? 'bg-red-500 text-white shadow-md shadow-red-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                      )}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex justify-end max-w-2xl mx-auto">
            <button onClick={() => toast.success('Attendance saved successfully!')} className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-teal-700 transition-colors">
              Save Attendance
            </button>
          </div>
        </div>
      )}

      {/* Mess Menu Tab */}
      {activeTab === 'mess' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <Utensils size={20} className="text-amber-500" /> Weekly Mess Menu
            </h3>
            <button onClick={() => setEditMenuModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
              <Edit3 size={16} /> Edit Menu
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-white border-b border-slate-100">
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Day</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">🌅 Breakfast</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">🌞 Lunch</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">🍪 Snacks</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">🌙 Dinner</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {messMenu.map(m => (
                  <tr key={m.day} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-bold text-slate-800">{m.day}</td>
                    <td className="px-5 py-4 text-sm text-slate-600 font-medium">{m.breakfast}</td>
                    <td className="px-5 py-4 text-sm text-slate-600 font-medium">{m.lunch}</td>
                    <td className="px-5 py-4 text-sm text-slate-600 font-medium">{m.snacks}</td>
                    <td className="px-5 py-4 text-sm text-slate-600 font-medium">{m.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fees Tab */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Hostel Fee Collection</h3>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">September 2026</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.map(s => (
              <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-xl shadow-inner">{s.avatar}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{s.name}</div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">Room {s.roomNo}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={clsx('text-[11px] font-bold px-3 py-1 rounded-md border uppercase tracking-wider', 
                    s.feeStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    s.feeStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  )}>{s.feeStatus}</span>
                  {s.feeStatus !== 'Paid' && (
                    <button 
                      onClick={() => {
                        toast.success(`Payment reminder sent to ${s.name}'s parent!`);
                        setRemindersSent(new Set(remindersSent).add(s.id));
                      }}
                      disabled={remindersSent.has(s.id)}
                      className={clsx("text-xs font-bold underline decoration-2 underline-offset-2 transition-colors", 
                        remindersSent.has(s.id) ? "text-slate-400 decoration-slate-200 cursor-not-allowed" : "text-indigo-600 hover:text-indigo-800 decoration-indigo-200"
                      )}
                    >
                      {remindersSent.has(s.id) ? 'Reminder Sent' : 'Send Reminder'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="flex justify-end">
             <button onClick={() => setComplaintModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors shadow-md">
              <Plus size={16} /> Log Complaint
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complaints.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="pr-4">
                    <h4 className="text-base font-bold text-slate-800 leading-snug">{c.subject}</h4>
                    <div className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-2">
                      <span className="text-slate-700">{c.studentName}</span> 
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>Room {c.roomNo}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100 line-clamp-2">{c.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><Calendar size={12} /> {c.date}</div>
                  <div className="flex gap-2">
                    <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase', 
                      c.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                      c.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-slate-50 text-slate-600 border-slate-200'
                    )}>{c.priority}</span>
                    <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase', 
                      c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      c.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-100 text-slate-700 border-slate-300'
                    )}>{c.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visitors Tab */}
      {activeTab === 'visitors' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-lg">Visitor Logs</h3>
            <button onClick={() => setVisitorModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition-colors shadow-md shadow-teal-200">
              <Plus size={16} /> New Entry
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-white border-b border-slate-100">
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Visitor Details</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Visiting</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Purpose & ID</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time In</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status/Time Out</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {visitors.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-slate-800">{v.visitorName}</div>
                      <div className="text-xs font-medium text-slate-500 mt-0.5">{v.phone}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-slate-700">{v.studentName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Room {v.roomNo}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-slate-700 font-medium">{v.purpose}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{v.idType}</div>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-emerald-600 flex items-center gap-1.5"><Clock size={14}/> {v.checkIn}</td>
                    <td className="px-5 py-4 text-sm">
                      {v.checkOut ? (
                        <span className="text-slate-600 font-medium">{v.checkOut}</span>
                      ) : (
                        <button onClick={() => handleVisitorCheckout(v.id)} className="px-3 py-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-xs font-bold transition-colors">
                          Check Out Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ────────────────── Modals ────────────────── */}

      <Modal isOpen={isAddResidentModalOpen} onClose={() => setAddResidentModalOpen(false)} title="Allocate Room & Add Resident">
        <form onSubmit={handleAddResidentSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Student Name</label>
            <input name="name" required type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" placeholder="E.g. Rohan Sharma" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Room Selection</label>
              <select name="roomNo" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all">
                {rooms.filter(r => r.occupancy < r.capacity && r.status !== 'Maintenance').map(r => (
                  <option key={r.id} value={r.roomNo}>{r.roomNo} ({r.capacity - r.occupancy} beds left)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Grade/Class</label>
              <input name="grade" required type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" placeholder="E.g. Grade 10" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Parent Contact Number</label>
            <input name="phone" required type="tel" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" placeholder="+91 XXXXX XXXXX" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Medical Conditions / Allergies</label>
            <textarea name="allergies" rows={2} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" placeholder="Leave blank if none"></textarea>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={() => setAddResidentModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors">Confirm Allocation</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isVisitorModalOpen} onClose={() => setVisitorModalOpen(false)} title="Register New Visitor">
        <form onSubmit={handleAddVisitorSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Visitor Name</label>
              <input name="visitorName" required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Phone Number</label>
              <input name="phone" required type="tel" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Student to Visit</label>
              <select name="studentName" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all">
                {students.map(s => <option key={s.id} value={s.name}>{s.name} ({s.roomNo})</option>)}
              </select>
            </div>
             <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">ID Provided</label>
              <select name="idType" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all">
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="Driving License">Driving License</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <input type="hidden" name="roomNo" value={students[0]?.roomNo || ''} /> {/* Simplification for demo */}
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Purpose of Visit</label>
            <input name="purpose" required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" placeholder="E.g. Dropping belongings, Meeting" />
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={() => setVisitorModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors">Register Entry</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditMenuModalOpen} onClose={() => setEditMenuModalOpen(false)} title="Edit Mess Menu">
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {messMenu.map(m => (
              <button key={m.day} type="button" onClick={() => setEditingDay(m.day)} className={clsx("px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors", editingDay === m.day ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                {m.day}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            setMessMenu(messMenu.map(m => m.day === editingDay ? {
              ...m,
              breakfast: formData.get('breakfast') as string,
              lunch: formData.get('lunch') as string,
              snacks: formData.get('snacks') as string,
              dinner: formData.get('dinner') as string,
            } : m));
            toast.success(`${editingDay}'s menu updated successfully!`);
            setEditMenuModalOpen(false);
          }} className="space-y-4">
            {['breakfast', 'lunch', 'snacks', 'dinner'].map((meal) => (
              <div key={meal}>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 capitalize">{meal}</label>
                <input name={meal} defaultValue={messMenu.find(m => m.day === editingDay)?.[meal as keyof MessMenu] as string} required type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" />
              </div>
            ))}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={() => setEditMenuModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors">Save Changes</button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={isComplaintModalOpen} onClose={() => setComplaintModalOpen(false)} title="Log New Complaint">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const newComplaint: Complaint = {
            id: `CMP-00${complaints.length + 1}`,
            studentName: formData.get('studentName') as string,
            roomNo: students.find(s => s.name === formData.get('studentName'))?.roomNo || 'Unknown',
            subject: formData.get('subject') as string,
            description: formData.get('description') as string,
            status: 'Open',
            date: new Date().toISOString().split('T')[0],
            priority: formData.get('priority') as 'Low' | 'Medium' | 'High'
          };
          setComplaints([newComplaint, ...complaints]);
          toast.success('Complaint logged successfully!');
          setComplaintModalOpen(false);
        }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Student</label>
            <select name="studentName" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all">
              {students.map(s => <option key={s.id} value={s.name}>{s.name} ({s.roomNo})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Subject</label>
            <input name="subject" required type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" placeholder="E.g. AC not working" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Description</label>
            <textarea name="description" required rows={3} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" placeholder="Describe the issue..."></textarea>
          </div>
          <div>
             <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Priority</label>
             <select name="priority" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all">
               <option value="Low">Low</option>
               <option value="Medium">Medium</option>
               <option value="High">High</option>
             </select>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={() => setComplaintModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors">Submit Complaint</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
