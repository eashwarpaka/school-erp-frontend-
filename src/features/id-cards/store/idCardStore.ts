import { create } from 'zustand';

// Store for ID Cards Feature

export interface SchoolTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  theme: 'modern-wave' | 'corporate-edge' | 'gradient-flow' | 'playful-bubbles' | 'classic-stripe' | 'default';
}

export interface ChennaiSchool {
  id: string;
  name: string;
  shortName: string;
  address: string;
  board: 'CBSE' | 'ICSE' | 'Tamil Nadu State Board' | 'IB';
  logoUrl: string;
  logoInitials: string;
  theme: SchoolTheme;
  established: number;
  phone: string;
  email: string;
}

export interface SchoolClass {
  id: string;
  schoolId: string;
  standard: string;
  section: string;
  label: string;
  classTeacher: string;
  room: string;
  studentCount: number;
}

export interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'qrcode' | 'barcode';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: Record<string, any>;
}

export interface IDCardTemplate {
  id: string;
  name: string;
  scope: 'Global' | 'Campus' | 'Grade' | 'Staff' | 'Visitor';
  scopeValue?: string;
  schoolId?: string;
  classId?: string;
  status: 'Draft' | 'Published' | 'Archived';
  version: number;
  elements: TemplateElement[];
  backElements?: TemplateElement[];
  width: number;
  height: number;
  orientation: 'landscape' | 'portrait';
  hasBackSide?: boolean;
  cardStyle?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    backgroundImage?: string;
    theme?: 'default' | 'modern-wave' | 'corporate-edge' | 'gradient-flow' | 'playful-bubbles' | 'classic-stripe';
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    watermark?: string;
    securityPattern?: 'none' | 'dots' | 'lines' | 'guilloche';
  };
  expiryMonths?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PrintBatch {
  id: string;
  templateId: string;
  templateVersion: number;
  printedBy: string;
  printedAt: string;
  studentCount: number;
  status: 'Completed' | 'Failed' | 'Pending';
  schoolId?: string;
  classId?: string;
  exportFormat?: 'PDF' | 'PNG' | 'Excel';
  notes?: string;
}

export type CardStatus = 'Active' | 'Expired' | 'Lost' | 'Revoked' | 'Reissued';

export interface IssuedCard {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  schoolId: string;
  templateId: string;
  batchId: string;
  issuedAt: string;
  expiresAt: string | null;
  status: CardStatus;
  cardNumber: string;
  reprints: number;
  lastActivityAt?: string;
}

