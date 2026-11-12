🏫 Smart School ERP — Management System
A multi-tenant School Management System (ERP) featuring automated workflows, academic management, role-based access control, fee collections, attendance, ID cards generation, LMS, and parent/student portals.

📁 Repository Structure
school-management/
├── school-frontend/          # React 19 + TypeScript + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── app/              # Router and Providers
│   │   ├── components/       # Layout, RoleGate, UI components
│   │   ├── features/         # Modular feature suites (auth, academics, finance, etc.)
│   │   ├── lib/              # Axios client, authContext, permissions
│   │   └── styles/           # Global styles and Tailwind config
│   ├── package.json
│   └── vite.config.ts        # Configured with proxy to backend (/api -> localhost:5000)
│
├── school-backend/           # Express 5 + Node.js + PostgreSQL Backend
│   ├── db/
│   │   ├── migrations/       # 16 SQL database migration scripts
│   │   └── seed/             # Seed data (demo school, default admin accounts)
│   ├── src/
│   │   ├── config/           # Database pool (PostgreSQL) and environment
│   │   ├── middleware/       # Auth JWT, RBAC, tenant resolver
│   │   ├── routes/           # 24+ REST API module endpoints
│   │   ├── services/         # Business logic routers
│   │   └── server.js         # Express server entry point (port 5000)
│   ├── scripts/              # Migration, seed, and data viewer utilities
│   └── package.json
│
└── package.json              # Root workspace runner scripts
🚀 Quick Start
1. Prerequisites
Node.js (v18 or v20+)
PostgreSQL 14+ (running on port 5432 with database school_erp)
2. Setup Backend
cd school-backend
npm install

# Copy environment template and configure DB credentials
cp .env.example .env

# Run database migrations and seed default data
npm run migrate
npm run seed
3. Setup Frontend
cd ../school-frontend
npm install
4. Run Both Servers
Backend: cd school-backend && npm start (runs on http://localhost:5000)
Frontend: cd school-frontend && npm run dev (runs on http://localhost:3000)
Or run from the root workspace:

npm run start:backend
npm run start:frontend
🔑 Default Credentials
School Code: DEMO
Email: admin@demo.schoolerp.com
Password: Admin@123
