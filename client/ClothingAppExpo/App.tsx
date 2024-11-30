import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CreateUserScreen from './src/screens/create_user';
import ResetPasswordScreen from './src/screens/reset_pw';
import LoginUserScreen from './src/screens/login_user';
import VerifyUserScreen from './src/screens/verify_user';
import ForgotPasswordScreen from './src/screens/forgot_password';
import MainTabs from './src/navigation/MainTabs';
import { AuthStackParamList } from './src/types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateToken } from './src/api/auth';

const Stack = createStackNavigator<AuthStackParamList>();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { isValid } = await validateToken();
      const isAuthenticatedValue = await AsyncStorage.getItem('isAuthenticated');
      
      if (isValid && isAuthenticatedValue === 'true') {
        setIsAuthenticated(true);
      } else {
        await AsyncStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={isAuthenticated ? "MainTabs" : "Login"}
        >
          <Stack.Screen name="Login" component={LoginUserScreen} />
          <Stack.Screen name="CreateUser" component={CreateUserScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="VerifyUser" component={VerifyUserScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;