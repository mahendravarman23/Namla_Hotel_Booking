# 🏨 Hotel Management System

DEMO VIDEO:https://drive.google.com/file/d/13yjsfimiXCqhjlfaVEygkqi7FgngdQqH/view?usp=sharing
 
A modern, full-stack luxury hotel discovery and management web application built with **React 19**, **Redux Toolkit**, **Vite**, **Node.js / Express**, and **PostgreSQL**.

Featuring role-based JWT authentication, a signature **3D Sphere Showcase**, strict prefix search, image upload management, OpenStreetMap integration, and an administrative CRUD dashboard.

---

## 🌟 Key Features

### 🌐 Client Features (Frontend)
- **Interactive 3D Sphere Showcase:** Smooth orbit-based 3D gallery powered by pure CSS 3D matrix math; supports touch swipe, mouse drag, wheel scroll, and keyboard navigation.
- **Strict Prefix Search:** Real-time filtering matching hotel titles from the first character (`title ILIKE 'term%'`) while instantly hiding non-matching items.
- **Clean Pagination:** Configured for 8 cards per page with responsive page controls.
- **Interactive Map Integration:** OpenStreetMap bounding-box embeds and Google Maps navigation links computed from GPS coordinates.
- **Location & Distance Calculation:** Haversine formula calculation computing distance in kilometers or meters from coordinates.
- **Indian Rupee Formatting:** Localized currency formatting (`₹`).
- **Responsive UI:** Custom CSS design system optimized for mobile, tablet, and desktop viewports without external bloated UI frameworks.

### 🔐 Server & Security Features (Backend)
- **Role-Based Access Control (RBAC):** Public read-only access for visitors; standard user authentication; protected CRUD operations restricted to users with `admin` role.
- **Secure Password Hashing:** Node.js native `crypto.scrypt` with unique 16-byte cryptographically secure random salts (`salt:hash`).
- **Stateless JWT Authentication:** HS256 signed JSON Web Tokens passed via standard `Authorization: Bearer <token>` headers.
- **File Upload Management:** Secure image uploads handled via `multer` with file-type whitelisting, 5 MB payload caps, and automated orphan file cleanup on delete or edit.
- **Native SQL Queries:** Direct PostgreSQL parameterized queries using `pg` pool (no heavy ORM overhead).

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hotels.com` | `admin` | Full CRUD Access (`/admin`, Add/Edit/Delete Hotels) |
| **Admin (Alternative)** | `namlaadmin@gmail.com` | `admin` | Full CRUD Access |
| **Standard User** | `user@hotels.com` | `password123` | Browsing, Details, Account Profile |

---

## 📁 Project Architecture

```text
hotel-app/
├── client/                     # Frontend (React 19 + Vite)
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, HotelCard, Pagination, Toast, Icons)
│   │   ├── features/
│   │   │   ├── auth/           # Redux auth slice & session management
│   │   │   ├── hotels/         # Redux hotels slice (async thunks & filters)
│   │   │   └── ui/             # 3D Gallery showcase & toast slice
│   │   ├── hooks/              # Custom hooks (useDebounce)
│   │   ├── pages/              # Routed views (Landing, Showcase, Details, Admin, Auth)
│   │   ├── utils/              # Formatting & Haversine math utils
│   │   ├── api.js              # Centralized HTTP client
│   │   ├── App.jsx             # Route definitions & scroll restoration
│   │   ├── main.jsx            # React root & Redux store provider
│   │   └── styles.css          # Core CSS variables & base styles
│   ├── tests/                  # Client unit tests (Node test runner)
│   ├── package.json
│   └── vite.config.js          # Vite config & API reverse proxy
│
└── server/                     # Backend (Node.js + Express + PostgreSQL)
    ├── src/
    │   ├── controllers/        # Business logic (hotels.controller.js, auth.controller.js)
    │   ├── db/
    │   │   ├── pool.js         # PostgreSQL connection pool & query helper
    │   │   ├── schema.sql      # Database schema (hotels & users tables)
    │   │   ├── applySchema.js  # Schema migration runner
    │   │   ├── seed.js         # Base hotel seeding
    │   │   ├── seed20Hotels.js # 20 luxury hotels seeder with random prices
    │   │   └── seedUsers.js    # Pre-seeded users & password hashing
    │   ├── middleware/         # auth.js (JWT/RBAC), upload.js (Multer), validate.js
    │   ├── routes/             # Express routes (/api/hotels, /api/auth)
    │   ├── utils/              # Cryptographic hashing & JWT sign/verify
    │   └── index.js            # Express entry point & static file server
    ├── tests/                  # Backend unit & integration tests
    ├── uploads/                # Stored hotel photos
    └── package.json
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **PostgreSQL** (running locally on port 5432)

### 2. Database Setup
Create the database in PostgreSQL:
```sql
CREATE DATABASE hotels_db;
```

Configure your server environment in `hotel-app/server/.env`:
```env
PORT=4001
DATABASE_URL=postgres://postgres:your_password@localhost:5432/hotels_db
JWT_SECRET=hotel_app_jwt_secret_key_2026_secure
NODE_ENV=development
```

Apply schema and seed database with 20 hotels and users:
```bash
cd server
npm run db:schema
node src/db/seed20Hotels.js
node src/db/seedUsers.js
```

---

### 3. Running the Application

#### Option A: 1-Click Launch (Windows)
Double-click `start.bat` located in the root directory. It automatically launches both backend and frontend in separate command windows.

#### Option B: Single Command (from root)
```bash
npm run dev
```

#### Option C: Manual Launch (Two Terminals)

**Terminal 1 — Backend Server:**
```bash
cd server
npm start
# Server starts at http://localhost:4001
```

**Terminal 2 — Frontend Client:**
```bash
cd client
npm run dev
# Frontend runs at http://localhost:5173
```

Open your browser at **`http://localhost:5173`**.

---

## 📡 API Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account (`{ name, email, password }`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Authenticated | Fetch current user session profile |

### Hotel Endpoints (`/api/hotels`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/hotels` | Public | Get paginated list of hotels (`?search=&limit=8&offset=0&minPrice=&maxPrice=`) |
| `GET` | `/api/hotels/:id` | Public | Retrieve detailed information for a single hotel |
| `POST` | `/api/hotels` | Admin Only | Create a new hotel (multipart form with image file) |
| `PUT` | `/api/hotels/:id` | Admin Only | Update an existing hotel (multipart form with optional image) |
| `DELETE` | `/api/hotels/:id` | Admin Only | Delete a hotel and remove its image file from storage |

---

## 🧪 Test Suite

The project includes 38 comprehensive unit and integration tests using Node.js's native test runner (`node:test` and `node:assert/strict`):

- **Client Tests (13 tests):** Format utilities, distance calculations, Redux hotels slice reducers, Redux auth slice reducers.
  ```bash
  cd client && npm test
  ```
- **Server Tests (25 tests):** Password hashing/verification, JWT token generation/verification/expiration, payload validation middleware, and live API integration tests.
  ```bash
  cd server && npm test
  ```

---

## 📄 License
ISC License. Built for luxury hotel discovery and administration.
