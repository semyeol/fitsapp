import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ActionSheetIOS, Platform, Alert } from "react-native";
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainTabParamList, AuthStackParamList } from '../types/navigation';
import { removeAuthToken } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

type ClosetScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, 'Closet'>,
    StackNavigationProp<AuthStackParamList>
>;

type ClosetScreenProps = {
    navigation: ClosetScreenNavigationProp;
};

const ClosetScreen: React.FC<ClosetScreenProps> = ({ navigation }) => {
    // represent two states
    // string (image url), null (nothing selected)
    const [image, setImage] = useState<string | null>(null);
    const [size, setSize] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [layer, setLayer] = useState<string>('');

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
            if (isAuthenticated !== 'true') {
                navigation.navigate('Login');
            }
        };
        checkAuth();
    }, [navigation]);

    const showImagePicker = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
                    cancelButtonIndex: 0,
                },
                async (buttonIndex) => {
                    if (buttonIndex === 1) {
                        // Take Photo
                        const { status } = await ImagePicker.requestCameraPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert('Permission needed', 'Sorry, we need camera permissions to make this work!');
                            return;
                        }
                        let result = await ImagePicker.launchCameraAsync({
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 1,
                        });
                        if (!result.canceled) {
                            setImage(result.assets[0].uri);
                        }
                    } else if (buttonIndex === 2) {
                        // Choose from Gallery
                        let result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 1,
                        });
                        if (!result.canceled) {
                            setImage(result.assets[0].uri);
                        }
                    }
                }
            );
        } else {
            // For Android, show a regular Alert with options
            Alert.alert(
                'Add New Piece',
                'Choose an option',
                [
                    {
                        text: 'Take Photo',
                        onPress: async () => {
                            const { status } = await ImagePicker.requestCameraPermissionsAsync();
                            if (status !== 'granted') {
                                Alert.alert('Permission needed', 'Sorry, we need camera permissions to make this work!');
                                return;
                            }
                            let result = await ImagePicker.launchCameraAsync({
                                allowsEditing: true,
                                aspect: [1, 1],
                                quality: 1,
                            });
                            if (!result.canceled) {
                                setImage(result.assets[0].uri);
                            }
                        }
                    },
                    {
                        text: 'Choose from Gallery',
                        onPress: async () => {
                            let result = await ImagePicker.launchImageLibraryAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                aspect: [1, 1],
                                quality: 1,
                            });
                            if (!result.canceled) {
                                setImage(result.assets[0].uri);
                            }
                        }
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    }
                ]
            );
        }
    };

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
            <Button title="Add New Piece" onPress={showImagePicker} />
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
