import useFetchFellowUsers from "@/app/hooks/useFetchFellowUsers"
import { BackIcon } from "@/assets/icons"
import CustomerRecordSocial from "@/components/customerrecord/CustomerRecordSocial"
import CustomNavbar from '@/components/navbar'
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { memo, useEffect, useLayoutEffect } from "react"
import { FlatList, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Users = () => {

    // params, router, nav
    const state = useLocalSearchParams();
    const router = useRouter();
    const nav = useNavigation();

    // states
    const [users, isLoading, error] = useFetchFellowUsers(state.cafeId as string);

    useLayoutEffect(() => {

        nav.setOptions({
            headerShown: false,
        })

    }, [])

    useEffect(() => {
        console.log(state);
        console.log(users);
    }, [users]);

    if ( isLoading && !error ) {
        return <Text>Loading users</Text>
    }

    if ( error && !isLoading ) {
        return <Text>Error encountered whilst loading users</Text>
    }

    function handleNavBack(): void {
        router.back();
    }

    return (
        <SafeAreaView edges={["top"]} style={styles.container}>
            <CustomNavbar
                height={60}
                fontWeight="300"
                fontSize={16}
                hasBottomBorder={true}
                leftIcon={<BackIcon height='20' width='30' color='#424C55' />}
                leftOnPress={handleNavBack}
                title='Community' />
            <View style={styles.usersContainer}>
                {/* <FlatList
                    data={Object.entries(users ?? {})}
                    renderItem={({item}) => <Text>{JSON.stringify(item)}</Text>}
                /> */}
                <FlatList 
                    data={Object.values(users ?? {})}
                    keyExtractor={(item) => item.userId}
                    renderItem={({item}) => (
                        <CustomerRecordSocial data={item} />
                        )}
                    />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    usersContainer: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
    }
})

export default memo(Users);