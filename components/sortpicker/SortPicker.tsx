import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SortKey = 'active' | 'runLengthDays' | 'scansPerDay' | 'redeemsPerDay';

interface SortPickerProps {
    selectedValue: SortKey;
    onValueChange: (value: SortKey) => void;
}

const filterOptions: { label: string; value: SortKey }[] = [
    // { label: 'Active', value: 'active' },
    { label: 'Scans / Day', value: 'scansPerDay' },
    { label: 'Run Length', value: 'runLengthDays' },
    { label: 'Redeems / Day', value: 'redeemsPerDay' },
];

const SortPicker: React.FC<SortPickerProps> = ({ selectedValue, onValueChange }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Previous Promotions</Text>
            <View style={styles.buttonContainer}>
                {filterOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => onValueChange(option.value)}
                        style={[
                            styles.button,
                            selectedValue === option.value && styles.selectedButton,
                        ]}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                selectedValue === option.value && styles.selectedButtonText,
                            ]}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    button: {
        backgroundColor: '#F8F4F9',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedButton: {
        backgroundColor: '#6200EE',
    },
    buttonText: {
        fontSize: 14,
        color: '#333',
    },
    selectedButtonText: {
        color: '#fff',
    },
});

export default SortPicker;
