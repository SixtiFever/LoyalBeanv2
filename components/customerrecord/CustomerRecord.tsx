import { Card } from "@/types/Card";
import { BeanType } from "@/utils/utils";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface CustomerRecordProps {
    data: Card;
}

const CustomerRecord: React.FC<CustomerRecordProps> = ({data}) => {
    console.log(data)
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text>{data.userEmail}</Text>
                <Text>{BeanType[data.beanType]}</Text>
            </View>
            <View style={styles.bottomContainer}>
                <Text>{data.totalScanCount}</Text>
                <Text>{data.totalRedeemCount}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 80,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 8,
        justifyContent:'space-between',
        borderWidth: 0.2,
        borderColor: 'rgba(0,0,0,0.3)',
        padding: 10,
    },
    topContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bottomContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    }
})

export default memo(CustomerRecord);