// SortPicker.tsx
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SortKey = 'active' | 'runLengthDays' | 'scansPerDay' | 'redeemsPerDay';

interface SortPickerProps {
    selectedValue: SortKey;
    onValueChange: (value: SortKey) => void;
}

const SortPicker: React.FC<SortPickerProps> = ({ selectedValue, onValueChange }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Previous Promotions</Text>
            <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => onValueChange(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Active" value="active" />
                <Picker.Item label="Run Length (Days)" value="runLengthDays" />
                <Picker.Item label="Scans per Day" value="scansPerDay" />
                <Picker.Item label="Redeems per Day" value="redeemsPerDay" />
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: .1,
        borderBottomColor: 'black',
        paddingBottom: 5,
    },
    label: {
        fontSize: 14,
        marginBottom: 2,
        fontWeight: '600',
    },
    picker: {
        height: 30,
        width: '50%',
        borderWidth: 0,
        backgroundColor: '#F8F4F9',
        padding: 4,
        borderRadius: 8,
    },
});

export default SortPicker;