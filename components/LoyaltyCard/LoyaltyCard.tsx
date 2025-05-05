import useFetchCard from "@/app/hooks/useFetchCard";
import { firestore } from "@/firebaseconfig";
import { Card } from "@/types/Card";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { memo, useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

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

    if ( cardData && card ) {
        return (
            <View style={styles.container}>
                <Text>{cardData.currentCount ?? card?.currentCount} out of {cardData.countRequiredRedeem ?? card.countRequiredRedeem}</Text>
                <Button onPress={handleNav} title="scan" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: 120,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'yellow',
    }
})

export default memo(LoyaltyCard)