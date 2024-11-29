import React, { useState } from "react";
import {View, Text, Button, StyleSheet, TouchableOpacity} from "react-native";
import {loginUser } from "../api/user";
import CustomInput from "../components/CustomInput";

type LoginUserScreenProps = {
    navigation: any;
};

const LoginUserScreen: React.FC<LoginUserScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleLogin = async () => {
        try {
            const response = await loginUser({ email, password });
            console.log('Login response:', response);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed. Please check your email and password.');
        }
    };

    return (
        <View style={styles.container}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <CustomInput 
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
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