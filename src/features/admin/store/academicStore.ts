import { create } from 'zustand';

// ── Types ──
export type AYStatus = 'Draft' | 'Active' | 'Closing' | 'Archived';
export type TermPattern = 'Annual' | 'Semester' | 'Trimester' | 'Custom';
export type EnrollmentStatus = 'Active' | 'Promoted' | 'Retained' | 'Graduated' | 'TransferredOut' | 'Withdrawn';
export type SubjectType = 'Core' | 'Elective' | 'Practical' | 'Language' | 'Co-Scholastic';
export type SubjectStatus = 'Draft' | 'Review' | 'Approved' | 'Published' | 'Active' | 'Archived';

export interface Board {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface Curriculum {
  id: string;
  boardId: string;
  version: string;
  name: string;
  isActive: boolean;
}

export interface SubjectGroup {
  id: string;
  curriculumId: string;
  name: string;
  classification: SubjectType;
  maxSubjects?: number;
  isActive: boolean;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: AYStatus;
  isCurrent: boolean;
  termPattern: TermPattern;
  holidays: Holiday[];
  createdAt: string;
}

export interface Term {
  id: string;
  academicYearId: string;
  name: string;
  sequence: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'Active' | 'Closed' | 'Upcoming';
  examWindow?: { start: string; end: string };
  feeDueDate?: string;
}

export interface ClassMaster {
  id: string;
  name: string;
  shortName: string;
  sequence: number;
  level: 'Primary' | 'Middle' | 'Secondary' | 'SrSecondary';
  isActive: boolean;
}

export interface ClassYearOffering {
  id: string;
  classMasterId: string;
  academicYearId: string;
  stream?: string;
  isActive: boolean;
}

export interface Section {
  id: string;
  classYearOfferingId: string;
  name: string;
  capacity: number;
  enrolled: number;
  classTeacherId?: string;
  classTeacherName?: string;
  room?: string;
}

export interface SubjectMaster {
  id: string;
  subjectGroupId: string;
  name: string;
  code: string;
  type: SubjectType;
  credits: number;
  language: string;
  isActive: boolean;
}

export interface SubjectVersion {
  id: string;
  subjectMasterId: string;
  version: string;
  name: string;
  status: SubjectStatus;
  isActive: boolean;
}

export interface SubjectMapping {
  id: string;
  subjectId: string;
  classYearOfferingId: string;
  sectionId?: string;
  termId?: string;
  teacherId?: string;
  teacherName?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  academicYearId: string;
  classYearOfferingId: string;
  sectionId: string;
  enrollDate: string;
  exitDate?: string;
  status: EnrollmentStatus;
  rollNumber?: string;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  type: 'Holiday' | 'Weekend' | 'Event';
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  entity: string;
  entityId: string;
  action: 'Create' | 'Update' | 'Delete' | 'StateChange';
  field?: string;
  oldValue?: string;
  newValue?: string;
  user: string;
}

export interface Period {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface TimetableEntry {
  id: string;
  sectionId: string;
  periodId: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  subjectId: string;
  teacherId: string;
  teacherName: string;
  roomId: string;
}

export interface StudentAttendance {
  id: string;
  timetableEntryId: string;
  date: string;
  studentId: string;
  status: 'Present' | 'Absent' | 'Late' | 'HalfDay';
  remarks?: string;
}

export interface AssessmentComponent {
  id: string;
  name: string;
  type: 'Internal' | 'Theory' | 'Practical' | 'Project' | 'Lab' | 'Viva';
  maxMarks: number;
  weightage: number;
}

export interface ExamPattern {
  id: string;
  name: string;
  description: string;
  components: string[]; // AssessmentComponent IDs
}

export interface Exam {
  id: string;
  termId: string;
  name: string;
  examPatternId: string;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Scheduled' | 'Ongoing' | 'Completed' | 'Published';
}

export interface MarksEntry {
  id: string;
  examId: string;
  studentId: string;
  subjectId: string;
  componentId: string;
  marksObtained: number;
  isModerated: boolean;
  moderatedMarks?: number;
}

export interface Result {
  id: string;
  examId: string;
  studentId: string;
  totalMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
}

export interface ElectivePreference {
  id: string;
  studentId: string;
  subjectGroupId: string;
  preferences: string[];
  status: 'Pending' | 'Validated' | 'Approved' | 'Rejected';
  approvedSubjectId?: string;
}

export interface Unit {
  id: string;
  subjectVersionId: string;
  name: string;
  sequence: number;
}

export interface Chapter {
  id: string;
  unitId: string;
  name: string;
  sequence: number;
}

export interface LearningOutcome {
  id: string;
  chapterId: string;
  code: string;
  description: string;
}

export interface Activity {
  id: string;
  learningOutcomeId: string;
  name: string;
  description: string;
}

export interface StudentCompetency {
  id: string;
  studentId: string;
  learningOutcomeId: string;
  level: 'Beginning' | 'Approaching' | 'Proficient' | 'Mastery';
}

// ── Valid state transitions ──
const validTransitions: Record<AYStatus, AYStatus[]> = {
  Draft: ['Active'],
  Active: ['Closing'],
  Closing: ['Archived'],
  Archived: [],
};

// ── Mock Data ──
const mockAcademicYears: AcademicYear[] = [
  { id: 'AY2627', name: '2026–2027', startDate: '2026-04-01', endDate: '2027-03-31', status: 'Draft', isCurrent: false, termPattern: 'Semester', holidays: [], createdAt: '2026-06-15' },
  { id: 'AY2526', name: '2025–2026', startDate: '2025-04-01', endDate: '2026-03-31', status: 'Active', isCurrent: true, termPattern: 'Semester', holidays: [], createdAt: '2025-03-01' },
  { id: 'AY2425', name: '2024–2025', startDate: '2024-04-01', endDate: '2025-03-31', status: 'Archived', isCurrent: false, termPattern: 'Trimester', holidays: [], createdAt: '2024-03-01' },
];

const mockTerms: Term[] = [
  { id: 'T1-2526', academicYearId: 'AY2526', name: 'Term 1', sequence: 1, startDate: '2025-04-01', endDate: '2025-09-30', isCurrent: false, status: 'Closed', examWindow: { start: '2025-09-15', end: '2025-09-28' }, feeDueDate: '2025-04-15' },
  { id: 'T2-2526', academicYearId: 'AY2526', name: 'Term 2', sequence: 2, startDate: '2025-10-01', endDate: '2026-03-31', isCurrent: true, status: 'Active', examWindow: { start: '2026-03-10', end: '2026-03-25' }, feeDueDate: '2025-10-15' },
  { id: 'T1-2627', academicYearId: 'AY2627', name: 'Semester 1', sequence: 1, startDate: '2026-04-01', endDate: '2026-09-30', isCurrent: false, status: 'Upcoming' },
  { id: 'T2-2627', academicYearId: 'AY2627', name: 'Semester 2', sequence: 2, startDate: '2026-10-01', endDate: '2027-03-31', isCurrent: false, status: 'Upcoming' },
];

const mockClassMasters: ClassMaster[] = [
  { id: 'CM1', name: 'Grade 1', shortName: 'G1', sequence: 1, level: 'Primary', isActive: true },
  { id: 'CM2', name: 'Grade 2', shortName: 'G2', sequence: 2, level: 'Primary', isActive: true },
  { id: 'CM3', name: 'Grade 3', shortName: 'G3', sequence: 3, level: 'Primary', isActive: true },
  { id: 'CM4', name: 'Grade 4', shortName: 'G4', sequence: 4, level: 'Primary', isActive: true },
  { id: 'CM5', name: 'Grade 5', shortName: 'G5', sequence: 5, level: 'Primary', isActive: true },
  { id: 'CM6', name: 'Grade 6', shortName: 'G6', sequence: 6, level: 'Middle', isActive: true },
  { id: 'CM7', name: 'Grade 7', shortName: 'G7', sequence: 7, level: 'Middle', isActive: true },
  { id: 'CM8', name: 'Grade 8', shortName: 'G8', sequence: 8, level: 'Middle', isActive: true },
  { id: 'CM9', name: 'Grade 9', shortName: 'G9', sequence: 9, level: 'Secondary', isActive: true },
  { id: 'CM10', name: 'Grade 10', shortName: 'G10', sequence: 10, level: 'Secondary', isActive: true },
  { id: 'CM11', name: 'Grade 11', shortName: 'G11', sequence: 11, level: 'SrSecondary', isActive: true },
  { id: 'CM12', name: 'Grade 12', shortName: 'G12', sequence: 12, level: 'SrSecondary', isActive: true },
];

const mockOfferings: ClassYearOffering[] = [
  // AY2526 (Active)
  { id: 'CYO-5-2526', classMasterId: 'CM5', academicYearId: 'AY2526', isActive: true },
  { id: 'CYO-6-2526', classMasterId: 'CM6', academicYearId: 'AY2526', isActive: true },
  { id: 'CYO-7-2526', classMasterId: 'CM7', academicYearId: 'AY2526', isActive: true },
  { id: 'CYO-11S-2526', classMasterId: 'CM11', academicYearId: 'AY2526', stream: 'Science', isActive: true },
  { id: 'CYO-11C-2526', classMasterId: 'CM11', academicYearId: 'AY2526', stream: 'Commerce', isActive: true },
  // AY2627 (Draft — promotion targets)
  { id: 'CYO-6-2627', classMasterId: 'CM6', academicYearId: 'AY2627', isActive: true },
  { id: 'CYO-7-2627', classMasterId: 'CM7', academicYearId: 'AY2627', isActive: true },
  { id: 'CYO-8-2627', classMasterId: 'CM8', academicYearId: 'AY2627', isActive: true },
  { id: 'CYO-12S-2627', classMasterId: 'CM12', academicYearId: 'AY2627', stream: 'Science', isActive: true },
  { id: 'CYO-12C-2627', classMasterId: 'CM12', academicYearId: 'AY2627', stream: 'Commerce', isActive: true },
];

const mockSections: Section[] = [
  // AY2526 sections
  { id: 'SEC-5A', classYearOfferingId: 'CYO-5-2526', name: '5-A', capacity: 40, enrolled: 38, classTeacherId: 'EMP-021', classTeacherName: 'J. Mwangi', room: 'Room 101' },
  { id: 'SEC-5B', classYearOfferingId: 'CYO-5-2526', name: '5-B', capacity: 40, enrolled: 35, classTeacherId: 'EMP-034', classTeacherName: 'A. Osei', room: 'Room 102' },
  { id: 'SEC-6A', classYearOfferingId: 'CYO-6-2526', name: '6-A', capacity: 38, enrolled: 36, classTeacherId: 'EMP-011', classTeacherName: 'S. Mensah', room: 'Room 201' },
  { id: 'SEC-6B', classYearOfferingId: 'CYO-6-2526', name: '6-B', capacity: 38, enrolled: 34, classTeacherId: 'EMP-045', classTeacherName: 'R. Boateng', room: 'Room 202' },
  { id: 'SEC-7A', classYearOfferingId: 'CYO-7-2526', name: '7-A', capacity: 36, enrolled: 33, classTeacherId: 'EMP-018', classTeacherName: 'K. Asante', room: 'Room 301' },
  { id: 'SEC-11SA', classYearOfferingId: 'CYO-11S-2526', name: '11-Sci-A', capacity: 30, enrolled: 28, classTeacherId: 'EMP-052', classTeacherName: 'D. Nyarko', room: 'Lab 1' },
  { id: 'SEC-11CA', classYearOfferingId: 'CYO-11C-2526', name: '11-Com-A', capacity: 35, enrolled: 32, classTeacherId: 'EMP-061', classTeacherName: 'F. Adjei', room: 'Room 401' },
  // AY2627 sections (promotion targets)
  { id: 'SEC-6A-27', classYearOfferingId: 'CYO-6-2627', name: '6-A', capacity: 40, enrolled: 0, room: 'Room 201' },
  { id: 'SEC-6B-27', classYearOfferingId: 'CYO-6-2627', name: '6-B', capacity: 40, enrolled: 0, room: 'Room 202' },
  { id: 'SEC-7A-27', classYearOfferingId: 'CYO-7-2627', name: '7-A', capacity: 38, enrolled: 0, room: 'Room 301' },
  { id: 'SEC-7B-27', classYearOfferingId: 'CYO-7-2627', name: '7-B', capacity: 38, enrolled: 0, room: 'Room 302' },
  { id: 'SEC-8A-27', classYearOfferingId: 'CYO-8-2627', name: '8-A', capacity: 36, enrolled: 0, room: 'Room 401' },
  { id: 'SEC-12SA-27', classYearOfferingId: 'CYO-12S-2627', name: '12-Sci-A', capacity: 30, enrolled: 0, room: 'Lab 1' },
  { id: 'SEC-12CA-27', classYearOfferingId: 'CYO-12C-2627', name: '12-Com-A', capacity: 35, enrolled: 0, room: 'Room 402' },
];

const mockBoards: Board[] = [
  { id: 'BRD-CBSE', name: 'Central Board of Secondary Education', code: 'CBSE', isActive: true },
  { id: 'BRD-ICSE', name: 'Indian Certificate of Secondary Education', code: 'ICSE', isActive: true },
  { id: 'BRD-IB', name: 'International Baccalaureate', code: 'IB', isActive: true },
];

const mockCurriculums: Curriculum[] = [
  { id: 'CUR-CBSE-V1', boardId: 'BRD-CBSE', version: '1.0', name: 'CBSE Core Curriculum V1', isActive: true },
  { id: 'CUR-CBSE-V2', boardId: 'BRD-CBSE', version: '2.0', name: 'CBSE Advanced Curriculum V2', isActive: true },
  { id: 'CUR-IB-V1', boardId: 'BRD-IB', version: '1.0', name: 'IB Global Curriculum', isActive: true },
];

const mockSubjectGroups: SubjectGroup[] = [
  { id: 'SG-SCI', curriculumId: 'CUR-CBSE-V1', name: 'Science Stream Core', classification: 'Core', isActive: true },
  { id: 'SG-COM', curriculumId: 'CUR-CBSE-V1', name: 'Commerce Stream Core', classification: 'Core', isActive: true },
  { id: 'SG-LANG', curriculumId: 'CUR-CBSE-V1', name: 'Languages', classification: 'Language', isActive: true },
  { id: 'SG-ELEC', curriculumId: 'CUR-CBSE-V1', name: 'General Electives', classification: 'Elective', isActive: true },
];

const mockSubjects: SubjectMaster[] = [
  { id: 'SUB-MATH', subjectGroupId: 'SG-SCI', name: 'Mathematics', code: 'MATH', type: 'Core', credits: 5, language: 'English', isActive: true },
  { id: 'SUB-ENG', subjectGroupId: 'SG-LANG', name: 'English Language', code: 'ENG', type: 'Language', credits: 5, language: 'English', isActive: true },
  { id: 'SUB-SCI', subjectGroupId: 'SG-SCI', name: 'General Science', code: 'SCI', type: 'Core', credits: 4, language: 'English', isActive: true },
  { id: 'SUB-PHY', subjectGroupId: 'SG-SCI', name: 'Physics', code: 'PHY', type: 'Core', credits: 5, language: 'English', isActive: true },
  { id: 'SUB-BIO', subjectGroupId: 'SG-ELEC', name: 'Biology', code: 'BIO', type: 'Elective', credits: 4, language: 'English', isActive: true },
];

const mockSubjectVersions: SubjectVersion[] = [
  { id: 'SV-MATH-V1', subjectMasterId: 'SUB-MATH', version: '1.0', name: 'Mathematics Basic', status: 'Published', isActive: true },
  { id: 'SV-MATH-V2', subjectMasterId: 'SUB-MATH', version: '2.0', name: 'Mathematics Advanced', status: 'Approved', isActive: true },
  { id: 'SV-ENG-V1', subjectMasterId: 'SUB-ENG', version: '1.0', name: 'English Literature 2025', status: 'Published', isActive: true },
  { id: 'SV-PHY-V1', subjectMasterId: 'SUB-PHY', version: '1.0', name: 'Physics V1', status: 'Published', isActive: true },
];

const mockEnrollments: Enrollment[] = [
  { id: 'ENR-001', studentId: 'STU-001', studentName: 'Ama Asante', academicYearId: 'AY2526', classYearOfferingId: 'CYO-5-2526', sectionId: 'SEC-5A', enrollDate: '2025-04-01', status: 'Active', rollNumber: '5A-01' },
  { id: 'ENR-002', studentId: 'STU-002', studentName: 'Kofi Mensah', academicYearId: 'AY2526', classYearOfferingId: 'CYO-5-2526', sectionId: 'SEC-5A', enrollDate: '2025-04-01', status: 'Active', rollNumber: '5A-02' },
  { id: 'ENR-003', studentId: 'STU-003', studentName: 'Abena Darko', academicYearId: 'AY2526', classYearOfferingId: 'CYO-5-2526', sectionId: 'SEC-5B', enrollDate: '2025-04-01', status: 'Active', rollNumber: '5B-01' },
  { id: 'ENR-004', studentId: 'STU-004', studentName: 'Kwame Boateng', academicYearId: 'AY2526', classYearOfferingId: 'CYO-6-2526', sectionId: 'SEC-6A', enrollDate: '2025-04-01', status: 'Active', rollNumber: '6A-01' },
  { id: 'ENR-005', studentId: 'STU-005', studentName: 'Efua Owusu', academicYearId: 'AY2526', classYearOfferingId: 'CYO-6-2526', sectionId: 'SEC-6A', enrollDate: '2025-04-01', status: 'Active', rollNumber: '6A-02' },
  { id: 'ENR-006', studentId: 'STU-006', studentName: 'Yaw Amoah', academicYearId: 'AY2526', classYearOfferingId: 'CYO-7-2526', sectionId: 'SEC-7A', enrollDate: '2025-04-01', status: 'Active', rollNumber: '7A-01' },
  { id: 'ENR-007', studentId: 'STU-007', studentName: 'Akua Frimpong', academicYearId: 'AY2526', classYearOfferingId: 'CYO-11S-2526', sectionId: 'SEC-11SA', enrollDate: '2025-04-01', status: 'Active', rollNumber: '11S-01' },
  { id: 'ENR-008', studentId: 'STU-008', studentName: 'Nana Appiah', academicYearId: 'AY2526', classYearOfferingId: 'CYO-11C-2526', sectionId: 'SEC-11CA', enrollDate: '2025-04-01', status: 'Active', rollNumber: '11C-01' },
];

const mockPeriods: Period[] = [
  { id: 'PER-1', name: 'Period 1', startTime: '08:00', endTime: '08:45' },
  { id: 'PER-2', name: 'Period 2', startTime: '08:45', endTime: '09:30' },
  { id: 'PER-3', name: 'Period 3', startTime: '09:45', endTime: '10:30' },
];

const mockTimetable: TimetableEntry[] = [
  { id: 'TT-1', sectionId: 'SEC-5A', periodId: 'PER-1', dayOfWeek: 'Monday', subjectId: 'SUB-MATH', teacherId: 'EMP-021', teacherName: 'J. Mwangi', roomId: 'Room 101' },
  { id: 'TT-2', sectionId: 'SEC-5A', periodId: 'PER-2', dayOfWeek: 'Monday', subjectId: 'SUB-ENG', teacherId: 'EMP-034', teacherName: 'A. Osei', roomId: 'Room 101' },
];

const mockAttendances: StudentAttendance[] = [
  { id: 'ATT-1', timetableEntryId: 'TT-1', date: '2026-07-19', studentId: 'STU-001', status: 'Present' },
  { id: 'ATT-2', timetableEntryId: 'TT-1', date: '2026-07-19', studentId: 'STU-002', status: 'Absent', remarks: 'Sick leave' },
];

const mockAssessmentComponents: AssessmentComponent[] = [
  { id: 'AC-TH', name: 'Theory Exam', type: 'Theory', maxMarks: 80, weightage: 80 },
  { id: 'AC-IA', name: 'Internal Assessment', type: 'Internal', maxMarks: 20, weightage: 20 },
  { id: 'AC-PR', name: 'Practical', type: 'Practical', maxMarks: 30, weightage: 30 },
  { id: 'AC-TH-SCI', name: 'Science Theory', type: 'Theory', maxMarks: 70, weightage: 70 },
  { id: 'AC-PROJ', name: 'Project Work', type: 'Project', maxMarks: 20, weightage: 20 },
  { id: 'AC-LAB', name: 'Lab Work', type: 'Lab', maxMarks: 10, weightage: 10 },
  { id: 'AC-VIVA', name: 'Viva Voce', type: 'Viva', maxMarks: 10, weightage: 10 },
];

const mockExamPatterns: ExamPattern[] = [
  { id: 'EP-STD', name: 'Standard Theory + Internal', description: '80 Theory, 20 Internal', components: ['AC-TH', 'AC-IA'] },
  { id: 'EP-SCI', name: 'Science Pattern', description: '70 Theory, 30 Practical', components: ['AC-TH-SCI', 'AC-PR'] },
];

const mockExams: Exam[] = [
  { id: 'EX-TERM1', termId: 'T1-2526', name: 'Term 1 Final Exam', examPatternId: 'EP-STD', startDate: '2025-09-15', endDate: '2025-09-28', status: 'Completed' },
];

const mockMarks: MarksEntry[] = [
  { id: 'ME-1', examId: 'EX-TERM1', studentId: 'STU-001', subjectId: 'SUB-MATH', componentId: 'AC-TH', marksObtained: 75, isModerated: false },
  { id: 'ME-2', examId: 'EX-TERM1', studentId: 'STU-001', subjectId: 'SUB-MATH', componentId: 'AC-IA', marksObtained: 18, isModerated: false },
];

const mockResults: Result[] = [
  { id: 'RES-1', examId: 'EX-TERM1', studentId: 'STU-001', totalMarks: 93, percentage: 93, grade: 'A1', remarks: 'Excellent' },
];

interface AcademicStore {
  // Data
  academicYears: AcademicYear[];
  terms: Term[];
  boards: Board[];
  curriculums: Curriculum[];
  subjectGroups: SubjectGroup[];
  classMasters: ClassMaster[];
  classYearOfferings: ClassYearOffering[];
  sections: Section[];
  subjects: SubjectMaster[];
  subjectVersions: SubjectVersion[];
  subjectMappings: SubjectMapping[];
  enrollments: Enrollment[];
  auditLog: AuditEntry[];