export const CHENNAI_SCHOOLS: ChennaiSchool[] = [
  {
    id: 'SCH-001',
    name: 'DAV Matriculation Higher Secondary School',
    shortName: 'DAV School',
    address: 'Gopalapuram, Chennai - 600 086',
    board: 'Tamil Nadu State Board',
    logoUrl: 'https://ui-avatars.com/api/?name=DAV&background=1e3a5f&color=ffffff&size=128&bold=true&font-size=0.4',
    logoInitials: 'DAV',
    established: 1957,
    phone: '+91 44 2811 3445',
    email: 'info@davgopalapuram.edu.in',
    theme: { primaryColor: '#1e3a5f', secondaryColor: '#c8a951', accentColor: '#e8f4fd', textColor: '#ffffff', theme: 'corporate-edge' },
  },
  {
    id: 'SCH-002',
    name: 'Padma Seshadri Bala Bhavan Senior Secondary School',
    shortName: 'PSBB School',
    address: 'K.K. Nagar, Chennai - 600 078',
    board: 'CBSE',
    logoUrl: 'https://ui-avatars.com/api/?name=PSBB&background=8b1a1a&color=ffffff&size=128&bold=true&font-size=0.4',
    logoInitials: 'PSBB',
    established: 1969,
    phone: '+91 44 2374 5921',
    email: 'info@psbbschools.ac.in',
    theme: { primaryColor: '#8b1a1a', secondaryColor: '#d4a017', accentColor: '#fdf2f2', textColor: '#ffffff', theme: 'modern-wave' },
  },
  {
    id: 'SCH-003',
    name: 'Chettinad Vidyashram Senior Secondary School',
    shortName: 'Chettinad Vidyashram',
    address: 'Raja Annamalai Puram, Chennai - 600 028',
    board: 'CBSE',
    logoUrl: 'https://ui-avatars.com/api/?name=CV&background=1a5276&color=f0e68c&size=128&bold=true&font-size=0.5',
    logoInitials: 'CV',
    established: 1968,
    phone: '+91 44 2461 7890',
    email: 'admin@chettinadvidyashram.org',
    theme: { primaryColor: '#1a5276', secondaryColor: '#f0e68c', accentColor: '#eaf4fb', textColor: '#ffffff', theme: 'gradient-flow' },
  },
  {
    id: 'SCH-004',
    name: 'The Hindu Senior Secondary School',
    shortName: 'The Hindu School',
    address: 'Mylapore, Chennai - 600 004',
    board: 'Tamil Nadu State Board',
    logoUrl: 'https://ui-avatars.com/api/?name=THS&background=14532d&color=ffffff&size=128&bold=true&font-size=0.4',
    logoInitials: 'THS',
    established: 1897,
    phone: '+91 44 2498 3562',
    email: 'info@hinduschool.edu.in',
    theme: { primaryColor: '#14532d', secondaryColor: '#fbbf24', accentColor: '#f0fdf4', textColor: '#ffffff', theme: 'classic-stripe' },
  },
  {
    id: 'SCH-005',
    name: 'Sishya School',
    shortName: 'Sishya School',
    address: 'Adyar, Chennai - 600 020',
    board: 'ICSE',
    logoUrl: 'https://ui-avatars.com/api/?name=SS&background=4a1d96&color=ffffff&size=128&bold=true&font-size=0.5',
    logoInitials: 'SS',
    established: 1978,
    phone: '+91 44 2441 5522',
    email: 'info@sishyaschool.com',
    theme: { primaryColor: '#4a1d96', secondaryColor: '#e879f9', accentColor: '#f5f3ff', textColor: '#ffffff', theme: 'playful-bubbles' },
  },
  {
    id: 'SCH-006',
    name: 'Good Shepherd Matriculation Higher Secondary School',
    shortName: 'Good Shepherd',
    address: 'Vepery, Chennai - 600 007',
    board: 'Tamil Nadu State Board',
    logoUrl: 'https://ui-avatars.com/api/?name=GS&background=0f3460&color=e94560&size=128&bold=true&font-size=0.5',
    logoInitials: 'GS',
    established: 1960,
    phone: '+91 44 2642 3189',
    email: 'info@goodshepherdchennai.in',
    theme: { primaryColor: '#0f3460', secondaryColor: '#e94560', accentColor: '#e8f4fd', textColor: '#ffffff', theme: 'corporate-edge' },
  },
];

const generateClasses = (schoolId: string, standards: string[], sections: string[]): SchoolClass[] => {
  const teachers = ['Mrs. Kavitha', 'Mr. Ramesh', 'Mrs. Priya', 'Mr. Suresh', 'Mrs. Lakshmi', 'Mr. Venkat'];
  const rooms = ['Room 101', 'Room 102', 'Room 201', 'Room 202', 'Room 301', 'Room 302', 'Lab 1'];
  const classes: SchoolClass[] = [];
  let idx = 0;
  standards.forEach((std) => {
    sections.forEach((sec) => {
      classes.push({
        id: 'CLS-' + schoolId + '-' + std.replace(/\s+/g, '') + '-' + sec,
        schoolId,
        standard: std,
        section: sec,
        label: std + ' - Section ' + sec,
        classTeacher: teachers[idx % teachers.length],
        room: rooms[idx % rooms.length],
        studentCount: 35 + Math.floor(Math.random() * 10),
      });
      idx++;
    });
  });
  return classes;
};

