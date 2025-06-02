import useFetchCafeCards from "@/app/hooks/useFetchCafeCards"
import useFetchCafeData from "@/app/hooks/useFetchCafeData"
import useFetchPromotions from "@/app/hooks/useFetchPromotions"
import { BackIcon, RefreshStarIcon } from "@/assets/icons"
import { CustomersDataContainer, PromotionalDataContainer } from "@/components/dashboardcomponents"
import { HorizontalPicker } from "@/components/horizontalpicker"
import CustomNavbar from '@/components/navbar'
import { firestore } from "@/firebaseconfig"
import { Card } from "@/types/Card"
import { DashboardMenuOption } from "@/types/DashboardMenuOption"
import { PromotionInteractions, PromotionRecord } from "@/types/Promotion"
import { Cafe } from "@/types/User"
import { getSelectedOption } from "@/utils/utils"
import { useNavigation, useRouter } from "expo-router"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { collection, doc, DocumentData, getDoc, onSnapshot, setDoc } from "firebase/firestore"
import { memo, ReactNode, useEffect, useLayoutEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const ComponentMap: Record<string, ReactNode> = {
    'Promotions': <Text>Promotions Rendered</Text>,
    'Customers': <Text>Promotions Rendered</Text>,
}

const CafeDashboard = () => {

    // navigation
    const nav = useNavigation();
    const router = useRouter();

    // states
    const [id, setId] = useState<string>();
    const [selectedOption, setSelectedOption] = useState<DashboardMenuOption>();
    const [options, setOptions] = useState<DashboardMenuOption[]>([
                        {label: 'Promotions', selected: true}, 
                        {label: 'Customers', selected: false}]);
    const [fetchedCafeData, loadingData, errorData] = useFetchCafeData();  // cafe data
    const [fetchedCardsData, loadingCards, errorCards] = useFetchCafeCards();  // leaderboard data
    const [fetchedPromotions, loadingPromotions, errorPromotions] = useFetchPromotions();  // promotions data
    const [cafeData, setCafeData] = useState<Cafe | null>(null)
    const [cardsData, setCardsData] = useState<DocumentData>()
    const [promotionsData, setPromotionsData] = useState<Record<string, PromotionRecord>>();

    useLayoutEffect(() => {

        const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
            if ( !user?.uid ) return;
            setId(user?.uid);
        });

        nav.setOptions({
            headerShown: false,
        })

        return () => unsubscribe();

    }, [])

    useEffect(() => {
    
        if (!id) return;

        const colRef = collection(firestore, 'cards');
        const docRef = doc(colRef, id)
        const unsubCards = onSnapshot(docRef, async (snap) => {
            setCardsData(snap.data());
        })

        const colRefCafes = collection(firestore, 'cafes');
        const docRefCafe = doc(colRefCafes, id)
        const unsubCafesData = onSnapshot(docRefCafe, async (snap) => {
            if (snap !== null) {
                setCafeData(snap.data() as Cafe);
            }
        })

        return () => {
            unsubCards();
            unsubCafesData();
        }
    }, [id])


    const handleNavBack = () => {
        router.back();
    }

    useEffect(() => {
        const selecedOption: DashboardMenuOption = getSelectedOption(options);
        setSelectedOption(selecedOption);
        console.log(selectedOption)
    }, [options])

    const handleUpdateFavourites = async () => {
        const colRef = collection(firestore, 'promotions');
        const docRef = doc(colRef, id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return;
        const promotions: Record<string, PromotionRecord> = snap.data();
        const favPromotions: Record<string, {promoId: string, scans: number}> = {};
        for ( let promoId in promotions ) {
            const interactions: PromotionInteractions | undefined = promotions[promoId].interactions;
            for ( let uid in interactions ) {
                if ( !favPromotions[uid] ) {
                    favPromotions[uid] = { promoId: promoId, scans: interactions[uid].scans }
                } else {
                    favPromotions[uid] = favPromotions[uid].scans < interactions[uid].scans ? {promoId: promoId, scans: interactions[uid].scans} : favPromotions[uid];
                }
            }
        }

        const cardsColRef = collection(firestore, 'cards');
        const cardsDocRef = doc(cardsColRef, id);
        const cardsSnap = await getDoc(cardsDocRef);
        if (!cardsSnap.exists()) return;
        const cards: Record<string, Card> = cardsSnap.data();
        for ( let uid in cards ) {
            if ( favPromotions[uid] ) {
                cards[uid]['favouritePromotionId'] = favPromotions[uid].promoId;
            }
        }
        setDoc(cardsDocRef, cards)
        // for ( const docSnap of querySnap.docs ) {
        //     const customerId = docSnap.id;
        //     if ( favPromotions[customerId] ) {
        //         await updateDoc(doc(firestore, 'customers', customerId), {
        //             favouritePromotionId: favPromotions[customerId].promoId
        //         })
        //     }
        // }
        // connect to promotions collection
        // 
    }

    return (
        <SafeAreaView edges={["top"]} style={styles.container}>

            <CustomNavbar
                leftIcon={<BackIcon height='15' width='25' color='#424C55' />}
                title="Dashboard"
                leftOnPress={handleNavBack}
                height={60}
                rightIcon={<RefreshStarIcon height="24" width="24" />}
                rightOnPress={handleUpdateFavourites}
            />
            <HorizontalPicker 
                options={options}
                setOption={setOptions}
            />
            <View style={styles.contentContainer}>
                {/* <Text>{selectedOption?.label}</Text> */}
                { 
                    selectedOption?.label === 'Promotions' && selectedOption.selected === true ?
                    <PromotionalDataContainer promotions={promotionsData ?? fetchedPromotions} /> : 
                    <CustomersDataContainer /> }
                
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#F8F4F9',
    }
})

export default memo(CafeDashboard);