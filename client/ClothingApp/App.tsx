import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { NavigationContainer, LinkingOptions, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateUserScreen from './src/screens/create_user';
import ResetPasswordScreen from './src/screens/reset_pw';
import { RootStackParamList } from './src/types/navigation';

// Initialize Stack Navigator with typed parameter list
const Stack = createStackNavigator<RootStackParamList>();

// Create a navigation reference
const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

// Deep linking configuration
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      CreateUser: 'create_user',
      ResetPassword: 'set_new_password/:token',
    },
  },
  getInitialURL: async () => {
    const url = await Linking.getInitialURL();
    console.log("Initial URL:", url);
    return url;
  },
};

const App = (): React.JSX.Element => {
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      console.log("Received URL while app is open:", url);

      if (url) {
        const token = url.split('/').pop();  // Extract the token from the URL
        navigationRef.current?.navigate('ResetPassword', { token: token || '' });
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator initialRouteName="CreateUser">
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
  );
};

export default App;
