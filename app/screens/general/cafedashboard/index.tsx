import { memo, useEffect, useLayoutEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import CustomNavbar from '@/components/navbar'
import { BackIcon } from "@/assets/icons"
import { useNavigation, useRouter } from "expo-router"
import useFetchCafeData from "@/app/hooks/useFetchCafeData"
import useFetchCafeCards from "@/app/hooks/useFetchCafeCards"
import { Cafe } from "@/types/User"
import { collection, doc, DocumentData, onSnapshot } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { firestore } from "@/firebaseconfig"

const CafeDashboard = () => {

    // navigation
    const nav = useNavigation();
    const router = useRouter();

    // states
    const [id, setId] = useState<string>();
    const [fetchedCafeData, loadingData, errorData] = useFetchCafeData();
    const [fetchedCardsData, loadingCards, errorCards] = useFetchCafeCards();
    const [cafeData, setCafeData] = useState<Cafe | null>(null)
    const [cardsData, setCardsData] = useState<DocumentData>()

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

    return (
        <View style={styles.container}>
            <CustomNavbar
                leftIcon={<BackIcon height='15' width='25' color='#424C55' />}
                title="Dashboard"
                leftOnPress={handleNavBack}
                height={60} />
            <Text>Welcome to the cafe dashboard</Text>
            <Text>{JSON.stringify(cafeData ?? fetchedCafeData)}</Text>
            <Text>{JSON.stringify(cardsData ?? fetchedCardsData)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default memo(CafeDashboard);