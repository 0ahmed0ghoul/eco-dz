// src/contexts/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log('🔌 SocketProvider: Initializing socket connection...');

    // Create socket connection
    const socketInstance = io("http://localhost:5000", {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });

    socketInstance.on('connect', () => {
      console.log('✅ SocketProvider: Global socket connected:', socketInstance.id);
      
      // Send user online status if logged in
      const userId = localStorage.getItem("userId");
      if (userId) {
        console.log('👤 SocketProvider: Sending user online status:', userId);
        socketInstance.emit("user-online", { userId });
      }
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ SocketProvider: Socket disconnected:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('⚠️ SocketProvider: Connection error:', error);
    });

    setSocket(socketInstance);

    return () => {
      console.log('🔌 SocketProvider: Cleaning up socket connection');
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Updated useSocket hook that doesn't throw error for null socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  
  // Check if we're inside SocketProvider
  if (context === undefined) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  
  // Return the socket (can be null during initial connection)
  return context;
};

// Optional: Hook for checking if socket is ready
export const useSocketReady = () => {
  const socket = useSocket();
  return socket !== null && socket.connected;
};