  periods: Period[];
  timetable: TimetableEntry[];
  attendances: StudentAttendance[];
  assessmentComponents: AssessmentComponent[];
  examPatterns: ExamPattern[];
  exams: Exam[];
  marks: MarksEntry[];
  results: Result[];
  
  electivePreferences: ElectivePreference[];
  units: Unit[];
  chapters: Chapter[];
  learningOutcomes: LearningOutcome[];
  activities: Activity[];
  competencies: StudentCompetency[];
  
  // Context
  selectedYearId: string | null;
  
  // AY Actions
  setSelectedYear: (id: string) => void;
  addAcademicYear: (ay: AcademicYear) => void;
  updateAcademicYear: (id: string, updates: Partial<AcademicYear>) => void;
  transitionYearState: (id: string, newState: AYStatus) => boolean;
  deleteAcademicYear: (id: string) => void;
  
  // Term Actions
  addTerm: (term: Term) => void;
  updateTerm: (id: string, updates: Partial<Term>) => void;
  deleteTerm: (id: string) => void;
  getTermsByYear: (yearId: string) => Term[];
  
  // Class Master Actions
  addClassMaster: (cm: ClassMaster) => void;
  updateClassMaster: (id: string, updates: Partial<ClassMaster>) => void;
  deleteClassMaster: (id: string) => void;
  
