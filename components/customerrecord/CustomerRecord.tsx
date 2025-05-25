import { Card } from "@/types/Card";
import { BeanType } from "@/utils/utils";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import React, { memo, useLayoutEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface CustomerRecordProps {
    data: Card;
}

const deafultIcon = require('../../assets/images/defaultusericon.jpg');

const CustomerRecord: React.FC<CustomerRecordProps> = ({data}) => {

    const [user, setUser] = useState<User>()
    const [totalScanCount, setTotalScanCount] = useState(0);
    const [totalRedeemCount, setTotalRedeemCount] = useState(0);

    useLayoutEffect(() => {

        onAuthStateChanged(getAuth(), (user) => {
            if (user) setUser(user);
        })

    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.leftSideContainer}>
                <Image source={deafultIcon} style={styles.image} />
                <Text>{BeanType[data.beanType]}</Text>
            </View>
            <View style={styles.rightSideContainer}>
                <Text>{user?.displayName}</Text>
                <Text>{data.userEmail}</Text>
                <Text>Scans: {data.totalScanCount}</Text>
                <Text>Redeems: {data.totalRedeemCount}</Text>
                {/* <Text>Fav: {data.userEmail}</Text> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 100,
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 8,
        // justifyContent:'space-between',
        borderWidth: 0.2,
        borderColor: 'rgba(0,0,0,0.3)',
        padding: 10,
    },
    leftSideContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '25%',
        alignItems: 'center'
    },
    rightSideContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        paddingStart: 35,
        justifyContent: 'space-evenly',
    },
    image: {
        height: 60,
        width: 60,
        borderColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderRadius: '100%',
    }
})

export default memo(CustomerRecord);