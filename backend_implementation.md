# 🏫 Smart School ERP — Backend Implementation Guide

> **Stack**: Node.js (Express) · PostgreSQL · Redis · JWT + HttpOnly Cookies · Multi-tenant SaaS

---

## 📋 Table of Contents

1. [Project Structure](#1-project-structure)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Database Schema & Scripts](#3-database-schema--scripts)
4. [API Endpoints (All Modules)](#4-api-endpoints)
5. [Authentication & RBAC Middleware](#5-authentication--rbac-middleware)
6. [Node.js Route Files](#6-nodejs-route-files)
7. [Environment Configuration](#7-environment-configuration)

---

## 1. Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # PostgreSQL pool
│   │   ├── redis.js           # Redis client
│   │   └── env.js             # Environment validation
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── rbac.js            # Role-based access control
│   │   ├── tenant.js          # Multi-tenant resolver
│   │   └── errorHandler.js    # Global error handler
│   ├── routes/
│   │   ├── auth.js            # /api/auth/*
│   │   ├── tenant.js          # /api/tenant/*
│   │   ├── dashboard.js       # /api/dashboard/*
│   │   ├── students.js        # /api/students/*
│   │   ├── parents.js         # /api/parents/*
│   │   ├── academics.js       # /api/academics/*
│   │   ├── timetable.js       # /api/timetable/*
│   │   ├── exams.js           # /api/exams/*
│   │   ├── attendance.js      # /api/attendance/*
│   │   ├── admissions.js      # /api/admissions/*
│   │   ├── finance.js         # /api/finance/*
│   │   ├── hr.js              # /api/hr/*
│   │   ├── payroll.js         # /api/payroll/*
│   │   ├── transport.js       # /api/transport/*
│   │   ├── library.js         # /api/library/*
│   │   ├── hostel.js          # /api/hostel/*
│   │   ├── inventory.js       # /api/inventory/*
│   │   ├── communication.js   # /api/communication/*
│   │   ├── reports.js         # /api/reports/*
│   │   ├── lms.js             # /api/lms/*
│   │   ├── certificates.js    # /api/certificates/*
│   │   ├── portal.js          # /api/portal/*
│   │   └── audit.js           # /api/audit/*
│   ├── services/              # Business logic layer
│   ├── utils/
│   │   ├── pagination.js
│   │   ├── response.js        # Standard response envelope
│   │   └── validators.js
│   └── app.js                 # Express app entry
├── db/
│   ├── migrations/
│   │   ├── 001_tenants.sql
│   │   ├── 002_users.sql
│   │   ├── 003_school_setup.sql
│   │   ├── 004_students.sql
│   │   ├── 005_academics.sql
│   │   ├── 006_attendance.sql
│   │   ├── 007_finance.sql
│   │   ├── 008_hr.sql
│   │   ├── 009_transport.sql
│   │   ├── 010_library.sql
│   │   ├── 011_hostel.sql
│   │   ├── 012_communication.sql
│   │   ├── 013_admissions.sql
│   │   ├── 014_inventory.sql      # Inventory, Procurement & Assets
│   │   ├── 015_lms.sql            # LMS, Courses, Live Classes, Assessments
│   │   └── 016_certificates.sql   # Certificate Templates & Issuance
│   └── seed/
│       └── seed.sql
├── package.json
└── .env
```

---

## 2. Tech Stack & Dependencies

```json
{
  "name": "school-erp-backend",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "redis": "^4.6.10",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.7",
    "uuid": "^9.0.1",
    "dotenv": "^16.3.1",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "socket.io": "^4.6.1",
    "node-cron": "^3.0.3",
    "pdfkit": "^0.14.0",
    "exceljs": "^4.4.0",
    "twilio": "^4.19.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0"
  }
}
```

---

## 3. Database Schema & Scripts

### 📄 Migration 001 — Tenants (Multi-tenant SaaS)

```sql
-- db/migrations/001_tenants.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE tenants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_code     VARCHAR(20) UNIQUE NOT NULL,       -- e.g. 'STMARY'
  school_name     VARCHAR(200) NOT NULL,
  logo_url        TEXT,
  primary_color   VARCHAR(20) DEFAULT '#f59e0b',
  secondary_color VARCHAR(20) DEFAULT '#1e293b',
  tagline         TEXT,
  address         TEXT,
  phone           VARCHAR(20),
  email           VARCHAR(150),
  website         VARCHAR(200),
  timezone        VARCHAR(60) DEFAULT 'Asia/Kolkata',
  currency        VARCHAR(10) DEFAULT 'INR',
  currency_symbol VARCHAR(5) DEFAULT '₹',
  locale          VARCHAR(20) DEFAULT 'en-IN',
  academic_year_pattern VARCHAR(30) DEFAULT 'April-March',
  enabled_modules TEXT[] DEFAULT ARRAY[
    'dashboard','school_admin','students','parents',
    'academics','exams','timetable','hr','payroll',
    'attendance','admissions','finance','communication',
    'transport','library','inventory','hostel',
    'reports','ai_hub','security','audit_log'
  ],
  plan            VARCHAR(30) DEFAULT 'basic',       -- basic | standard | premium
  plan_status     VARCHAR(20) DEFAULT 'active',      -- active | trial | suspended | churned
  trial_ends_at   TIMESTAMPTZ,
  mrr             NUMERIC(12,2) DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tenants_school_code ON tenants(school_code);
```

### 📄 Migration 002 — Users & Roles

```sql
-- db/migrations/002_users.sql

CREATE TYPE user_role AS ENUM (
  'super_admin', 'school_admin', 'accountant', 'hr_manager',
  'teacher', 'librarian', 'hostel_warden', 'transport_manager',
  'parent', 'student'
);

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email           VARCHAR(200) UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  role            user_role NOT NULL DEFAULT 'student',
  first_name      VARCHAR(100),
  last_name       VARCHAR(100),
  phone           VARCHAR(20),
  avatar_url      TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  otp_code        VARCHAR(10),
  otp_expires_at  TIMESTAMPTZ,
  last_login_at   TIMESTAMPTZ,
  mfa_enabled     BOOLEAN DEFAULT FALSE,
  mfa_secret      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  user_id     UUID REFERENCES users(id),
  action      VARCHAR(100) NOT NULL,
  module      VARCHAR(50),
  entity_type VARCHAR(50),
  entity_id   UUID,
  old_value   JSONB,
  new_value   JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
```

### 📄 Migration 003 — School Setup (Admin)

```sql
-- db/migrations/003_school_setup.sql

CREATE TABLE academic_years (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,             -- e.g. '2026-27'
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  is_current  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE terms (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id        UUID REFERENCES tenants(id) ON DELETE CASCADE,
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
  name             VARCHAR(100) NOT NULL,       -- e.g. 'Term 1'
  start_date       DATE NOT NULL,
  end_date         DATE NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE class_masters (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name        VARCHAR(50) NOT NULL,             -- e.g. 'Grade 10'
  grade_level INT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sections (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  class_master_id UUID REFERENCES class_masters(id) ON DELETE CASCADE,
  name            VARCHAR(10) NOT NULL,          -- e.g. 'A', 'B'
  capacity        INT DEFAULT 40,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE class_year_offerings (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id        UUID REFERENCES tenants(id) ON DELETE CASCADE,
  class_master_id  UUID REFERENCES class_masters(id),
  section_id       UUID REFERENCES sections(id),
  academic_year_id UUID REFERENCES academic_years(id),
  teacher_id       UUID REFERENCES users(id),    -- class teacher
  room_number      VARCHAR(20),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, section_id, academic_year_id)
);

CREATE TABLE subjects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  class_master_id UUID REFERENCES class_masters(id),
  name            VARCHAR(100) NOT NULL,
  code            VARCHAR(20),
  is_elective     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_academic_years_tenant ON academic_years(tenant_id);
CREATE INDEX idx_terms_year ON terms(academic_year_id);
CREATE INDEX idx_sections_class ON sections(class_master_id);
```

### 📄 Migration 004 — Students & Parents

```sql
-- db/migrations/004_students.sql

CREATE TYPE student_status AS ENUM ('active', 'transferred', 'graduated', 'withdrawn');

CREATE TABLE students (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id         UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES users(id),            -- linked login account
  student_id        VARCHAR(30) UNIQUE NOT NULL,           -- e.g. STU-2026-0001
  admission_number  VARCHAR(50),
  national_id       VARCHAR(50),
  first_name        VARCHAR(100) NOT NULL,
  last_name         VARCHAR(100) NOT NULL,
  date_of_birth     DATE,
  gender            VARCHAR(10),
  blood_group       VARCHAR(5),
  avatar_url        TEXT,
  address           TEXT,
  city              VARCHAR(100),
  state             VARCHAR(100),
  country           VARCHAR(100),
  pin_code          VARCHAR(20),
  status            student_status DEFAULT 'active',
  admission_date    DATE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_enrollments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id        UUID REFERENCES tenants(id),
  student_id       UUID REFERENCES students(id) ON DELETE CASCADE,
  class_offering_id UUID REFERENCES class_year_offerings(id),
  academic_year_id UUID REFERENCES academic_years(id),
  roll_number      VARCHAR(20),
  enrolled_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, academic_year_id)
);

CREATE TABLE parents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id),
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  relation    VARCHAR(30),                 -- Father | Mother | Guardian
  email       VARCHAR(200),
  phone       VARCHAR(20),
  occupation  VARCHAR(100),
  address     TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_parents (
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES parents(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (student_id, parent_id)
);

CREATE INDEX idx_students_tenant ON students(tenant_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_student_enrollments_year ON student_enrollments(academic_year_id);
```

### 📄 Migration 005 — Academics (Timetable, Assignments, Exams)

```sql
-- db/migrations/005_academics.sql

CREATE TABLE timetable_slots (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id        UUID REFERENCES tenants(id) ON DELETE CASCADE,
  class_offering_id UUID REFERENCES class_year_offerings(id),
  subject_id       UUID REFERENCES subjects(id),
  teacher_id       UUID REFERENCES users(id),
  day_of_week      SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  start_time       TIME NOT NULL,
  end_time         TIME NOT NULL,
  room_number      VARCHAR(20),
  academic_year_id UUID REFERENCES academic_years(id),
  term_id          UUID REFERENCES terms(id),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assignments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id        UUID REFERENCES tenants(id) ON DELETE CASCADE,
  title            VARCHAR(200) NOT NULL,
  description      TEXT,
  subject_id       UUID REFERENCES subjects(id),
  class_offering_id UUID REFERENCES class_year_offerings(id),
  teacher_id       UUID REFERENCES users(id),
  due_date         DATE,
  max_marks        NUMERIC(6,2),
  attachment_url   TEXT,
  status           VARCHAR(20) DEFAULT 'active',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assignment_submissions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id    UUID REFERENCES students(id),
  submitted_at  TIMESTAMPTZ,
  file_url      TEXT,
  marks_obtained NUMERIC(6,2),
  feedback      TEXT,
  status        VARCHAR(20) DEFAULT 'pending'   -- pending | submitted | graded | late
);

CREATE TABLE exams (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id        UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name             VARCHAR(200) NOT NULL,
  exam_type        VARCHAR(50),                -- mid-term | final | unit-test
  academic_year_id UUID REFERENCES academic_years(id),
  term_id          UUID REFERENCES terms(id),
  start_date       DATE,
  end_date         DATE,
  created_by       UUID REFERENCES users(id),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_schedules (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id     UUID REFERENCES exams(id) ON DELETE CASCADE,
  subject_id  UUID REFERENCES subjects(id),
  class_offering_id UUID REFERENCES class_year_offerings(id),
  exam_date   DATE NOT NULL,
  start_time  TIME,
  end_time    TIME,
  room_number VARCHAR(20),
  max_marks   NUMERIC(6,2),
  pass_marks  NUMERIC(6,2)
);

CREATE TABLE exam_results (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_schedule_id UUID REFERENCES exam_schedules(id),
  student_id       UUID REFERENCES students(id),
  marks_obtained   NUMERIC(6,2),
  grade            VARCHAR(5),
  remarks          TEXT,
  is_absent        BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_schedule_id, student_id)
);

CREATE TABLE learning_outcomes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  subject_id  UUID REFERENCES subjects(id),
  description TEXT NOT NULL,
  bloom_level VARCHAR(30),               -- Remember | Understand | Apply | ...
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE electives (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id        UUID REFERENCES tenants(id),
  subject_id       UUID REFERENCES subjects(id),
  academic_year_id UUID REFERENCES academic_years(id),
  max_students     INT DEFAULT 30,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_timetable_class ON timetable_slots(class_offering_id);
CREATE INDEX idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX idx_exam_results_student ON exam_results(student_id);
```

### 📄 Migration 006 — Attendance

```sql
-- db/migrations/006_attendance.sql

CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

CREATE TABLE student_attendance (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id        UUID REFERENCES tenants(id) ON DELETE CASCADE,
  student_id       UUID REFERENCES students(id),
  class_offering_id UUID REFERENCES class_year_offerings(id),
  date             DATE NOT NULL,
  status           attendance_status DEFAULT 'present',
  marked_by        UUID REFERENCES users(id),
  remarks          TEXT,
  subject_id       UUID REFERENCES subjects(id),   -- for period-wise
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date, subject_id)
);

CREATE TABLE staff_attendance (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  staff_id    UUID REFERENCES users(id),
  date        DATE NOT NULL,
  check_in    TIMESTAMPTZ,
  check_out   TIMESTAMPTZ,
  status      attendance_status DEFAULT 'present',
  biometric_id VARCHAR(50),
  remarks     TEXT,
  UNIQUE(staff_id, date)
);

CREATE INDEX idx_student_attendance_date ON student_attendance(date);
CREATE INDEX idx_student_attendance_student ON student_attendance(student_id);
CREATE INDEX idx_staff_attendance_date ON staff_attendance(date);
```

### 📄 Migration 007 — Finance

```sql
-- db/migrations/007_finance.sql

CREATE TABLE fee_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,            -- Tuition | Transport | Hostel
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE fee_structures (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id        UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name             VARCHAR(200) NOT NULL,
  academic_year_id UUID REFERENCES academic_years(id),
  term_id          UUID REFERENCES terms(id),
  class_master_id  UUID REFERENCES class_masters(id),
  category_id      UUID REFERENCES fee_categories(id),
  amount           NUMERIC(12,2) NOT NULL,
  due_date         DATE,
  late_fee_per_day NUMERIC(8,2) DEFAULT 0,
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id      UUID REFERENCES tenants(id),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  student_id     UUID REFERENCES students(id),
  fee_structure_id UUID REFERENCES fee_structures(id),
  amount         NUMERIC(12,2) NOT NULL,
  discount       NUMERIC(12,2) DEFAULT 0,
  net_amount     NUMERIC(12,2) NOT NULL,
  amount_paid    NUMERIC(12,2) DEFAULT 0,
  balance        NUMERIC(12,2),
  status         VARCHAR(30) DEFAULT 'Not Paid', -- Paid In Full | Partially Paid | Not Paid
  due_date       DATE,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID REFERENCES tenants(id),
  invoice_id      UUID REFERENCES invoices(id),
  student_id      UUID REFERENCES students(id),
  amount          NUMERIC(12,2) NOT NULL,
  payment_method  VARCHAR(30),                 -- cash | card | bank_transfer | online | cheque
  transaction_ref VARCHAR(100),
  receipt_number  VARCHAR(50),
  payment_date    DATE DEFAULT CURRENT_DATE,
  recorded_by     UUID REFERENCES users(id),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scholarships (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  student_id  UUID REFERENCES students(id),
  name        VARCHAR(200),
  discount_type VARCHAR(20),               -- percentage | flat
  discount_value NUMERIC(10,2),
  applied_at  DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_student ON invoices(student_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
```

### 📄 Migration 008 — HR & Payroll

```sql
-- db/migrations/008_hr.sql

CREATE TABLE staff (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id),
  staff_id        VARCHAR(30) UNIQUE NOT NULL,    -- e.g. STF-001
  department      VARCHAR(100),
  designation     VARCHAR(100),
  qualification   VARCHAR(200),
  joining_date    DATE,
  employment_type VARCHAR(30),                    -- full_time | part_time | contract
  salary          NUMERIC(12,2),
  bank_account    VARCHAR(50),
  bank_ifsc       VARCHAR(20),
  emergency_contact TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leave_types (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  name        VARCHAR(100) NOT NULL,              -- Sick | Casual | Earned | Maternity
  max_days    INT DEFAULT 0,
  is_paid     BOOLEAN DEFAULT TRUE
);

CREATE TABLE leave_requests (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id    UUID REFERENCES tenants(id),
  staff_id     UUID REFERENCES staff(id),
  leave_type_id UUID REFERENCES leave_types(id),
  from_date    DATE NOT NULL,
  to_date      DATE NOT NULL,
  days         INT,
  reason       TEXT,
  status       VARCHAR(20) DEFAULT 'pending',     -- pending | approved | rejected | cancelled
  approved_by  UUID REFERENCES users(id),
  approved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payroll_runs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id        UUID REFERENCES tenants(id),
  month            SMALLINT NOT NULL,
  year             SMALLINT NOT NULL,
  status           VARCHAR(20) DEFAULT 'draft',   -- draft | approved | processed | paid
  total_amount     NUMERIC(14,2),
  approved_by      UUID REFERENCES users(id),
  processed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, month, year)
);

CREATE TABLE payslips (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payroll_run_id UUID REFERENCES payroll_runs(id) ON DELETE CASCADE,
  staff_id       UUID REFERENCES staff(id),
  basic_salary   NUMERIC(12,2),
  hra            NUMERIC(12,2) DEFAULT 0,
  allowances     NUMERIC(12,2) DEFAULT 0,
  deductions     NUMERIC(12,2) DEFAULT 0,
  tax            NUMERIC(12,2) DEFAULT 0,
  net_salary     NUMERIC(12,2),
  status         VARCHAR(20) DEFAULT 'pending',
  paid_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_staff_tenant ON staff(tenant_id);
CREATE INDEX idx_leave_requests_staff ON leave_requests(staff_id);
CREATE INDEX idx_payroll_runs_tenant ON payroll_runs(tenant_id);
```

### 📄 Migration 009 — Transport

```sql
-- db/migrations/009_transport.sql

CREATE TABLE vehicles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  vehicle_number  VARCHAR(30) NOT NULL,
  vehicle_type    VARCHAR(30) DEFAULT 'bus',
  capacity        INT,
  driver_id       UUID REFERENCES users(id),
  model           VARCHAR(100),
  make_year       SMALLINT,
  insurance_expiry DATE,
  fitness_expiry  DATE,
  gps_device_id   VARCHAR(100),
  status          VARCHAR(20) DEFAULT 'active',   -- active | maintenance | inactive
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE routes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  route_name  VARCHAR(100) NOT NULL,
  vehicle_id  UUID REFERENCES vehicles(id),
  start_point VARCHAR(200),
  end_point   VARCHAR(200),
  distance_km NUMERIC(8,2),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE route_stops (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id    UUID REFERENCES routes(id) ON DELETE CASCADE,
  stop_name   VARCHAR(200) NOT NULL,
  stop_order  INT,
  pickup_time TIME,
  drop_time   TIME,
  latitude    NUMERIC(10,7),
  longitude   NUMERIC(10,7)
);

CREATE TABLE student_transport (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  student_id  UUID REFERENCES students(id),
  route_id    UUID REFERENCES routes(id),
  stop_id     UUID REFERENCES route_stops(id),
  academic_year_id UUID REFERENCES academic_years(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, academic_year_id)
);

CREATE TABLE vehicle_trips (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  vehicle_id  UUID REFERENCES vehicles(id),
  route_id    UUID REFERENCES routes(id),
  trip_date   DATE DEFAULT CURRENT_DATE,
  trip_type   VARCHAR(20),               -- morning | afternoon
  departure_at TIMESTAMPTZ,
  arrival_at  TIMESTAMPTZ,
  status      VARCHAR(20) DEFAULT 'scheduled',  -- scheduled | in_progress | completed | delayed
  delay_mins  INT DEFAULT 0
);

CREATE TABLE maintenance_alerts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  vehicle_id  UUID REFERENCES vehicles(id),
  alert_type  VARCHAR(50),
  description TEXT,
  due_date    DATE,
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_routes_tenant ON routes(tenant_id);
CREATE INDEX idx_vehicle_trips_date ON vehicle_trips(trip_date);
```

### 📄 Migration 010 — Library

```sql
-- db/migrations/010_library.sql

CREATE TABLE books (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id     UUID REFERENCES tenants(id) ON DELETE CASCADE,
  title         VARCHAR(300) NOT NULL,
  author        VARCHAR(200),
  isbn          VARCHAR(30),
  publisher     VARCHAR(200),
  edition       VARCHAR(50),
  category      VARCHAR(100),
  subject_id    UUID REFERENCES subjects(id),
  total_copies  INT DEFAULT 1,
  available     INT DEFAULT 1,
  location      VARCHAR(100),             -- Shelf / Rack reference
  added_at      DATE DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE book_issues (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  book_id     UUID REFERENCES books(id),
  borrower_id UUID REFERENCES users(id),  -- student or staff user id
  issue_date  DATE DEFAULT CURRENT_DATE,
  due_date    DATE,
  return_date DATE,
  fine_amount NUMERIC(8,2) DEFAULT 0,
  fine_paid   BOOLEAN DEFAULT FALSE,
  status      VARCHAR(20) DEFAULT 'issued',   -- issued | returned | overdue | lost
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_books_tenant ON books(tenant_id);
CREATE INDEX idx_book_issues_status ON book_issues(status);
CREATE INDEX idx_book_issues_borrower ON book_issues(borrower_id);
```

### 📄 Migration 011 — Hostel

```sql
-- db/migrations/011_hostel.sql

CREATE TABLE hostel_blocks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,           -- Block A | Block B
  gender      VARCHAR(10),                     -- boys | girls | mixed
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hostel_rooms (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  block_id    UUID REFERENCES hostel_blocks(id) ON DELETE CASCADE,
  room_number VARCHAR(20) NOT NULL,
  capacity    INT DEFAULT 2,
  room_type   VARCHAR(30),                     -- single | double | dormitory
  status      VARCHAR(20) DEFAULT 'available', -- available | occupied | maintenance | reserved
  floor       INT DEFAULT 0,
  monthly_fee NUMERIC(10,2)
);

CREATE TABLE hostel_allocations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  student_id  UUID REFERENCES students(id),
  room_id     UUID REFERENCES hostel_rooms(id),
  check_in    DATE,
  check_out   DATE,
  academic_year_id UUID REFERENCES academic_years(id),
  status      VARCHAR(20) DEFAULT 'active',
  UNIQUE(student_id, academic_year_id)
);

CREATE TABLE hostel_incidents (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id    UUID REFERENCES tenants(id),
  block_id     UUID REFERENCES hostel_blocks(id),
  room_id      UUID REFERENCES hostel_rooms(id),
  reported_by  UUID REFERENCES users(id),
  incident_type VARCHAR(50),
  description  TEXT NOT NULL,
  severity     VARCHAR(20) DEFAULT 'medium',   -- low | medium | high | critical
  status       VARCHAR(20) DEFAULT 'open',     -- open | in_progress | resolved
  resolved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hostel_visitors (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  student_id  UUID REFERENCES students(id),
  visitor_name VARCHAR(200),
  relation    VARCHAR(50),
  phone       VARCHAR(20),
  visit_date  DATE DEFAULT CURRENT_DATE,
  check_in    TIMESTAMPTZ,
  check_out   TIMESTAMPTZ,
  purpose     TEXT
);

CREATE INDEX idx_hostel_rooms_block ON hostel_rooms(block_id);
CREATE INDEX idx_hostel_allocations_student ON hostel_allocations(student_id);
```

### 📄 Migration 012 — Communication

```sql
-- db/migrations/012_communication.sql

CREATE TABLE notices (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id     UUID REFERENCES tenants(id) ON DELETE CASCADE,
  title         VARCHAR(300) NOT NULL,
  content       TEXT NOT NULL,
  target_roles  user_role[],               -- who can see: teacher | parent | student
  published_by  UUID REFERENCES users(id),
  publish_date  DATE DEFAULT CURRENT_DATE,
  expiry_date   DATE,
  is_pinned     BOOLEAN DEFAULT FALSE,
  attachment_url TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  sender_id   UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  subject     VARCHAR(300),
  body        TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  parent_msg_id UUID REFERENCES messages(id),   -- thread support
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  user_id     UUID REFERENCES users(id),
  title       VARCHAR(200),
  body        TEXT,
  type        VARCHAR(30),               -- fee | attendance | exam | system
  is_read     BOOLEAN DEFAULT FALSE,
  action_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sms_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id),
  phone       VARCHAR(20),
  message     TEXT,
  status      VARCHAR(20),               -- sent | failed | delivered
  provider_ref VARCHAR(100),
  sent_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notices_tenant ON notices(tenant_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
```

### 📄 Migration 013 — Admissions

```sql
-- db/migrations/013_admissions.sql

CREATE TYPE admission_status AS ENUM (
  'inquiry', 'applied', 'shortlisted', 'interview_scheduled',
  'accepted', 'enrolled', 'rejected', 'waitlisted'
);

CREATE TABLE admissions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id        UUID REFERENCES tenants(id) ON DELETE CASCADE,
  applicant_name   VARCHAR(200) NOT NULL,
  date_of_birth    DATE,
  gender           VARCHAR(10),
  applying_for_class UUID REFERENCES class_masters(id),
  academic_year_id UUID REFERENCES academic_years(id),
  parent_name      VARCHAR(200),
  parent_phone     VARCHAR(20),
  parent_email     VARCHAR(200),
  previous_school  VARCHAR(300),
  address          TEXT,
  status           admission_status DEFAULT 'inquiry',
  application_date DATE DEFAULT CURRENT_DATE,
  interview_date   DATE,
  notes            TEXT,
  assigned_to      UUID REFERENCES users(id),
  converted_to     UUID REFERENCES students(id),   -- on enrollment
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admissions_tenant ON admissions(tenant_id);
CREATE INDEX idx_admissions_status ON admissions(status);
```

---

## 4. API Endpoints

### 🔐 Auth Module — `/api/auth`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `POST` | `/api/auth/login` | Login with email+password | All |
| `POST` | `/api/auth/signup` | Register new school tenant | Public |
| `POST` | `/api/auth/logout` | Clear session/refresh token | Authenticated |
| `POST` | `/api/auth/forgot-password` | Send OTP to email | All |
| `POST` | `/api/auth/verify-otp` | Verify OTP code | All |
| `POST` | `/api/auth/reset-password` | Reset password with token | All |
| `POST` | `/api/auth/refresh` | Refresh access token | Authenticated |
| `GET`  | `/api/auth/me` | Get current user profile | Authenticated |
| `PUT`  | `/api/auth/me` | Update own profile | Authenticated |
| `POST` | `/api/auth/mfa/enable` | Enable MFA (TOTP) | Authenticated |
| `POST` | `/api/auth/mfa/verify` | Verify MFA token | Authenticated |

### 🏫 Tenant Module — `/api/tenant`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/tenant/resolve` | Resolve tenant by school code | Public |
| `GET`  | `/api/tenant/me` | Get current tenant config | Authenticated |
| `PUT`  | `/api/tenant/me` | Update tenant branding | super_admin, school_admin |
| `GET`  | `/api/tenant/all` | List all tenants (SaaS) | super_admin |
| `POST` | `/api/tenant` | Create new tenant | super_admin |
| `PUT`  | `/api/tenant/:id/plan` | Update tenant plan | super_admin |
| `DELETE` | `/api/tenant/:id` | Deactivate tenant | super_admin |

### 📊 Dashboard Module — `/api/dashboard`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/dashboard/kpis` | Role-based KPI metrics | All |
| `GET`  | `/api/dashboard/chart` | Role-based chart data | All |
| `GET`  | `/api/dashboard/activities` | Recent activity feed | All |
| `GET`  | `/api/dashboard/schedule` | Today's schedule | All |
| `GET`  | `/api/dashboard/summary-stats` | Summary donut chart data | All |

### 🎓 School Admin — `/api/admin`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/admin/academic-years` | List academic years | school_admin+ |
| `POST` | `/api/admin/academic-years` | Create academic year | school_admin+ |
| `PUT`  | `/api/admin/academic-years/:id` | Update academic year | school_admin+ |
| `DELETE` | `/api/admin/academic-years/:id` | Delete academic year | school_admin+ |
| `GET`  | `/api/admin/terms` | List terms | school_admin+ |
| `POST` | `/api/admin/terms` | Create term | school_admin+ |
| `PUT`  | `/api/admin/terms/:id` | Update term | school_admin+ |
| `DELETE` | `/api/admin/terms/:id` | Delete term | school_admin+ |
| `GET`  | `/api/admin/class-masters` | List class masters | school_admin+ |
| `POST` | `/api/admin/class-masters` | Create class master | school_admin+ |
| `PUT`  | `/api/admin/class-masters/:id` | Update class | school_admin+ |
| `DELETE` | `/api/admin/class-masters/:id` | Delete class | school_admin+ |
| `GET`  | `/api/admin/sections` | List sections | school_admin+ |
| `POST` | `/api/admin/sections` | Create section | school_admin+ |
| `GET`  | `/api/admin/class-year-offerings` | List class-year offerings | school_admin+ |
| `POST` | `/api/admin/class-year-offerings` | Create offering | school_admin+ |
| `GET`  | `/api/admin/curriculum` | Get curriculum/subjects | school_admin+ |
| `POST` | `/api/admin/curriculum` | Add subject to curriculum | school_admin+ |
| `POST` | `/api/admin/enrollment` | Enroll student into class | school_admin+ |
| `POST` | `/api/admin/promotion` | Batch promote students | school_admin+ |
| `GET`  | `/api/admin/id-cards` | Get ID card data | school_admin+ |

### 👨‍🎓 Students Module — `/api/students`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/students` | Paginated student list | school_admin, teacher |
| `POST` | `/api/students` | Register new student | school_admin |
| `GET`  | `/api/students/:id` | Get student detail | school_admin, teacher, parent |
| `PUT`  | `/api/students/:id` | Update student info | school_admin |
| `DELETE` | `/api/students/:id` | Remove student | school_admin |
| `GET`  | `/api/students/:id/enrollments` | Student enrollment history | school_admin, teacher |
| `POST` | `/api/students/:id/enroll` | Enroll in class/year | school_admin |
| `GET`  | `/api/students/:id/parents` | Get student's parents | school_admin, teacher |
| `POST` | `/api/students/:id/avatar` | Upload student avatar | school_admin |
| `GET`  | `/api/students/export` | Export students CSV/Excel | school_admin |

### 👪 Parents Module — `/api/parents`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/parents` | List all parents | school_admin |
| `POST` | `/api/parents` | Add parent/guardian | school_admin |
| `GET`  | `/api/parents/:id` | Get parent details | school_admin |
| `PUT`  | `/api/parents/:id` | Update parent info | school_admin |
| `DELETE` | `/api/parents/:id` | Remove parent | school_admin |
| `POST` | `/api/parents/:id/link` | Link parent to student | school_admin |
| `DELETE` | `/api/parents/:id/unlink/:studentId` | Unlink parent from student | school_admin |

### 📚 Academics Module — `/api/academics`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/academics/timetable` | Get timetable (by class/teacher) | All |
| `POST` | `/api/academics/timetable` | Create timetable slot | school_admin |
| `PUT`  | `/api/academics/timetable/:id` | Update slot | school_admin |
| `DELETE` | `/api/academics/timetable/:id` | Delete slot | school_admin |
| `POST` | `/api/academics/timetable/generate` | AI timetable generation | school_admin |
| `GET`  | `/api/academics/assignments` | List assignments | teacher, student, parent |
| `POST` | `/api/academics/assignments` | Create assignment | teacher |
| `PUT`  | `/api/academics/assignments/:id` | Update assignment | teacher |
| `DELETE` | `/api/academics/assignments/:id` | Delete assignment | teacher, school_admin |
| `POST` | `/api/academics/assignments/:id/submit` | Student submits | student |
| `PUT`  | `/api/academics/assignments/:id/grade` | Grade submission | teacher |
| `GET`  | `/api/academics/absentees` | Today's absentees | teacher, school_admin |
| `GET`  | `/api/academics/rankings` | Student rankings | school_admin, teacher |
| `GET`  | `/api/academics/analytics` | Academic analytics | school_admin, teacher |
| `GET`  | `/api/academics/electives` | List electives | All |
| `POST` | `/api/academics/electives` | Create elective | school_admin |
| `GET`  | `/api/academics/learning-outcomes` | Get learning outcomes | All |
| `POST` | `/api/academics/learning-outcomes` | Add outcome | school_admin, teacher |

### 📝 Exams Module — `/api/exams`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/exams` | List exams | All |
| `POST` | `/api/exams` | Create exam | school_admin |
| `GET`  | `/api/exams/:id` | Exam detail + schedule | All |
| `PUT`  | `/api/exams/:id` | Update exam | school_admin |
| `DELETE` | `/api/exams/:id` | Delete exam | school_admin |
| `GET`  | `/api/exams/:id/schedule` | Get exam timetable | All |
| `POST` | `/api/exams/:id/schedule` | Add exam schedule | school_admin |
| `POST` | `/api/exams/:id/results` | Bulk enter marks | teacher |
| `PUT`  | `/api/exams/:id/results/:studentId` | Edit a result | teacher, school_admin |
| `GET`  | `/api/exams/:id/report-cards` | Generate report cards | school_admin, teacher |
| `GET`  | `/api/exams/results/:studentId` | Student's results history | student, parent |

### 📅 Attendance Module — `/api/attendance`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/attendance/students` | Student attendance list | teacher, school_admin |
| `POST` | `/api/attendance/students` | Mark student attendance | teacher |
| `PUT`  | `/api/attendance/students/:id` | Correct attendance | school_admin |
| `GET`  | `/api/attendance/students/summary` | Class attendance summary | teacher, school_admin |
| `GET`  | `/api/attendance/students/:studentId` | Individual report | student, parent |
| `GET`  | `/api/attendance/staff` | Staff attendance | hr_manager |
| `POST` | `/api/attendance/staff` | Record staff check-in | hr_manager |
| `GET`  | `/api/attendance/live` | Live attendance dashboard | school_admin, teacher |
| `GET`  | `/api/attendance/analytics` | AI attendance analytics | school_admin |
| `GET`  | `/api/attendance/export` | Export attendance report | school_admin |

### 📋 Admissions Module — `/api/admissions`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/admissions` | Kanban board data | school_admin |
| `POST` | `/api/admissions` | Create inquiry/application | school_admin, Public |
| `GET`  | `/api/admissions/:id` | Application detail | school_admin |
| `PUT`  | `/api/admissions/:id` | Update application | school_admin |
| `PUT`  | `/api/admissions/:id/status` | Move Kanban stage | school_admin |
| `DELETE` | `/api/admissions/:id` | Remove application | school_admin |
| `POST` | `/api/admissions/:id/convert` | Convert to student | school_admin |
| `GET`  | `/api/admissions/export` | Export admissions data | school_admin |

### 💰 Finance Module — `/api/finance`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/finance/categories` | List fee categories | accountant, school_admin |
| `POST` | `/api/finance/categories` | Create category | accountant, school_admin |
| `PUT`  | `/api/finance/categories/:id` | Update category | accountant |
| `DELETE` | `/api/finance/categories/:id` | Delete category | school_admin |
| `GET`  | `/api/finance/structures` | List fee structures | accountant, school_admin |
| `POST` | `/api/finance/structures` | Create fee structure | accountant |
| `PUT`  | `/api/finance/structures/:id` | Update structure | accountant |
| `DELETE` | `/api/finance/structures/:id` | Delete structure | school_admin |
| `GET`  | `/api/finance/invoices` | Paginated invoices | accountant, school_admin |
| `POST` | `/api/finance/invoices` | Create invoice | accountant |
| `GET`  | `/api/finance/invoices/:id` | Invoice detail | accountant, parent |
| `PUT`  | `/api/finance/invoices/:id` | Update invoice | accountant |
| `GET`  | `/api/finance/student-fees/:studentId` | Student fee summary | accountant, parent |
| `POST` | `/api/finance/payments` | Record payment | accountant |
| `GET`  | `/api/finance/payments/:id` | Payment detail + receipt | accountant, parent |
| `GET`  | `/api/finance/receipt/:id` | Generate PDF receipt | accountant, parent |
| `POST` | `/api/finance/pay-online` | Initiate online payment | parent, student |
| `POST` | `/api/finance/pay-online/webhook` | Payment gateway webhook | System |
| `GET`  | `/api/finance/scholarships` | List scholarships | accountant |
| `POST` | `/api/finance/scholarships` | Apply scholarship | accountant |
| `GET`  | `/api/finance/reports/daily` | Daily collection report | accountant |
| `GET`  | `/api/finance/reports/overdue` | Overdue accounts list | accountant |

### 👔 HR Module — `/api/hr`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/hr/staff` | Staff directory | hr_manager, school_admin |
| `POST` | `/api/hr/staff` | Add staff member | hr_manager |
| `GET`  | `/api/hr/staff/:id` | Staff profile | hr_manager, school_admin |
| `PUT`  | `/api/hr/staff/:id` | Update staff | hr_manager |
| `DELETE` | `/api/hr/staff/:id` | Remove staff | school_admin |
| `POST` | `/api/hr/staff/:id/avatar` | Upload avatar | hr_manager |
| `GET`  | `/api/hr/leave` | Leave requests list | hr_manager |
| `POST` | `/api/hr/leave` | Submit leave request | All staff |
| `GET`  | `/api/hr/leave/:id` | Leave detail | hr_manager |
| `PUT`  | `/api/hr/leave/:id/approve` | Approve leave | hr_manager, school_admin |
| `PUT`  | `/api/hr/leave/:id/reject` | Reject leave | hr_manager, school_admin |
| `GET`  | `/api/hr/attendance` | Staff attendance | hr_manager |
| `POST` | `/api/hr/attendance` | Record attendance | hr_manager |
| `GET`  | `/api/hr/attendance/export` | Export to Excel | hr_manager |

### 💸 Payroll Module — `/api/payroll`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/payroll/runs` | List payroll runs | accountant, hr_manager |
| `POST` | `/api/payroll/runs` | Start payroll run | accountant, hr_manager |
| `GET`  | `/api/payroll/runs/:id` | Payroll run detail | accountant |
| `POST` | `/api/payroll/runs/:id/approve` | Approve payroll | school_admin |
| `POST` | `/api/payroll/runs/:id/process` | Process/mark as paid | accountant |
| `GET`  | `/api/payroll/payslips/:staffId` | Staff payslip history | hr_manager, staff |
| `GET`  | `/api/payroll/payslips/:id/pdf` | Download payslip PDF | hr_manager, staff |

### 🚌 Transport Module — `/api/transport`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/transport/vehicles` | Fleet list | transport_manager, school_admin |
| `POST` | `/api/transport/vehicles` | Add vehicle | transport_manager |
| `PUT`  | `/api/transport/vehicles/:id` | Update vehicle | transport_manager |
| `DELETE` | `/api/transport/vehicles/:id` | Remove vehicle | school_admin |
| `GET`  | `/api/transport/routes` | Routes list | transport_manager, parent |
| `POST` | `/api/transport/routes` | Create route | transport_manager |
| `PUT`  | `/api/transport/routes/:id` | Update route | transport_manager |
| `GET`  | `/api/transport/routes/:id/stops` | Route stops | All |
| `POST` | `/api/transport/routes/:id/stops` | Add stop | transport_manager |
| `GET`  | `/api/transport/trips` | Today's trips | transport_manager |
| `POST` | `/api/transport/trips` | Create trip | transport_manager |
| `PUT`  | `/api/transport/trips/:id/status` | Update trip status | transport_manager, driver |
| `GET`  | `/api/transport/gps/:vehicleId` | Live GPS location | All |
| `GET`  | `/api/transport/students` | Students with transport | transport_manager |
| `POST` | `/api/transport/students` | Assign student to route | transport_manager |
| `GET`  | `/api/transport/maintenance-alerts` | Maintenance alerts | transport_manager |
| `POST` | `/api/transport/maintenance-alerts` | Create alert | transport_manager |

### 📖 Library Module — `/api/library`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/library/books` | Book catalogue | librarian, All |
| `POST` | `/api/library/books` | Add book | librarian |
| `PUT`  | `/api/library/books/:id` | Update book info | librarian |
| `DELETE` | `/api/library/books/:id` | Remove book | librarian |
| `POST` | `/api/library/books/:id/issue` | Issue book to borrower | librarian |
| `POST` | `/api/library/issues/:id/return` | Return book | librarian |
| `GET`  | `/api/library/issues` | All issued books | librarian |
| `GET`  | `/api/library/issues/overdue` | Overdue books list | librarian |
| `GET`  | `/api/library/issues/:userId` | User's issued books | All |
| `POST` | `/api/library/fines/:issueId/pay` | Pay overdue fine | librarian |
| `GET`  | `/api/library/stats` | Circulation statistics | librarian |

### 🏠 Hostel Module — `/api/hostel`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/hostel/blocks` | Block list | hostel_warden |
| `POST` | `/api/hostel/blocks` | Create block | school_admin |
| `GET`  | `/api/hostel/rooms` | Rooms with occupancy | hostel_warden |
| `POST` | `/api/hostel/rooms` | Create room | hostel_warden |
| `PUT`  | `/api/hostel/rooms/:id` | Update room | hostel_warden |
| `GET`  | `/api/hostel/allocations` | Current allocations | hostel_warden |
| `POST` | `/api/hostel/allocations` | Allocate student to room | hostel_warden |
| `PUT`  | `/api/hostel/allocations/:id` | Update/checkout | hostel_warden |
| `GET`  | `/api/hostel/incidents` | Incidents list | hostel_warden |
| `POST` | `/api/hostel/incidents` | Log incident | hostel_warden |
| `PUT`  | `/api/hostel/incidents/:id` | Update incident status | hostel_warden |
| `GET`  | `/api/hostel/visitors` | Visitor log | hostel_warden |
| `POST` | `/api/hostel/visitors` | Log visitor entry | hostel_warden |
| `PUT`  | `/api/hostel/visitors/:id/checkout` | Log visitor exit | hostel_warden |
| `GET`  | `/api/hostel/stats` | Occupancy stats | hostel_warden |

### 📦 Inventory Module — `/api/inventory`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/inventory/items` | Item catalogue | accountant, school_admin |
| `POST` | `/api/inventory/items` | Add item | accountant |
| `PUT`  | `/api/inventory/items/:id` | Update item | accountant |
| `DELETE` | `/api/inventory/items/:id` | Remove item | school_admin |
| `GET`  | `/api/inventory/categories` | Item categories | All |
| `POST` | `/api/inventory/stock-in` | Record stock purchase | accountant |
| `POST` | `/api/inventory/stock-out` | Record stock usage | accountant |
| `GET`  | `/api/inventory/transactions` | Transaction history | accountant |
| `GET`  | `/api/inventory/low-stock` | Low stock alerts | accountant |

### 📢 Communication Module — `/api/communication`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/communication/notices` | Notice board list | All |
| `POST` | `/api/communication/notices` | Post notice | school_admin, teacher |
| `PUT`  | `/api/communication/notices/:id` | Update notice | school_admin, teacher |
| `DELETE` | `/api/communication/notices/:id` | Delete notice | school_admin |
| `GET`  | `/api/communication/messages` | Inbox messages | Authenticated |
| `POST` | `/api/communication/messages` | Send message | Authenticated |
| `GET`  | `/api/communication/messages/:id` | Read message | Authenticated |
| `DELETE` | `/api/communication/messages/:id` | Delete message | Authenticated |
| `GET`  | `/api/communication/notifications` | User notifications | Authenticated |
| `PUT`  | `/api/communication/notifications/:id/read` | Mark read | Authenticated |
| `PUT`  | `/api/communication/notifications/read-all` | Mark all read | Authenticated |
| `POST` | `/api/communication/sms/send` | Send SMS bulk | school_admin |
| `GET`  | `/api/communication/sms/logs` | SMS log | school_admin |

### 📈 Reports Module — `/api/reports`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/reports/student` | Student performance report | school_admin, teacher |
| `GET`  | `/api/reports/attendance` | Attendance report | school_admin |
| `GET`  | `/api/reports/financial` | Financial report | accountant, school_admin |
| `GET`  | `/api/reports/performance` | Class performance analytics | school_admin |
| `POST` | `/api/reports/export` | Export any report | school_admin, accountant |

### 🎓 LMS Module — `/api/lms`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/lms/courses` | Course list | All |
| `POST` | `/api/lms/courses` | Create course | teacher |
| `GET`  | `/api/lms/courses/:id` | Course detail | All |
| `PUT`  | `/api/lms/courses/:id` | Update course | teacher |
| `POST` | `/api/lms/courses/:id/content` | Add content module | teacher |
| `GET`  | `/api/lms/live-classes` | Scheduled live classes | All |
| `POST` | `/api/lms/live-classes` | Schedule live class | teacher |
| `POST` | `/api/lms/live-classes/:id/join` | Join live class | student, teacher |
| `GET`  | `/api/lms/assessments` | Online assessments | All |
| `POST` | `/api/lms/assessments` | Create assessment | teacher |
| `POST` | `/api/lms/assessments/:id/submit` | Submit assessment answers | student |

### 🎖 Certificates Module — `/api/certificates`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/certificates/templates` | Certificate templates | school_admin |
| `POST` | `/api/certificates/templates` | Create template | school_admin |
| `POST` | `/api/certificates/generate` | Generate certificate PDF | school_admin |
| `GET`  | `/api/certificates/:studentId` | Student's certificates | school_admin, parent |

### 📝 Audit Log — `/api/audit`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET`  | `/api/audit/logs` | Paginated audit log | school_admin, super_admin |
| `GET`  | `/api/audit/logs/:id` | Audit event detail | school_admin, super_admin |
| `GET`  | `/api/audit/export` | Export audit log | super_admin |

---

## 5. Authentication & RBAC Middleware

```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const ROLES = [
  'super_admin','school_admin','accountant','hr_manager',
  'teacher','librarian','hostel_warden','transport_manager',
  'parent','student'
];

/**
 * verifyToken — validates JWT from HttpOnly cookie
 * Attaches req.user = { id, email, role, tenantId }
 */
async function verifyToken(req, res, next) {
  try {
    const token = req.cookies?.access_token;
    if (!token) return res.status(401).json({ error: { message: 'Unauthorized' } });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: { message: 'Token expired or invalid' } });
  }
}

/**
 * requireRole(...roles) — RBAC gate
 * Usage: router.get('/resource', verifyToken, requireRole('school_admin','teacher'), handler)
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: { message: 'Unauthorized' } });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Forbidden — insufficient role' } });
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };
```

```javascript
// src/middleware/tenant.js
const { pool } = require('../config/db');

/**
 * resolveTenant — attaches req.tenantId from the authenticated user
 * For super_admin calls that target a specific tenant, reads from header.
 */
async function resolveTenant(req, res, next) {
  try {
    if (req.user.role === 'super_admin') {
      req.tenantId = req.headers['x-tenant-id'] || req.user.tenantId;
    } else {
      req.tenantId = req.user.tenantId;
    }
    if (!req.tenantId) {
      return res.status(400).json({ error: { message: 'Tenant context missing' } });
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { resolveTenant };
```

---

## 6. Node.js Route Files

### 📄 src/app.js

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ── Security & Performance ───────────────────────────
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate Limiter ────────────────────────────────────
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api', limiter);

// ── Routes ──────────────────────────────────────────
app.use('/api/auth',           require('./routes/auth'));
app.use('/api/tenant',         require('./routes/tenant'));
app.use('/api/dashboard',      require('./routes/dashboard'));
app.use('/api/admin',          require('./routes/schoolAdmin'));
app.use('/api/students',       require('./routes/students'));
app.use('/api/parents',        require('./routes/parents'));
app.use('/api/academics',      require('./routes/academics'));
app.use('/api/exams',          require('./routes/exams'));
app.use('/api/attendance',     require('./routes/attendance'));
app.use('/api/admissions',     require('./routes/admissions'));
app.use('/api/finance',        require('./routes/finance'));
app.use('/api/hr',             require('./routes/hr'));
app.use('/api/payroll',        require('./routes/payroll'));
app.use('/api/transport',      require('./routes/transport'));
app.use('/api/library',        require('./routes/library'));
app.use('/api/hostel',         require('./routes/hostel'));
app.use('/api/inventory',      require('./routes/inventory'));
app.use('/api/communication',  require('./routes/communication'));
app.use('/api/reports',        require('./routes/reports'));
app.use('/api/lms',            require('./routes/lms'));
app.use('/api/certificates',   require('./routes/certificates'));
app.use('/api/audit',          require('./routes/audit'));

// ── Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: { message: err.message || 'Internal Server Error' }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));

module.exports = app;
```

### 📄 src/routes/auth.js

```javascript
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { verifyToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000,  // 15 minutes
};

// POST /api/auth/login
router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: { message: 'Validation failed', details: errors.array() } });

    const { email, password } = req.body;
    const result = await pool.query(
      `SELECT u.*, t.school_code FROM users u
       LEFT JOIN tenants t ON t.id = u.tenant_id
       WHERE u.email = $1 AND u.is_active = true`,
      [email]
    );
    const user = result.rows[0];
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    const payload = { id: user.id, email: user.email, role: user.role, tenantId: user.tenant_id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Store refresh token hash in DB
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [user.id, await bcrypt.hash(refreshToken, 8)]
    );

    // Audit log
    await pool.query(
      `INSERT INTO audit_logs (tenant_id, user_id, action, module, ip_address)
       VALUES ($1, $2, 'LOGIN', 'auth', $3)`,
      [user.tenant_id, user.id, req.ip]
    );

    await pool.query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [user.id]);

    res.cookie('access_token', accessToken, COOKIE_OPTS);
    res.cookie('refresh_token', refreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({
      user: { id: user.id, email: user.email, role: user.role, firstName: user.first_name, lastName: user.last_name, avatarUrl: user.avatar_url },
      school: { code: user.school_code, tenantId: user.tenant_id }
    });
  }
);

// POST /api/auth/logout
router.post('/logout', verifyToken, async (req, res) => {
  await pool.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [req.user.id]);
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req, res) => {
  const result = await pool.query(
    `SELECT id, email, role, first_name, last_name, phone, avatar_url, tenant_id, is_email_verified
     FROM users WHERE id = $1`,
    [req.user.id]
  );
  res.json({ user: result.rows[0] });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', body('email').isEmail(), async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await pool.query(
    `UPDATE users SET otp_code = $1, otp_expires_at = $2 WHERE email = $3`,
    [otp, expiresAt, email]
  );

  // TODO: Send OTP via nodemailer/twilio
  // await sendOtpEmail(email, otp);
  res.json({ message: 'OTP sent to your email' });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const result = await pool.query(
    `SELECT id FROM users WHERE email = $1 AND otp_code = $2 AND otp_expires_at > NOW()`,
    [email, otp]
  );
  if (!result.rows[0]) return res.status(400).json({ error: { message: 'Invalid or expired OTP' } });

  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });
  await pool.query(`UPDATE users SET otp_code = NULL WHERE email = $1`, [email]);
  res.json({ reset_token: resetToken });
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { reset_token, password } = req.body;
  try {
    const decoded = jwt.verify(reset_token, process.env.JWT_SECRET);
    const hash = await bcrypt.hash(password, 12);
    await pool.query(`UPDATE users SET password_hash = $1 WHERE email = $2`, [hash, decoded.email]);
    res.json({ message: 'Password reset successful' });
  } catch {
    res.status(400).json({ error: { message: 'Invalid reset token' } });
  }
});

module.exports = router;
```

### 📄 src/routes/students.js

```javascript
const router = require('express').Router();
const { pool } = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');
const { resolveTenant } = require('../middleware/tenant');

router.use(verifyToken, resolveTenant);

// GET /api/students  — paginated list
router.get('/', requireRole('super_admin','school_admin','teacher','hr_manager'), async (req, res) => {
  const { page = 1, limit = 20, status, class_id, search, academic_year_id } = req.query;
  const offset = (page - 1) * limit;

  let where = `WHERE s.tenant_id = $1`;
  const params = [req.tenantId];
  let idx = 2;

  if (status) { where += ` AND s.status = $${idx++}`; params.push(status); }
  if (search) { where += ` AND (s.first_name ILIKE $${idx} OR s.last_name ILIKE $${idx} OR s.student_id ILIKE $${idx})`; params.push(`%${search}%`); idx++; }

  const countResult = await pool.query(`SELECT COUNT(*) FROM students s ${where}`, params);
  const dataResult = await pool.query(
    `SELECT s.*, u.avatar_url FROM students s LEFT JOIN users u ON u.id = s.user_id ${where}
     ORDER BY s.created_at DESC LIMIT $${idx} OFFSET $${idx+1}`,
    [...params, limit, offset]
  );

  res.json({
    data: dataResult.rows,
    meta: { total: parseInt(countResult.rows[0].count), page: +page, limit: +limit }
  });
});

// POST /api/students  — create student
router.post('/', requireRole('super_admin','school_admin'), async (req, res) => {
  const { first_name, last_name, date_of_birth, gender, blood_group, address,
          city, state, country, pin_code, admission_date, national_id } = req.body;

  const year = new Date().getFullYear();
  const countRes = await pool.query(`SELECT COUNT(*) FROM students WHERE tenant_id = $1`, [req.tenantId]);
  const seq = parseInt(countRes.rows[0].count) + 1;
  const student_id = `STU-${year}-${seq.toString().padStart(4, '0')}`;

  const result = await pool.query(
    `INSERT INTO students (tenant_id, student_id, national_id, first_name, last_name,
       date_of_birth, gender, blood_group, address, city, state, country, pin_code, admission_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
    [req.tenantId, student_id, national_id, first_name, last_name,
     date_of_birth, gender, blood_group, address, city, state, country, pin_code, admission_date]
  );

  // Audit
  await pool.query(`INSERT INTO audit_logs (tenant_id, user_id, action, module, entity_type, entity_id, new_value)
    VALUES ($1,$2,'CREATE','students','student',$3,$4)`,
    [req.tenantId, req.user.id, result.rows[0].id, JSON.stringify(result.rows[0])]
  );

  res.status(201).json({ student: result.rows[0] });
});

// GET /api/students/:id
router.get('/:id', async (req, res) => {
  const result = await pool.query(
    `SELECT s.*, u.email, u.avatar_url FROM students s
     LEFT JOIN users u ON u.id = s.user_id
     WHERE s.id = $1 AND s.tenant_id = $2`,
    [req.params.id, req.tenantId]
  );
  if (!result.rows[0]) return res.status(404).json({ error: { message: 'Student not found' } });
  res.json({ student: result.rows[0] });
});

// PUT /api/students/:id
router.put('/:id', requireRole('super_admin','school_admin'), async (req, res) => {
  const { first_name, last_name, date_of_birth, gender, blood_group,
          address, city, state, country, pin_code, status } = req.body;
  const result = await pool.query(
    `UPDATE students SET first_name=$1, last_name=$2, date_of_birth=$3, gender=$4,
       blood_group=$5, address=$6, city=$7, state=$8, country=$9, pin_code=$10, status=$11,
       updated_at=NOW()
     WHERE id=$12 AND tenant_id=$13 RETURNING *`,
    [first_name, last_name, date_of_birth, gender, blood_group,
     address, city, state, country, pin_code, status, req.params.id, req.tenantId]
  );
  if (!result.rows[0]) return res.status(404).json({ error: { message: 'Student not found' } });
  res.json({ student: result.rows[0] });
});

// DELETE /api/students/:id
router.delete('/:id', requireRole('super_admin','school_admin'), async (req, res) => {
  await pool.query(`UPDATE students SET status='withdrawn', updated_at=NOW() WHERE id=$1 AND tenant_id=$2`,
    [req.params.id, req.tenantId]);
  res.json({ message: 'Student withdrawn successfully' });
});

module.exports = router;
```

### 📄 src/routes/finance.js (excerpt)

```javascript
const router = require('express').Router();
const { pool } = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');
const { resolveTenant } = require('../middleware/tenant');
const { v4: uuidv4 } = require('uuid');

router.use(verifyToken, resolveTenant);

// GET /api/finance/invoices
router.get('/invoices', requireRole('super_admin','school_admin','accountant'), async (req, res) => {
  const { page = 1, limit = 20, status, student_id } = req.query;
  const offset = (page - 1) * limit;
  let where = `WHERE i.tenant_id = $1`;
  const params = [req.tenantId];
  let idx = 2;
  if (status) { where += ` AND i.status = $${idx++}`; params.push(status); }
  if (student_id) { where += ` AND i.student_id = $${idx++}`; params.push(student_id); }

  const count = await pool.query(`SELECT COUNT(*) FROM invoices i ${where}`, params);
  const data = await pool.query(
    `SELECT i.*, s.first_name || ' ' || s.last_name AS student_name, s.student_id AS student_code
     FROM invoices i JOIN students s ON s.id = i.student_id
     ${where} ORDER BY i.created_at DESC LIMIT $${idx} OFFSET $${idx+1}`,
    [...params, limit, offset]
  );
  res.json({ data: data.rows, meta: { total: +count.rows[0].count, page: +page, limit: +limit } });
});

// POST /api/finance/payments — record a payment
router.post('/payments', requireRole('super_admin','school_admin','accountant'), async (req, res) => {
  const { invoice_id, amount, payment_method, transaction_ref, payment_date, notes } = req.body;

  const inv = await pool.query(`SELECT * FROM invoices WHERE id=$1 AND tenant_id=$2`, [invoice_id, req.tenantId]);
  if (!inv.rows[0]) return res.status(404).json({ error: { message: 'Invoice not found' } });

  const invoice = inv.rows[0];
  const new_paid = parseFloat(invoice.amount_paid) + parseFloat(amount);
  const new_balance = parseFloat(invoice.net_amount) - new_paid;
  const status = new_balance <= 0 ? 'Paid In Full' : 'Partially Paid';

  const seq = await pool.query(`SELECT COUNT(*) FROM payments WHERE tenant_id=$1`, [req.tenantId]);
  const receipt_number = `RCP-${new Date().getFullYear()}-${(+seq.rows[0].count + 1).toString().padStart(5,'0')}`;

  const payment = await pool.query(
    `INSERT INTO payments (tenant_id, invoice_id, student_id, amount, payment_method,
       transaction_ref, receipt_number, payment_date, recorded_by, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [req.tenantId, invoice_id, invoice.student_id, amount, payment_method,
     transaction_ref, receipt_number, payment_date || new Date(), req.user.id, notes]
  );

  await pool.query(
    `UPDATE invoices SET amount_paid=$1, balance=$2, status=$3, updated_at=NOW() WHERE id=$4`,
    [new_paid, new_balance, status, invoice_id]
  );

  res.status(201).json({ payment: payment.rows[0] });
});

module.exports = router;
```

### 📄 src/routes/dashboard.js

```javascript
const router = require('express').Router();
const { pool } = require('../config/db');
const { verifyToken } = require('../middleware/auth');
const { resolveTenant } = require('../middleware/tenant');

router.use(verifyToken, resolveTenant);

// GET /api/dashboard/kpis — Role-specific KPIs
router.get('/kpis', async (req, res) => {
  const { role, tenantId } = req.user;
  let kpis = {};

  if (role === 'school_admin' || role === 'super_admin') {
    const [students, staff, revenue, classes] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM students WHERE tenant_id=$1 AND status='active'`, [tenantId]),
      pool.query(`SELECT COUNT(*) FROM staff WHERE tenant_id=$1 AND is_active=true`, [tenantId]),
      pool.query(`SELECT COALESCE(SUM(amount_paid),0) AS total FROM invoices WHERE tenant_id=$1`, [tenantId]),
      pool.query(`SELECT COUNT(*) FROM class_year_offerings WHERE tenant_id=$1`, [tenantId]),
    ]);
    kpis = {
      totalStudents: students.rows[0].count,
      teachingStaff: staff.rows[0].count,
      termRevenue: revenue.rows[0].total,
      activeClasses: classes.rows[0].count,
    };
  } else if (role === 'accountant') {
    const [daily, overdue, collectionPct, payroll] = await Promise.all([
      pool.query(`SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE tenant_id=$1 AND payment_date=CURRENT_DATE`, [tenantId]),
      pool.query(`SELECT COUNT(*) FROM invoices WHERE tenant_id=$1 AND status='Not Paid' AND due_date < CURRENT_DATE`, [tenantId]),
      pool.query(`SELECT ROUND(AVG(CASE WHEN status='Paid In Full' THEN 100 ELSE amount_paid/NULLIF(net_amount,0)*100 END),1) AS pct FROM invoices WHERE tenant_id=$1`, [tenantId]),
      pool.query(`SELECT COALESCE(SUM(net_salary),0) as total FROM payslips ps JOIN payroll_runs pr ON pr.id=ps.payroll_run_id WHERE pr.tenant_id=$1 AND pr.status='approved'`, [tenantId]),
    ]);
    kpis = { dailyCollections: daily.rows[0].total, overdueAccounts: overdue.rows[0].count, termCollectionPct: collectionPct.rows[0].pct, payrollPending: payroll.rows[0].total };
  } else if (role === 'teacher') {
    const teacherId = req.user.id;
    const [students, classes, pendingGrades, attendance] = await Promise.all([
      pool.query(`SELECT COUNT(DISTINCT se.student_id) FROM student_enrollments se JOIN class_year_offerings cyo ON cyo.id=se.class_offering_id WHERE cyo.teacher_id=$1`, [teacherId]),
      pool.query(`SELECT COUNT(*) FROM timetable_slots WHERE teacher_id=$1 AND day_of_week=EXTRACT(DOW FROM NOW())`, [teacherId]),
      pool.query(`SELECT COUNT(*) FROM assignment_submissions WHERE status='pending' AND assignment_id IN (SELECT id FROM assignments WHERE teacher_id=$1)`, [teacherId]),
      pool.query(`SELECT ROUND(AVG(CASE WHEN status='present' THEN 100 ELSE 0 END),1) AS avg FROM student_attendance sa JOIN class_year_offerings cyo ON cyo.id=sa.class_offering_id WHERE cyo.teacher_id=$1`, [teacherId]),
    ]);
    kpis = { myStudents: students.rows[0].count, classesToday: classes.rows[0].count, pendingGrades: pendingGrades.rows[0].count, avgAttendance: attendance.rows[0].avg };
  }
  // Add similar blocks for other roles...

  res.json({ kpis });
});

module.exports = router;
```

---

## 7. Environment Configuration

```bash
# .env

NODE_ENV=development
PORT=3000

# Frontend
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://school_user:password@localhost:5432/school_erp
DB_POOL_MAX=20

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-64-chars
JWT_REFRESH_SECRET=another-super-secret-refresh-key-min-64-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=app-specific-password
SMTP_FROM=noreply@schoolerp.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxx
TWILIO_PHONE=+1234567890

# File Storage (AWS S3 / Supabase Storage)
S3_BUCKET=school-erp-uploads
S3_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Payment Gateway (Razorpay / Stripe)
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your-secret

# AI / Gemini (for AI timetable & analytics)
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# GPS/Tracking
GPS_WEBSOCKET_PORT=3001
```

---

## 📦 Quick Setup Commands

```bash
# 1. Initialize Node.js backend
mkdir school-erp-backend && cd school-erp-backend
npm init -y
npm install express pg redis jsonwebtoken bcryptjs cookie-parser cors helmet \
  express-rate-limit express-validator multer nodemailer uuid dotenv morgan \
  compression socket.io node-cron pdfkit exceljs

# 2. Create PostgreSQL database
createdb school_erp

# 3. Run all migrations in order
psql -d school_erp -f db/migrations/001_tenants.sql
psql -d school_erp -f db/migrations/002_users.sql
psql -d school_erp -f db/migrations/003_school_setup.sql
psql -d school_erp -f db/migrations/004_students.sql
psql -d school_erp -f db/migrations/005_academics.sql
psql -d school_erp -f db/migrations/006_attendance.sql
psql -d school_erp -f db/migrations/007_finance.sql
psql -d school_erp -f db/migrations/008_hr.sql
psql -d school_erp -f db/migrations/009_transport.sql
psql -d school_erp -f db/migrations/010_library.sql
psql -d school_erp -f db/migrations/011_hostel.sql
psql -d school_erp -f db/migrations/012_communication.sql
psql -d school_erp -f db/migrations/013_admissions.sql
psql -d school_erp -f db/migrations/014_inventory.sql
psql -d school_erp -f db/migrations/015_lms.sql
psql -d school_erp -f db/migrations/016_certificates.sql

# 4. Run seed (demo tenant + super_admin user)
psql -d school_erp -f db/seed/seed.sql

# 5. Start development server
npm run dev
```

---

## 🌱 Seed Script

```sql
-- db/seed/seed.sql

-- Create demo tenant
INSERT INTO tenants (school_code, school_name, primary_color, timezone, currency, currency_symbol, locale)
VALUES ('DEMO', 'Smart School ERP Demo', '#f59e0b', 'Asia/Kolkata', 'INR', '₹', 'en-IN');

-- Create super admin (password: Admin@123)
INSERT INTO users (tenant_id, email, password_hash, role, first_name, last_name, is_active, is_email_verified)
SELECT id, 'super@schoolerp.com',
  '$2a$12$RmJoUj8ZTlQEBbJSqU4XmeDHQ7nV2xGpAXI8o1H6vqYIvCHvV0e1.', -- bcrypt of 'Admin@123'
  'super_admin', 'Super', 'Admin', TRUE, TRUE
FROM tenants WHERE school_code = 'DEMO';

-- Create school admin (password: Admin@123)
INSERT INTO users (tenant_id, email, password_hash, role, first_name, last_name, is_active, is_email_verified)
SELECT id, 'admin@demo.schoolerp.com',
  '$2a$12$RmJoUj8ZTlQEBbJSqU4XmeDHQ7nV2xGpAXI8o1H6vqYIvCHvV0e1.',
  'school_admin', 'School', 'Admin', TRUE, TRUE
FROM tenants WHERE school_code = 'DEMO';

-- Demo academic year
INSERT INTO academic_years (tenant_id, name, start_date, end_date, is_current)
SELECT id, '2026-27', '2026-04-01', '2027-03-31', TRUE
FROM tenants WHERE school_code = 'DEMO';
```

---

> **Note:** The frontend's `src/lib/axios.ts` is pre-configured to call `http://localhost:3000/api`.
> Set `VITE_API_BASE_URL=http://localhost:3000/api` in your frontend `.env` file.
