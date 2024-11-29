import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type ResetPasswordRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
  const route = useRoute<ResetPasswordRouteProp>();
  const token = route.params?.token;

  console.log('Received token:', token); // Debug log to verify token

  return (
    <View>
      <Text>Enter your new password:</Text>
      <TextInput placeholder="New Password" secureTextEntry />
      <Button title="Reset Password" onPress={() => { /* Handle reset */ }} />
    </View>
  );
};

export default ResetPasswordScreen;
