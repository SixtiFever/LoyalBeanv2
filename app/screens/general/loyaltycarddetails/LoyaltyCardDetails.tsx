import useFetchCard from "@/app/hooks/useFetchCard"
import { BackIcon } from "@/assets/icons"
import { ActionButton } from "@/components/buttons"
import CustomNavbar from '@/components/navbar'
import { firestore } from "@/firebaseconfig"
import { Card } from "@/types/Card"
import { splitPattern } from "@/utils/utils"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { collection, doc, onSnapshot } from "firebase/firestore"
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react"
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import QRCode from "react-native-qrcode-svg"
import { SafeAreaView } from "react-native-safe-area-context"


interface LoyaltyCardProps {
    data?: Card;
}

const LoyaltyCardDetails: React.FC<LoyaltyCardProps> = ({}) => {

    // navigation
    const nav = useNavigation();
    const router = useRouter();
    const state = useLocalSearchParams();

    // states
    const uid: string = state.userId as string
    const cid: string = state.cafeId as string
    const [fetchedCard, isLoading, error] = useFetchCard(state.userId as string, state.cafeId as string);
    const [card, setCard] = useState<Card>()
    const [redeemClaim, setRedeemClaim] = useState<{key: string, redeem: string}>()
    const customerId = useRef<string>('')
    const [modalVisible, setModalVisible] = useState(false);

    useLayoutEffect(() => {

        nav.setOptions({
            headerShown: false,
        })

    }, [])

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

    const handleNavBack = () => {
        router.back();
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
                <CustomNavbar
                        height={60}
                        fontWeight="300"
                        fontSize={16}
                        hasBottomBorder={true}
                        leftIcon={<BackIcon height='20' width='30' color='#424C55' />}
                        leftOnPress={handleNavBack}
                        title='Card Details' />

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
                
                <View style={styles.cardDetailsContainer}>
                    <View style={styles.cardDetailsContent}>
                        <Text>Reward: { card?.reward ?? fetchedCard?.reward }</Text>
                        <Text>Current: {card?.currentCount ?? fetchedCard?.currentCount}</Text>
                        <Text>Required: {card?.countRequiredRedeem ?? fetchedCard?.countRequiredRedeem}</Text>
                    </View>
                    
                </View>
                
                <View style={styles.pendingRedeemsContainer}>
                    <View style={styles.pendingRedeemsContent}>
                        <Text style={styles.titleText}>Pending Redeems</Text>
                        <FlatList
                            style={{paddingTop: 20}}
                            data={Object.entries(card?.pendingRedeems ?? fetchedCard?.pendingRedeems ?? {})}
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
                    
                </View>
                <ActionButton onPress={handleNavScanner} title="Scan" color={'#64A6BD'} />
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
    cardDetailsContainer: {
        flex: 1,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    cardDetailsContent: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 10,
        padding: 10,
    },
    pendingRedeemsContainer: {
        flex: 3,
        padding: 10,
    },
    pendingRedeemsItemContainer: {
        height: 50,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        borderTopWidth: .4,
        borderTopColor: '#BFD7EA',
        borderBottomWidth: .4,
        borderBottomColor: '#BFD7EA',
    },
    pendingRedeemsContent: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 10,
        padding: 10,
        paddingTop: 15,
    },
    titleText: {
        fontSize: 12,
        fontWeight: 'bold',
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

export default memo(LoyaltyCardDetails);