import { Card } from '@/types/Card';
import { Cafe } from '@/types/User';
import { addCafeIdToCustomerAccount, checkForCard, createCustomerRecord, fetchData, postNewCard } from '@/utils/FirebaseController';
import { BeanType, splitPattern } from '@/utils/utils';
import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { memo, useLayoutEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ScanCamera = () => {

    // const [id, setId] = useState<string>()
    // const [email, setEmail] = useState<string>()
    const [user, setUser] = useState<User>()
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState<boolean>(false);
    const scannedRef = useRef<boolean>(false);
    const [data, setData] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false);

    const nav = useNavigation();

    const state = useLocalSearchParams();

    useLayoutEffect(() => {

        onAuthStateChanged(getAuth(), (user) => {
            if ( user ) {
                setUser(user);
            }
        })

        nav.setOptions({
            title: 'Scan Code',
        })
        
    }, [])

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
        <View style={styles.container}>
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="grant permission" />
        </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const handleBarcodeScanned = (result: BarcodeScanningResult) => {
        if (!scannedRef.current) {
            // parse QR code data - {cafeid}-{coffe count}
            const [cafeId, quantity]: string[] = result.data.split(splitPattern);
            if (parseInt(quantity) < 1) {
                console.log('value less than 1')
                return;
            }
            if (!user?.uid) return;
            updateCard(cafeId, user.uid, parseInt(quantity));

            // create card instance OR alert card already exists

            scannedRef.current = true;
            setData(result.data);
            return;
        }
    }

    const updateCard = async (cafeId: string, customerId: string, quantity: number) => {
        const hasCard: boolean = await checkForCard(cafeId, customerId);
        if (hasCard) {
            alert('You already have this vendors card.\n Please use the scanner on the Your Cards screen.')
            return;
        }

        if (!cafeId || !user?.uid || !user?.email) {
            console.log('Authentication error');
            return;
        }
        // generate cafe card for customer
        const cafeData: Cafe = await fetchData(cafeId, 'cafes') as Cafe;
        const card: Card = {
            userId: user?.uid,
            userEmail: user?.email ?? undefined,
            cafeId: cafeId,
            reward: cafeData.reward,
            currentCount: quantity,
            countRequiredRedeem: cafeData.redeemCount,
            totalScanCount: quantity,
            totalRedeemCount: 0,
            ranking: 0,
            dateCardCreated: Timestamp.now(),
            dateCardUpdated: Timestamp.now(),
            logoUri: '',
            beanType: BeanType['Green Bean'],
            beanIconUri: '',
        }

        // past card to cards
        const isCardSaved: boolean = await postNewCard(cafeId, user?.uid, card);
        if ( isCardSaved ) {

            // append cafe id to customer cafes array
            const result: boolean | string [] = await addCafeIdToCustomerAccount(customerId, cafeId);
            console.log(result);
        } else {
            alert('Error saving card')
        }

        // create a customer record in the cafe doc
        const isCustomerRecordCreated = await createCustomerRecord(cafeId, customerId, quantity);
        console.log(isCustomerRecordCreated)
        if ( !isCustomerRecordCreated ) {
            console.log('Customer record not created');
            return;
        }
    }

    return (
        <View style={styles.container}>
            <CameraView onBarcodeScanned={handleBarcodeScanned} style={styles.camera} facing={facing}>
                <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>{data ?? 'Data Scanned'}</Text>
                    <Text style={styles.text}>Flip Camera</Text>
                </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default memo(ScanCamera)