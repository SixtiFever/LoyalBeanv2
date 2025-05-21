import useFetchCard from "@/app/hooks/useFetchCard";
import { firestore } from "@/firebaseconfig";
import { Card } from "@/types/Card";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { memo, useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

interface CardProps {
    user: User;
    cafeId: string;
    data: Card;
}

const LoyaltyCard: React.FC<CardProps> = ({user, cafeId, data}) => {

    const router = useRouter();
    const [card, isLoading, error] = useFetchCard(user.uid, cafeId);
    const [cardData, setCardData] = useState<Card>();

    useEffect(() => {

        const colRef = collection(firestore, 'cards');
        const docRef = doc(colRef, cafeId);
        const unsubscribe = onSnapshot(docRef, async (snap) => {
            if (!snap.exists()) return;
            const card: Card = await snap.data()[user.uid]
            setCardData(card);
        })

        return () => unsubscribe();

    }, [])

    const handleNav = () => {
        router.navigate({
            pathname: '/screens/general/loyaltycarddetails/LoyaltyCardDetails',
            params: 
                {
                    userId: data.userId,
                    cafeId: data.cafeId,
                    userEmail: data.userEmail,
                    reward: data.reward,
                    currentCount: data.currentCount,
                    countRequiredRedeem: data.countRequiredRedeem,
                    totalScanCount: data.totalScanCount,
                    totalRedeemCount: data.totalRedeemCount,
                    ranking: data.ranking,
                    logoUri: data.logoUri,
                    beanType: data.beanType,
                    beanIconUri: data.beanIconUri,
                }
        })
    }

    if ( error && !isLoading ) {
        return (
            <View>
                <Text>Error encountered</Text>
            </View>
        )
    }

    if ( isLoading && !error ) {
        return (
            <View>
                <Text>Loading</Text>
            </View>
        )
    }

    if ( cardData && card ) {
        console.log(cardData?.logoUri)
        return (
            <View style={styles.container}>
                <View style={styles.logoTitleContainer}>
                    <View style={styles.logoContainer}>
                        <Image 
                            source={{uri: cardData.logoUri ?? card?.logoUri ?? ''}}
                            style={{ height: '100%', width: '100%' }}
                            resizeMode="contain" />
                    </View>
                    <Text style={styles.cafeName}>{cardData.cafeName ?? 'Cafe Name Goes Here'}</Text>
                </View>
                <Text>{cardData.currentCount ?? card?.currentCount} out of {cardData.countRequiredRedeem ?? card.countRequiredRedeem}</Text>
                {/* <Text>{cardData.cafeId}</Text> */}
                {/* <Text>{cardData.dateCardUpdated.toDate().toDateString()}</Text> */}
                <Button onPress={handleNav} title="View Card" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 150,
        display: 'flex',
        backgroundColor: 'white',
        justifyContent: 'space-evenly',
        borderRadius: 10,
        padding: 10,

        // iOS shadow
        shadowColor: 'rgba(100, 100, 100, .2)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 2,
    },
    logoTitleContainer: {
        height: 40,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

    },
    logoContainer: {
        height: 40,
        width: 50,
        justifyContent:'center',
        alignItems: 'center',
    },
    cafeName: {
        paddingLeft: 10,
        fontSize: 14,
        fontWeight: '400',
    }
})

export default memo(LoyaltyCard)