// src/socket/socket.js
import { io } from 'socket.io-client';
import API_BASE_URL from '../config/api';

let socket;

export const initializeSocket = () => {
  if (socket) return socket;
  
  console.log('🔌 Connecting to WebSocket at:', API_BASE_URL);
  
  socket = io(API_BASE_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000
  });

  socket.on('connect', () => {
    console.log('✅ WebSocket connected:', socket.id);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ WebSocket connection error:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 WebSocket disconnected:', reason);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};