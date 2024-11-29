// src/types/reset_pw_types.ts

import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './navigation'; // Import the general stack types

// Define the RouteProp type specifically for ResetPassword
export type ResetPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

// Define the props expected by ResetPasswordScreen
export interface ResetPasswordScreenProps {
  route: ResetPasswordScreenRouteProp;
}
