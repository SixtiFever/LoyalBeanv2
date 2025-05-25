import useFetchCards from "@/app/hooks/useFetchCards";
import { PlusIcon, SettingsIcon } from "@/assets/icons";
import { LoyaltyCard } from "@/components/LoyaltyCard";
import CustomNavbar from '@/components/navbar';
import { firestore } from "@/firebaseconfig";
import { Card } from "@/types/Card";
import { fetchCustomerCards, getCafeIds } from "@/utils/FirebaseController";
import { sortCardsByLatestUpdate } from "@/utils/utils";
import { useNavigation, useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { memo, useEffect, useLayoutEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const YourCards = () => {

    const nav = useNavigation();
    const router = useRouter();
    const auth = getAuth();
    const [cards, isLoading, error] = useFetchCards();
    const [updatedCards, setUpdatedCards] = useState<Card[]>();
    const [cafeIds, setCafeIds] = useState<string[]>();
    const [user, setUser] = useState<User>()
      

    useLayoutEffect(() => {

        nav.setOptions({
            headerShown: false,
        });

        onAuthStateChanged(getAuth(), async (user) => {
            if (user) {
                setUser(user);
                const cafeids: string[] | undefined = await getCafeIds(user);
                setCafeIds(cafeids);
            }
        })

    }, []);

    useEffect(() => {

        if (!user) { 
            console.log('Can\'t pull user');
            return;
        }

        // listener attached to cafeids on customer document
        // if cafeids changes, new cards are fetched in the below useEffect
        const colRef = collection(firestore, 'customers');
        const docRef = doc(colRef, user.uid);
        const unsubscribe = onSnapshot(docRef, async (snap) => {
            if (snap.exists()) {
                setCafeIds(snap.data().cafes ?? []);
            }
        })

        return () => {
            unsubscribe();
        }

    }, [user]);

    useEffect(() => {

        // udate cards
        // console.log('Fetching new cards-')
        if ( user && user.uid ) {
            const fetchCards = async () => {
                const cards: Card[] | void = await fetchCustomerCards(user?.uid);
                if (cards) {
                    const sortedCards = sortCardsByLatestUpdate(cards)

                    setUpdatedCards(sortedCards);
                }
            }
            fetchCards();
        }
        

    }, [cafeIds, user])


    if (auth.currentUser === null) {
        return (
            <Text>Loading details</Text>
        )
    }

    const handleNavNewCardScanner = () => {

        router.navigate({
            pathname: '/screens/general/scanner/Scanner',
            params: {id: 'test'}
        })
    }

    if ( auth.currentUser ) {

        if ( error && !isLoading ) {
            return (
                <View>
                    <Text>Error pulling your cards</Text>
                </View>
            )
        }

        if ( isLoading && !error) {
            return (
                <View>
                    <Text>Loading cards</Text>
                </View>
            )
        }

        if ( cards && user ) {
            // console.log('Here are your cards: ', cards)
            return (
                <SafeAreaView edges={["top"]} style={styles.container}>

                    <CustomNavbar
                        hasBottomBorder={true}
                        height={60}
                        leftIcon={<SettingsIcon width="25" height="25" />}
                        title="Your Cards"
                        fontWeight="300"
                        fontSize={16}
                        rightIcon={<PlusIcon width="25" height="25" onPress={handleNavNewCardScanner} />} />
                        <View style={styles.flatListContainer}>
                            <FlatList 
                                ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
                                keyExtractor={(item) => item.cafeId}
                                renderItem={({ item }) => 
                                    <LoyaltyCard 
                                        user={user} 
                                        cafeId={item.cafeId} 
                                        data={item} />
                                    }
                                
                                data={updatedCards ?? cards} />
                        </View>
                        
                        
                </SafeAreaView>
            )

        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    flatListContainer: {
        flex: 1,
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        backgroundColor: '#F8F4F9',
    }
})

export default memo(YourCards);