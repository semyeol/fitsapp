import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
// createUser is frontend code to handle the API call to flask create_user
import { createUser } from '../api/user'; 

const CreateUserScreen = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateUser = async () => {
    try {
      const response = await createUser({ email, username, password });
      Alert.alert('Success', response.message);
    } catch (error) {
      Alert.alert('Error', 'Failed to create user');
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Create User" onPress={handleCreateUser} />
    </View>
  );
};

export default CreateUserScreen;
