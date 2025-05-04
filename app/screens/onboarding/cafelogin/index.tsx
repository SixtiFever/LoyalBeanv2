import { BackIcon, EmailIcon } from '@/assets/icons';
import { ActionButton } from '@/components/buttons';
import { CustomPasswordInput, CustomTextInput } from '@/components/custominputs';
import CustomNavbar from '@/components/navbar';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LoginProps {
    type?: string;
}

const { height } = Dimensions.get('window');

const CafeLogin: React.FC<LoginProps> = ({ type }) => {

    // states
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // router config
    const nav = useNavigation();
    const router = useRouter();
    const {loginType} = useLocalSearchParams();

    useEffect(() => {

        nav.setOptions({
            title: 'Cafe Login',
            headerShown: false,
        })

    }, []);

    const navigateToCafeSignup = useCallback(() => {
        if ( loginType === 'cafe' ) {
            router.navigate({
                pathname: '/screens/onboarding/cafesignup',
            })
        }
    }, []);


    const handleLogin = async () => {
        console.log('r1')
        const loginResult = await signInWithEmailAndPassword(getAuth(), email, password);
        console.log('r2')
        if (loginResult.user) {
            router.dismissAll();
            router.replace({
                pathname: '/screens/general/cafehome',
            })
        }
    }

    const handleChangeText = (type: string, e?: any) => {
        if ( type === 'email' ) {
            setEmail(e)
        } else {
            setPassword(e);
        }
    }

    const handleNavBack = () => {
        router.back();
    }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>

        <CustomNavbar
            height={80}
            leftIcon={<BackIcon height='20' width='30' color='#424C55' />}
            leftOnPress={handleNavBack}
            title='Customer login' />

        <View style={styles.topSection}>
            
        </View>

        {/* Bottom 1/3 with inputs and signup */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.midSection}>
            {/* <TextInputLocal value={email} setStateVariable={setEmail} placeholder='Enter email' secureTextEntry={false}  /> */}
            <CustomTextInput
                    leftIcon={<EmailIcon width="25" height="15" color="#D2CBCB" />}
                    height={60} 
                    widthPercentage={100}
                    placeholder='Enter email'
                    type='email'
                    handleChangeText={handleChangeText} />
            
            <CustomPasswordInput 
                height={60} 
                widthPercentage={100}
                placeholder='Enter password'
                type='password'
                handleChangeText={handleChangeText}
            />
            </KeyboardAvoidingView>
            <View style={styles.bottomContainer}>
                <ActionButton title='Login' onPress={handleLogin} color={'#F87666'} />
                <TouchableOpacity onPress={navigateToCafeSignup}>
                    <Text style={styles.signupText}>Don't have an account? Sign up</Text>
                </TouchableOpacity>
            </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#F2F4FF',
    width: '100%',
  },
  topSection: {
    height: '40%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F8F8'
  },
  midSection: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
    rowGap: 10,
  },
  bottomContainer: {
    height: '20%',
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
  signupText: {
    marginTop: 10,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default CafeLogin;