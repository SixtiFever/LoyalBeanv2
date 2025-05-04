import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import CoffeeShopIcon from "@/assets/icons/CoffeeShopIcon";
import CoffeeCupIcon from "@/assets/icons/CoffeeCupIcon";
import { RaspberryBubblegum } from "@/styles";
import { useRouter } from "expo-router";
import { getLoadedFonts, useFonts } from "expo-font";

const Onboarding = () => {

    // states
    const router = useRouter();

    // reanimated
    const progress = useSharedValue(0);

    useEffect(() => {

        progress.value = withRepeat(withTiming(3, {duration: 20000}), -1, true)

        console.log(getLoadedFonts())

    }, [])

    const pulsingBackground = useAnimatedStyle(() => {

        const color = interpolateColor(
            progress.value,
            [0,1,2,4],
            RaspberryBubblegum
        );

        return {
            backgroundColor: color,
        }
    })


    const onSelectNavigate = (option?: string) => {

        if ( option === 'customer' ) {

            try {

                router.navigate({
                    pathname: '/screens/onboarding/customerlogin',
                    params: { loginType: option}
                });
    
            } catch(err) {
                console.log(err);
            }
        } else {

            router.navigate({
                pathname: '/screens/onboarding/cafelogin',
                params: { loginType: option}
            });

        }
        
    }

    return (
        <Animated.View style={[styles.container, pulsingBackground]}>
            <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>I am a...</Text>
                </View>
                <View style={styles.iconsContainer}>
                    <View onTouchEnd={() => onSelectNavigate('cafe')} style={styles.iconContainer}>
                        <CoffeeShopIcon />
                        <Text style={styles.iconText}>Cafe Owner</Text>
                    </View>
                    <View onTouchEnd={() => onSelectNavigate('customer')} style={styles.iconContainer}>
                        <CoffeeCupIcon />
                        <Text style={styles.iconText}>Coffee Drinker</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentContainer: {
        height: '80%',
        width: '90%',
    },
    textContainer: {
        height: '20%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    iconsContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    iconContainer: {
        display: 'flex',
        backgroundColor: 'white',
        height: 150,
        width: 150,
        borderRadius: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 8,
    },
    iconText: {
        fontSize: 12,
        fontWeight: 600,
    }
})

export default Onboarding;