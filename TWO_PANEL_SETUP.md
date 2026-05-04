# 🏦 Smart Queue Management System - Two Panel Setup Guide

## Overview

The Smart Queue Management System now features **two distinct panels**:

1. **🏦 Bank Admin Panel** - For bank administrators and managers
2. **👤 User Panel** - For regular customers and end users

Each panel has its own dedicated interface, features, and functionality tailored to its specific user role.

---

## 🏦 Bank Admin Panel

### Access
- **URL**: `http://localhost:3000/admin`
- **Route**: `/admin` (Protected - Admin only)

### Features

#### 📊 Overview Tab
- **Dashboard Statistics**:
  - Total Queues count
  - Active Users count
  - Average Wait Time (in minutes)
  - Completed Transactions (today)
  
- **Quick Actions**:
  - View Reports
  - Settings
  - Announcements
  - Notifications

- **Recent Activity**
  - Real-time queue updates
  - System alerts and notifications

#### 🏢 Assets Tab
- Create new bank assets (counters, service windows)
- Edit existing assets
- Delete inactive assets
- Asset properties:
  - Name
  - Branch location
  - Service type (Deposits, Withdrawals, Loans, etc.)
  - Maximum capacity
  - Current status (Open/Closed/Maintenance)

#### 📈 Analytics Tab
- Queue Performance analytics
- Wait Time Trends visualization
- Historical data analysis
- Performance metrics

### Admin Endpoints
```
GET  /api/admin/stats              - Get system statistics
GET  /api/admin/assets             - List all assets
POST /api/admin/asset              - Create new asset
PUT  /api/admin/asset/<id>         - Update asset
DELETE /api/admin/asset/<id>       - Delete asset
GET  /api/admin/queue/<branch>/<service_type> - Get queue details
POST /api/admin/counter/toggle     - Toggle counter status
POST /api/admin/settings/avg_time  - Update average service time
GET  /api/admin/alerts             - View system alerts
```

---

## 👤 User Panel

### Access
- **URL**: `http://localhost:3000/dashboard`
- **Route**: `/dashboard` (Protected - User only)

### Features

