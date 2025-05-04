import { Dispatch, memo, SetStateAction } from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native"

interface TextInputLocalProps extends TextInputProps {
    setStateVariable?: Dispatch<SetStateAction<string>>;
}

const TextInputLocal: React.FC<TextInputLocalProps> = ({...props}) => {
    return (
        <TextInput 
            style={styles.input}
            value={props.value}
            placeholderTextColor="#888"
            secureTextEntry={props.secureTextEntry}
            placeholder={props.placeholder}
            onChangeText={props.setStateVariable || props.onChangeText} />
    )
}


const styles = StyleSheet.create({
    input: {
        width: '90%',
        height: 60,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#FFFCF9'
      },
})

export default TextInputLocal;