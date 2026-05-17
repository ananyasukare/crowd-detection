# AI-Based Geospatial Queue Management System

A production-level full-stack web application for smart queue and appointment management in Banks, Government Offices, and Public Service Centers.

## 🚀 Key Features

### 👤 User Panel
- **Geospatial Office Discovery**: Live Leaflet.js map integration to find nearby offices.
* **Smart Crowd Indicators**: 🟢 Low, 🟡 Medium, 🔴 High crowd levels predicted by AI.
- **AI-Powered Predictions**: Real-time estimated waiting time and queue position.
- **Digital Token Booking**: Instant token generation with email confirmation.
- **Live Queue Monitoring**: Real-time updates via WebSockets.

### 🛡️ Admin Panel (Branch Level)
- **Queue Control**: Call next, skip, or pause tokens in real-time.
- **Live Dashboard**: Analytics on total visitors, active queue, and wait times.
- **AI Analytics**: Hourly traffic trends and peak timing predictions.
- **Branch Settings**: Manage office timings and service thresholds.

### 👑 Super Admin Panel
- **System Control**: Manage and verify all offices and branch admins.
- **Global Analytics**: System-wide performance reports and crowd monitoring.

## 🛠 Tech Stack

- **Backend**: FastAPI (Python), Motor (Async MongoDB), JWT, WebSockets.
- **Frontend**: React.js, Vite, Tailwind CSS, Leaflet.js, Chart.js.
- **AI/ML**: YOLOv8 (Crowd Density), Custom Regression (Wait Time Prediction).
- **Notifications**: FastAPI-Mail (SMTP), Browser Push.
- **Database**: MongoDB.

## 📂 Project Structure

```
crowd-detection/
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── api/v1/         # Endpoint handlers
│   │   ├── core/           # Security & Config
│   │   ├── db/             # MongoDB connection
│   │   ├── models/         # Pydantic schemas
│   │   ├── ml/             # YOLOv8 & Prediction logic
│   │   ├── services/       # Notification service
│   │   └── main.py         # Entry point
│   ├── .env                # Configuration
│   └── requirements.txt
│
└── frontend/               # React Application
    ├── src/
    │   ├── api/            # API services
    │   ├── components/     # UI Components (User/Admin)
    │   ├── context/        # Auth state management
    │   ├── pages/          # User & Admin Panels
    │   └── App.jsx
    └── tailwind.config.js
```

## ⚙️ Setup & Installation

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure your `.env` file with MongoDB and SMTP credentials.
4. Run the setup script to initialize the database:
   ```bash
   python setup_db.py
   ```
5. Start the server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔒 Security
- Role-Based Access Control (RBAC).
- Secure password hashing with BCrypt.
- Protected API routes using JWT Bearer tokens.

## 📝 License
MIT License