#### 🏠 Dashboard Tab
- **Personal Statistics**:
  - Active Queues (user's current queues)
  - Nearby Assets (based on location)
  - Average Wait Time

- **Quick Actions**:
  - Find Assets
  - View Queues
  - Alerts
  - Profile

- **My Current Queues**
  - Token number
  - Position in queue
  - Estimated wait time
  - Queue status (Waiting/Serving/Completed)

- **Nearby Assets**
  - Real-time queue length
  - Estimated wait time
  - Join queue button
  - Asset location and type

- **Recent History**
  - Past transactions
  - Completed queues
  - Transaction status

#### 📋 Queues Tab
- Detailed view of all active queues
- Token number prominently displayed
- Position and total queue size
- Estimated wait time
- Status tracking

### User Endpoints
```
POST /api/token/join               - Join a queue
GET  /api/token/history            - Get queue history
GET  /api/token/current            - Get current token status
```

---

## 🔐 Test Credentials

### Admin Account
- **Email**: `admin@bank.com`
- **Password**: `admin123`
- **Role**: Bank Administrator

### Regular User Account
- **Email**: `user@bank.com`
- **Password**: `user123`
- **Role**: Customer

---

## 🗂️ Project Structure

### Frontend Components
```
src/
├── pages/
│   ├── AdminPanel.jsx          # 🏦 Bank Admin Dashboard
│   ├── UserPanel.jsx           # 👤 User Dashboard
│   ├── AdminDashboard.jsx      # Legacy admin page
│   ├── CustomerDashboard.jsx   # Legacy customer page
│   └── Landing.jsx             # Updated landing page
├── context/
│   ├── AuthContext.jsx         # Authentication & user role
│   ├── AssetContext.jsx        # Asset management
│   ├── QueueContext.jsx        # Queue operations
│   └── AlertContext.jsx        # Alert notifications
├── components/
│   ├── Navbar.jsx              # Updated navbar with role-based menu
│   └── UI.jsx                  # Reusable UI components
└── services/
    └── api.js                  # API calls
```

### Backend Models
```
models/
├── user_model.py        # User with is_admin field
├── asset_model.py       # Bank assets/counters (NEW)
├── token_model.py       # Queue tokens
└── settings_model.py    # System settings
```

### Backend Routes
```
routes/
├── auth_routes.py       # Login/Register with role checking
├── admin_routes.py      # Admin endpoints (ENHANCED)
└── token_routes.py      # Queue token operations
```

---

## 🚀 Running the System

### Start Both Servers

#### Backend
```bash
cd BackEnd
python -m flask run
# Runs on http://localhost:5000
```

#### Frontend
```bash
cd FrontEnd
npm install --legacy-peer-deps  # First time only
npm run dev
# Runs on http://localhost:3000
```

### Create Test Data
```bash
cd BackEnd
python setup_test_data.py
```

---

## 🔒 Authentication & Authorization

### Login Flow
1. User submits credentials via `/login` endpoint
2. Backend validates and returns JWT token with user data
3. Token includes `is_admin` flag for role verification
4. Frontend stores token & user data in localStorage

### Route Protection
```javascript
<PrivateRoute isAdmin={false}>  {/* Regular users */}
  <UserPanel />
</PrivateRoute>

<PrivateRoute isAdmin={true}>   {/* Admins only */}
  <AdminPanel />
</PrivateRoute>
```

### Role-Based Navigation
- **Admin users** see: Admin Panel, Map
- **Regular users** see: Dashboard, Map, Queue Status, Alerts

---

## 🎨 Design Differences

### Admin Panel (Dark Slate Theme)
- **Color scheme**: Slate/Gray with accent colors
- **Primary color**: `#1e293b` (slate-900)
- **Stats**: Blue, Green, Orange, Purple cards
- **Purpose**: Professional, data-focused interface

### User Panel (Emerald Green Theme)
- **Color scheme**: Emerald/Green with cyan and orange
- **Primary color**: `#065f46` (emerald-900)
- **Stats**: Emerald, Cyan, Orange cards
- **Purpose**: User-friendly, action-focused interface

---

## 📱 Responsive Design

Both panels are fully responsive:
- **Mobile**: Single column layout
- **Tablet**: 2-3 column layout
- **Desktop**: Full grid layout

---

## 🔄 Real-Time Updates

The system uses:
- **Socket.IO** (optional) for real-time updates
- **Polling** for current implementation
- **LocalStorage** for local state management

---

## 🛠️ Configuration

### Environment Variables (.env)
```env
FLASK_ENV=development
MONGODB_URI=mongodb://localhost:27017/queue_db
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
```

### Database Setup
- **Database**: MongoDB
- **Collections**: users, tokens, settings, assets
- **Default host**: localhost:27017

---

## ✅ Checklist for Running

- [ ] Python environment configured (venv)
- [ ] Python packages installed (`pip install -r requirements.txt`)
- [ ] MongoDB running on localhost:27017
- [ ] Frontend dependencies installed (`npm install --legacy-peer-deps`)
- [ ] Test data created (`python setup_test_data.py`)
- [ ] Backend running on localhost:5000
- [ ] Frontend running on localhost:3000
- [ ] Test login with provided credentials

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is already in use
lsof -i :5000
# Kill the process if needed
kill -9 <PID>
```

### Frontend compilation errors
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install --legacy-peer-deps
```

### MongoDB connection failed
```bash
# Ensure MongoDB is running
# Linux/Mac: brew services start mongodb-community
# Windows: net start MongoDB
# Or use Docker: docker run -d -p 27017:27017 mongo
```

### Can't login
- Ensure test data is created: `python setup_test_data.py`
- Check credentials: Admin: `admin@bank.com/admin123`, User: `user@bank.com/user123`

---

## 📚 API Documentation

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### Tokens (Queue)
```
GET    /api/token/current
POST   /api/token/join
GET    /api/token/history
DELETE /api/token/<id>
```

### Admin Operations
```
GET    /api/admin/stats
GET    /api/admin/assets
POST   /api/admin/asset
PUT    /api/admin/asset/<id>
DELETE /api/admin/asset/<id>
```

---

## 🎯 Next Steps

1. **Customize** the panels with your bank's branding
2. **Add** more analytics and reporting features
3. **Implement** real-time notifications with Socket.IO
4. **Deploy** to production with proper error handling
5. **Add** SMS/Email notifications for queue updates
6. **Integrate** with existing banking systems

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs in terminal
3. Check browser console for frontend errors
4. Verify MongoDB is running
5. Ensure all environment variables are set

---

**Last Updated**: April 11, 2026
**Version**: 1.0 - Two Panel System
