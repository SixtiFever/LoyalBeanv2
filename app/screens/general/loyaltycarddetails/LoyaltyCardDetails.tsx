import useFetchCard from "@/app/hooks/useFetchCard"
import { ActionButton } from "@/components/buttons"
import { firestore } from "@/firebaseconfig"
import { Card } from "@/types/Card"
import { splitPattern } from "@/utils/utils"
import { useLocalSearchParams, useRouter } from "expo-router"
import { collection, doc, onSnapshot } from "firebase/firestore"
import { memo, useEffect, useRef, useState } from "react"
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import QRCode from "react-native-qrcode-svg"
import { SafeAreaView } from "react-native-safe-area-context"


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
    const [redeemClaim, setRedeemClaim] = useState<{key: string, redeem: string}>()
    const customerId = useRef<string>('')
    const [modalVisible, setModalVisible] = useState(false);

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

    const handleOpenModal = (redeem: {key: string, redeem: string}) => {
        const [uid, rid] = redeem.key.split(splitPattern);
        customerId.current = uid;
        setRedeemClaim(redeem)
        setModalVisible(true);
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

        return (
            <SafeAreaView edges={["top"]} style={styles.container}>

                { redeemClaim &&  
                    <Modal 
                        animationType="slide"
                        transparent={false}
                        visible={modalVisible}
                        onRequestClose={() => {
                        alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                        }}>

                        <SafeAreaView edges={["top"]} style={styles.modal}>
                            <View style={styles.modalTitleContainer}>
                                <Text>Redeem</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text>Dismiss</Text>
                                </TouchableOpacity>
                            </View>
                            <QRCode
                                size={250}
                                value={redeemClaim.key} />
                            <Text>{redeemClaim.key ?? 'No Key'}</Text>
                        </SafeAreaView>

                    </Modal>
                }
                
                <View style={styles.cardDetailsCotnainer}>
                    <Text>Reward: { card?.reward ?? fetchedCard?.reward }</Text>
                    <Text>Current: {card?.currentCount ?? fetchedCard?.currentCount}</Text>
                    <Text>Required: {card?.countRequiredRedeem ?? fetchedCard?.countRequiredRedeem}</Text>
                </View>
                
                <View style={styles.pendingRedeemsContainer}>
                    <Text>Pending Redeems</Text>
                    <FlatList
                        style={styles.flatList}
                        data={Object.entries(card?.pendingRedeems ?? fetchedCard?.pendingRedeems)}
                        keyExtractor={([key]) => key}
                        renderItem={({ item: [key, redeem] }) => (
                            <View style={styles.pendingRedeemsItemContainer} key={key}>
                                <Text>{redeem?.reward}</Text>
                                <TouchableOpacity onPress={() => handleOpenModal({key: key, redeem: redeem as string})} style={styles.claimBtn}>
                                    <Text>Claim</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
                {/* { Object.entries(card?.pendingRedeems ?? fetchedCard?.pendingRedeems).map((redeem) => {
                    return (
                        <View style={styles.pendingRedeemsItemContainer} key={redeem[0]}>
                            <Text>{redeem[1]?.reward}</Text>
                        </View>
                    )
                })} */}
                <ActionButton onPress={handleNavScanner} title="Scan" color={'pink'} />
            </SafeAreaView>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modal: {
        display: 'flex',
        flexDirection: 'column'
    },
    modalTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalQRCodeContainer: {

    },
    cardDetailsCotnainer: {
        flex: 1,
    },
    pendingRedeemsContainer: {
        flex: 3,
    },
    pendingRedeemsItemContainer: {
        height: 50,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingEnd: 25,
    },
    claimBtn: {
        width: 80,
        height: 30,
        backgroundColor: 'green',
        borderRadius: 6,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default memo(LoyaltyCardDetails);