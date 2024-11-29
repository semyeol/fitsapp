import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { removeAuthToken } from '../api/auth';

type ClosetScreenProps = StackScreenProps<RootStackParamList, 'Closet'>;

const ClosetScreen: React.FC<ClosetScreenProps> = ({ navigation }) => {
    const handleLogout = async () => {
        try {
            await removeAuthToken();
            // Use replace to prevent going back to the closet screen after logout
            navigation.replace('Login');
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
