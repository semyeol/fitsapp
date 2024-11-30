import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainAppStackParamList } from '../types/navigation';

type FitBuilderScreenProps = BottomTabScreenProps<MainAppStackParamList, 'FitBuilder'>;

const FitBuilderScreen: React.FC<FitBuilderScreenProps> = () => {
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

export default FitBuilderScreen;