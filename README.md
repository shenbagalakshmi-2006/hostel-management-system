# 🏨 Smart Hostel Management System

A production-style, modern, full-stack web application built for a **Computer Science & Engineering (CSE) Mini Project / College Viva Review**. 

The application is built on a clean monorepo architecture featuring an independent **Next.js 14 (App Router) + TypeScript + Tailwind CSS** frontend and a dedicated **Node.js + Express.js + TypeScript + MongoDB (Mongoose)** REST API backend with JWT authentication, role-based authorization, and real-time database-calculated metrics.

---

## 🌟 Highlights & Key Features

### 🛡️ 1. Authentication & Role-Based Access Control (RBAC)
- **Dual Portal Security**: Granular access control for **Admin / Warden** and **Student Residents**.
- **JWT & bcryptjs**: Secure password hashing with salt rounds, standard bearer token validation, and automatic session restoration.
- **1-Click Demo Logins**: Instant credential fillers on `/login` for seamless examiner demonstrations.

### 👥 2. Student Resident Management
- Comprehensive student directory with search (by Name, Student ID, Email) and filtering (by Department and Academic Year).
- **Student 360° Profile**: View academic info, contact info, permanent address, guardian emergency contacts, active room allocation, and entire history of past allocations and complaints.
- Automated creation of student user login credentials upon enrollment.

### 🏢 3. Room Inventory & Live Occupancy Visualizer
- Multi-block support (Block A, Block B...) with room type definitions: *Single, Double, Triple, Four Sharing*.
- **Dynamic Bed Calculations**: Auto-calculates `availableBeds = capacity - occupiedCount`.
- **Status Transitions**: Auto-manages `AVAILABLE`, `PARTIALLY_OCCUPIED`, `FULL`, and `MAINTENANCE` states.
- Live percentage progress bars with bed allocation breakdown.

### 🛏️ 4. Room Allocation & Vacating Engine
- **Capacity Enforcement**: Prevents overbooking; only rooms with available beds can be selected.
- **Single Active Allocation Constraint**: Prevents allocating an already housed student to a second room without vacating or reassigning first.
- **Vacating & Bed Recovery**: Vacating a resident immediately frees up the bed, reverts room status, and archives the allocation timeline.
- **One-Click Reassignment**: Atomically transfers a resident to a new room.

### 🎫 5. Grievance & Maintenance Ticketing System
- Categorized complaints (*Electrical, Plumbing, Cleanliness, Food, Internet, Room, Security, Maintenance*).
- Formatted Unique IDs (`CMP-0001`, `CMP-0002`...).
- Priority classification (*LOW, MEDIUM, HIGH, URGENT*).
- Workflow: Students file complaints and track real-time resolution; Wardens update statuses (*PENDING, IN_PROGRESS, RESOLVED*) and attach resolution remarks.

