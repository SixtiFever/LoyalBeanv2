import { DashboardMenuOption } from "@/types/DashboardMenuOption";
import { SetStateAction } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HorizontalPickerProps {
    options: DashboardMenuOption[];
    setOption: SetStateAction<any>;
}

const HorizontalPicker: React.FC<HorizontalPickerProps> = ({options, setOption}) => {

    const handleSetOption = (option: DashboardMenuOption) => {
        const newOptions = options.map((o) =>
            o.label === option.label ? { ...o, selected: true } : { ...o, selected: false }
        );
        setOption(newOptions);
    }

    return (
        <View style={styles.container}>
            { options.map((option, index) => {
                return (
                    <TouchableOpacity onPress={() => handleSetOption(option)} key={index}>
                        <Text style={ option.selected ? styles.textActive : styles.text }>{option.label}</Text>
                    </TouchableOpacity>
                )
        }) }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: 20,
    },
    text: {
        fontWeight: '400',
        color: 'grey'
    },
    textActive: {
        fontWeight: 'bold',
        color: 'black',
    }
})

export default HorizontalPicker;