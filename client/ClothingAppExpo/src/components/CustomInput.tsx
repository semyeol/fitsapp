import React, { FC } from 'react';
import { TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';

type CustomInputProps = {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    keyboardType?: KeyboardTypeOptions;
};

const CustomInput: FC<CustomInputProps> = ({ 
    placeholder, 
    value, 
    onChangeText, 
    secureTextEntry = false,
    autoCapitalize = 'none',
    keyboardType = 'default'
}) => {
    return (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            style={styles.input}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 8,
        backgroundColor: '#fff',
        color: '#000'
    }
});

export default CustomInput;