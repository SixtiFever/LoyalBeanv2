import { PadlockIcon } from "@/assets/icons";
import { memo, useState } from "react";
import { StyleSheet, TextInputProps, View, TextInput } from "react-native"

interface CustomPasswordInputProps extends TextInputProps {
    widthPercentage: number;  // % occupancy width of parent container
    height: number;
    handleChangeText?: any;
    type?: 'email' | 'password' | 'username' | 'confirmPassword';
}

const CustomPasswordInput: React.FC<CustomPasswordInputProps> = ({type, handleChangeText, widthPercentage, height, ...props}) => {

    const [text, setText] = useState<string>('');

    const handleChange = (e: any) => {
        setText(e)
        handleChangeText(type, e)
    }

    return (
        <View style={[styles.container, { width: `${widthPercentage}%`, height: height }]}>
            <View style={styles.iconContainer}>
                <PadlockIcon width='15' height="25" color='#D2CBCB' />
            </View>
            <TextInput
                placeholderTextColor={'#D2CBCB'}
                value={text}
                onChangeText={(e) => handleChange(e)}
                style={styles.textInput}
                placeholder={props.placeholder ?? 'Enter password'}
                secureTextEntry={true} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: 60,
        borderRadius: 10,
    },
    iconContainer: {
        width: '20%',
        height: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        width: '80%',
        height: '100%',
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        color: '#424C55',
        fontWeight: '400',
        letterSpacing: 1
    }
})

export default memo(CustomPasswordInput);