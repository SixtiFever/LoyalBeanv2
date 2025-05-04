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
    state.currentCount = 7;
    console.log(state);

    const handleNavScanner = () => {
        router.navigate({
            pathname: '/screens/general/repeatscanner/RepeatScanner',
            params: { 
                currentCount: state.currentCount,
                redeemCount: state.countRequiredRedeem }
        })
    }

    return (
        <View style={styles.container}>
            <Text>Test</Text>
            <Text>{state.currentCount}</Text>
            <Text>{state.countRequiredRedeem}</Text>
            <ActionButton onPress={handleNavScanner} title="Scan" color={'pink'} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default memo(LoyaltyCardDetails);