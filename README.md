# 📦 Final Mile Delivery Hub Management System

A full-stack logistics and parcel delivery management system for managing customers, parcels, delivery agents, delivery operations, tracking, analytics, reports, and AI-assisted delivery intelligence.

## 🚀 Live Demo

**Live Application:** https://final-mile-hub.onslate.in/login

**Demo Role:** Delivery Agent
- **Email:** demoagent@gmail.com
- **Password:** 12345678

This account is provided for demonstration purposes.

**Interested in Becoming a Delivery Agent?**
Contact HR: finalmile.hr@gmail.com

## ✨ Features

### 🛠️ Admin Portal
- Dashboard and operational statistics
- Customer management
- Delivery-agent management
- Parcel creation and management
- Parcel assignment, auto-assignment and reassignment
- Parcel tracking and history
- Agent performance monitoring
- Analytics and reports
- Bulk import
- Payment management
- AI Delivery Intelligence Assistant

### 🚴 Delivery Agent Portal
- Dedicated dashboard and sidebar
- Assigned parcels
- Status filtering
- Start delivery
- Mark delivered
- Report failed delivery
- Delivery history
- Parcel tracking
- Profile and password management
- Delivery reports

## 🔐 Authentication & Authorization

JWT-based authentication with role-based authorization.

- **Admin** – Access to all administrative modules.
- **Delivery Agent** – Access only to dedicated delivery modules.

## 🔄 Parcel Delivery Workflow

```
Received
   ↓
Assigned
   ↓
OutForDelivery
   ↓
   ├──────────────┐
   ↓              ↓
Delivered   FailedDelivery
                   ↓
               Reassign
                   ↓
               Assigned
```

Admin creates and assigns parcels. The delivery agent starts delivery, changing the status to `OutForDelivery`. The agent then marks the parcel `Delivered` or `FailedDelivery`. Failed parcels can be reassigned by an administrator.

## 📋 Parcel Management

- Tracking number
- Customer
- Assigned delivery agent
- Parcel status
- Payment method and status
- Amount
- Failure reason
- Timestamps
- Assignment history

**Statuses:** `Received`, `Assigned`, `OutForDelivery`, `Delivered`, `FailedDelivery`

## 📊 Dashboards & Analytics

- **Admin cards:** Total Parcels, Delivered, Failed, Available Agents
- **Agent cards:** Assigned Parcels, Out For Delivery, Delivered Today, Failed Deliveries
- Recent parcels
- Agent performance
- Delivery status distribution
- Delivery trends
- Success rate
- Operational insights
- Date-based filtering

## 🤖 AI Delivery Intelligence Assistant

Uses the Google Gemini API to help administrators analyze delivery summaries, parcel operations, delays, agent performance, analytics, customer information, and operational insights.

```
GEMINI_API_KEY=your_api_key
```

> Keep API keys and other secrets in environment variables and never commit them to GitHub.

## 📄 Reports & Bulk Import

PDF delivery-agent reports are generated using **ReportLab**. Spreadsheet bulk import uses **OpenPyXL**.

## 🧰 Technology Stack

**Frontend:** React, Vite, JavaScript, React Router DOM, Axios, React Icons, Lucide React, React Select, React Toastify, Recharts, React Markdown

**Backend:** Python, FastAPI, Uvicorn, SQLAlchemy, Pydantic, PostgreSQL, Psycopg2, Python-JOSE, Passlib, Bcrypt

**AI:** Google Gemini API

**Reporting/Data:** ReportLab, OpenPyXL

**Deployment:** Zoho Catalyst AppSail, Zoho Catalyst Slate, Vite

## 📁 Project Structure

```
Inventory-System/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── database.py
│   │   └── main.py
│   ├── requirements.txt
│   ├── app-config.json
│   └── catalyst.json
├── frontend/
│   ├── src/
│   │   ├── admin/
│   │   ├── agent/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## ⚙️ Backend Setup

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

- **Backend:** http://127.0.0.1:8000
- **Swagger:** http://127.0.0.1:8000/docs

**Example environment variables:**

```
DATABASE_URL=your_postgresql_database_url
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GEMINI_API_KEY=your_gemini_api_key
```

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Usually available at http://localhost:5173

## 🏗️ Production Build

```bash
npm run build
npm run preview
```

## 🔌 Main API Endpoints

```
POST   /auth/login

GET    /customers/
POST   /customers/

GET    /delivery-agents/
GET    /delivery-agents/{agent_id}
POST   /delivery-agents/
DELETE /delivery-agents/{agent_id}

POST   /parcels/
GET    /parcels/
GET    /parcels/{parcel_id}
GET    /parcels/tracking/{tracking_number}
GET    /parcels/{parcel_id}/history
POST   /parcels/{parcel_id}/auto-assign
PATCH  /parcels/{parcel_id}/out-for-delivery
PATCH  /parcels/{parcel_id}/delivered
PATCH  /parcels/{parcel_id}/failed
POST   /parcels/{parcel_id}/reassign
PATCH  /parcels/{parcel_id}/collect-payment

GET    /dashboard/summary
GET    /dashboard/agent-performance
GET    /dashboard/top-agent
GET    /dashboard/worst-agent
GET    /dashboard/delivery-metrics
GET    /dashboard/recent-parcels

GET    /agent-reports/{agent_id}/download-pdf
```

## 🔒 Security

- JWT authentication
- Bcrypt password hashing
- Role-based authorization
- Protected frontend routes
- Protected backend resources
- Environment-based secret management
- Password-change enforcement

Passwords are never stored as plaintext. Database credentials, JWT secrets, and Gemini API keys must not be committed to source control.

## ☁️ Deployment

The project is configured for deployment using Zoho Catalyst. The backend uses AppSail and the React frontend is built with Vite and deployed through the configured Catalyst hosting environment.

- Verify production database URL
- Verify JWT secret
- Verify Gemini API key
- Verify frontend API URL
- Verify CORS
- Verify backend startup command
- Verify dependencies
- Verify database connectivity
- Run production build

## 🎯 Project Objective

The objective is to provide a centralized platform for last-mile delivery operations, bringing together customer management, parcel management, delivery-agent management, assignment, tracking, delivery status management, analytics, reporting, payment management, and AI-powered operational assistance.

## 🏛️ System Architecture

```
React + Vite Frontend
        │
      Axios
        │
        ▼
FastAPI REST Backend
    │         │
    ▼         ▼
PostgreSQL   Gemini API
 Database   AI Assistant
```

## 👥 Project Roles

- **Administrator:** System management, customers, agents, parcels, assignment, reassignment, monitoring, analytics, reports, and AI assistance.
- **Delivery Agent:** Assigned parcels, starting deliveries, completing deliveries, reporting failures, tracking operations, and viewing delivery history.

## 📜 License

This project is developed for educational, academic, and demonstration purposes.

## 📧 Delivery Agent Opportunities

finalmile.hr@gmail.com

---

Built with ❤️ using React, FastAPI, PostgreSQL, and modern web technologies.