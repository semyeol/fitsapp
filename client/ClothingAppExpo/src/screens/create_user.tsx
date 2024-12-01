import React, { useState } from 'react';
import { View, Button, Alert, Text, StyleSheet } from 'react-native';
import { createUser } from '../api/user';
import CustomInput from '../components/CustomInput';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';

type CreateUserScreenProps = StackScreenProps<AuthStackParamList, 'CreateUser'>;

const CreateUserScreen: React.FC<CreateUserScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [generalError, setGeneralError] = useState<string>('');

  const handleCreateUser = async () => {
    // Clear previous errors
    setEmailError('');
    setUsernameError('');
    setGeneralError('');

    try {
      const response = await createUser({ email, username, password });
      // Navigate to verification screen
      navigation.replace('VerifyUser', { email });
    } catch (error: any) {
      if (error.response?.status === 409) {
        // Handle specific field errors
        if (error.response.data.field === 'email') {
          setEmailError(error.response.data.message);
        } else if (error.response.data.field === 'username') {
          setUsernameError(error.response.data.message);
        }
      } else {
        // Handle general errors
        setGeneralError(error.response?.data?.message || 'Error creating account');
      }
    }
  };

  return (
    <View style={styles.container}>
      {generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}
      
      <CustomInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      
      <CustomInput 
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
      
      <CustomInput 
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button title="Create User" onPress={handleCreateUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  }
});

export default CreateUserScreen;
