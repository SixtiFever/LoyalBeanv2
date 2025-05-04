import { memo, ReactNode } from "react";
import { ButtonProps, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CustomNavbarProps extends ButtonProps {
    title: string;
    height: number;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    leftOnPress?: () => void;
    rightOnPress?: () => void;
    color?: string;
    fontWeight?: string;
    fontSize?: number;
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({
    height, leftIcon, title, rightIcon, leftOnPress, rightOnPress, color, fontWeight, fontSize }) => {


    return (
        <View style={[styles.container, { height: height, backgroundColor: `${color ?? 'white'}` }]}>
            
            <TouchableOpacity onPress={leftOnPress} style={styles.leftContainer}>
                {leftIcon}
            </TouchableOpacity>
            <View style={styles.middleContainer}>
                <Text style={{ fontWeight: fontWeight ? fontWeight : '500', fontSize: fontSize ? fontSize: 14, }}>{title}</Text>
            </View>
            <TouchableOpacity onPress={rightOnPress} style={styles.rightContainer}>
                {rightIcon}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftContainer: {
        width: '25%',
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleContainer: {
        width: '50%',
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        width: '25%',
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default memo(CustomNavbar);