import { splitPattern } from "@/utils/utils"
import { BarcodeScanningResult, CameraView } from "expo-camera"
import { useLocalSearchParams } from "expo-router"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { useLayoutEffect, useRef, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface CardScannerProps {
    currentCount?: number;
    redeemCount?: number;
}

const RepeatScanner: React.FC<CardScannerProps> = ({}) => {

    const [user, setUser] = useState<User>();
    const [userError, setUserError] = useState<boolean>(false)
    const state = useLocalSearchParams();
    const currentCount: number = Number(state.currentCount);
    const redeemCount: number = Number(state.redeemCount);
    const isScanned = useRef<boolean>(false);  // scan once controller

    useLayoutEffect(() => {

        onAuthStateChanged(getAuth(), (user) => {
            if ( user ) setUser(user);
            if (!user) setUserError(true);
        })

    }, [])

    const handleBarcodeScanned = (scanResult: BarcodeScanningResult) => {
        if ( !isScanned.current ) {
            const scanData = scanResult.data;
            const [cafeId, quantity]: string[] = scanData.split(splitPattern);
            if (parseInt(quantity) < 1) {
                console.log('Invalid coffee count ( < 1 )');
                return;
            }
            updateCard(parseInt(quantity), currentCount, redeemCount)
            isScanned.current = true;
        }
    }

    // performCardActionsAsync
    const updateCard = async (quantity: number, currentCount: number, redeemCount: number) => {
        const scanCount: number = quantity + currentCount;
        const newScanCount: number = scanCount > redeemCount ? (scanCount % redeemCount) - 1 : scanCount;
        console.log(`Original scan count: ${currentCount} \n Quantity: ${quantity} \n New scan count: ${newScanCount}`)

        // fetch card information
    }

    return (
        <View style={styles.container}>
            <CameraView onBarcodeScanned={handleBarcodeScanned} style={styles.camera}>
                <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>{currentCount}</Text>
                    <Text style={styles.text}>{redeemCount}</Text>
                </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default RepeatScanner;