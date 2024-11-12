import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { createUser } from '../api/user';

// Define props type (empty here since no props are passed)
type CreateUserScreenProps = {};

// Define the component with React.FC to specify it’s a functional component
const CreateUserScreen: React.FC<CreateUserScreenProps> = () => {
  // State variables
  const [email, setEmail] = useState<string>('');      // email state as string
  const [username, setUsername] = useState<string>(''); // username state as string
  const [password, setPassword] = useState<string>(''); // password state as string

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
