import { BackIcon, EmailIcon, UserIcon } from '@/assets/icons';
import { ActionButton } from '@/components/buttons';
import { CustomPasswordInput, CustomTextInput } from '@/components/custominputs';
import { auth } from '@/firebaseconfig';
import { Customer } from '@/types/User';
import { customerSignup } from '@/utils/FirebaseAuthentication';
import { postNewUserFirestore, postNewUserId, uploadProfilePicture } from '@/utils/FirebaseController';
import * as ImagePicker from 'expo-image-picker';
import { router, useNavigation } from 'expo-router';
import { getAuth, onAuthStateChanged, User, UserCredential } from 'firebase/auth';
import React, { memo, useLayoutEffect, useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomNavbar from '../../../../components/navbar';

const CustomerSignup = () => {

    // states
    const [confirmEmail, setConfirmEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useState<Customer>({});
    const [authUser, setAuthUser] = useState<User>()
    const [text, setText] = useState<string>('')
    const [mediaLibraryStatus, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    const [imageUri, setImageUri] = useState<string>()

    // router
    const nav = useNavigation();

    useLayoutEffect(() => {

        nav.setOptions({
            headerShown: false,
        })

        onAuthStateChanged(getAuth(), (user) => {
            if (user) setAuthUser(user);
        })

    }, [])


    const handleSignup = async () => {

        if ( !user.username || user.email !== confirmEmail || user.password !== confirmPassword ) {
            
            alert('Field error encountered')
        } else {

            // create user in firebase auth w/ username
            const usercredential: UserCredential | void = await customerSignup(auth, user.username, user.email, user.password);
            if (!usercredential) {
                console.log('User creation failed');
                return;
            }
            // post customer id to ids collection
            await postNewUserId(usercredential)

            // create user in firestore
            await postNewUserFirestore(usercredential, user);

            // save user profile picture
            if (!imageUri) return;
            await uploadProfilePicture(imageUri, usercredential.user.uid)
        }
    }

    const handleNavBack = () => {
        router.back();
    }

    const handleChangeText = (type: string, e?: any) => {
        console.log(e);
        if ( type === 'username' || type === 'password' || type === 'email' ) {
            setUser((prev: Partial<Customer>) => ({
                ...prev, [type]: e }))
        } else {
            if ( type === 'confirmEmail' ) setConfirmEmail(e);
            if ( type === 'confirmPassword' ) setConfirmPassword(e);
        }
    }

    const handlePickImage = async () => {
    
        if( !mediaLibraryStatus ) await requestPermission();

        try {
            const image: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync();
            setImageUri(image.assets[0].uri);
        } catch (err) {
            console.log(err)
        }

    }

  return (
    <SafeAreaView edges={["top"]}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                <CustomNavbar
                    height={80}
                    leftIcon={<BackIcon height='20' width='30' color='#424C55' />}
                    leftOnPress={handleNavBack}
                    title='Customer signup' />
                    <ScrollView contentContainerStyle={styles.form}>
                        <CustomTextInput 
                            leftIcon={<UserIcon width='15' height='30' color='#D2CBCB' />}
                            height={60} 
                            widthPercentage={80} 
                            placeholder='Enter username' 
                            handleChangeText={handleChangeText}
                            type='username'
                            />
                        <CustomTextInput
                            leftIcon={<EmailIcon width="25" height="15" color="#D2CBCB" />}
                            height={60} 
                            widthPercentage={80} 
                            placeholder='Enter email' 
                            handleChangeText={handleChangeText}
                            type='email'
                            />

                        <CustomTextInput
                            leftIcon={<EmailIcon width="25" height="15" color="#D2CBCB" />}
                            height={60} 
                            widthPercentage={80} 
                            placeholder='Confirm email' 
                            handleChangeText={handleChangeText}
                            type='confirmEmail'
                            />

                        <CustomPasswordInput 
                            height={60} 
                            widthPercentage={80} 
                            placeholder='Enter password' 
                            handleChangeText={handleChangeText}
                            type='password'
                            />
                        <CustomPasswordInput 
                            height={60} 
                            widthPercentage={80} 
                            placeholder='Confirm password'
                            handleChangeText={handleChangeText}
                            type='confirmPassword'
                            />
                        
                        <ActionButton
                            onPress={handlePickImage}
                            color={'yellow'}
                            title='Set profile picture'
                        />

                        { imageUri &&  <Image source={{ uri: imageUri }} style={{ height: 100, width: 100 }}  /> }

                    </ScrollView>
                    <ActionButton title='Signup' onPress={handleSignup} color={'#F87666'} />
                </>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill parent container
    backgroundColor: '#F2F4FF',
  },
  form: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 16,
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

export default memo(CustomerSignup);
