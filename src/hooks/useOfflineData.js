import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { StorageService, STORAGE_KEYS } from '../services/storage';

export const useOfflineData = (key, fetchFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadData();
  }, [isOnline]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get cached data first
      const cachedData = await StorageService.getData(key);
      if (cachedData) {
        setData(cachedData);
      }

      // If online, fetch fresh data
      if (isOnline) {
        const freshData = await fetchFunction();
        await StorageService.saveData(key, freshData);
        setData(freshData);
      }
    } catch (error) {
      setError(error);
      // If error and no cached data, show error
      if (!data) {
        console.error('Error loading data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => loadData();

  return {
    data,
    loading,
    error,
    refresh,
    isOnline
  };
}; 