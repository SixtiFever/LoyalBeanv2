import useFetchCard from "@/app/hooks/useFetchCard"
import { ActionButton } from "@/components/buttons"
import { Card } from "@/types/Card"
import { useLocalSearchParams, useRouter } from "expo-router"
import { memo } from "react"
import { StyleSheet, Text, View } from "react-native"


interface LoyaltyCardProps {
    data?: Card
}

const LoyaltyCardDetails: React.FC<LoyaltyCardProps> = ({}) => {

    const state = useLocalSearchParams();
    const router = useRouter();
    const [card, isLoading, error] = useFetchCard(state.userId as string, state.cafeId as string);

    const handleNavScanner = () => {
        router.navigate({
            pathname: '/screens/general/repeatscanner/RepeatScanner',
            params: { 
                currentCount: card.currentCount,
                redeemCount: card.countRequiredRedeem }
        })
    }

    if (error && !isLoading) {
        console.log(state)
        console.log(card)
        console.log(isLoading)
        console.log(error)
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

    if ( card ) {

        return (
            <View style={styles.container}>
                <Text>{ card.reward }</Text>
                <Text>{card.currentCount}</Text>
                <Text>{card.countRequiredRedeem}</Text>
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