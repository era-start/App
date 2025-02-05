import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',
    secondary: '#1976D2',
    accent: '#03A9F4',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#000000',
    error: '#B00020',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#000000',
    onSurface: '#000000',
    onError: '#FFFFFF',
    disabled: '#BDBDBD',
    placeholder: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.5)'
  }
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#90CAF9',
    secondary: '#64B5F6',
    accent: '#4FC3F7',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    error: '#CF6679',
    success: '#81C784',
    warning: '#FFD54F',
    info: '#64B5F6',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onError: '#000000',
    disabled: '#757575',
    placeholder: '#BDBDBD',
    backdrop: 'rgba(0, 0, 0, 0.8)'
  }
};

export { lightTheme, darkTheme }; 