import React, { useState, useEffect } from 'react';
import { Linking } from 'react-native';
import { NavigationContainer, LinkingOptions, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CreateUserScreen from './src/screens/create_user';
import ResetPasswordScreen from './src/screens/reset_pw';
import LoginUserScreen from './src/screens/login_user';
import VerifyUserScreen from './src/screens/verify_user';
import ClosetScreen from './src/screens/closet';
import { RootStackParamList } from './src/types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Import axios for making HTTP requests

const Stack = createStackNavigator<RootStackParamList>();
const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://', 'exp://'],
  config: {
    screens: {
      CreateUser: 'create_user',
      ResetPassword: 'set_new_password/:token',
      Login: 'login',
      Closet: 'closet',
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    console.log("Initial URL:", url);
    return url;
  },
};

// Function to validate token with backend
const validateToken = async (token: string) => {
  try {
    const response = await axios.post('https://your-backend-url.com/validate-token', { token });
    return response.data.isValid;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for authentication token on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        // Validate token with backend
        const isValid = await validateToken(token);
        if (!isValid) {
          // If token is invalid, remove it
          await AsyncStorage.removeItem('userToken');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } else {
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
      <NavigationContainer ref={navigationRef} linking={linking}>
        <Stack.Navigator 
          initialRouteName={isAuthenticated ? "Closet" : "Login"}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {isAuthenticated ? (
            <Stack.Screen 
              name="Closet" 
              component={ClosetScreen}
              options={{
                title: 'My Closet',
              }}
            />
          ) : (
            <>
              <Stack.Screen 
                name="Login" 
                component={LoginUserScreen}
                options={{
                  title: 'Login',
                }}
              />
              <Stack.Screen 
                name="CreateUser" 
                component={CreateUserScreen}
                options={{
                  title: 'Create Account',
                }}
              />
              <Stack.Screen 
                name="ResetPassword" 
                component={ResetPasswordScreen}
                options={{
                  title: 'Reset Password',
                }}
              />
              <Stack.Screen 
                name="VerifyUser" 
                component={VerifyUserScreen}
                options={{
                  title: 'Verify Account',
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}