export const SCHOOL_CLASSES: SchoolClass[] = [
  ...generateClasses('SCH-001', ['LKG','UKG','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], ['A','B','C']),
  ...generateClasses('SCH-002', ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], ['A','B']),
  ...generateClasses('SCH-003', ['LKG','UKG','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10'], ['A','B','C','D']),
  ...generateClasses('SCH-004', ['Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], ['A','B']),
  ...generateClasses('SCH-005', ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10'], ['A','B','C']),
  ...generateClasses('SCH-006', ['LKG','UKG','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], ['A','B']),
];

const TAMIL_NAMES = [
  'Aarav Krishnamurthy','Priya Sundaram','Karthik Rajan','Deepa Venkatesh','Santhosh Kumar',
  'Kavya Natarajan','Vijay Murugan','Ananya Balaji','Rahul Selvaraj','Nithya Chandran',
  'Arjun Subramaniam','Meena Ramachandran','Dinesh Pillai','Swathi Gopal','Harish Balasubramanian',
  'Lakshmi Iyer','Surya Ganesh','Pooja Shankar','Naveen Thirumal','Rekha Narayanan',
  'Ashwin Periyaswamy','Divya Raghunathan','Prashanth Annamalai','Saranya Krishnan','Vikram Durai',
  'Aishwarya Manickam','Praveen Selvakumar','Radha Moorthy','Arun Subramanian','Chithra Muthukumar',
  'Bharath Srinivasan','Keerthana Pandian','Mohan Palanisamy','Sneha Rajendran','Bala Murugesan',
];

export const generateStudentsForClass = (classId: string, schoolId: string, count: number = 8) => {
  const school = CHENNAI_SCHOOLS.find(s => s.id === schoolId);
  const cls = SCHOOL_CLASSES.find(c => c.id === classId);
  if (!school || !cls) return [];
  const bgColors = ['d1e7f9','fce8d5','d5f5e3','fde8e8','e8d5fc','fdf5d5'];
  const fgColors = ['1d4ed8','b45309','15803d','b91c1c','7c3aed','92400e'];
  return Array.from({ length: count }, (_, i) => {
    const name = TAMIL_NAMES[(i + classId.charCodeAt(4)) % TAMIL_NAMES.length];
    const colorIdx = i % bgColors.length;
    return {
      id: classId + '-STU-' + String(i + 1).padStart(3, '0'),
      name,
      class: cls.label,
      standard: cls.standard,
      section: cls.section,
      school: school.name,
      schoolShort: school.shortName,
      schoolId,
      classId,
      photo: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=' + bgColors[colorIdx] + '&color=' + fgColors[colorIdx] + '&size=128&bold=true',
      qr_code: classId + '-STU-' + String(i + 1).padStart(3, '0') + '-QR',
      blood_group: ['O+','A+','B+','AB+','O-','A-'][i % 6],
      rollNumber: cls.section + String(i + 1).padStart(2, '0'),
      dob: String(2010 + (i % 8)) + '-' + String((i % 12) + 1).padStart(2,'0') + '-' + String((i % 28) + 1).padStart(2,'0'),
      parentPhone: '+91 9' + String(800000000 + i).slice(1),
      admissionNo: 'ADM-' + schoolId.replace('SCH-','') + '-' + String(2020 + (i % 5)) + '-' + String(i + 1).padStart(4,'0'),
      busRoute: 'Route ' + String((i % 8) + 1),
      houseColor: ['Red','Blue','Green','Yellow'][i % 4],
    };
  });
};

const MOCK_TEMPLATES: IDCardTemplate[] = [
  {
    id: 'TPL-001',
    name: 'Standard Student ID - Primary',
    scope: 'Grade',
    scopeValue: 'Primary',
    schoolId: 'SCH-001',
    status: 'Published',
    version: 2,
    width: 324,
    height: 204,
    orientation: 'landscape',
    expiryMonths: 12,
    hasBackSide: true,
    cardStyle: { backgroundColor: '#ffffff', borderColor: '#1e3a5f', borderWidth: 2, borderRadius: 8, theme: 'corporate-edge', primaryColor: '#1e3a5f', secondaryColor: '#c8a951', securityPattern: 'guilloche', watermark: 'OFFICIAL' },
    elements: [
      { id: 'e1', type: 'text', x: 20, y: 12, width: 220, height: 24, content: '{{school.name}}', style: { fontWeight: 'bold', fontSize: '11px', color: '#ffffff' } },
      { id: 'e2', type: 'image', x: 16, y: 50, width: 72, height: 90, content: '{{student.photo}}', style: { borderRadius: '6px' } },
      { id: 'e3', type: 'text', x: 100, y: 50, width: 190, height: 18, content: 'Name: {{student.name}}', style: { fontSize: '11px', fontWeight: '600', color: '#1e3a5f' } },
      { id: 'e4', type: 'text', x: 100, y: 72, width: 190, height: 16, content: 'Class: {{student.class}}', style: { fontSize: '10px', color: '#334155' } },
      { id: 'e5', type: 'text', x: 100, y: 90, width: 190, height: 16, content: 'Roll No: {{student.rollNumber}}', style: { fontSize: '10px', color: '#334155' } },
      { id: 'e6', type: 'text', x: 100, y: 108, width: 190, height: 16, content: 'Blood: {{student.blood_group}}', style: { fontSize: '10px', color: '#334155' } },
      { id: 'e7', type: 'qrcode', x: 256, y: 120, width: 56, height: 56, content: '{{student.qr_code}}' },
      { id: 'e8', type: 'image', x: 270, y: 10, width: 42, height: 42, content: '{{school.logo}}' },
      { id: 'e9', type: 'barcode', x: 16, y: 160, width: 180, height: 32, content: '{{student.admissionNo}}' },
    ],
    backElements: [
      { id: 'b1', type: 'text', x: 16, y: 14, width: 292, height: 18, content: 'IMPORTANT: If found, please return to:', style: { fontSize: '9px', color: '#64748b', textAlign: 'center' } },
      { id: 'b2', type: 'text', x: 16, y: 34, width: 292, height: 16, content: '{{school.name}}', style: { fontSize: '10px', fontWeight: 'bold', color: '#1e3a5f', textAlign: 'center' } },
      { id: 'b3', type: 'text', x: 16, y: 52, width: 292, height: 14, content: '{{school.address}}', style: { fontSize: '9px', color: '#64748b', textAlign: 'center' } },
      { id: 'b4', type: 'text', x: 16, y: 76, width: 292, height: 14, content: 'Bus: {{student.busRoute}} | House: {{student.houseColor}}', style: { fontSize: '9px', color: '#334155', textAlign: 'center' } },
      { id: 'b5', type: 'text', x: 16, y: 100, width: 200, height: 14, content: 'Parent: {{student.parentPhone}}', style: { fontSize: '8px', color: '#64748b' } },
      { id: 'b6', type: 'text', x: 16, y: 130, width: 292, height: 50, content: 'Terms & Conditions: This card is property of the school. Loss must be reported immediately. Misuse will result in disciplinary action.', style: { fontSize: '7px', color: '#94a3b8' } },
      { id: 'b7', type: 'qrcode', x: 252, y: 110, width: 55, height: 55, content: '{{student.id}}' },
    ],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-02-20T14:30:00Z',
  },
  {
    id: 'TPL-002',
    name: 'Staff ID Card',
    scope: 'Staff',
    status: 'Draft',
    version: 1,
    width: 204,
    height: 324,
    orientation: 'portrait',
    expiryMonths: 24,
    hasBackSide: false,
    cardStyle: { backgroundColor: '#f8fafc', borderColor: '#8b1a1a', borderWidth: 2, borderRadius: 12, theme: 'modern-wave', primaryColor: '#8b1a1a', secondaryColor: '#d4a017', securityPattern: 'dots' },
    elements: [
      { id: 'e1', type: 'text', x: 10, y: 10, width: 184, height: 30, content: 'STAFF ID', style: { fontWeight: 'bold', fontSize: '18px', textAlign: 'center', color: '#ffffff' } },
      { id: 'e2', type: 'image', x: 52, y: 50, width: 100, height: 100, content: '{{staff.photo}}', style: { borderRadius: '50%' } },
      { id: 'e3', type: 'text', x: 10, y: 170, width: 184, height: 20, content: '{{staff.name}}', style: { fontSize: '14px', textAlign: 'center', fontWeight: 'bold', color: '#1e293b' } },
      { id: 'e4', type: 'text', x: 10, y: 195, width: 184, height: 20, content: '{{staff.role}}', style: { fontSize: '12px', textAlign: 'center', color: '#64748b' } },
      { id: 'e5', type: 'barcode', x: 22, y: 240, width: 160, height: 40, content: '{{staff.id}}' },
    ],
    backElements: [],
    createdAt: '2026-06-10T09:15:00Z',
    updatedAt: '2026-06-12T11:00:00Z',
  },
  {
    id: 'TPL-003',
    name: 'Visitor Day Pass',
    scope: 'Visitor',
    status: 'Published',
    version: 1,
    width: 204,
    height: 324,
    orientation: 'portrait',
    expiryMonths: 0,
    hasBackSide: false,
    cardStyle: { backgroundColor: '#fffbeb', borderColor: '#f59e0b', borderWidth: 3, borderRadius: 12, theme: 'gradient-flow', primaryColor: '#d97706', secondaryColor: '#fef3c7', securityPattern: 'lines', watermark: 'VISITOR' },
    elements: [
      { id: 'e1', type: 'text', x: 10, y: 10, width: 184, height: 24, content: 'VISITOR PASS', style: { fontWeight: 'bold', fontSize: '16px', textAlign: 'center', color: '#ffffff' } },
      { id: 'e2', type: 'text', x: 10, y: 44, width: 184, height: 14, content: '{{school.shortName}}', style: { fontSize: '10px', textAlign: 'center', color: '#ffffff' } },
      { id: 'e3', type: 'image', x: 62, y: 65, width: 80, height: 80, content: '{{visitor.photo}}', style: { borderRadius: '8px' } },
      { id: 'e4', type: 'text', x: 10, y: 160, width: 184, height: 20, content: '{{visitor.name}}', style: { fontSize: '14px', textAlign: 'center', fontWeight: 'bold', color: '#92400e' } },
      { id: 'e5', type: 'text', x: 10, y: 184, width: 184, height: 14, content: 'To Meet: {{visitor.meetingWith}}', style: { fontSize: '10px', textAlign: 'center', color: '#78350f' } },
      { id: 'e6', type: 'text', x: 10, y: 202, width: 184, height: 14, content: 'Date: {{visitor.visitDate}}', style: { fontSize: '10px', textAlign: 'center', color: '#78350f' } },
      { id: 'e7', type: 'qrcode', x: 72, y: 230, width: 60, height: 60, content: '{{visitor.id}}' },
      { id: 'e8', type: 'text', x: 10, y: 300, width: 184, height: 12, content: 'VALID FOR 1 DAY ONLY', style: { fontSize: '8px', fontWeight: 'bold', textAlign: 'center', color: '#b45309' } },
    ],
    backElements: [],
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
];

const MOCK_BATCHES: PrintBatch[] = [
  { id: 'PRT-1001', templateId: 'TPL-001', templateVersion: 2, printedBy: 'Admin User', printedAt: '2026-07-01T08:30:00Z', studentCount: 150, status: 'Completed', schoolId: 'SCH-001', exportFormat: 'PDF' },
  { id: 'PRT-1002', templateId: 'TPL-001', templateVersion: 1, printedBy: 'Admin User', printedAt: '2025-08-15T09:00:00Z', studentCount: 45, status: 'Completed', schoolId: 'SCH-001', exportFormat: 'PDF' },
  { id: 'PRT-1003', templateId: 'TPL-002', templateVersion: 1, printedBy: 'HR Manager', printedAt: '2026-06-14T11:00:00Z', studentCount: 28, status: 'Completed', schoolId: 'SCH-002', exportFormat: 'PNG' },
];

const MOCK_ISSUED_CARDS: IssuedCard[] = [
  { id: 'CARD-001', studentId: 'STU-001', studentName: 'Aarav Krishnamurthy', studentClass: 'LKG - Section A', schoolId: 'SCH-001', templateId: 'TPL-001', batchId: 'PRT-1001', issuedAt: '2026-07-01T08:30:00Z', expiresAt: '2027-07-01T00:00:00Z', status: 'Active', cardNumber: 'DAV-2026-0001', reprints: 0 },
  { id: 'CARD-002', studentId: 'STU-002', studentName: 'Priya Sundaram', studentClass: 'LKG - Section A', schoolId: 'SCH-001', templateId: 'TPL-001', batchId: 'PRT-1001', issuedAt: '2026-07-01T08:30:00Z', expiresAt: '2027-07-01T00:00:00Z', status: 'Active', cardNumber: 'DAV-2026-0002', reprints: 0 },
  { id: 'CARD-003', studentId: 'STU-003', studentName: 'Karthik Rajan', studentClass: 'LKG - Section A', schoolId: 'SCH-001', templateId: 'TPL-001', batchId: 'PRT-1001', issuedAt: '2025-08-15T09:00:00Z', expiresAt: '2026-08-15T00:00:00Z', status: 'Expired', cardNumber: 'DAV-2025-0003', reprints: 1 },
  { id: 'CARD-004', studentId: 'STU-004', studentName: 'Deepa Venkatesh', studentClass: 'LKG - Section B', schoolId: 'SCH-001', templateId: 'TPL-001', batchId: 'PRT-1001', issuedAt: '2026-07-01T08:30:00Z', expiresAt: '2027-07-01T00:00:00Z', status: 'Lost', cardNumber: 'DAV-2026-0004', reprints: 0 },
  { id: 'CARD-005', studentId: 'STU-005', studentName: 'Santhosh Kumar', studentClass: 'LKG - Section B', schoolId: 'SCH-001', templateId: 'TPL-001', batchId: 'PRT-1001', issuedAt: '2026-07-01T08:30:00Z', expiresAt: '2027-07-01T00:00:00Z', status: 'Active', cardNumber: 'DAV-2026-0005', reprints: 0 },
  { id: 'CARD-006', studentId: 'STU-006', studentName: 'Kavya Natarajan', studentClass: 'Grade 1 - Section A', schoolId: 'SCH-001', templateId: 'TPL-001', batchId: 'PRT-1002', issuedAt: '2025-08-15T09:00:00Z', expiresAt: '2026-08-15T00:00:00Z', status: 'Reissued', cardNumber: 'DAV-2025-0006', reprints: 2 },
  { id: 'CARD-007', studentId: 'STU-007', studentName: 'Vijay Murugan', studentClass: 'Grade 2 - Section B', schoolId: 'SCH-001', templateId: 'TPL-001', batchId: 'PRT-1002', issuedAt: '2025-08-15T09:00:00Z', expiresAt: '2026-08-15T00:00:00Z', status: 'Revoked', cardNumber: 'DAV-2025-0007', reprints: 0 },
];

interface IDCardState {
  templates: IDCardTemplate[];
  printBatches: PrintBatch[];
  issuedCards: IssuedCard[];
  selectedSchoolId: string | null;
  selectedClassId: string | null;
  setSelectedSchool: (id: string | null) => void;
  setSelectedClass: (id: string | null) => void;
  addTemplate: (template: Omit<IDCardTemplate, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  updateTemplate: (id: string, template: Partial<IDCardTemplate>) => void;
  deleteTemplate: (id: string) => void;
  publishTemplate: (id: string) => void;
  archiveTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => void;
  logPrintBatch: (batch: Omit<PrintBatch, 'id' | 'printedAt'>) => string;
  issueCards: (cards: Omit<IssuedCard, 'id'>[]) => void;
  updateCardStatus: (cardId: string, status: CardStatus) => void;
  reprintCard: (cardId: string) => void;
}

export const useIDCardStore = create<IDCardState>((set) => ({
  templates: MOCK_TEMPLATES,
  printBatches: MOCK_BATCHES,
  issuedCards: MOCK_ISSUED_CARDS,
  selectedSchoolId: null,
  selectedClassId: null,

  setSelectedSchool: (id) => set({ selectedSchoolId: id, selectedClassId: null }),
  setSelectedClass: (id) => set({ selectedClassId: id }),

  addTemplate: (template) =>
    set((state) => {
      const newTemplate: IDCardTemplate = {
        ...template,
        id: 'TPL-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { templates: [...state.templates, newTemplate] };
    }),

  updateTemplate: (id, templateData) =>
    set((state) => ({
      templates: state.templates.map((tpl) =>
        tpl.id === id ? { ...tpl, ...templateData, updatedAt: new Date().toISOString() } : tpl
      ),
    })),

  deleteTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((tpl) => tpl.id !== id),
    })),

  publishTemplate: (id) =>
    set((state) => ({
      templates: state.templates.map((tpl) =>
        tpl.id === id ? { ...tpl, status: 'Published', version: tpl.version + 1, updatedAt: new Date().toISOString() } : tpl
      ),
    })),

  archiveTemplate: (id) =>
    set((state) => ({
      templates: state.templates.map((tpl) =>
        tpl.id === id ? { ...tpl, status: 'Archived', updatedAt: new Date().toISOString() } : tpl
      ),
    })),

  duplicateTemplate: (id) =>
    set((state) => {
      const source = state.templates.find((t) => t.id === id);
      if (!source) return state;
      const newTemplate: IDCardTemplate = {
        ...source,
        id: 'TPL-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        name: source.name + ' (Copy)',
        status: 'Draft',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { templates: [...state.templates, newTemplate] };
    }),

  logPrintBatch: (batch) => {
    const id = 'PRT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    set((state) => ({
      printBatches: [{ ...batch, id, printedAt: new Date().toISOString() }, ...state.printBatches],
    }));
    return id;
  },

  issueCards: (cards) =>
    set((state) => ({
      issuedCards: [
        ...cards.map((c) => ({ ...c, id: 'CARD-' + Math.random().toString(36).substr(2, 8).toUpperCase() })),
        ...state.issuedCards,
      ],
    })),

  updateCardStatus: (cardId, status) =>
    set((state) => ({
      issuedCards: state.issuedCards.map((card) =>
        card.id === cardId ? { ...card, status, lastActivityAt: new Date().toISOString() } : card
      ),
    })),

  reprintCard: (cardId) =>
    set((state) => ({
      issuedCards: state.issuedCards.map((card) =>
        card.id === cardId ? { ...card, reprints: card.reprints + 1, lastActivityAt: new Date().toISOString() } : card
      ),
    })),
}));
