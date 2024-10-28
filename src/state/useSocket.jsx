import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (url, options = {}) => {
  const socketRef = useRef(null);
  const eventHandlers = useRef(new Map());

  useEffect(() => {
    socketRef.current = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
      timeout: 10000,
      ...options
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      if (socketRef.current) {
        eventHandlers.current.forEach((handler, event) => {
          socketRef.current.off(event, handler);
        });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [url]);

  const on = (event, handler) => {
    if (socketRef.current) {
      eventHandlers.current.set(event, handler);
      socketRef.current.on(event, handler);
    }
  };

  const off = (event) => {
    if (socketRef.current) {
      const handler = eventHandlers.current.get(event);
      if (handler) {
        socketRef.current.off(event, handler);
        eventHandlers.current.delete(event);
      }
    }
  };

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return { socket: socketRef.current, on, off, emit };
};