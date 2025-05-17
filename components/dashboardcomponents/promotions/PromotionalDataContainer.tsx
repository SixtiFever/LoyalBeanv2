import { PlusIcon } from "@/assets/icons";
import { PromotionRecord } from "@/types/Promotion";
import { filterActivePromotion } from "@/utils/utils";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface PromotionalDataContainerProps {
    promotions: Record<string, PromotionRecord> | boolean;
}

const PromotionalDataContainer: React.FC<PromotionalDataContainerProps> = ({promotions}) => {

    const nav = useNavigation();
    const router = useRouter();

    // states
    const [activePromotion, setActivePromotion] = useState<PromotionRecord>();
    const [allPromotions, setAllPromotions] = useState<Record<string, PromotionRecord>>({});

    useEffect(() => {

        if ( typeof(promotions) == 'boolean' ) return;

        const promotion = filterActivePromotion(promotions);
        setActivePromotion(promotion);
        setAllPromotions(promotions);

    }, [promotions])

    const handleNavCreateNew = () => {
        console.log(activePromotion)
        router.navigate({
            pathname: '/screens/general/createpromotion',
            params: { activePromotion: JSON.stringify(activePromotion) }
        })
    }

    if (!promotions) {
        return (
            <View>
                <Text>Error fetching promotions</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.activePromotionSection}>
                <View style={styles.activePromotionContainer}>
                    <View style={styles.topBarContainer}>
                        <Text>Active</Text>
                        <PlusIcon onPress={handleNavCreateNew} width="20" height="20" />
                    </View>
                    { activePromotion && <Text>{JSON.stringify(activePromotion.reward)}</Text> }
                    
                </View>
            </View>
            <View style={styles.previousPromotionSection}>
                <View style={styles.previousPromotionContainer}>
                    <FlatList 
                        data={Object.values(allPromotions)}
                        keyExtractor={(item) => item.promotionId}
                        renderItem={({item}) => (
                            <View>
                                <Text>{item.reward}</Text>
                                <Text>{item.promotionId} | Scans: {item.scans} | Active: {String(item.active)}</Text>
                                <Text>##########</Text>
                            </View>
                        )} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activePromotionSection: {
        height: '40%',
        width: '100%',
        borderBottomWidth: .1,
        padding: 10,
        borderBottomColor: 'rgb(167, 165, 168)'
    },
    activePromotionContainer: {
        height: '100%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    topBarContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    previousPromotionSection: {
        flex: 1,
        width: '100%',
        padding: 10,
    },
    previousPromotionContainer: {
        height: '100%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
})

export default PromotionalDataContainer;