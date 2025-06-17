import { PlusIcon } from "@/assets/icons";
import { PromotionCard } from "@/components/promotioncard";
import { SortPicker } from "@/components/sortpicker";
import { PromotionRecord } from "@/types/Promotion";
import { calculateDaysBetween, filterActivePromotion } from "@/utils/utils";
import { useNavigation, useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
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
    const [sortKey, setSortKey] = useState<'active' | 'runLengthDays' | 'scansPerDay' | 'redeemsPerDay'>('active');  // active promotion first

    useEffect(() => {

        if ( typeof(promotions) == 'boolean' ) return;

        const promotion = filterActivePromotion(promotions);
        setActivePromotion(promotion);
        const activePromotions: [string, PromotionRecord][] = Object.entries(promotions).filter((promo) => promo[1].active == false);
        const promotionsRecord: Record<string, PromotionRecord> = Object.fromEntries(activePromotions);
        setAllPromotions(promotionsRecord);

    }, [promotions])

    const handleNavCreateNew = () => {

        router.navigate({
            pathname: '/screens/general/createpromotion',
            params: { activePromotion: JSON.stringify(activePromotion) }
        })

    }

    const sortedPromotions = useMemo(() => {

        const promotions = Object.values(allPromotions);

        return promotions.sort((a, b) => {
            switch (sortKey) {
                case 'active':
                    return Number(b.active) - Number(a.active); // true > false
                case 'runLengthDays':
                    return (b.runLengthDays || 0) - (a.runLengthDays || 0);
                case 'scansPerDay':
                    return (b.scansPerDay || 0) - (a.scansPerDay || 0);
                case 'redeemsPerDay':
                    return (b.redeemsPerDay || 0) - (a.redeemsPerDay || 0);
                default:
                    return 0;
            }
        });
    }, [allPromotions, sortKey]);


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
                    <View style={styles.activeCurrentStats}>
                        { activePromotion && <Text>Reward: {JSON.stringify(activePromotion.reward)}</Text> }
                        { activePromotion && <Text>Milestone: {JSON.stringify(activePromotion.purchaseMilestone)}</Text> }
                        { activePromotion && <Text>Scans: {JSON.stringify(activePromotion.scans)}</Text> }
                        { activePromotion && <Text>Redeems: {JSON.stringify(activePromotion.redeems)}</Text> }
                        { activePromotion && <Text>Days Running: {calculateDaysBetween(activePromotion.startDateTimestamp, Timestamp.now())}</Text> }
                    </View>
                    {/* { activePromotion && <Text>{JSON.stringify(activePromotion.)}</Text> } */}
                </View>
            </View>
            <View style={styles.previousPromotionSection}>
                <View style={styles.previousPromotionContainer}>
                    <SortPicker selectedValue={sortKey} onValueChange={setSortKey} />
                    <FlatList 
                        style={{paddingTop: 10}}
                        ItemSeparatorComponent={() => <View style={{height: 10,}} />}
                        data={sortedPromotions}
                        keyExtractor={(item) => item.promotionId}
                        renderItem={({item}) => (
                            <PromotionCard data={item} />
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
        height: '25%',
        width: '100%',
        borderBottomWidth: .1,
        padding: 10,
        borderBottomColor: 'rgb(167, 165, 168)'
    },
    activePromotionContainer: {
        height: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    activeCurrentStats: {
        paddingTop: 10,
    },
    topBarContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.3,
        borderBottomColor: 'rgb(167, 165, 168)',
        paddingBottom: 5,
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