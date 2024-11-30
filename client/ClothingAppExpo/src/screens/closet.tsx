import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainAppStackParamList, RootStackParamList } from '../types/navigation';
import { removeAuthToken } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ClosetScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<MainAppStackParamList, 'Closet'>,
    StackNavigationProp<RootStackParamList>
>;

type ClosetScreenProps = {
    navigation: ClosetScreenNavigationProp;
};

const ClosetScreen: React.FC<ClosetScreenProps> = ({ navigation }) => {
    
    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
            if (isAuthenticated !== 'true') {
                navigation.navigate('Login');
            }
        };
        checkAuth();
    }, [navigation]);

    const handleLogout = async () => {
        try {
            await removeAuthToken();
            await AsyncStorage.removeItem('isAuthenticated');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Closet</Text>
            <Text>Welcome to your digital closet!</Text>
            <View style={styles.logoutContainer}>
                <Button title="Logout" onPress={handleLogout} color="#f4511e" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    logoutContainer: {
        marginTop: 20,
    },
});

export default ClosetScreen;
