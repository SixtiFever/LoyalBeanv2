import useFetchCafeCards from "@/app/hooks/useFetchCafeCards";
import { CustomerRecord } from "@/components/customerrecord";
import { memo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const CustomerDataContainer = () => {

    const [fetchedCardsData, loadingCards, errorCards] = useFetchCafeCards();  // leaderboard data

    if (errorCards && !loadingCards) {
        return (
            <Text>Error loading customers</Text>
        )
    }

    if (!errorCards && loadingCards) {
        return (
            <Text>Loading customers</Text>
        )
    }

    if ( fetchedCardsData ) {
        return (
                <View style={styles.container}>
                    <View style={styles.dataContainer}>
                        <Text>Customers</Text>
                        <FlatList 
                            style={{paddingTop: 10}}
                            ItemSeparatorComponent={() => <View style={{height: 10,}} />}
                            data={Object.values(fetchedCardsData)}
                            keyExtractor={(item) => item.userId}
                            renderItem={({item}) => (
                                <CustomerRecord data={item} />
                                )}
                            />
                    </View>
                </View>
            )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#F8F4F9',
    },
    dataContainer: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 10,
        padding: 10,
    }
})

export default memo(CustomerDataContainer);