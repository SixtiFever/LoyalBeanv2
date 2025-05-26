import useFetchCard from "@/app/hooks/useFetchCard";
import { BeanIcon, ScannerIcon, TrophyIcon } from "@/assets/icons";
import { firestore } from "@/firebaseconfig";
import { Card } from "@/types/Card";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { memo, useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
        return (
            <TouchableOpacity style={styles.container} onPress={handleNav}>
                <View style={styles.detailsContainer}>
                    <View style={styles.cafeNameContainer}>
                        <Text style={styles.cafeName}>{cardData.cafeName ?? 'Cafe Name Goes Here'}</Text>
                    </View>
                    <View style={styles.rewardContainer}>
                        {/* <StarIcon height="25" width="25" /> */}
                        <Text style={styles.labelText}>{cardData.reward ?? 'Reward goes here'}</Text>
                    </View>
                    <View style={styles.statsContainer}>
                        <View style={styles.rewardContainer}>
                            <ScannerIcon height="24" width="24" />
                            <Text style={styles.labelText}>{cardData.currentCount ?? '999'}</Text>
                        </View>
                        <View style={[styles.rewardContainer, {paddingStart: 30}]}>
                            <TrophyIcon height="24" width="24" />
                            <Text style={styles.labelText}>{cardData.countRequiredRedeem ?? '999'}</Text>
                        </View>
                    </View>
                    <View style={styles.rewardContainer}>
                        <BeanIcon height="24" width="24" />
                        <Text style={styles.labelText}>{ cardData.beanType ?? 'Status not available'}</Text>
                    </View>
                </View>
                <View style={styles.logoContainer}>

                    <Image 
                        source={{uri: cardData.logoUri ?? card?.logoUri ?? ''}}
                        style={{ height: '50%', width: '50%' }}
                        resizeMode="contain" />

                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 150,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        // justifyContent: 'space-evenly',
        borderRadius: 10,
        padding: 10,
        justifyContent: 'space-between',
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
        // height: 40,
        // width: 40,
        justifyContent:'center',
        alignItems: 'flex-end',
        flex: 1,
    },
    cafeName: {
        // paddingLeft: 15,
        fontSize: 16,
        fontWeight: '400',
        paddingStart: 6,
    },
    detailsContainer: {
        height: '100%',
        width: 'auto',
        maxWidth: '60%',
        display: 'flex',
        flexDirection: 'column',
    },
    cafeNameContainer: {
        width: '100%',
        display: 'flex',
        flex: 1,
    },
    rewardContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    labelText: {
        fontSize: 13,
        fontWeight: '400',
        paddingLeft: 6,
    },
    statsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
    }
})

export default memo(LoyaltyCard)