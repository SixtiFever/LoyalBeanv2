import { memo, ReactNode, useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

interface CustomTextInputProps extends TextInputProps {
    leftIcon?: ReactNode;
    widthPercentage: number;  // % occupancy width of parent container
    height: number;
    handleChangeText?: any;
    type: 'email' | 'password' | 'username' | 'confirmEmail' | 'shopname' | 'reward' | 'about' | 'interests';
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({leftIcon, type, widthPercentage, height, handleChangeText, ...props}) => {

    const [text, setText] = useState<string>('')

    const handleChange = (e: any) => {
        setText(e)
        handleChangeText(type, e)
    }

    return (
        <View style={[styles.container, { width: `${widthPercentage}%`, height: height }]}>
            <View style={styles.iconContainer}>
                {leftIcon}
            </View>
            <TextInput
                placeholderTextColor={'#D2CBCB'}
                value={text}
                onChangeText={(e) => handleChange(e)}
                style={styles.textInput}
                placeholder={props.placeholder ?? 'Enter text'}

                />
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

export default memo(CustomTextInput);