### 📊 6. Real-Time MongoDB Computed Dashboard
- Computes **Total Students, Total Rooms, Occupied Beds, Available Beds, Pending Complaints, and Resolved Issues** via MongoDB aggregate pipelines.
- Zero fake/hardcoded numbers — everything is calculated live from active collections.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | [Next.js 14](https://nextjs.org/) | React framework utilizing App Router & Server/Client components |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict end-to-end typing on both frontend and backend |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Responsive UI with curated palette (Indigo, Slate, Emerald, Rose) |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent interface icons |
| **Backend** | [Express.js](https://expressjs.com/) | Modular Node.js REST API with Services and Controllers |
| **Database** | [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Document persistence, schemas, hooks, and indexes |
| **Auth** | [JSON Web Tokens (JWT)](https://jwt.io/) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Token authentication and password hashing |

---

## 📁 Monorepo Folder Structure

```
hostel-management-system/
├── package.json               # Root scripts (dev, build, seed, test)
├── .gitignore
├── README.md                  # Project documentation & presentation guide
│
├── backend/                   # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts          # MongoDB connection handler
│   │   ├── models/
│   │   │   ├── User.ts        # User credentials model
│   │   │   ├── Student.ts     # Student profile model
│   │   │   ├── Room.ts        # Room & capacity model
│   │   │   ├── Allocation.ts  # Room allocation link model
│   │   │   └── Complaint.ts   # Maintenance ticket model
│   │   ├── middleware/
│   │   │   ├── auth.ts        # JWT and Role-check middleware
│   │   │   └── errorHandler.ts# Centralized error handler
│   │   ├── services/          # Business logic isolating DB queries
│   │   ├── controllers/       # HTTP request/response handlers
│   │   ├── routes/            # Express router definitions
│   │   ├── utils/
│   │   │   ├── seed.ts        # Realistic hostel sample dataset
│   │   │   └── testRunner.ts  # Automated backend test suite
│   │   ├── types/index.ts     # Shared TypeScript interfaces
│   │   ├── app.ts             # Express app setup & CORS
│   │   └── server.ts          # Entry point listening on port 5000
│   ├── tsconfig.json
│   ├── .env.example
│   └── package.json
│
└── frontend/                  # Next.js 14 App Router Frontend
    ├── app/
    │   ├── page.tsx           # Modern Landing page
    │   ├── login/page.tsx     # Dual-role Login page with demo helper
    │   ├── admin/
    │   │   ├── dashboard/     # Live analytics & occupancy visualizer
    │   │   ├── students/      # Student directory CRUD & modal forms
    │   │   │   └── [id]/      # Student 360° dossier
    │   │   ├── rooms/         # Room inventory & capacity meters
    │   │   ├── allocations/   # Room allocation & vacating desk
    │   │   ├── complaints/    # Complaint tickets & remarks resolution
    │   │   └── profile/       # Admin credentials view
    │   ├── student/
    │   │   ├── dashboard/     # Resident room overview & complaints summary
    │   │   ├── profile/       # Student contact info editor
    │   │   └── complaints/    # Resident grievance reporting & tracking
    │   ├── globals.css        # Tailwind styling & smooth scrollbars
    │   └── layout.tsx         # Root layout with Toast & Auth providers
    ├── components/
    │   ├── layout/            # Responsive Sidebar & Header components
    │   ├── ui/                # Button, Input, Select, Modal, ConfirmDialog, etc.
    │   └── context/           # AuthContext and ToastContext
    ├── services/              # API clients for auth, students, rooms, etc.
    ├── types/                 # Frontend TypeScript definitions
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── .env.example
    └── package.json
```

---

## 🚀 Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [MongoDB](https://www.mongodb.com/) (Local instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 1. Clone & Install Dependencies
Run the following from the root directory:
```bash
npm run install:all
```
*Alternatively, install individually in `backend/` and `frontend/`:*
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment Variables
Create `.env` in `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hostel_management
JWT_SECRET=super_secret_hostel_jwt_key_2026_dev_mode
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Create `.env.local` in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Seed Realistic Sample Data
Populate the database with demo accounts, rooms, allocations, and maintenance complaints:
```bash
npm run seed
```

### 4. Run Development Servers
Start both Backend (`http://localhost:5000`) and Frontend (`http://localhost:3000`) simultaneously:
```bash
npm run dev
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Details |
|---|---|---|---|
| **Admin Warden** | `admin@hostel.com` | `Admin@123` | Full administrative authority across all modules |
| **Student Resident 1** | `rahul.kumar@hostel.com` | `Student@123` | Assigned to Room A-101 (Single), Active complaint |
| **Student Resident 2** | `priya.sharma@hostel.com` | `Student@123` | Assigned to Room B-101 (Single), Resolved ticket |
| **Student Resident 3** | `ankit.verma@hostel.com` | `Student@123` | Assigned to Room A-102 (Double), Urgent complaint |
| **Student (Unallocated)** | `sneha.patel@hostel.com` | `Student@123` | Unallocated (Ideal for testing new room assignment) |

*(Tip: On the `/login` screen, click the **"Admin Warden"** or **"Student Resident"** demo buttons for instant 1-click credential filling!)*

---

## 🧪 Automated Business Logic Tests

The project includes an automated test runner validating the backend models, authentication, and core allocation rules:
```bash
npm run test:backend
```
**Tests Verified:**
1. Password hashing with bcrypt & token issuance
2. Room model capacity, available beds, and status calculations
3. Student enrollment and unique constraints
4. Room allocation capacity validation and status change to `FULL`
5. Prevention of assigning multiple rooms to the same resident
6. Prevention of overbooking full rooms
7. Vacating workflow and bed recovery
8. Complaint ticket generation and status updating

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/login` - Sign in and receive JWT token
- `GET /api/auth/me` - Fetch authenticated user session
- `POST /api/auth/logout` - Clear user session

### Dashboard
- `GET /api/dashboard/stats` - Fetch dynamic database aggregate metrics *(Admin only)*

### Students
- `GET /api/students` - List students with search, filters & pagination *(Admin only)*
- `GET /api/students/:id` - Get student 360° profile with history
- `GET /api/students/profile/me` - Get logged-in student's profile
- `POST /api/students` - Register new student *(Admin only)*
- `PUT /api/students/:id` - Update student profile details
- `DELETE /api/students/:id` - Delete student & vacate active bed *(Admin only)*

### Rooms
- `GET /api/rooms` - List all rooms with filter support
- `GET /api/rooms/:id` - Get room with current occupants & history
- `POST /api/rooms` - Create new room *(Admin only)*
- `PUT /api/rooms/:id` - Update room details or status *(Admin only)*
- `DELETE /api/rooms/:id` - Delete unoccupied room *(Admin only)*

### Allocations
- `GET /api/allocations` - List room allocations *(Admin only)*
- `POST /api/allocations` - Allocate student to room *(Admin only)*
- `POST /api/allocations/:id/vacate` - Vacate resident and free bed *(Admin only)*
- `POST /api/allocations/:id/reassign` - Reassign resident to new room *(Admin only)*

### Complaints
- `GET /api/complaints` - List complaints (Admin: all, Student: own)
- `GET /api/complaints/:id` - Get complaint details
- `POST /api/complaints` - Submit new grievance ticket
- `PUT /api/complaints/:id` - Update status & warden remarks *(Admin only)*
- `DELETE /api/complaints/:id` - Delete complaint ticket *(Admin only)*

---

## 🎓 Viva & CSE Review Defense Points

When presenting this project for your CSE Mini-Project evaluation:
1. **Explain the Separation of Concerns**: Next.js handles server-side rendering and client UI states, while Express acts as a decoupled API gateway talking to MongoDB.
2. **Explain the Allocation Logic**: Detail how the system uses transactional-style validation to check capacity, verify unallocated status, adjust `occupiedCount`, calculate `availableBeds`, and change room status between `AVAILABLE`, `PARTIALLY_OCCUPIED`, and `FULL`.
3. **Highlight Real-Time Aggregations**: Show how `/api/dashboard/stats` utilizes MongoDB `$group` and `$sum` pipelines rather than static counters.
4. **Demonstrate Security**: Point out that passwords are encrypted using `bcrypt`, tokens are checked using Express middleware (`authenticateJWT`, `requireRole`), and student users are prevented from modifying read-only academic identifiers or administrative records.