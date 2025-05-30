import { firestore } from "@/firebaseconfig";
import { Card } from "@/types/Card";
import { PromotionRecord } from "@/types/Promotion";
import { fetchProfilePicture } from "@/utils/FirebaseController";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { memo, useEffect, useLayoutEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CustomerRecordProps {
    data: Card;
}

const deafultIcon = require('../../assets/images/defaultusericon.jpg');

const CustomerRecord: React.FC<CustomerRecordProps> = ({data}) => {

    const [user, setUser] = useState<User>()
    const [totalScanCount, setTotalScanCount] = useState(0);
    const [totalRedeemCount, setTotalRedeemCount] = useState(0);
    const [isPersonalisedRewardActive, setIsPersonalisedRewardActive] = useState<boolean>(data.personalisedRewardActive ?? false)
    const [imageUri, setImageUri] = useState<string>();

    useLayoutEffect(() => {

        onAuthStateChanged(getAuth(), (user) => {
            if (user) setUser(user);
        })

        

    }, [])

    useEffect(() => {
        if (user) {
            const fetchImage = async () => {
                const result = await fetchProfilePicture(data.userId);
                setImageUri(result)
            }
            fetchImage();
        }
    }, [user])

    const handleActivatePersonalisedPromotion = async () => {

        if ( !isPersonalisedRewardActive ) {
            const colRef = collection(firestore, 'cards');
            const docRef = doc(colRef, user?.uid);
            const snap = await getDoc(docRef);
            if (!snap.exists()) return;
            console.log(snap.data())
            const favPromoId: string = snap.data()[data.userId]['favouritePromotionId'];

            const promoColRef = collection(firestore, 'promotions');
            const promoDocRef = doc(promoColRef, user?.uid);
            const promoSnap = await getDoc(promoDocRef);
            if ( !promoSnap.exists() ) return;
            const favPromo: PromotionRecord = promoSnap.data()[favPromoId];
            console.log(favPromo);
            updateDoc(docRef, { 
                [`${data.userId}.reward`] :  favPromo.reward,
                [`${data.userId}.countRequiredRedeem`] : favPromo.purchaseMilestone,
                [`${data.userId}.personalisedRewardActive`] : true,
            }).catch(err => {
                console.log(err);
            })

            setIsPersonalisedRewardActive(true);
        } else {
            // reverse the above
        }
        
    }

    return (
        <View style={styles.container}>
            <View style={styles.leftSideContainer}>
                <Image source={ imageUri ? { uri: imageUri } : deafultIcon} style={styles.image} />
                <Text>{data.beanType}</Text>
            </View>
            <View style={styles.rightSideContainer}>
                <Text>{user?.displayName}</Text>
                <Text>{data.userEmail}</Text>
                <Text>Scans: {data.totalScanCount}</Text>
                <Text>Redeems: {data.totalRedeemCount}</Text>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.claimBtn}>
                        <Text>Notify</Text>
                    </TouchableOpacity>
                        <TouchableOpacity onPress={handleActivatePersonalisedPromotion} style={styles.claimBtn}>
                        <Text>{ isPersonalisedRewardActive ? 'Deactivate' : 'Activate' }</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 120,
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 8,
        // justifyContent:'space-between',
        borderWidth: 0.2,
        borderColor: 'rgba(0,0,0,0.3)',
        padding: 10,
    },
    leftSideContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '30%',
        alignItems: 'center'
    },
    rightSideContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        paddingStart: 35,
        justifyContent: 'space-evenly',
    },
    image: {
        height: 60,
        width: 60,
        borderColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderRadius: '100%',
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    claimBtn: {
        width: 80,
        height: 30,
        borderRadius: 6,
        borderWidth: 0.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default memo(CustomerRecord);