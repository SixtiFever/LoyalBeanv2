import useFetchCafeCards from "@/app/hooks/useFetchCafeCards"
import useFetchCafeData from "@/app/hooks/useFetchCafeData"
import useFetchPromotions from "@/app/hooks/useFetchPromotions"
import { BackIcon } from "@/assets/icons"
import { CustomersDataContainer, PromotionalDataContainer } from "@/components/dashboardcomponents"
import { HorizontalPicker } from "@/components/horizontalpicker"
import CustomNavbar from '@/components/navbar'
import { firestore } from "@/firebaseconfig"
import { DashboardMenuOption } from "@/types/DashboardMenuOption"
import { PromotionRecord } from "@/types/Promotion"
import { Cafe } from "@/types/User"
import { getSelectedOption } from "@/utils/utils"
import { useNavigation, useRouter } from "expo-router"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { collection, doc, DocumentData, onSnapshot } from "firebase/firestore"
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

    

    return (
        <SafeAreaView edges={["top"]} style={styles.container}>

            <CustomNavbar
                leftIcon={<BackIcon height='15' width='25' color='#424C55' />}
                title="Dashboard"
                leftOnPress={handleNavBack}
                height={60}
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