import { useEffect, useRef, useState } from 'react';
import { updateActivity } from '../services/api';

export const useActivityTracker = (userEmail, isLoggedIn) => {
  const [sessionSeconds, setSessionSeconds] = useState(() => {
    const saved = localStorage.getItem('sessionSeconds');
    return saved ? parseInt(saved) : 0;
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn || !userEmail) return;

    // Increment session seconds every second
    intervalRef.current = setInterval(() => {
      setSessionSeconds(prev => {
        const newSec = prev + 1;
        localStorage.setItem('sessionSeconds', newSec);
        return newSec;
      });
    }, 1000);

    // Save full minutes to backend every minute
    const minuteSaver = setInterval(async () => {
      const savedSec = parseInt(localStorage.getItem('sessionSeconds')) || 0;
      if (savedSec >= 60) {
        const minutesToSave = Math.floor(savedSec / 60);
        try {
          await updateActivity(userEmail, minutesToSave);
          // Keep remainder seconds
          const remainder = savedSec % 60;
          localStorage.setItem('sessionSeconds', remainder);
          setSessionSeconds(remainder);
        } catch (err) {
          console.error("Failed to save activity:", err);
        }
      }
    }, 60000);

    // Save remaining seconds on tab close or reload
    const handleBeforeUnload = async () => {
      const savedSec = parseInt(localStorage.getItem('sessionSeconds')) || 0;
      if (savedSec > 0) {
        const minutesToSave = Math.floor(savedSec / 60);
        try {
          await updateActivity(userEmail, minutesToSave);
          localStorage.setItem('sessionSeconds', savedSec % 60);
        } catch (err) {
          console.error("Failed to save activity on unload:", err);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(minuteSaver);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userEmail, isLoggedIn]);

  return sessionSeconds;
};
