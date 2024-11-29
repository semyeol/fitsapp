import React, {useState} from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { verifyUser } from '../api/user';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type VerifyUserScreenProps = StackScreenProps<RootStackParamList, 'VerifyUser'>;

const VerifyUserScreen: React.FC<VerifyUserScreenProps> = ({ route }) => {
  const { email } = route.params;
  const [verificationCode, setVerificationCode] = useState<string>('');

  const handleVerifyUser = async () => {
    try {
      const response = await verifyUser({ code: verificationCode, email });
      Alert.alert('Success', response.message);
    } catch (error) {
      Alert.alert('Error', 'Failed to verify user');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        placeholder="Enter Verification Code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="number-pad"
      />
      <Button title="Verify Account" onPress={handleVerifyUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  }
});

export default VerifyUserScreen;