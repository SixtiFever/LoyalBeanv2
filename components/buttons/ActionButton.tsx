import { getLoadedFonts } from "expo-font"
import { memo, useEffect } from "react"
import { TouchableOpacity, Text, ButtonProps, StyleSheet, View } from "react-native"

interface ActionButtonProps extends ButtonProps {

}

const ActionButton: React.FC<ActionButtonProps> = ({...props}) => {

    useEffect(() => {
        console.log(getLoadedFonts())
    }, [])

    return (
        <View style={styles.viewContainer}>
            <TouchableOpacity onPress={props.onPress} style={[styles.container, {backgroundColor: props.color, borderColor: props.color}]}>
                <Text style={styles.text}>{props.title}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        height: 60,
        width: '90%',
        backgroundColor: '#3B3561',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1.3,
        color: 'black',

    },
})

export default memo(ActionButton);