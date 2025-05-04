import useFetchCards from "@/app/hooks/useFetchCards";
import { PlusIcon, SettingsIcon } from "@/assets/icons";
import { LoyaltyCard } from "@/components/LoyaltyCard";
import CustomNavbar from '@/components/navbar';
import { useNavigation, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { memo, useEffect, useLayoutEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const YourCards = () => {

    const nav = useNavigation();
    const router = useRouter();
    const auth = getAuth();
    const [cards, isLoading, error] = useFetchCards();

    // const cards = [
    //     {
    //       id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    //       title: 'First Item',
    //     },
    //     {
    //       id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    //       title: 'Second Item',
    //     },
    //     {
    //       id: '58694a0f-3da1-471f-bd96-145571e29d72',
    //       title: 'Third Item',
    //     },
    //   ];
      

    useLayoutEffect(() => {

        nav.setOptions({
            headerShown: false,
        });

    }, []);

    useEffect(() => {

    }, [])


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

        if ( cards ) {
            console.log('Here are your cards: ', cards)
            return (
                <SafeAreaView edges={["top"]} style={styles.container}>

                    <CustomNavbar
                        height={60}
                        leftIcon={<SettingsIcon width="25" height="25" />}
                        title="Your Cards"
                        fontWeight="300"
                        fontSize={16}
                        rightIcon={<PlusIcon width="25" height="25" onPress={handleNavNewCardScanner} />} />
                        <FlatList 
                            renderItem={({ item }) => <LoyaltyCard data={item} />}
                            data={cards} />
                        
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
    scrollView: {
        backgroundColor: 'blue',
    }
})

export default memo(YourCards);