  // Class-Year Offering Actions
  addOffering: (o: ClassYearOffering) => void;
  updateOffering: (id: string, updates: Partial<ClassYearOffering>) => void;
  deleteOffering: (id: string) => void;
  rollForwardOfferings: (fromYearId: string, toYearId: string) => void;
  getOfferingsByYear: (yearId: string) => ClassYearOffering[];
  
  // Section Actions
  addSection: (s: Section) => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  deleteSection: (id: string) => void;
  getSectionsByOffering: (offeringId: string) => Section[];
  
  // Subject & Curriculum Actions
  addBoard: (b: Board) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;

  addCurriculum: (c: Curriculum) => void;
  updateCurriculum: (id: string, updates: Partial<Curriculum>) => void;
  deleteCurriculum: (id: string) => void;

  addSubjectGroup: (sg: SubjectGroup) => void;
  updateSubjectGroup: (id: string, updates: Partial<SubjectGroup>) => void;
  deleteSubjectGroup: (id: string) => void;

  addSubject: (s: SubjectMaster) => void;
  updateSubject: (id: string, updates: Partial<SubjectMaster>) => void;
  deleteSubject: (id: string) => void;
  
  addSubjectVersion: (sv: SubjectVersion) => void;
  updateSubjectVersion: (id: string, updates: Partial<SubjectVersion>) => void;
  deleteSubjectVersion: (id: string) => void;

