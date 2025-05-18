import { resolvePromotionRedeem } from "@/utils/FirebaseController";
import { splitPattern } from "@/utils/utils";
import { BarcodeScanningResult, CameraView } from "expo-camera";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useLayoutEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

const RedeemScanner = () => {

    // states
    const [user, setUser] = useState<User>();
    const [userError, setUserError] = useState<boolean>(false);
    
    // refs
    const isScanned = useRef<boolean>(false);  // scan once controller

    useLayoutEffect(() => {
    
            onAuthStateChanged(getAuth(), (user) => {
                if ( user ) setUser(user);
                if (!user) setUserError(true);
            })
    
        }, [])

    const handleBarcodeScanned = (scanResult: BarcodeScanningResult) => {
        if ( !isScanned.current ) {
            isScanned.current = true;
            handleResolveRedeem(scanResult.data)
        }
    }

    const handleResolveRedeem = async (promotionId: string) => {
        const [uid, rid] = promotionId.split(splitPattern);
        if (!user) return;
        await resolvePromotionRedeem(user?.uid, uid, promotionId)
    }

    return (
        <View style={styles.container}>
            <CameraView onBarcodeScanned={handleBarcodeScanned} style={styles.camera}>
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

export default RedeemScanner;