// src/config/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eco-dz-2.onrender.com';

export const API_ENDPOINTS = {
  places: `${API_BASE_URL}/api/places`,
  trips: `${API_BASE_URL}/api/trips`,
  deals: `${API_BASE_URL}/api/deals`,
  auth: `${API_BASE_URL}/api/auth`,
  user: `${API_BASE_URL}/api/user`,
  comments: `${API_BASE_URL}/api/comments`,
  bookings: `${API_BASE_URL}/api/bookings`,
  messaging: `${API_BASE_URL}/api/messaging`,
  searches: `${API_BASE_URL}/api/searches`,
};

export const SOCKET_URL = API_BASE_URL;

export default API_BASE_URL;