  addSubjectMapping: (m: SubjectMapping) => void;
  deleteSubjectMapping: (id: string) => void;
  
  // Enrollment Actions
  addEnrollment: (e: Enrollment) => void;
  updateEnrollment: (id: string, updates: Partial<Enrollment>) => void;
  getEnrollmentsBySection: (sectionId: string) => Enrollment[];
  bulkPromote: (enrollmentIds: string[], targetOfferingId: string, targetSectionId: string) => void;
  transferStudent: (enrollmentId: string, newSectionId: string) => void;
  
  // Audit
  addAuditEntry: (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => void;
  
  // Timetable Actions
  addTimetableEntry: (entry: TimetableEntry) => void;
  updateTimetableEntry: (id: string, updates: Partial<TimetableEntry>) => void;
  deleteTimetableEntry: (id: string) => void;

  // Attendance Actions
  saveAttendance: (attendanceRecords: StudentAttendance[]) => void;

  // Exam Actions
  addExam: (exam: Exam) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  
  addExamPattern: (pattern: ExamPattern) => void;
  updateExamPattern: (id: string, updates: Partial<ExamPattern>) => void;
  deleteExamPattern: (id: string) => void;

  addAssessmentComponent: (comp: AssessmentComponent) => void;
  updateAssessmentComponent: (id: string, updates: Partial<AssessmentComponent>) => void;
  deleteAssessmentComponent: (id: string) => void;

  saveMarks: (marksList: MarksEntry[]) => void;
  calculateResults: (examId: string) => void;

  // Helpers
  getClassMasterById: (id: string) => ClassMaster | undefined;
  getYearById: (id: string) => AcademicYear | undefined;
  isYearEditable: (id: string) => boolean;
}

export const useAcademicStore = create<AcademicStore>((set, get) => ({
  academicYears: mockAcademicYears,
  terms: mockTerms,
  boards: mockBoards,
  curriculums: mockCurriculums,
  subjectGroups: mockSubjectGroups,
  classMasters: mockClassMasters,
  classYearOfferings: mockOfferings,
  sections: mockSections,
  subjects: mockSubjects,
  subjectVersions: mockSubjectVersions,
  subjectMappings: [],
  enrollments: mockEnrollments,
  auditLog: [],
  periods: mockPeriods,
  timetable: mockTimetable,
  attendances: mockAttendances,
  assessmentComponents: mockAssessmentComponents,
  examPatterns: mockExamPatterns,
  exams: mockExams,
  marks: mockMarks,
  results: mockResults,
  electivePreferences: [],
  units: [],
  chapters: [],
  learningOutcomes: [],
  activities: [],
  competencies: [],
  selectedYearId: 'AY2526',

  setSelectedYear: (id) => set({ selectedYearId: id }),

  addAcademicYear: (ay) => set((s) => {
    get().addAuditEntry({ entity: 'AcademicYear', entityId: ay.id, action: 'Create', newValue: ay.name, user: 'admin' });
    return { academicYears: [...s.academicYears, ay] };
  }),

  updateAcademicYear: (id, updates) => set((s) => ({
    academicYears: s.academicYears.map((ay) => ay.id === id ? { ...ay, ...updates } : ay),
  })),

  transitionYearState: (id, newState) => {
    const year = get().academicYears.find((y) => y.id === id);
    if (!year) return false;
    if (!validTransitions[year.status].includes(newState)) return false;
    
    // If transitioning to Active, ensure only one active
    if (newState === 'Active') {
      set((s) => ({
        academicYears: s.academicYears.map((ay) =>
          ay.id === id
            ? { ...ay, status: newState, isCurrent: true }
            : { ...ay, isCurrent: ay.status === 'Active' ? false : ay.isCurrent }
        ),
      }));
    } else {
      set((s) => ({
        academicYears: s.academicYears.map((ay) =>
          ay.id === id ? { ...ay, status: newState, isCurrent: newState !== 'Archived' ? ay.isCurrent : false } : ay
        ),
      }));
    }

    get().addAuditEntry({ entity: 'AcademicYear', entityId: id, action: 'StateChange', field: 'status', oldValue: year.status, newValue: newState, user: 'admin' });
    return true;
  },

  deleteAcademicYear: (id) => set((s) => {
    const year = s.academicYears.find((y) => y.id === id);
    if (year?.status !== 'Draft') return s;
    get().addAuditEntry({ entity: 'AcademicYear', entityId: id, action: 'Delete', oldValue: year.name, user: 'admin' });
    return { academicYears: s.academicYears.filter((ay) => ay.id !== id) };
  }),

  addTerm: (term) => set((s) => ({ terms: [...s.terms, term] })),
  updateTerm: (id, updates) => set((s) => ({ terms: s.terms.map((t) => t.id === id ? { ...t, ...updates } : t) })),
  deleteTerm: (id) => set((s) => ({ terms: s.terms.filter((t) => t.id !== id) })),
  getTermsByYear: (yearId) => get().terms.filter((t) => t.academicYearId === yearId),

  addClassMaster: (cm) => set((s) => ({ classMasters: [...s.classMasters, cm] })),
  updateClassMaster: (id, updates) => set((s) => ({ classMasters: s.classMasters.map((c) => c.id === id ? { ...c, ...updates } : c) })),
  deleteClassMaster: (id) => set((s) => ({ classMasters: s.classMasters.filter((c) => c.id !== id) })),

  addOffering: (o) => set((s) => ({ classYearOfferings: [...s.classYearOfferings, o] })),
  updateOffering: (id, updates) => set((s) => ({ classYearOfferings: s.classYearOfferings.map((o) => o.id === id ? { ...o, ...updates } : o) })),
  deleteOffering: (id) => set((s) => ({ classYearOfferings: s.classYearOfferings.filter((o) => o.id !== id) })),
  
  rollForwardOfferings: (fromYearId, toYearId) => set((s) => {
    const existing = s.classYearOfferings.filter((o) => o.academicYearId === fromYearId);
    const newOfferings = existing.map((o) => ({
      ...o,
      id: o.id.replace(fromYearId.slice(-4), toYearId.slice(-4)),
      academicYearId: toYearId,
    }));
    get().addAuditEntry({ entity: 'ClassYearOffering', entityId: toYearId, action: 'Create', newValue: `Rolled forward ${newOfferings.length} offerings`, user: 'admin' });
    return { classYearOfferings: [...s.classYearOfferings, ...newOfferings] };
  }),

  getOfferingsByYear: (yearId) => get().classYearOfferings.filter((o) => o.academicYearId === yearId),

  addSection: (s_) => set((s) => ({ sections: [...s.sections, s_] })),
  updateSection: (id, updates) => set((s) => ({ sections: s.sections.map((sec) => sec.id === id ? { ...sec, ...updates } : sec) })),
  deleteSection: (id) => set((s) => ({ sections: s.sections.filter((sec) => sec.id !== id) })),
  getSectionsByOffering: (offeringId) => get().sections.filter((s) => s.classYearOfferingId === offeringId),

  addBoard: (b) => set((s) => ({ boards: [...s.boards, b] })),
  updateBoard: (id, updates) => set((s) => ({ boards: s.boards.map((b) => b.id === id ? { ...b, ...updates } : b) })),
  deleteBoard: (id) => set((s) => ({ boards: s.boards.filter((b) => b.id !== id) })),

  addCurriculum: (c) => set((s) => ({ curriculums: [...s.curriculums, c] })),
  updateCurriculum: (id, updates) => set((s) => ({ curriculums: s.curriculums.map((c) => c.id === id ? { ...c, ...updates } : c) })),
  deleteCurriculum: (id) => set((s) => ({ curriculums: s.curriculums.filter((c) => c.id !== id) })),

  addSubjectGroup: (sg) => set((s) => ({ subjectGroups: [...s.subjectGroups, sg] })),
  updateSubjectGroup: (id, updates) => set((s) => ({ subjectGroups: s.subjectGroups.map((sg) => sg.id === id ? { ...sg, ...updates } : sg) })),
  deleteSubjectGroup: (id) => set((s) => ({ subjectGroups: s.subjectGroups.filter((sg) => sg.id !== id) })),

  addSubject: (sub) => set((s) => ({ subjects: [...s.subjects, sub] })),
  updateSubject: (id, updates) => set((s) => ({ subjects: s.subjects.map((sub) => sub.id === id ? { ...sub, ...updates } : sub) })),
  deleteSubject: (id) => set((s) => ({ subjects: s.subjects.filter((sub) => sub.id !== id) })),

  addSubjectVersion: (sv) => set((s) => ({ subjectVersions: [...s.subjectVersions, sv] })),
  updateSubjectVersion: (id, updates) => set((s) => ({ subjectVersions: s.subjectVersions.map((sv) => sv.id === id ? { ...sv, ...updates } : sv) })),
  deleteSubjectVersion: (id) => set((s) => ({ subjectVersions: s.subjectVersions.filter((sv) => sv.id !== id) })),

  addSubjectMapping: (m) => set((s) => ({ subjectMappings: [...s.subjectMappings, m] })),
  deleteSubjectMapping: (id) => set((s) => ({ subjectMappings: s.subjectMappings.filter((m) => m.id !== id) })),

  addEnrollment: (e) => set((s) => ({ enrollments: [...s.enrollments, e] })),
  updateEnrollment: (id, updates) => set((s) => ({ enrollments: s.enrollments.map((e) => e.id === id ? { ...e, ...updates } : e) })),
  getEnrollmentsBySection: (sectionId) => get().enrollments.filter((e) => e.sectionId === sectionId),
  
  bulkPromote: (enrollmentIds, targetOfferingId, targetSectionId) => set((s) => {
    // Find the academicYearId that belongs to the target offering
    const targetOffering = s.classYearOfferings.find((o) => o.id === targetOfferingId);
    const targetAcademicYearId = targetOffering?.academicYearId;

    const today = new Date().toISOString().slice(0, 10);

    // Mark original enrollments as Promoted
    const updatedEnrollments = s.enrollments.map((e) =>
      enrollmentIds.includes(e.id)
        ? { ...e, status: 'Promoted' as EnrollmentStatus, exitDate: today }
        : e
    );

    // Create new Active enrollments in the next year
    const now = Date.now();
    const newEnrollments: Enrollment[] = enrollmentIds.map((eid, idx) => {
      const orig = s.enrollments.find((e) => e.id === eid)!;
      return {
        ...orig,
        id: `ENR-P-${now}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
        academicYearId: targetAcademicYearId ?? orig.academicYearId,
        classYearOfferingId: targetOfferingId,
        sectionId: targetSectionId,
        enrollDate: today,
        exitDate: undefined,
        status: 'Active' as EnrollmentStatus,
        rollNumber: undefined,
      };
    });

    // Update target section's enrolled count
    const updatedSections = s.sections.map((sec) =>
      sec.id === targetSectionId
        ? { ...sec, enrolled: sec.enrolled + enrollmentIds.length }
        : sec
    );

    return {
      enrollments: [...updatedEnrollments, ...newEnrollments],
      sections: updatedSections,
    };
  }),

  transferStudent: (enrollmentId, newSectionId) => set((s) => ({
    enrollments: s.enrollments.map((e) => e.id === enrollmentId ? { ...e, sectionId: newSectionId } : e),
  })),

  addAuditEntry: (entry) => set((s) => ({
    auditLog: [{ ...entry, id: `AUD-${Date.now()}`, timestamp: new Date().toISOString() }, ...s.auditLog],
  })),

  addTimetableEntry: (e) => set((s) => ({ timetable: [...s.timetable, e] })),
  updateTimetableEntry: (id, updates) => set((s) => ({ timetable: s.timetable.map((t) => t.id === id ? { ...t, ...updates } : t) })),
  deleteTimetableEntry: (id) => set((s) => ({ timetable: s.timetable.filter((t) => t.id !== id) })),

  saveAttendance: (records) => set((s) => {
    const newRecords = [...s.attendances];
    records.forEach(r => {
      const existingIdx = newRecords.findIndex(ex => ex.timetableEntryId === r.timetableEntryId && ex.studentId === r.studentId && ex.date === r.date);
      if (existingIdx >= 0) newRecords[existingIdx] = r;
      else newRecords.push(r);
    });
    return { attendances: newRecords };
  }),

  addExam: (e) => set((s) => ({ exams: [...s.exams, e] })),
  updateExam: (id, updates) => set((s) => ({ exams: s.exams.map((ex) => ex.id === id ? { ...ex, ...updates } : ex) })),
  deleteExam: (id) => set((s) => ({ exams: s.exams.filter((ex) => ex.id !== id) })),

  addExamPattern: (p) => set((s) => ({ examPatterns: [...s.examPatterns, p] })),
  updateExamPattern: (id, updates) => set((s) => ({ examPatterns: s.examPatterns.map((p) => p.id === id ? { ...p, ...updates } : p) })),
  deleteExamPattern: (id) => set((s) => ({ examPatterns: s.examPatterns.filter((p) => p.id !== id) })),

  addAssessmentComponent: (c) => set((s) => ({ assessmentComponents: [...s.assessmentComponents, c] })),
  updateAssessmentComponent: (id, updates) => set((s) => ({ assessmentComponents: s.assessmentComponents.map((c) => c.id === id ? { ...c, ...updates } : c) })),
  deleteAssessmentComponent: (id) => set((s) => ({ assessmentComponents: s.assessmentComponents.filter((c) => c.id !== id) })),

  saveMarks: (newMarks) => set((s) => {
    const updated = [...s.marks];
    newMarks.forEach(m => {
      const idx = updated.findIndex(ex => ex.examId === m.examId && ex.studentId === m.studentId && ex.subjectId === m.subjectId && ex.componentId === m.componentId);
      if (idx >= 0) updated[idx] = m;
      else updated.push(m);
    });
    return { marks: updated };
  }),

  calculateResults: (examId) => set((s) => {
    // Basic mock calculation for demonstration purposes
    const examMarks = s.marks.filter(m => m.examId === examId);
    const students = Array.from(new Set(examMarks.map(m => m.studentId)));
    const newResults: Result[] = [];
    
    students.forEach(studentId => {
      const stuMarks = examMarks.filter(m => m.studentId === studentId);
      const total = stuMarks.reduce((acc, curr) => acc + (curr.moderatedMarks ?? curr.marksObtained), 0);
      let grade = 'F';
      if (total >= 90) grade = 'A1';
      else if (total >= 80) grade = 'A2';
      else if (total >= 70) grade = 'B1';
      else if (total >= 60) grade = 'B2';
      else if (total >= 50) grade = 'C1';
      else if (total >= 40) grade = 'D';
      
      newResults.push({
        id: `RES-${examId}-${studentId}`,
        examId,
        studentId,
        totalMarks: total,
        percentage: total, // Simplified for mock
        grade,
      });
    });

    const filtered = s.results.filter(r => r.examId !== examId);
    return { results: [...filtered, ...newResults] };
  }),

  getClassMasterById: (id) => get().classMasters.find((c) => c.id === id),
  getYearById: (id) => get().academicYears.find((y) => y.id === id),
  isYearEditable: (id) => {
    const year = get().academicYears.find((y) => y.id === id);
    return year ? year.status !== 'Archived' : false;
  },
}));
