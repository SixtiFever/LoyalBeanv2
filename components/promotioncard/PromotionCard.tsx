import { RedeemIcon } from "@/assets/icons";
import { PromotionRecord } from "@/types/Promotion";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface PromotionCardProps {
    data: PromotionRecord;
}

const PromotionCard: React.FC<PromotionCardProps> = ({data}) => {
    return (
        <View style={styles.container}>
            <View style={styles.rewardContainer}>
                <RedeemIcon height="18" width="18" />
                <Text style={styles.rewardText}>{data.reward}</Text>
            </View>
            <View style={styles.statsContainer}>
                <View style={styles.statsColumn}>
                    <Text style={styles.valueText}>{data.scansPerDay}</Text>
                    <Text style={styles.labelText}>Scans/day</Text>
                </View>
                <View style={styles.statsColumn}>
                    <Text style={styles.valueText}>{data.redeemsPerDay}</Text>
                    <Text style={styles.labelText}>Redeems/day</Text>
                </View>
                <View style={styles.statsColumn}>
                    <Text style={styles.valueText}>{data.runLengthDays}</Text>
                    <Text style={styles.labelText}>Days</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 100,
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        borderRadius: 8,
        justifyContent:'space-between',
        borderWidth: 0.2,
        borderColor: 'rgba(0,0,0,0.3)'
    },
    rewardContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderBottomWidth: .2,
        borderBottomColor: 'rgba(0, 0, 0, 0.3)',
        paddingBottom: 4,
    },
    rewardText: {
        fontSize: 12,
        fontWeight: '600',
        paddingLeft: 5,
    },
    statsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-evenly',
        paddingTop: 10,
    },
    statsColumn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    valueText: {
        fontWeight: 'bold',
        fontSize:14,
        color: 'black'
    },
    labelText: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(0,0,0,0.6)'
    }
})

export default memo(PromotionCard);