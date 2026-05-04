# Smart Queue Alert Management System

A full-stack web application for managing bank queue lines and alerting customers before their turn.

## 🏗 Project Structure

```
Smart_Queue_Management_System/
├── BackEnd/                    # Flask REST API
│   ├── app.py                 # Flask app factory
│   ├── config.py              # Configuration
│   ├── models/
│   │   ├── user_model.py
│   │   ├── token_model.py
│   │   └── settings_model.py
│   ├── routes/
│   │   ├── auth_routes.py     # Register/Login
│   │   ├── token_routes.py    # Book token/Queue status
│   │   └── admin_routes.py    # Admin endpoints
│   ├── utils/
│   │   ├── wait_time.py       # Wait time calculation
│   │   └── alert_service.py   # Alert/notification logic
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
└── FrontEnd/                   # React Dashboard
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── TokenCard.jsx
    │   │   └── CrowdStatus.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── CustomerDashboard.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── README.md
```

## ✨ Features

### 🎯 Customer Features
- **User Authentication** - Register & login with JWT
- **Branch Selection** - Choose from available bank branches
- **Token Booking** - Book queue tokens with service type selection
- **Real-time Queue Status** - See live crowd indicators (🟢 Low / 🟡 Medium / 🔴 High)
- **Wait Time Estimation** - Get estimated wait time based on crowd
- **Smart Alerts** - Receive notification when wait time ≤ 15 minutes
- **Progress Tracking** - Visual progress bar showing queue movement

### 🏢 Admin Features
- **Admin Dashboard** - Overview of all branches and services
- **Live Metrics** - Real-time customer count, active counters, wait times
- **Queue Management** - View current queue, token status
- **Service Settings** - Update average service time per branch/service
- **Alert History** - View all alerts sent to customers
- **Counter Management** - Open/close service counters

## 🛠 Tech Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: MySQL with SQLAlchemy ORM
- **Authentication**: JWT (Flask-JWT-Extended)
- **Migration**: Flask-Migrate
- **Dependencies**: See `BackEnd/requirements.txt`

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **UI**: Material UI + Tailwind CSS
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Dependencies**: See `FrontEnd/package.json`

## 🚀 Quick Start

### Backend Setup

1. **Navigate to BackEnd folder:**
   ```bash
   cd BackEnd
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Initialize database:**
   ```bash
   export FLASK_APP=app.py
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

6. **Run backend server:**
   ```bash
   python app.py
   ```

   Backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to FrontEnd folder:**
   ```bash
   cd FrontEnd
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`

## 📋 API Endpoints

### Auth Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login

### Token Routes (`/api/token`)
- `POST /book` - Book a new queue token
- `GET /my` - Get current user's token
- `GET /branch/:branch/service/:service_type` - Get queue status (public)

### Admin Routes (`/api/admin`)
- `GET /queue/:branch/:service_type` - View queue
- `POST /settings/avg_time` - Update avg service time
- `GET /alerts` - View alerts sent
- `POST /counter/toggle` - Toggle counter status

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:

1. User registers/logs in → receive `access_token`
2. Token stored in browser `localStorage`
3. Token sent in `Authorization: Bearer <token>` header for protected routes
4. Admin users have `is_admin: true` flag in token

## 📊 Database Schema

### Users Table
- `id` - Primary key
- `name` - User name
- `email` - Unique email
- `password_hash` - Hashed password
- `is_admin` - Boolean (default: false)
- `created_at` - Timestamp

### Tokens Table
- `id` - Primary key
- `token_number` - Sequential number
- `user_id` - Foreign key (users)
- `branch` - Branch name
- `service_type` - Service category
- `status` - waiting/serving/served/cancelled
- `estimated_wait` - Minutes
- `alert_sent` - Boolean
- `created_at` - Timestamp

### Settings Table
- `id` - Primary key
- `branch` - Branch name
- `service_type` - Service category
- `avg_service_time` - Average minutes per customer

## 🔄 Wait Time Calculation

Estimated wait time = Number of waiting customers × Average service time per customer

Example: 5 waiting customers × 5 min/customer = 25 minutes estimated wait

## 🚨 Alert Logic

- Alert is sent when: `estimated_wait_time ≤ 15 minutes`
- Alert is sent once per token
- Alert can be email or SMS (implementation pending)

## 📝 Notes

- Database credentials should be provided and added to `.env` file
- Email/SMS integration is placeholder - integrate with SendGrid/Twilio later
- CORS headers may need adjustment for production
- JWT secret keys should be changed from defaults
- Frontend is proxied to backend via Vite proxy configuration

## 🤝 Workflow

1. **Customer** → Registers and logs in
2. **Customer** → Selects branch and service type
3. **Customer** → Books a token (gets token number)
4. **System** → Calculates estimated wait time
5. **System** → Monitors queue and sends alert when time ≤ 15 min
6. **Admin** → Monitors queue, updates settings, views alerts

## 📈 Future Enhancements

- Real SMS/Email notifications
- Counter management UI
- Queue analytics and reporting
- Mobile app version
- Real-time WebSocket updates
- Multiple language support
- Dark mode UI

---

**Created:** December 2025  
**Status:** Initial Implementation Complete
