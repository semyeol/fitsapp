import React from 'react';
import { Linking } from 'react-native';
import { NavigationContainer, LinkingOptions, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CreateUserScreen from './src/screens/create_user';
import ResetPasswordScreen from './src/screens/reset_pw';
import LoginUserScreen from './src/screens/login_user';
import { RootStackParamList } from './src/types/navigation';

// Initialize Stack Navigator with typed parameter list
const Stack = createStackNavigator<RootStackParamList>();

// Create a navigation reference
const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

// Deep linking configuration
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://', 'exp://'],  // Added exp:// for Expo
  config: {
    screens: {
      CreateUser: 'create_user',
      ResetPassword: 'set_new_password/:token',
      Login: 'login',
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    console.log("Initial URL:", url);
    return url;
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <Stack.Navigator 
          initialRouteName="Login"
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
          <Stack.Screen 
            name="Login" 
            component={LoginUserScreen} 
            options={{ title: 'Login' }} 
          />
          <Stack.Screen 
            name="CreateUser" 
            component={CreateUserScreen} 
            options={{ title: 'Create User' }} 
          />
          <Stack.Screen 
            name="ResetPassword" 
            component={ResetPasswordScreen} 
            options={{ title: 'Reset Password' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}