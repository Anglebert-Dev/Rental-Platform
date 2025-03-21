import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  verify: () => api.get("/auth/verify"),
  googleLogin: () => api.get("/auth/google"),
  updateRole: (role) => api.put("/auth/role", { role }),
};

export const propertyService = {
  getAll: () => api.get("/properties"),
  getMyProperties: () => api.get("/properties/my-properties"),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post("/properties", data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  search: (params) => api.get("/properties/search", { params }),
};

export const bookingService = {
  create: (data) => api.post("/bookings", data),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  getMyBookings: () => api.get("/bookings/me"),
  getPropertyBookings: (propertyId) =>
    api.get(`/bookings/property/${propertyId}`),
};
