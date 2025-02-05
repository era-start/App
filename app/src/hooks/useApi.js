import { useState, useCallback } from 'react';
import { showErrorMessage } from '../utils/errorHandler';
import { Alert } from 'react-native';

export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc(...args);
      setData(result);
      return result;
    } catch (error) {
      setError(error);
      Alert.alert('Error', showErrorMessage(error));
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return {
    data,
    loading,
    error,
    execute
  };
}; 