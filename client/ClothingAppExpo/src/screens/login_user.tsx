import React, { useState } from "react";
import {View, Text, Button, StyleSheet, TouchableOpacity} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginUser} from "../api/user";
import CustomInput from "../components/CustomInput";
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { setAuthToken } from '../api/auth';

type LoginUserScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

const LoginUserScreen: React.FC<LoginUserScreenProps> = ({ navigation }) => {
    const [identifier, setIdentifier] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleLogin = async () => {
        try {
            const response = await loginUser({ identifier, password });
            console.log('Login response:', response);
            
            if (response.token) {
                await setAuthToken(response.token);
                await AsyncStorage.setItem('isAuthenticated', 'true');
                navigation.replace('MainTabs'); // changed from 'Closet' 
            } else {
                setError('Login failed: No token received');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed. Check your credentials.');
        }
    };

    return (
        <View style={styles.container}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <CustomInput 
                placeholder="Username/Email"
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType="email-address"
            />
            
            <CustomInput 
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            <Button title="Login" onPress={handleLogin} />
            
            <TouchableOpacity 
                onPress={() => navigation.navigate('CreateUser')}
                style={styles.linkContainer}
            >
                <Text style={styles.linkText}>Don't have an account? Create one</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.linkContainer}
            >
                <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>
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
    },
    linkContainer: {
        marginTop: 15,
        alignItems: 'center'
    },
    linkText: {
        color: '#007AFF',
        textDecorationLine: 'underline'
    }
});

export default LoginUserScreen;