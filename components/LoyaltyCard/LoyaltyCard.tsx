import { Card } from "@/types/Card";
import { useRouter } from "expo-router";
import { memo } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

interface CardProps {
    data: Card;
}

const LoyaltyCard: React.FC<CardProps> = ({data}) => {

    const router = useRouter();

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

    return (
        <View style={styles.container}>
            <Text>{data.currentCount} out of {data.countRequiredRedeem}</Text>
            <Button onPress={handleNav} title="scan" />
        </View>
    )
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