import { create } from 'zustand';

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinDate: string;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  name: string;
  type: string;
  duration: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
  reason: string;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

interface HRState {
  staffList: Staff[];
  leaveRequests: LeaveRequest[];
  attendanceRecords: AttendanceRecord[];
  
  // Staff actions
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  
  // Leave actions
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => void;
  updateLeaveStatus: (id: string, status: LeaveRequest['status']) => void;
  
  // Attendance actions
  markAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  updateAttendance: (id: string, record: Partial<AttendanceRecord>) => void;
}

// Mock Data
const MOCK_STAFF: Staff[] = [
  { id: '1', name: 'Eleanor Pena', role: 'Senior Mathematics Teacher', department: 'Academics', phone: '+1 234 567 890', email: 'eleanor@school.edu', status: 'Active', joinDate: '2023-01-15' },
  { id: '2', name: 'Cody Fisher', role: 'Head of IT', department: 'Administration', phone: '+1 234 567 891', email: 'cody@school.edu', status: 'Active', joinDate: '2021-06-01' },
  { id: '3', name: 'Esther Howard', role: 'Librarian', department: 'Library', phone: '+1 234 567 892', email: 'esther@school.edu', status: 'On Leave', joinDate: '2019-09-10' },
  { id: '4', name: 'Jenny Wilson', role: 'Physics Teacher', department: 'Academics', phone: '+1 234 567 893', email: 'jenny@school.edu', status: 'Active', joinDate: '2024-02-20' },
  { id: '5', name: 'Robert Fox', role: 'Physical Education', department: 'Sports', phone: '+1 234 567 894', email: 'robert@school.edu', status: 'Active', joinDate: '2022-11-05' },
];

const MOCK_LEAVES: LeaveRequest[] = [
  { id: '1', staffId: '1', name: 'Eleanor Pena', type: 'Sick Leave', duration: '2 Days (Oct 12 - Oct 13)', status: 'Pending', appliedOn: '2026-10-10', reason: 'Fever and cold' },
  { id: '2', staffId: '2', name: 'Cody Fisher', type: 'Casual Leave', duration: '1 Day (Oct 15)', status: 'Approved', appliedOn: '2026-10-08', reason: 'Family event' },
  { id: '3', staffId: '3', name: 'Esther Howard', type: 'Maternity Leave', duration: '90 Days (Nov 1 - Jan 29)', status: 'Approved', appliedOn: '2026-09-25', reason: 'Maternity' },
];

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: '1', staffId: '1', date: new Date().toISOString().split('T')[0], status: 'Present', checkIn: '08:00 AM', checkOut: '04:00 PM' },
  { id: '2', staffId: '2', date: new Date().toISOString().split('T')[0], status: 'Present', checkIn: '08:15 AM', checkOut: '05:00 PM' },
  { id: '3', staffId: '3', date: new Date().toISOString().split('T')[0], status: 'Absent', notes: 'On Leave' },
  { id: '4', staffId: '4', date: new Date().toISOString().split('T')[0], status: 'Late', checkIn: '09:30 AM', checkOut: '04:30 PM', notes: 'Traffic' },
];

export const useHRStore = create<HRState>((set) => ({
  staffList: MOCK_STAFF,
  leaveRequests: MOCK_LEAVES,
  attendanceRecords: MOCK_ATTENDANCE,

  addStaff: (staff) => set((state) => ({
    staffList: [...state.staffList, { ...staff, id: Math.random().toString(36).substr(2, 9) }]
  })),

  updateStaff: (id, staffData) => set((state) => ({
    staffList: state.staffList.map(staff => staff.id === id ? { ...staff, ...staffData } : staff)
  })),

  deleteStaff: (id) => set((state) => ({
    staffList: state.staffList.filter(staff => staff.id !== id)
  })),

  addLeaveRequest: (request) => set((state) => ({
    leaveRequests: [...state.leaveRequests, { 
      ...request, 
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      appliedOn: new Date().toISOString()
    }]
  })),

  updateLeaveStatus: (id, status) => set((state) => ({
    leaveRequests: state.leaveRequests.map(req => req.id === id ? { ...req, status } : req)
  })),

  markAttendance: (records) => set((state) => ({
    attendanceRecords: [
      ...state.attendanceRecords,
      ...records.map(record => ({ ...record, id: Math.random().toString(36).substr(2, 9) }))
    ]
  })),

  updateAttendance: (id, recordData) => set((state) => ({
    attendanceRecords: state.attendanceRecords.map(rec => rec.id === id ? { ...rec, ...recordData } : rec)
  }))
}));
