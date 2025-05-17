import useFetchCard from "@/app/hooks/useFetchCard"
import { ActionButton } from "@/components/buttons"
import { firestore } from "@/firebaseconfig"
import { Card } from "@/types/Card"
import { useLocalSearchParams, useRouter } from "expo-router"
import { collection, doc, onSnapshot } from "firebase/firestore"
import { memo, useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"


interface LoyaltyCardProps {
    data?: Card;
}

const LoyaltyCardDetails: React.FC<LoyaltyCardProps> = ({}) => {

    const state = useLocalSearchParams();
    const uid: string = state.userId as string
    const cid: string = state.cafeId as string
    const router = useRouter();
    const [fetchedCard, isLoading, error] = useFetchCard(state.userId as string, state.cafeId as string);
    const [card, setCard] = useState<Card>()

    useEffect(() => {

        const colRef = collection(firestore, 'cards');
        const docRef = doc(colRef, cid);
        const unsubscribe = onSnapshot(docRef, async (snap) => {
            if (!snap.exists()) return;
            const card: Card = await snap.data()[uid]
            setCard(card);
        })

        return () => unsubscribe();

    }, [])

    const handleNavScanner = () => {
        router.navigate({
            pathname: '/screens/general/repeatscanner/RepeatScanner',
            params: { 
                currentCount: card?.currentCount,
                redeemCount: card?.countRequiredRedeem,
                cafeId: cid,
                userId: uid }
        })
    }

    if (error && !isLoading) {
        return (
            <View>
                <Text>Error</Text>
            </View>
        )
    }

    if (isLoading && !error) {
        return (
            <View>
                <Text>Loading card data...</Text>
            </View>
        )
    }

    if ( fetchedCard || card) {
        console.log(card?.pendingRedeems ?? fetchedCard?.pendingRedeems)
        return (
            <View style={styles.container}>
                <Text>{ card?.reward ?? fetchedCard?.reward }</Text>
                <Text>{card?.currentCount ?? fetchedCard?.currentCount}</Text>
                <Text>{card?.countRequiredRedeem ?? fetchedCard?.countRequiredRedeem}</Text>
                { Object.entries(card?.pendingRedeems ?? fetchedCard?.pendingRedeems).map((redeem) => {
                    return (
                        <Text key={redeem[0]}>{redeem[1]?.reward}</Text>
                    )
                })}
                <ActionButton onPress={handleNavScanner} title="Scan" color={'pink'} />
            </View>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default memo(LoyaltyCardDetails);