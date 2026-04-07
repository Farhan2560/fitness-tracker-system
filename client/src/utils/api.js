import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fittrack-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Auth ────────────────────────────────────────────────────────────────────

export const UserRegister = async (data) => api.post("/user/signup", data);
export const UserLogin = async (data) => api.post("/user/signin", data);

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const getDashboardDetails = async () => api.get("/user/dashboard");

// ─── Workouts ────────────────────────────────────────────────────────────────

export const getWorkouts = async (date) => {
  const params = date ? { date } : {};
  return api.get("/user/workout", { params });
};

export const addWorkout = async (data) => api.post("/user/workout", data);

export const deleteWorkout = async (id) => api.delete(`/user/workout/${id}`);

export const getWorkoutCategories = async () =>
  api.get("/workout/categories");
