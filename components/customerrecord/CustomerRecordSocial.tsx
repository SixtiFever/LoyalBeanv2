import { Card } from "@/types/Card";
import { fetchProfilePicture } from "@/utils/FirebaseController";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import React, { memo, useEffect, useLayoutEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollableInterests } from "../interests";

interface CustomerRecordProps {
    data: Card;
}

const deafultIcon = require('../../assets/images/defaultusericon.jpg');

const CustomerRecordSocial: React.FC<CustomerRecordProps> = ({data}) => {

    const [user, setUser] = useState<User>()
    const [totalScanCount, setTotalScanCount] = useState(0);
    const [totalRedeemCount, setTotalRedeemCount] = useState(0);
    const [isPersonalisedRewardActive, setIsPersonalisedRewardActive] = useState<boolean>(data.personalisedRewardActive ?? false)
    const [imageUri, setImageUri] = useState<string>();

    useLayoutEffect(() => {

        onAuthStateChanged(getAuth(), (user) => {
            if (user) setUser(user);
        })

        

    }, [])

    useEffect(() => {
        if (user) {
            const fetchImage = async () => {
                const result = await fetchProfilePicture(data.userId);
                setImageUri(result)
            }
            fetchImage();
        }

        console.log(data)
    }, [user])

    const handleMessage = async () => {
        
    }

    return (
        <View style={styles.container}>
            <View style={styles.leftSideContainer}>
                <Image source={ imageUri ? { uri: imageUri } : deafultIcon} style={styles.image} />
                <Text>{data.beanType}</Text>
            </View>
            <View style={styles.rightSideContainer}>
                {/* <Text>{user?.displayName}</Text> */}
                <Text>{data.userEmail}</Text>
                <Text>{data.about}</Text>
                <ScrollableInterests data={data.interests ?? []} />
                {/* <Text>{data.beanType}</Text> */}
                {/* <Text>{data.dateCardUpdated.toDate().toDateString()}</Text> */}
                <View style={styles.buttonsContainer}>
                    {/* <TouchableOpacity style={styles.claimBtn}>
                        <Text>Notify</Text>
                    </TouchableOpacity> */}
                        <TouchableOpacity onPress={handleMessage} style={styles.claimBtn}>
                        <Text>Message</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 150,
        display: 'flex',
        flexDirection: 'row',
        borderTopWidth: 0.2,
        borderColor: '#5D576B',
        padding: 10,
    },
    leftSideContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '30%',
        alignItems: 'center'
    },
    rightSideContainer: {
        display: 'flex',
        // height: 100,
        flexDirection: 'column',
        flex: 1,
        paddingStart: 35,
        justifyContent: 'space-evenly',
    },
    image: {
        height: 80,
        width: 80,
        borderColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderRadius: '100%',
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    claimBtn: {
        width: 80,
        height: 30,
        borderRadius: 6,
        borderWidth: 0.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default memo(CustomerRecordSocial);