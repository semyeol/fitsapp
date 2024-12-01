import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';
import CustomInput from '../components/CustomInput';
import config from '@config';

type ResetPasswordScreenProps = StackScreenProps<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ route, navigation }) => {
  const { token } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage('Please fill in all fields');
      setIsError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch(`${config.extra.apiBaseUrl}/reset_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successful!');
        setIsError(false);
        // Navigate to login after a short delay
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
      } else {
        setMessage(data.message || 'Failed to reset password');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set New Password</Text>

      <CustomInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <CustomInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {message ? (
        <Text style={[styles.message, isError ? styles.error : styles.success]}>
          {message}
        </Text>
      ) : null}

      <Button
        title={isLoading ? "Resetting..." : "Reset Password"}
        onPress={handleResetPassword}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    marginVertical: 10,
    textAlign: 'center',
  },
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
  },
});

export default ResetPasswordScreen;
