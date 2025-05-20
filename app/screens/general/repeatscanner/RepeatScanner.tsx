import { firestore } from "@/firebaseconfig"
import { Card } from "@/types/Card"
import { PromotionRecord } from "@/types/Promotion"
import { getActivePromotion, updatePromotionInteractions } from "@/utils/FirebaseController"
import { splitPattern } from "@/utils/utils"
import { BarcodeScanningResult, CameraView } from "expo-camera"
import { useLocalSearchParams } from "expo-router"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { collection, doc, DocumentData, DocumentSnapshot, runTransaction, Timestamp } from "firebase/firestore"
import { useLayoutEffect, useRef, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

interface CardScannerProps {
    currentCount?: number;
    redeemCount?: number;
}

const RepeatScanner: React.FC<CardScannerProps> = ({}) => {

    const [user, setUser] = useState<User>();
    const [userError, setUserError] = useState<boolean>(false)
    const state = useLocalSearchParams();
    const cid: string = state.cafeId as string;
    const uid: string = state.userId as string;
    const currentCount: number = Number(state.currentCount);
    const redeemCount: number = Number(state.redeemCount);
    const redeemCountIncrease = useRef<number>(0)
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
            console.log(scanData);
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
        // calculate new scan count
        const scanCount: number = quantity + currentCount;
        const newScanCount: number = scanCount > redeemCount ? (scanCount % redeemCount) : scanCount;
        console.log('scanCount: ', scanCount)
        console.log('quantity: ', quantity)
        // update customers card for the cafe
        const result: void | Card = await runTransaction(firestore, async (transaction) => {

            const activePromotion: PromotionRecord = await getActivePromotion(cid);

            const colRef = collection(firestore, 'cards');
            const docRef = doc(colRef, cid);
            const snap: DocumentSnapshot<DocumentData> = await transaction.get(docRef);
            if (!snap.exists()) {
                console.log('Doc ' + cid + ' doesn\'t exist');
                return;
            }

            const card: Card = await snap.data()[uid] as Card;

            if ( !card ) {
                console.log('Can\'t find customers loyalty card');
                return;
            }
            
            if (!activePromotion) {
                console.log('Couldn\'t find promotion');
                return;
            }
            if (!card.pendingRedeems) {
                card.pendingRedeems = {};
            }
            
            card.currentCount = newScanCount;
            //card.totalRedeemCount = scanCount > card.countRequiredRedeem ? card.totalRedeemCount + 1 : card.totalRedeemCount;
            card.dateCardUpdated = Timestamp.now();
            card.totalScanCount += quantity;

            if ( scanCount > card.countRequiredRedeem ) {

                const quantityOfRedeems = Math.floor(scanCount / card.countRequiredRedeem)
                card.totalRedeemCount += quantityOfRedeems;
                redeemCountIncrease.current = quantityOfRedeems;
                card.currentCount = newScanCount % card.countRequiredRedeem
                console.log('Redeem quant: ', quantityOfRedeems)
                for ( let i = 0; i < quantityOfRedeems; i++ ) {
                    const randomId: string = uuidv4();
                    card.pendingRedeems[`${uid}${splitPattern}${randomId}`] = { reward: activePromotion.reward };
                }

            }
            transaction.set(docRef, {[uid]: card}, {merge: true})
            return card
        }).catch(err => {
            console.log('RepeatScanner/102 - ', err);
        });
        const activePromotion: PromotionRecord = await getActivePromotion(cid);
        await updatePromotionInteractions(cid, activePromotion, uid, quantity, redeemCountIncrease.current );
       
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