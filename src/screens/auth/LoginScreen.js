import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Surface, 
  ActivityIndicator,
  useTheme 
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';

const LoginScreen = ({ navigation }) => {
  const [credentials, setCredentials] = useState({
    employeeId: '',
    password: ''
  });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const theme = useTheme();

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Main');
    }
  }, [isAuthenticated, navigation]);

  const handleLogin = async () => {
    dispatch(loginStart());

    try {
      const response = await fetch('http://your-api-url/api/auth/employee/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      dispatch(loginSuccess(data));
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Surface style={styles.surface}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text variant="headlineMedium" style={styles.title}>
          Employee Login
        </Text>

        {error && (
          <Text style={styles.error}>
            {error}
          </Text>
        )}

        <TextInput
          mode="outlined"
          label="Employee ID"
          value={credentials.employeeId}
          onChangeText={(text) => setCredentials({
            ...credentials,
            employeeId: text
          })}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          mode="outlined"
          label="Password"
          value={credentials.password}
          onChangeText={(text) => setCredentials({
            ...credentials,
            password: text
          })}
          secureTextEntry={secureTextEntry}
          right={
            <TextInput.Icon
              icon={secureTextEntry ? 'eye-off' : 'eye'}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          disabled={loading}
          style={styles.button}
          loading={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 20
  },
  surface: {
    padding: 20,
    borderRadius: 10,
    elevation: 4
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20
  },
  title: {
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    marginBottom: 15
  },
  button: {
    marginTop: 10
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15
  }
});

export default LoginScreen; 