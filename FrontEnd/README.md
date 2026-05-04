Smart Queue Alert Management System - Frontend

A React-based customer and admin dashboard for the Smart Queue Management System.

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Development server:**

```bash
npm run dev
```

The app will run at `http://localhost:3000`

3. **Build for production:**

```bash
npm run build
```

## Features

### Customer Side
- User registration and login with JWT
- Book queue tokens with branch and service selection
- View real-time queue status and estimated wait time
- Receive alerts when wait time ≤ 15 minutes
- Live crowd status indicator

### Admin Side
- Admin dashboard with real-time metrics
- View current queue for each branch/service
- Update average service time settings
- View alerts sent to customers
- Manage counters (placeholder)

## API Integration

All API calls are handled through `src/services/api.js`. 
Update the base URL if your backend is on a different server:

```javascript
const API_BASE = 'http://localhost:5000/api';
```

## Tech Stack
- **React 18** - UI library
- **React Router** - Navigation
- **Material UI** - Component library
- **Tailwind CSS** - Utility styling
- **Axios** - HTTP client
- **Vite** - Build tool

## Environment Notes
- Backend must be running on `http://localhost:5000`
- Ensure JWT tokens are properly handled in localStorage
- Mock data is available for demo purposes if backend is unavailable
