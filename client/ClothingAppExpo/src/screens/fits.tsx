import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';

type FitsScreenProps = BottomTabScreenProps<MainTabParamList, 'Fits'>;

const FitsScreen: React.FC<FitsScreenProps> = () => {
    return (
        <View style={styles.container}>
            <Text>Fits Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FitsScreen;