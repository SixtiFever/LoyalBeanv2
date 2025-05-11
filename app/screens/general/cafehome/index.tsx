import useFetchCafeCards from "@/app/hooks/useFetchCafeCards"
import useFetchCafeData from "@/app/hooks/useFetchCafeData"
import { DashboardIcon, SettingsIcon } from "@/assets/icons"
import { ActionButton } from "@/components/buttons"
import CustomNavbar from '@/components/navbar'
import NumberPickerLocal from '@/components/NumericInputLocal'
import { Cafe } from "@/types/User"
import { splitPattern } from "@/utils/utils"
import { router, useNavigation } from "expo-router"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { DocumentData } from "firebase/firestore"
import { memo, useCallback, useLayoutEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import QRCode from "react-native-qrcode-svg"
import { SafeAreaView } from "react-native-safe-area-context"

const CafeHome = () => {

    const nav = useNavigation();
    const [id, setId] = useState<string>()
    const [quantity, setQuantity] = useState<number>(0)
    const [fetchedCafeData, loadingData, errorData] = useFetchCafeData();
    const [fetchedCardsData, loadingCards, errorCards] = useFetchCafeCards();
    const [cafeData, setCafeData] = useState<Cafe | null>(null)
    const [cardsData, setCardsData] = useState<DocumentData>()
    const [qrdata, setQrdata] = useState<string>('')
    const baseString = `${id}${splitPattern}`;

    useLayoutEffect(() => {

        const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
            if ( !user?.uid ) return;
            setId(user?.uid);
        });

        nav.setOptions({
            headerShown: false,
        });

        return () => unsubscribe()

    }, [])


    const handleQuantityChange = useCallback((val: number) => {
        setQuantity(val);
    }, []);

    const handleGenerateCode = () => {
        setQrdata(baseString.concat(`${quantity}`))
    }

    const handleNavDashboard = () => {
        router.navigate('/screens/general/cafedashboard')
    }

    console.log(qrdata)
    
    return (
        <SafeAreaView edges={["top"]} style={styles.container}>
            <CustomNavbar 
                leftIcon={<SettingsIcon width="25" height="25" />}
                title="Your cafe" 
                height={60}
                fontWeight="300"
                fontSize={16}
                rightIcon={<DashboardIcon onPress={handleNavDashboard} height="40" width="25" />}
                />
                <View style={styles.qrCodeContainer}>
                    <View style={styles.innerQrContainer}>
                        { qrdata ? <QRCode size={250} value={qrdata} /> : 'QR Code goes here' }
                    </View>
                    <Text style={styles.text}>{quantity} coffees</Text>
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.bottomCanvas}>
                        <NumberPickerLocal value={quantity} onChange={handleQuantityChange} min={1} max={30} />
                        <ActionButton onPress={handleGenerateCode} title="Generate QR Code" color={'yellow'} />
                    </View>
                </View>
        </SafeAreaView>
    )
}

export default memo(CafeHome);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F4FF',
    },
    qrCodeContainer: {
        height: '50%',
        width: '100%',
        backgroundColor: '#F2F4FF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerQrContainer: {
        backgroundColor: 'white',
        height: 300,
        width: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    text: {
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 4,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
    },
    bottomContainer: {
        height: '40%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomCanvas: {
        height: '80%',
        width: '80%',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 10,
        paddingTop: 40,
    }
})