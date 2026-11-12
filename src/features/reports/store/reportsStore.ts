import { create } from 'zustand';

export interface StudentReportData {
  id: string;
  studentName: string;
  grade: string;
  section: string;
  attendancePercentage: number;
  averageScore: number;
  status: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
}

export interface AttendanceReportData {
  date: string;
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  totalStudents: number;
}

export interface FinancialReportData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface PerformanceAnalyticsData {
  subject: string;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

interface ReportsState {
  studentReports: StudentReportData[];
  attendanceReports: AttendanceReportData[];
  financialReports: FinancialReportData[];
  performanceData: PerformanceAnalyticsData[];
  
  // Actions
  fetchStudentReports: (filters?: any) => void;
  fetchAttendanceReports: (filters?: any) => void;
  fetchFinancialReports: (filters?: any) => void;
  fetchPerformanceData: (filters?: any) => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
  studentReports: [
    { id: '1', studentName: 'Alice Johnson', grade: 'Grade 10', section: 'A', attendancePercentage: 95, averageScore: 88, status: 'Excellent' },
    { id: '2', studentName: 'Bob Smith', grade: 'Grade 10', section: 'B', attendancePercentage: 82, averageScore: 72, status: 'Good' },
    { id: '3', studentName: 'Charlie Brown', grade: 'Grade 9', section: 'A', attendancePercentage: 98, averageScore: 91, status: 'Excellent' },
    { id: '4', studentName: 'Diana Prince', grade: 'Grade 11', section: 'C', attendancePercentage: 75, averageScore: 65, status: 'Average' },
    { id: '5', studentName: 'Evan Wright', grade: 'Grade 8', section: 'B', attendancePercentage: 60, averageScore: 55, status: 'Needs Improvement' },
  ],
  
  attendanceReports: [
    { date: '2023-09-01', presentCount: 450, absentCount: 20, leaveCount: 30, totalStudents: 500 },
    { date: '2023-09-02', presentCount: 460, absentCount: 15, leaveCount: 25, totalStudents: 500 },
    { date: '2023-09-03', presentCount: 470, absentCount: 10, leaveCount: 20, totalStudents: 500 },
    { date: '2023-09-04', presentCount: 440, absentCount: 30, leaveCount: 30, totalStudents: 500 },
    { date: '2023-09-05', presentCount: 480, absentCount: 5, leaveCount: 15, totalStudents: 500 },
  ],

  financialReports: [
    { month: 'Jan', revenue: 120000, expenses: 80000, profit: 40000 },
    { month: 'Feb', revenue: 125000, expenses: 82000, profit: 43000 },
    { month: 'Mar', revenue: 130000, expenses: 85000, profit: 45000 },
    { month: 'Apr', revenue: 128000, expenses: 83000, profit: 45000 },
    { month: 'May', revenue: 135000, expenses: 88000, profit: 47000 },
    { month: 'Jun', revenue: 140000, expenses: 90000, profit: 50000 },
  ],

  performanceData: [
    { subject: 'Mathematics', averageScore: 78, highestScore: 100, lowestScore: 45 },
    { subject: 'Science', averageScore: 82, highestScore: 98, lowestScore: 50 },
    { subject: 'English', averageScore: 85, highestScore: 99, lowestScore: 55 },
    { subject: 'History', averageScore: 75, highestScore: 95, lowestScore: 40 },
    { subject: 'Geography', averageScore: 80, highestScore: 97, lowestScore: 48 },
  ],

  fetchStudentReports: () => {
    // In a real app, this would fetch from an API
  },
  
  fetchAttendanceReports: () => {},
  fetchFinancialReports: () => {},
  fetchPerformanceData: () => {},
}));
