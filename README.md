# 🏋️ FitnessTrack — Full-Stack Fitness Tracker System

A full-stack MERN (MongoDB, Express, React, Node.js) fitness tracking application that lets you log workouts, track weekly calorie burn, visualize progress with charts, and manage your personal fitness data.

---

## ✨ Features

- **User Authentication** — Secure sign-up / sign-in with JWT tokens
- **Dashboard** — Weekly stats: calories burned, workouts done, average calories/session
- **Workout Logging** — Log strength & cardio workouts via a simple text format
- **Auto Calorie Estimation** — Calories auto-calculated from sets/reps/weight or duration
- **Progress Charts** — Area chart (daily calories, last 7 days) + Pie chart (categories this week)
- **Workout History** — Browse past workouts by date; delete individual entries
- **Responsive UI** — Works on desktop and mobile

---

## 🗂️ Project Structure

```
fitness-tracker-system/
├── client/                  # React frontend (Vite)
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── context/
│       │   └── UserContext.jsx      # Auth state (JWT + localStorage)
│       ├── utils/
│       │   └── api.js               # Axios API helpers
│       ├── pages/
│       │   ├── Authentication.jsx   # Login / Register page
│       │   └── Dashboard.jsx        # Main dashboard
│       └── components/
│           ├── Navbar.jsx
│           └── cards/
│               ├── CountsCard.jsx   # Stat summary cards
│               └── WorkoutCard.jsx  # Individual workout entry
│
└── server/                  # Node.js / Express backend
    ├── index.js             # App entry point
    ├── error.js             # Error helper
    ├── .env.example         # Environment variables template
    ├── models/
    │   ├── User.js
    │   └── Workout.js
    ├── routes/
    │   ├── user.js          # Auth + workout CRUD routes
    │   └── workout.js       # Category listing
    ├── controllers/
    │   ├── user.js          # Business logic
    │   └── workout.js
    └── middleware/
        └── verifyToken.js   # JWT auth middleware
```

---

## 🚀 How to Run

### Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org/) | v18+ |
| [MongoDB](https://www.mongodb.com/try/download/community) | v6+ (local) **or** [MongoDB Atlas](https://cloud.mongodb.com/) (cloud) |
| npm | v9+ (comes with Node.js) |

---

### 1. Clone the repository

```bash
git clone https://github.com/Farhan2560/fitness-tracker-system.git
cd fitness-tracker-system
```

---

### 2. Set up the Server

```bash
cd server
npm install
```

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Edit `server/.env` with your values:

```env
MONGO_URL=mongodb://127.0.0.1:27017/fitnessdb   # or your Atlas connection string
JWT_SECRET=your_super_secret_key_change_this     # any long random string
PORT=8080
```

Start the server:

```bash
# Production
npm start

# Development (auto-restart on file changes)
npm run dev
```

The API will be available at **http://localhost:8080**

---

### 3. Set up the Client

Open a **new terminal tab**:

```bash
cd client
npm install
npm run dev
```

The React app will be available at **http://localhost:3000**

> The Vite dev server proxies `/api` requests to `http://localhost:8080` automatically — no CORS issues.

---

### 4. Open in browser

Navigate to **http://localhost:3000**, register a new account, and start logging workouts!

---

## 🏗️ API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/user/signup` | No | Register a new user |
| `POST` | `/api/user/signin` | No | Login, returns JWT |
| `GET` | `/api/user/dashboard` | ✅ | Weekly stats & chart data |
| `GET` | `/api/user/workout?date=YYYY-MM-DD` | ✅ | Workouts for a specific date |
| `POST` | `/api/user/workout` | ✅ | Log new workouts (see format below) |
| `DELETE` | `/api/user/workout/:id` | ✅ | Delete a workout by ID |
| `GET` | `/api/workout/categories` | ✅ | List all workout categories |

---

## 📝 Workout Input Format

Workouts are logged using a simple text format in the dashboard's input box:

```
#Category
-Exercise Name
-Sets x Reps
-Weight kg
```

**Examples:**

```
#Chest
-Bench Press
-4 x 10
-80 kg

#Legs
-Squats
-3 x 12
-100 kg

#Cardio
-Running
-30 min
```

- Start a new exercise with `#CategoryName`
- Each exercise begins with `-Exercise Name`
- Sets × Reps: `-3 x 12`
- Weight (optional): `-80 kg`
- Cardio duration: `-30 min`
- Separate multiple exercises with a blank line or just start a new `#` block

**Available categories:** `Chest`, `Back`, `Legs`, `Shoulders`, `Arms`, `Core`, `Cardio`, `Flexibility`, `Other`

---

## 🌍 Environment Variables

### Server (`server/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://127.0.0.1:27017/fitnessdb` |
| `JWT_SECRET` | Secret key for signing JWT tokens | — |
| `PORT` | Server port | `8080` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| UI Components | MUI (Material UI) v5 |
| Styling | styled-components |
| Charts | Recharts |
| HTTP Client | Axios |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens (JWT) + bcryptjs |

---

## 🐛 Troubleshooting

**MongoDB connection error**
- Make sure MongoDB is running: `mongod` (local) or check your Atlas connection string
- Confirm the `MONGO_URL` in `server/.env` is correct

**Port already in use**
- Change `PORT` in `server/.env` and update the `proxy` target in `client/vite.config.js`

**JWT errors / "not authenticated"**
- Clear localStorage in browser DevTools and log in again
- Make sure `JWT_SECRET` is set in `server/.env`
