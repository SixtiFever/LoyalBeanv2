import { BackIcon, EmailIcon, LoyalBeanLogo } from '@/assets/icons';
import { ActionButton } from '@/components/buttons';
import { CustomPasswordInput, CustomTextInput } from '@/components/custominputs';
import CustomNavbar from '@/components/navbar';
import { auth } from '@/firebaseconfig';
import { customerSignin } from '@/utils/FirebaseAuthentication';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { getAuth, UserCredential } from 'firebase/auth';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface LoginProps {
    type?: string;
}

const { height } = Dimensions.get('window');

const Login: React.FC<LoginProps> = memo(({ type }) => {

    // states
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // router config
    const nav = useNavigation();
    const router = useRouter();
    const {loginType} = useLocalSearchParams();

    console.log('test')

    useEffect(() => {

        nav.setOptions({
            title: 'Customer Login',
            headerShown: false,
        })

    }, []);

    const navigateToCustomerSignup = useCallback(() => {
        if ( loginType === 'customer' ) {
            router.navigate({
                pathname: '/screens/onboarding/customersignup',
            })
        } else {

        }
    }, []);

    const handleSignin = async () => {
        console.log('pre-signing')
        let a = getAuth();
        console.log(a);
        const result = await customerSignin(auth, email, password);
        console.log(result)
        if (result as UserCredential) {
            // navigate to home and reset nav stack
            router.dismissAll()
            router.replace({
                pathname: '/screens/general',
            })
        }
    }

    const handleNavBack = () => {
        router.back();
    }

    const handleChangeText = (type: string, e?: any) => {
        if (type === 'email' ) {
            setEmail(e);
        } else {
            setPassword(e);
        }
    }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
    <View style={styles.container}>
        <View style={styles.topContainer}>
            <CustomNavbar
                    height={80}
                    leftIcon={<BackIcon height='20' width='30' color='#424C55' />}
                    leftOnPress={handleNavBack}
                    title='Cafe login' />
            <View style={styles.logoContainer}>
                <LoyalBeanLogo height='150' width='150' color='#2D3142' />
            </View>
        </View>

        <KeyboardAvoidingView key={1} behavior={Platform.OS === 'ios' ? 'padding' : undefined}  style={styles.contentContainer}>
            <View style={styles.inputsContainer}>
                <CustomTextInput
                    leftIcon={<EmailIcon width="25" height="15" color="#D2CBCB" />}
                    height={60} 
                    widthPercentage={80}
                    placeholder='Enter email'
                    type='email'
                    handleChangeText={handleChangeText} />
            </View>
            <View style={styles.inputsContainer}>
                <CustomPasswordInput 
                    height={60} 
                    widthPercentage={80} 
                    placeholder='Enter password'
                    type='password'
                    handleChangeText={handleChangeText} />
            </View>
        </KeyboardAvoidingView>
        
        <View style={styles.buttonContainer}>
            <ActionButton title='Login' onPress={handleSignin} color={'#F87666'} />
            <TouchableOpacity onPress={navigateToCustomerSignup}>
                <Text style={styles.signupText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </View>
    </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#F2F4FF',
  },
  topContainer: {
    height: '45%',
    backgroundColor: 'white',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  navbarContainer: {
    height: '30%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  backIconContainer: {
    width: '25%',
    height: '60%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  screenTitleContainer: {
    width: '75%',
    height: '60%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingLeft: 50,
  },
  text: {
    color: '',
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  logoContainer: {
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    height: '40%',
    width: '100%',   
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  inputsContainer: {
    height: '40%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    height: '15%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
  signupText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default Login;