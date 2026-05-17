# 🚀 GigFlow — Smart Leads Dashboard

A production-ready, full-stack **Lead Management Dashboard** built with the **MERN stack** and **TypeScript**. Designed for sales teams to efficiently track, manage, and convert leads through a modern, responsive interface with role-based access control.

> **Live Demo:** [https://leads-management-system-gamma.vercel.app](https://leads-management-system-gamma.vercel.app)  
> **Backend API:** Hosted on [Railway](https://railway.app)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker Setup](#-docker-setup)
  - [Database Seeding](#-database-seeding)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Authentication Flow](#-authentication-flow)
- [Role-Based Access Control](#-role-based-access-control)
- [Frontend Architecture](#-frontend-architecture)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Design Decisions](#-design-decisions)

---

## ✨ Features

### Core Features
- ✅ **JWT Authentication** — Secure login/register with access + refresh token rotation
- ✅ **Leads CRUD** — Create, read, update, and delete leads with full validation
- ✅ **Advanced Filtering** — Filter by status, source, and combine with search simultaneously
- ✅ **Debounced Search** — Real-time search by name or email with input debouncing
- ✅ **Backend Pagination** — Server-side pagination (10 records/page) with `skip`/`limit`
- ✅ **Sorting** — Sort leads by latest or oldest
- ✅ **CSV Export** — Export filtered leads as a downloadable `.csv` file
- ✅ **Role-Based Access Control** — Admin and Sales roles with route-level restrictions
- ✅ **Dark Mode** — Elegant dark-themed UI throughout the application

### UI/UX
- ✅ Responsive design (mobile + desktop)
- ✅ Loading states and skeleton loaders
- ✅ Empty states with helpful messaging
- ✅ Form validation with real-time error feedback
- ✅ Toast-style error notifications
- ✅ Animated page transitions
- ✅ Reusable component library

### Engineering
- ✅ Full TypeScript on both frontend and backend — no `any` abuse
- ✅ Centralized error handling middleware
- ✅ Request validation with `express-validator`
- ✅ Proper interfaces and type definitions throughout
- ✅ Docker + Docker Compose setup
- ✅ Clean, modular folder structure
- ✅ Database indexing for performance

---

## 🛠 Tech Stack

| Layer        | Technology                                                    |
|-------------|---------------------------------------------------------------|
| **Frontend** | React 19, TypeScript, TailwindCSS 4, Vite 8                  |
| **State**    | TanStack React Query v5 (server state), React Hook Form       |
| **Routing**  | React Router DOM v7                                           |
| **Charts**   | Recharts                                                      |
| **Icons**    | Lucide React                                                  |
| **HTTP**     | Axios with interceptors                                       |
| **Backend**  | Node.js, Express 5, TypeScript                                |
| **Database** | MongoDB Atlas + Mongoose 9                                    |
| **Auth**     | JWT (access + refresh tokens), bcryptjs, httpOnly cookies     |
| **Validation**| express-validator                                            |
| **DevOps**   | Docker, Docker Compose, Nginx                                 |
| **Hosting**  | Vercel (frontend), Railway (backend), MongoDB Atlas (database)|

---

## 🏗 Architecture

```
┌──────────────────────┐       HTTPS        ┌──────────────────────┐
│                      │ ◄────────────────► │                      │
│   React Frontend     │   withCredentials  │   Express Backend    │
│   (Vercel)           │   + Bearer Token   │   (Railway)          │
│                      │                    │                      │
│  • TanStack Query    │                    │  • JWT Auth          │
│  • React Router      │                    │  • RBAC Middleware   │
│  • Axios Interceptor │                    │  • Validation Layer  │
│  • React Hook Form   │                    │  • Error Handler     │
│                      │                    │                      │
└──────────────────────┘                    └──────────┬───────────┘
                                                       │
                                                       │ Mongoose
                                                       ▼
                                            ┌──────────────────────┐
                                            │   MongoDB Atlas      │
                                            │                      │
                                            │  • Users Collection  │
                                            │  • Leads Collection  │
                                            │  • Indexed Fields    │
                                            └──────────────────────┘
```

### Authentication Flow

```
Login Request                  Backend                         Browser
    │                            │                               │
    ├── POST /auth/login ───────►│                               │
    │                            ├── Validate credentials        │
    │                            ├── Generate Access Token (15m) │
    │                            ├── Generate Refresh Token (7d) │
    │                            ├── Set httpOnly cookies ──────►│ (stored)
    │◄── { accessToken, user } ──┤                               │
    │                            │                               │
    ├── Store token in memory    │                               │
    │                            │                               │
    ├── GET /leads ─────────────►│                               │
    │   (Bearer + Cookie)        ├── Verify access token         │
    │◄── { leads, pagination } ──┤                               │
    │                            │                               │
    │   (Token expired)          │                               │
    ├── POST /auth/refresh ─────►│                               │
    │   (refreshToken cookie)    ├── Verify refresh token        │
    │                            ├── Issue new token pair ──────►│
    │◄── 200 OK ─────────────────┤                               │
    │                            │                               │
    ├── Retry original request   │                               │
```

---

## 📁 Project Structure

```
leadsManagementSystem/
├── docker-compose.yml          # Multi-service Docker orchestration
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                     # Express app entry point
│       ├── config/
│       │   └── db.ts                    # MongoDB connection
│       ├── models/
│       │   ├── user.model.ts            # User schema + password hashing
│       │   └── lead.model.ts            # Lead schema + indexes
│       ├── controllers/
│       │   ├── auth.controller.ts       # Register, login, refresh, logout, getMe
│       │   ├── lead.controller.ts       # CRUD + filtering + CSV export
│       │   └── user.controller.ts       # Admin user management
│       ├── middlewares/
│       │   ├── auth.middleware.ts        # JWT protect + role restriction
│       │   └── error.middleware.ts       # Centralized error handler
│       ├── helpers/
│       │   ├── jwt.helper.ts            # Token generation + verification
│       │   ├── cookie.helper.ts         # Secure cookie management
│       │   ├── csv.helper.ts            # Lead-to-CSV conversion
│       │   └── seeder.ts               # Database seed script
│       ├── validators/
│       │   ├── auth.validator.ts        # Registration + login validation
│       │   └── lead.validator.ts        # Lead create/update validation
│       ├── routes/
│       │   ├── auth.routes.ts
│       │   ├── lead.routes.ts
│       │   └── user.routes.ts
│       └── types/
│           └── express.d.ts             # Express Request type augmentation
│
└── frontend/
    ├── Dockerfile                       # Multi-stage build (Node → Nginx)
    ├── nginx.conf
    ├── vercel.json                      # SPA rewrite rules
    ├── .env.example
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx                     # React entry point
        ├── App.tsx                      # QueryClient provider setup
        ├── App.css                      # Global styles
        ├── api/
        │   ├── axiosInstance.ts          # Axios with interceptors + token refresh
        │   ├── auth.api.ts              # Auth API calls
        │   ├── leads.api.ts             # Leads API calls
        │   └── users.api.ts             # Users API calls
        ├── hooks/
        │   ├── useAuth.ts               # Login, logout, register, currentUser
        │   ├── useLeads.ts              # Leads CRUD hooks
        │   └── useUsers.ts              # User management hooks
        ├── pages/
        │   ├── Home.tsx                 # Landing page
        │   ├── Login.tsx                # Login page
        │   ├── Register.tsx             # Registration page
        │   ├── Dashboard.tsx            # Main dashboard with stats + charts
        │   ├── Leads.tsx                # Leads table with filters
        │   ├── SalesTeam.tsx            # Team management (admin only)
        │   ├── Reports.tsx              # Analytics & reports
        │   └── Settings.tsx             # User settings
        ├── components/
        │   ├── FormInput.tsx            # Reusable form input with validation
        │   ├── layout/
        │   │   ├── DashboardLayout.tsx  # Sidebar + content layout
        │   │   └── Sidebar.tsx          # Navigation sidebar
        │   ├── dashboard/
        │   │   ├── RevenueChart.tsx     # Recharts revenue visualization
        │   │   └── TopPerformers.tsx    # Top sales performers widget
        │   ├── leads/
        │   │   ├── LeadFilters.tsx      # Status, source, search, sort filters
        │   │   ├── LeadModal.tsx        # Create/edit lead modal form
        │   │   └── LeadRow.tsx          # Individual lead table row
        │   └── ui/
        │       ├── Table.tsx            # Reusable table component
        │       ├── Button.tsx           # Reusable button component
        │       ├── Input.tsx            # Reusable input component
        │       └── index.tsx            # UI component exports
        ├── routes/
        │   └── AppRouter.tsx            # Route definitions + guards
        └── types/
            └── index.ts                 # Shared TypeScript interfaces
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x
- **MongoDB** (local or Atlas)
- **Docker & Docker Compose** (optional, for containerized setup)

### Local Development

#### 1. Clone the repository

```bash
git clone https://github.com/Fazilniyaz/leadsManagementSystem.git
cd leadsManagementSystem
```

#### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev
```

The backend will start at `http://localhost:5000`.

#### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if backend is on a different URL
npm run dev
```

The frontend will start at `http://localhost:5173`.

---

### 🐳 Docker Setup

Run the entire stack with a single command:

```bash
# From the project root
docker-compose up --build
```

This spins up three containers:

| Service    | Container         | Port  | Description               |
|-----------|-------------------|-------|---------------------------|
| MongoDB   | `leads_mongo`     | 27017 | Database with health check|
| Backend   | `leads_backend`   | 5000  | Express API server        |
| Frontend  | `leads_frontend`  | 5173  | Nginx serving React build |

To stop all services:

```bash
docker-compose down
```

To also remove persisted data:

```bash
docker-compose down -v
```

---

### 🌱 Database Seeding

Populate the database with sample users and leads:

```bash
cd backend
npm run seed
```

This creates:

| Role  | Email              | Password      |
|-------|--------------------|---------------|
| Admin | admin@leads.com    | password123   |
| Sales | rahul@leads.com    | password123   |
| Sales | priya@leads.com    | password123   |

Plus **12 sample leads** with various statuses and sources.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable                 | Description                           | Example                              |
|-------------------------|---------------------------------------|--------------------------------------|
| `PORT`                  | Server port                           | `5000`                               |
| `MONGO_URI`             | MongoDB connection string             | `mongodb://localhost:27017/leadsdb`   |
| `ACCESS_TOKEN_SECRET`   | Secret for signing access JWTs        | `your_access_secret_here`            |
| `ACCESS_TOKEN_EXPIRES_IN`| Access token TTL                     | `15m`                                |
| `REFRESH_TOKEN_SECRET`  | Secret for signing refresh JWTs       | `your_refresh_secret_here`           |
| `REFRESH_TOKEN_EXPIRES_IN`| Refresh token TTL                   | `7d`                                 |
| `NODE_ENV`              | Environment (`development`/`production`)| `development`                      |
| `CLIENT_URL`            | Frontend URL for CORS                 | `http://localhost:5173`              |

### Frontend (`frontend/.env`)

| Variable       | Description          | Example                        |
|---------------|----------------------|--------------------------------|
| `VITE_API_URL`| Backend API base URL | `http://localhost:5000/api`    |

---

## 📡 API Documentation

Base URL: `/api`

### Authentication

| Method | Endpoint          | Auth | Description                          |
|--------|------------------|------|--------------------------------------|
| POST   | `/auth/register` | ❌   | Register a new user                  |
| POST   | `/auth/login`    | ❌   | Login and receive tokens             |
| POST   | `/auth/refresh`  | 🍪   | Refresh access token via cookie      |
| POST   | `/auth/logout`   | ✅   | Clear auth cookies                   |
| GET    | `/auth/me`       | ✅   | Get current authenticated user       |
| PATCH  | `/auth/me`       | ✅   | Update own profile (name, email)     |

### Leads

| Method | Endpoint              | Auth | Role  | Description                    |
|--------|----------------------|------|-------|--------------------------------|
| GET    | `/leads`             | ✅   | Any   | List leads (paginated, filtered)|
| GET    | `/leads/:id`         | ✅   | Any   | Get single lead details         |
| POST   | `/leads`             | ✅   | Any   | Create a new lead               |
| PUT    | `/leads/:id`         | ✅   | Any   | Update a lead                   |
| DELETE | `/leads/:id`         | ✅   | Admin | Delete a lead                   |
| GET    | `/leads/export/csv`  | ✅   | Any   | Export leads as CSV             |

### Users (Admin Only)

| Method | Endpoint         | Auth | Role  | Description              |
|--------|-----------------|------|-------|--------------------------|
| GET    | `/users`        | ✅   | Admin | List all users           |
| GET    | `/users/:id`    | ✅   | Admin | Get single user          |
| PATCH  | `/users/:id`    | ✅   | Admin | Update user role         |

### Query Parameters for `GET /leads`

| Parameter | Type   | Description                                 | Example             |
|-----------|--------|---------------------------------------------|---------------------|
| `page`    | number | Page number (default: 1)                    | `?page=2`           |
| `limit`   | number | Items per page (default: 10, max: 1000)     | `?limit=20`         |
| `status`  | string | Filter by status                            | `?status=qualified` |
| `source`  | string | Filter by source                            | `?source=instagram` |
| `search`  | string | Search by name or email (regex, case-insensitive) | `?search=rahul`|
| `sort`    | string | Sort order: `latest` or `oldest`            | `?sort=oldest`      |

**Combined filter example:**
```
GET /api/leads?status=qualified&source=instagram&search=rahul&sort=latest&page=1
```

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "lead": { ... }
  }
}
```

**Paginated:**
```json
{
  "success": true,
  "data": {
    "leads": [ ... ],
    "pagination": {
      "total": 42,
      "page": 1,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### HTTP Status Codes

| Code | Usage                                        |
|------|----------------------------------------------|
| 200  | Successful read/update/delete                |
| 201  | Successful creation                          |
| 400  | Validation errors, bad request               |
| 401  | Unauthorized (missing/invalid token)         |
| 403  | Forbidden (insufficient role)                |
| 404  | Resource not found                           |
| 409  | Conflict (e.g., duplicate email)             |
| 500  | Internal server error                        |

---

## 🔒 Authentication Flow

The application uses a **dual-token strategy** with httpOnly cookies:

1. **Access Token** (15 min) — Short-lived, sent as both a cookie and in-memory for API requests via `Authorization: Bearer <token>` header.
2. **Refresh Token** (7 days) — Long-lived, stored as an httpOnly cookie only. Used to silently rotate expired access tokens.

### Security Measures

- Passwords hashed with **bcryptjs** (12 salt rounds)
- Tokens stored in **httpOnly, secure, SameSite=None** cookies (production)
- In-memory token storage on frontend (not localStorage — XSS-safe)
- Automatic token refresh via Axios response interceptor
- Failed refresh → redirect to login
- Request queue during token refresh to prevent race conditions

---

## 👥 Role-Based Access Control

| Feature                  | Admin | Sales |
|-------------------------|-------|-------|
| View Dashboard           | ✅    | ✅    |
| View/Create/Edit Leads   | ✅    | ✅    |
| Delete Leads             | ✅    | ❌    |
| Export Leads CSV          | ✅    | ✅    |
| View Sales Team          | ✅    | ❌    |
| Manage User Roles        | ✅    | ❌    |
| View Reports             | ✅    | ✅    |
| Update Own Profile       | ✅    | ✅    |

RBAC is enforced at **two levels**:
- **Backend:** `restrictTo('admin')` middleware on protected routes
- **Frontend:** `adminOnly` prop on `<ProtectedRoute>` component

---

## 🎨 Frontend Architecture

### State Management

- **Server State:** TanStack React Query v5 handles all API data (leads, users, auth).
  - Automatic caching, background refetching, and stale-while-revalidate
  - `staleTime: Infinity` for auth to prevent unnecessary re-fetches
- **Form State:** React Hook Form for all forms (login, register, lead create/edit)
- **UI State:** Local `useState` for modals, filters, and toggle states

### Routing & Guards

```
/                   → Home (public landing page)
/login              → Login (PublicRoute — redirects to /dashboard if authenticated)
/register           → Register (PublicRoute)
/dashboard          → Dashboard (ProtectedRoute)
/leads              → Leads Management (ProtectedRoute)
/sales-team         → Team Management (ProtectedRoute, adminOnly)
/reports            → Reports & Analytics (ProtectedRoute)
/settings           → User Settings (ProtectedRoute)
```

### Axios Interceptor Pipeline

1. **Request Interceptor:** Attaches in-memory Bearer token to every request
2. **Response Interceptor (401):**
   - If the failed request is `/auth/refresh` → redirect to login
   - If the failed request is another auth endpoint → reject silently
   - Otherwise → attempt silent refresh, queue concurrent requests, retry on success

---

## 🌐 Deployment

### Frontend — Vercel

The frontend is deployed on **Vercel** as a static SPA:

- Build command: `npm run build` (runs `tsc -b && vite build`)
- Output: `dist/`
- `vercel.json` handles SPA routing with a catch-all rewrite to `index.html`
- Environment variable `VITE_API_URL` points to the Railway backend

### Backend — Railway

The backend is deployed on **Railway**:

- Runs the Dockerfile: `node dist/index.js`
- Environment variables configured in Railway dashboard
- `NODE_ENV=production` enables secure cross-domain cookies (`SameSite=None`, `Secure=true`)
- `CLIENT_URL` must include the full protocol (`https://...`) for CORS

### Database — MongoDB Atlas

- Free-tier M0 cluster
- Connection string stored in `MONGO_URI` env variable
- Indexes on `status`, `source`, and text index on `name` + `email` for search performance

---

## 💡 Design Decisions

### Why httpOnly Cookies + In-Memory Token?

Storing JWTs in `localStorage` or `sessionStorage` is vulnerable to XSS attacks. Instead:
- **httpOnly cookies** handle token transport securely (invisible to JavaScript)
- **In-memory variable** stores the access token for Bearer header authentication
- On page refresh, the app calls `GET /auth/me` which reads the cookie and returns a fresh access token

### Why TanStack React Query?

- Eliminates manual loading/error states — built into every query
- Automatic cache invalidation after mutations (create/update/delete lead)
- Prefetching on login for instant dashboard load
- Deduplication of concurrent requests

### Why Express Validator?

- Declarative, chainable validation rules
- Consistent error format across all endpoints
- Separates validation logic from controller business logic

### Why Dual Token Strategy?

- Short-lived access tokens (15 min) limit the damage window if compromised
- Long-lived refresh tokens (7 days) provide seamless UX without frequent re-login
- Token rotation on refresh prevents replay attacks

---

## 📜 License

This project was built as a full-stack internship assignment submission.

---

**Built with ❤️ by [Fazil Niyaz](https://github.com/Fazilniyaz)**
