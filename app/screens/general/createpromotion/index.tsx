import useFetchPromotions from '@/app/hooks/useFetchPromotions';
import { BackIcon, RedeemIcon } from '@/assets/icons';
import { ActionButton } from '@/components/buttons';
import { CustomTextInput } from '@/components/custominputs';
import CustomNavbar from '@/components/navbar';
import NumberPickerLocal from '@/components/NumericInputLocal';
import { PromotionRecord } from '@/types/Promotion';
import { updateActivePromotion, updateCardsWithNewPromotion } from '@/utils/FirebaseController';
import { calculateDaysBetween, calculatePerDayStat, extractDayMonthYear } from '@/utils/utils';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';

const CreatePromotion = () => {

    const nav = useNavigation();
    const router = useRouter();
    const state = useLocalSearchParams();

    // states
    const [quantity, setQuantity] = useState<number>(0);
    const [reward, setReward] = useState<string>();
    const [user, setUser] = useState<User>()
    const activePromotion = useRef<PromotionRecord>({});
    const [promotions, isLoading, error] = useFetchPromotions();
    const archivedPromotion = useRef<PromotionRecord>(JSON.parse(state.activePromotion));
    // const [promotions, setPromotions] = useState<Record<string, PromotionRecord>>({})
    // const [error, setError] = useState<boolean>(false);

    useLayoutEffect(() => {

        nav.setOptions({
            headerShown: false,
        });

        const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
            if (user) setUser(user)
        })

        return () => unsubscribe();

    }, [])

    useEffect(() => {

        if ( typeof promotions === 'boolean' ) return;

        for ( let key in promotions) {
            if ( promotions[key].active ) archivedPromotion.current = promotions[key]
        }

    }, [promotions])


    const handleNavBack = () => {
        router.back();
    }

    const handleQuantityChange = useCallback((val: number) => {
            setQuantity(val);
    }, [])

    const handleChangeText = (type: string, e?: any) => {
        if ( type === 'reward' ) {
            setReward(e);
        }
    }

    const handleCreatePromotion = async () => {
        try {
            if ( !reward || quantity < 1 ) {
                alert('Enter valid reward / quantity')
                return;
            }
            if ( !user ) {
                console.log('No user object');
                return;
            }
            const now: Timestamp = Timestamp.now();
            const { day, month, year } = extractDayMonthYear(now.toDate());
            archivedPromotion.current = { ...archivedPromotion.current };
            archivedPromotion.current.endDate = now;
            archivedPromotion.current.endDateDay = day;
            archivedPromotion.current.endDateMonth = month;
            archivedPromotion.current.endDateYear = year;
            archivedPromotion.current.endDateFull = now.toDate();
            archivedPromotion.current.active = false;
            const startTimestamp: Timestamp = new Timestamp(archivedPromotion.current.startDateTimestamp.seconds,archivedPromotion.current.startDateTimestamp.nanoseconds);
            const daysRun = calculateDaysBetween(startTimestamp, now);
            const perDayStats: {scansPerDay: number, redeemsPerDay: number} | void = calculatePerDayStat(archivedPromotion.current, daysRun);
            if ( !perDayStats ) {
                alert('Couldn\'t calculate per day stats');
                return;
            }

            const spd: number = Number(perDayStats.scansPerDay.toFixed(2));
            const rpd: number = Number(perDayStats.redeemsPerDay.toFixed(2));

            archivedPromotion.current.runLengthDays = daysRun;
            archivedPromotion.current.scansPerDay = spd;
            archivedPromotion.current.redeemsPerDay = rpd;
            console.log(archivedPromotion.current);
            const id: string = uuidv4()
            const promotion: PromotionRecord = { 
                promotionId: id,
                active: true,
                purchaseMilestone: quantity,
                reward: reward,
                scans: 0,
                redeems: 0,
                startDateTimestamp: now,
                startDateFull: now.toDate(),
                startDateDay: day,
                startDateMonth: month,
                startDateYear: year,
                interactions: {}
            }
            activePromotion.current = promotion;

            // set active === true on new promotion
            await updateActivePromotion(user?.uid, archivedPromotion.current, activePromotion.current);
            
            // update all customer cards with new promotion details (purchase milestone, reward)
            await updateCardsWithNewPromotion(user.uid, promotion);

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <CustomNavbar
                leftIcon={<BackIcon height='15' width='25' color='#424C55' />}
                title="Launch New Promotion"
                leftOnPress={handleNavBack}
                height={60}
            />
            <View style={styles.contentArea}>
                <View style={styles.contentContainer}>
                    <CustomTextInput
                        leftIcon={<RedeemIcon width="35" height="25" color="#D2CBCB" />}
                        height={60} 
                        widthPercentage={100}
                        placeholder='Redeemable reward'
                        type='reward'
                        handleChangeText={handleChangeText} />
                    <NumberPickerLocal value={quantity} onChange={handleQuantityChange} min={1} max={30} />
                    <ActionButton onPress={handleCreatePromotion} title='Create Promotion' color={'cyan'} />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentArea: {
        flex: 1,
        backgroundColor: '#F8F4F9',
        padding: 10,
    },
    contentContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        rowGap: 25,
    }
})

export default CreatePromotion;