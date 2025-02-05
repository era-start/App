import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/redux/store';
import { lightTheme, darkTheme } from './src/theme';
import NotificationService from './src/services/notifications';
import BackgroundSyncService from './src/services/backgroundSync';

const ThemedApp = () => {
  const { darkMode } = useSelector(state => state.theme);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const initServices = async () => {
      if (isAuthenticated) {
        await NotificationService.init();
        await BackgroundSyncService.init();
      }
    };

    initServices();
  }, [isAuthenticated]);

  return (
    <PaperProvider theme={darkMode ? darkTheme : lightTheme}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </PaperProvider>
  );
};

const App = () => {
  return (
    <StoreProvider store={store}>
      <ThemedApp />
    </StoreProvider>
  );
};

export default App; 