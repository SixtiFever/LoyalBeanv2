import { BackIcon, EmailIcon, RedeemIcon, ShopIconFilled } from '@/assets/icons';
import { ActionButton } from '@/components/buttons';
import { CustomPasswordInput, CustomTextInput } from '@/components/custominputs';
import LocationAdder from '@/components/LocationAdder';
import CustomNavbar from '@/components/navbar';
import NumberPickerLocal from '@/components/NumericInputLocal';
import { auth } from '@/firebaseconfig';
import { Geolocations } from '@/types/Geolocations';
import { PromotionRecord } from '@/types/Promotion';
import { Cafe } from '@/types/User';
import { activateFirstPromotion, createCardsDocument, createPromotionRecord, postNewCafe, postNewCafeId, uploadCafeLogo } from '@/utils/FirebaseController';
import * as ImagePicker from 'expo-image-picker';
import { router, useNavigation } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { memo, useCallback, useLayoutEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CafeSignup = () => {

    // states
    const [confirmEmail, setConfirmEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [quantity, setQuantity] = useState<number>(0);
    const [cafe, setCafe] = useState<Partial<Cafe>>({});
    const [geolocations, setGeolocations] = useState<Geolocations>({});
    const [mediaLibraryStatus, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    const [logoUri, setLogoUri] = useState<string>()

    // router
    const nav = useNavigation();

    useLayoutEffect(() => {

        nav.setOptions({
            headerShown: false,
        })

    }, [])

    const handleQuantityChange = useCallback((val: number) => {
        setQuantity(val);
    }, [])


    const handleSignup = async () => {

        if ( confirmEmail !== cafe.email || confirmPassword !== cafe.password ) return;

        try {

            const result = await createUserWithEmailAndPassword(auth, confirmEmail, confirmPassword );
            const cafeObject: Partial<Cafe> = { 
                ...cafe, 
                id: result.user.uid, 
                qrCode: result.user.uid, 
                logo: logoUri, 
                redeemCount: quantity, 
                locations: geolocations,
                customers: [],
            }
            // post new users to cafes collection
            await postNewCafe(cafeObject);  // add document to cafes collection
            await createCardsDocument(result.user.uid); // create card in cards collection
            await postNewCafeId(cafeObject); // store id in cafeids collection
            // storage cafe logo 
            await uploadCafeLogo(cafeObject);
            const promotion: PromotionRecord | false = createPromotionRecord(cafeObject);
            if (!promotion) {
                console.log('Promotion can\'t be created');
                return;
            }
            await activateFirstPromotion(result.user.uid, promotion);

        } catch (err) {
            console.log(err)
        } finally {
            setGeolocations({})
        }
        
    }

    const handleChangeText = (type: string, e?: any) => {
        if ( type === 'confirmEmail' ) {
            setConfirmEmail(e);
        } else if ( type === 'confirmPassword' ) {
            setConfirmPassword(e);
        } else {
            setCafe((prev: Partial<Cafe>) => ({
                ...prev, [type]: e }))
        }
    }

    const handlePickImage = async () => {

        if( !mediaLibraryStatus ) await requestPermission();

        try {
            const image: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync();
            setLogoUri(image.assets[0].uri);
        } catch (err) {
            console.log(err)
        }
    }

    const handleNavBack = () => {
        router.back()
    }

  return (

            <SafeAreaView edges={["top"]} style={styles.contentContainer}>    
                <CustomNavbar
                    height={80}
                    leftIcon={<BackIcon height='20' width='30' color='#424C55' />}
                    leftOnPress={handleNavBack}
                    title='Cafe login'
                    color={'#F2F4FF'} />

                <ScrollView
                style={styles.scrollviewStyle}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                >

                    <CustomTextInput
                        leftIcon={<ShopIconFilled width="22" height="20" color="#D2CBCB" />}
                        height={60} 
                        widthPercentage={100}
                        placeholder='Enter shopname'
                        type='shopname'
                        handleChangeText={handleChangeText} />

                    <CustomTextInput
                        leftIcon={<EmailIcon width="25" height="15" color="#D2CBCB" />}
                        height={60} 
                        widthPercentage={100}
                        placeholder='Enter email'
                        type='email'
                        handleChangeText={handleChangeText} />

                    <CustomTextInput
                        leftIcon={<EmailIcon width="25" height="15" color="#D2CBCB" />}
                        height={60} 
                        widthPercentage={100}
                        placeholder='Confirm email'
                        type='confirmEmail'
                        handleChangeText={handleChangeText} />

                    <CustomPasswordInput 
                        height={60} 
                        widthPercentage={100} 
                        placeholder='Enter password'
                        type='password'
                        handleChangeText={handleChangeText} />
                    
                    <CustomPasswordInput 
                        height={60} 
                        widthPercentage={100} 
                        placeholder='Confirm password'
                        type='confirmPassword'
                        handleChangeText={handleChangeText} />

              
                    <Text>Scans required</Text>
                    <NumberPickerLocal value={quantity} onChange={handleQuantityChange} min={1} max={30} />

                    <CustomTextInput
                        leftIcon={<RedeemIcon width="35" height="25" color="#D2CBCB" />}
                        height={60} 
                        widthPercentage={100}
                        placeholder='Redeemable reward'
                        type='reward'
                        handleChangeText={handleChangeText} />

                    <LocationAdder setGeolocations={setGeolocations} />
                    <ActionButton title='Choose logo' onPress={handlePickImage} />
                    { logoUri &&  <Image source={{ uri: logoUri }} style={{ height: 100, width: 100 }}  /> }
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <ActionButton title='Sign up' onPress={handleSignup} color={'#F87666'} />
                    <Text onPress={handleNavBack}>Go to cafe login</Text>
                </View>
            </SafeAreaView>
      );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FFF',
  },
  scrollviewStyle: {
    width: '100%',
  },
  scrollContent: {
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    rowGap: 20,
    backgroundColor: '#F2F4FF',
  },
  contentContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F4FF'

  },
  buttonContainer: {
    height: '20%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
});

export default memo(CafeSignup);
