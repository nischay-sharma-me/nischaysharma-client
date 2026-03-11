import { useEffect, useState } from 'react';
import { initSocket, onJobEvent, disconnectSocket } from '@/services/socketService';
import { toast } from 'sonner';
import { eventsService } from '@/services/events.service';
import { auth } from '@/lib/firebase';
import { useNotificationStore } from '@/store/useNotificationStore';

export const useJobSocket = (userId?: string, deviceId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!userId) return;

    let cleanup: (() => void) | undefined;

    const setupSocket = async () => {
      const socket = await initSocket(deviceId);
      if (socket) {
        setIsConnected(socket.connected);

        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));

        cleanup = onJobEvent((data) => {
          handleJobNotification(data, deviceId);
        });
      }
    };

    setupSocket();

    return () => {
      if (cleanup) cleanup();
      disconnectSocket();
    };
  }, [userId, deviceId]);

  const handleJobNotification = async (data: any, devId?: string) => {
    const { type, status, id } = data;

    let message = '';
    let toastType: 'info' | 'success' | 'error' | 'loading' = 'info';

    // Map status to human-readable message and toast type
    switch (status) {
      case 'queued':
        message = `Job Queued: ${type.replace(/-/g, ' ')}`;
        toastType = 'info';
        break;
      case 'processing':
        message = `Job Processing: ${type.replace(/-/g, ' ')} (${data.progress}%)`;
        toastType = 'loading';
        break;
      case 'completed':
        message = `Job Completed: ${type.replace(/-/g, ' ')}`;
        toastType = 'success';
        break;
      case 'failed':
        message = `Job Failed: ${type.replace(/-/g, ' ')}`;
        toastType = 'error';
        break;
    }

    // Display Persistent Toast (duration: Infinity)
    toast[toastType](message, { 
      description: status === 'failed' ? (data.error || 'Unknown error occurred.') : `ID: ${id}`,
      duration: Infinity, // Keep on screen until clicked/closed
      id: `job_${id}_${status}` // Prevent duplicate toasts for same status
    });

    // Add to Notification Store
    addNotification({
      type,
      status,
      message,
      timestamp: Date.now(),
      data: data
    });

    // Store event on server
    try {
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        await eventsService.storeEvent({
          type: `job:${status}`,
          payload: data,
          deviceId: devId
        }, token);
      }
    } catch (err) {
      console.error('Failed to store received event:', err);
    }
  };

  return { isConnected };
};

