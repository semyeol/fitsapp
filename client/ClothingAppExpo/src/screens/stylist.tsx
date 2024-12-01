import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';

type StylistScreenProps = BottomTabScreenProps<MainTabParamList, 'Stylist'>;

const StylistScreen: React.FC<StylistScreenProps> = () => {
    return (
        <View style={styles.container}>
            <Text>Fit Builder Screen</Text>
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

export default StylistScreen;