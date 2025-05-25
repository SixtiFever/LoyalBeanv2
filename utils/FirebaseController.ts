import { firestore, storage } from "@/firebaseconfig";
import { Card, PromotionRedeem } from "@/types/Card";
import { CustomerRecord } from "@/types/CustomerRecord";
import { PromotionInteractions, PromotionRecord } from "@/types/Promotion";
import { Cafe, Customer } from "@/types/User";
import { User, UserCredential } from "firebase/auth";
import { collection, doc, DocumentData, DocumentSnapshot, getDoc, runTransaction, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { extractDayMonthYear } from "./utils";

export const postNewUserFirestore = async (usercredential: UserCredential, user: Customer) => {
    const uid: string = usercredential.user.uid;
    const userObj: Customer = {
        ...user,
        id: uid,
        cafes: [],
    }

    const colRef = collection(firestore, 'customers');
    const docRef = doc(colRef, uid);

    try {
        await setDoc(docRef, userObj)
    } catch(err) {
        console.log(err);
    }
    
}

export const postNewUserId = async (user: UserCredential) => {
    if (!user || !user.user.email) return;
    const colRef = collection(firestore, 'customerids');
    const docRef = doc(colRef, user.user.email);
    await setDoc(docRef, { 'id' : user.user.uid })
}


export const postNewCafe = async (cafe: Partial<Cafe>) => {
    const colRef = collection(firestore, 'cafes');
    const docRef = doc(colRef, cafe.id);

    try {
        await setDoc(docRef, cafe);
    } catch (err) {
        console.log(err)
    }
}

export const createCardsDocument = async (id: string): Promise<void> => {
    const colRef = collection(firestore, 'cards');
    const docRef = doc(colRef, id);
    try {
        await setDoc(docRef, {});
    } catch (err) {
        console.log(err)
    }
}

export const postNewCafeId = async (cafe: Partial<Cafe>) => {
    const colRef = collection(firestore, 'cafeids');
    const docRef = doc(colRef, cafe.email);
    try {
        await setDoc(docRef, { 'id': cafe.id })
    } catch (err) {
        console.log(err)
    }
}

export const fetchId = async (email: string, type: 'cafeids' | 'customerids'): Promise<string | boolean> => {
    const result = await runTransaction(firestore, async (transaction) => {
        const colRef = collection(firestore, type);
        const docRef = doc(colRef, email);
        const snap: DocumentSnapshot<DocumentData> = await transaction.get(docRef);
        if ( snap.exists() ) {
            return snap.data().id
        }
        return false
    }).catch(err => {
        console.log(err);
    })
    return result
}

export const fetchData = async (id: string, type: 'cafes' | 'customers'): Promise<Cafe | Customer | boolean> => {

    const result: Cafe | Customer | boolean = await runTransaction(firestore, async (transaction) => {
        const colRef = collection(firestore, type);
        const docRef = doc(colRef, id);
        const snap: DocumentSnapshot<DocumentData> = await transaction.get(docRef);
        if ( !snap.exists() ) {
            return false;
        }
        return snap.data();
    });
    return result;
}


// fetch cafes cards
export const fetchCards = async (id: string): Promise<void | DocumentData> => {
    const result: void | DocumentData = await runTransaction(firestore, async (transaction) => {
        const colRef = collection(firestore, 'cards');
        const docRef = doc(colRef, id);
        const snap: DocumentSnapshot<DocumentData> = await transaction.get(docRef);
        if (snap.exists()) {
            return snap.data();
        }
    }).catch(err => {
        console.log(err);
    })

    return result;
}


export const checkForCard = async (cafeId: string, customerId: string) => {
    const colRef = collection(firestore, 'cards');
    const docRef = doc(colRef, cafeId);
    const snap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
    if ( snap.exists() ) {
        const hasCard: boolean = snap.data()[customerId] ? true : false;
        return hasCard;
    }
    return false;
}

export const postNewCard = async (cafeId: string, customerId: string | undefined, card: Card): Promise<boolean>  => {
    try {
        const colRef = collection(firestore, 'cards');
        const docRef = doc(colRef, cafeId);
        const snap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
        if ( !snap.exists() ) return false;
        await setDoc(docRef, { [customerId as string]: card }, {merge: true});
        return true;
    } catch (err) {
        console.log('FirebaseController/postNewCard: ', err);
    }
    return false;
}

export const fetchCustomerCards = async (id: string): Promise<Card[] | void> => {
    const result: Card[] | void = await runTransaction(firestore, async (transaction) => {

        const colRefUser = collection(firestore, 'customers');
        const docRefUser = doc(colRefUser, id);

        const colRefCard = collection(firestore, 'cards');

        const customerSnap = await transaction.get(docRefUser);

        if ( !customerSnap.exists() ) {
            console.log('Customer snap doesn\'t exist');
            return;
        }
        const cafeids: string[] = customerSnap.data().cafes ?? [];

        let cards: Card[] = []
        for (let i = 0; i < cafeids.length; i++ ) {
            const snap = await transaction.get(doc(colRefCard, cafeids[i]));
            const logo = await fetchCafeLogo(cafeids[i]);
            if ( snap.exists() ) {
                const card: Card = snap.data()[`${id}`]
                card.logoUri = logo;
                cards.push(card);
            }
            
        }
        return cards;
    })
    return result;
}

export const addCafeIdToCustomerAccount = async (customerId: string, cafeId: string): Promise<boolean | string[]> => {
    const colRef = collection(firestore, 'customers');
    const docRef = doc(colRef, customerId);
    const snap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
    if (!snap.exists()) return false;
    const cafes: string [] = await snap.data().cafes ?? [];
    if (!cafes.includes(cafeId)) {
        cafes.push(cafeId);
        await setDoc(docRef, { 'cafes': cafes }, {merge: true});
        return cafes;
    } else {
        console.log('Cafe id exists');
        return false;
    }
}

export const createCustomerRecord = async (cafeId: string, customerId: string, x: number): Promise<boolean | void | CustomerRecord> => {
    const result: boolean | void | CustomerRecord = await runTransaction(firestore, async (transaction) => {
        const colRef = collection(firestore, 'cafes');
        const docRef = doc(colRef, cafeId);
        const snap = await transaction.get(docRef);
        if ( !snap.exists() ) return false;
        // assign customer record from cafe doc. If not found, create one.
        const record: CustomerRecord = {[customerId] : { scans: 0, redeems: 0 }};

        record[customerId].scans += x
        transaction.set(docRef, { 'customers': record }, {merge: true});
        return record;
    }).catch(err => {
        console.log(err);
    })
    return result;
}


export const createPromotionRecord = (cafeObject: Partial<Cafe>): PromotionRecord | false => {
    if ( !cafeObject.redeemCount || !cafeObject.reward ) {
        return false;
    }
    const id: string = uuidv4()
    const startDate = Timestamp.now().toDate();
    const { day, month, year } = extractDayMonthYear(Timestamp.now().toDate());
    const promotion: PromotionRecord = { 
        promotionId: id,
        active: false,
        purchaseMilestone: cafeObject.redeemCount,
        reward: cafeObject.reward,
        scans: 0,
        redeems: 0,
        startDateTimestamp: Timestamp.now(),
        startDateFull: startDate,
        startDateDay: day,
        startDateMonth: month,
        startDateYear: year,
        interactions: {}
    }
    return promotion;
}

// sets promotion active to true and adds to the promotions/cafeid document
export const activateFirstPromotion = async (cafeId: string, promotion: PromotionRecord): Promise<boolean> => {
    const colRef = collection(firestore, 'promotions');
    const docRef = doc(colRef, cafeId);
    const snap = await getDoc(docRef);
    promotion.active = true;
    try {
        await setDoc(docRef, { [promotion.promotionId]: promotion }, { merge: true });
    } catch (err) {
        console.log(err);
        return false;
    }
    return true;
}


// update promotion interactions
export const updatePromotionInteractions = async (cafeId: string, activePromotion: PromotionRecord, userId: string, quantity: number, redeems: number) => {
    const result = await runTransaction(firestore, async (transaction) => {
        const colRef = collection(firestore, 'promotions');
        const docRef = doc(colRef, cafeId);
        const snap: DocumentSnapshot<DocumentData> = await transaction.get(docRef);
        if (!snap.exists()) return;
        const newInteraction: PromotionInteractions = { [userId]: { scans: quantity, redeems: redeems } };

        if ( !snap.data()[activePromotion.promotionId]['interactions'][userId] ) {
            transaction.set(docRef, { [activePromotion.promotionId]: { interactions: newInteraction }}, { merge: true })
        } else {
            const oldInteraction: PromotionInteractions = snap.data()[activePromotion.promotionId]['interactions'][userId];

            const newScans: number = quantity + oldInteraction.scans;
            const newRedeems: number = redeems + oldInteraction.redeems;
            transaction.set(docRef, { [activePromotion.promotionId]: { interactions: { [userId]: { scans: newScans, redeems: newRedeems }}}}, {merge: true});
        }
        
    }).catch(err => {
        console.log('FirebaseController/269 - ', err);
    })
}


export const getActivePromotion = async (cafeId: string) => {
    const colRef = collection(firestore, 'promotions');
    const docRef = doc(colRef, cafeId);
    try {
        const snap = await getDoc(docRef)
        if ( !snap.exists() ) return;
        const promotions = snap.data();
        // Find the key where active is true
        const activeKey: string | undefined = Object.keys(promotions).find(
            key => promotions[key].active === true
        );
        if(!activeKey) return;

        const activePromotion = promotions[activeKey]
        return activePromotion;
    } catch (err) {
        console.log(err);
    }
    
}


export const getCafeIds = async (user: User): Promise<string[] | undefined> => {
    const colRef = collection(firestore, 'customers');
    const docRef = doc(colRef, user.uid);
    const snap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
    if (!snap.exists()) return;
    return snap.data().cafes ?? []
}



export const updateActivePromotion = async (cid: string, oldPromotion: PromotionRecord, newPromotion: PromotionRecord) => {

    const result = await runTransaction(firestore, async (transaction) => {
        const colRef = collection(firestore, 'promotions');
        const docRef = doc(colRef, cid);
        const snap: DocumentSnapshot<DocumentData> = await transaction.get(docRef);
        if (!snap.exists()) return;
        const promotions: Record<string, PromotionRecord> = snap.data();
        // blankey loop to turn assign all .active as false
        for ( let key in promotions ) {
            if ( promotions[key].active ) {
                promotions[key].active = false;
            }
        }
        delete promotions[oldPromotion.promotionId];
        promotions[oldPromotion.promotionId] = oldPromotion;
        promotions[newPromotion.promotionId] = newPromotion;
        transaction.set(docRef, promotions);
    }).catch(err => {
        console.log(err);
    })
}


export const updateCardsWithNewPromotion = async (cafeId: string, newPromotion: PromotionRecord): Promise<Record<string, Card> | void> => {
    const result: Record<string, Card> | void = await runTransaction(firestore, async (transaction) => {
        const colRef = collection(firestore, 'cards');
        const docRef = doc(colRef, cafeId);
        const snap: DocumentSnapshot<DocumentData> = await transaction.get(docRef); // retrieve customer cards

        if ( !snap.exists() ) return;

        const cards: Record<string, Card> = snap.data(); // locally assign card for manipulation
        for ( let key in cards ) {
            cards[key].countRequiredRedeem = newPromotion.purchaseMilestone;
            cards[key].reward = newPromotion.reward;
        }
        transaction.set(docRef, cards); // update document with new cards
        return cards;
    }).catch(err => {
        console.log(err)
    })
    return result;
}


export const resolvePromotionRedeem = async (cafeId: string, customerId: string, promotionId: string) => {
    const result = runTransaction(firestore, async (transaction) => {

        const colRef = collection(firestore, 'cards');
        const docRef = doc(colRef, cafeId);
        // const fieldPath: string = `${customerId}.pendingRedeems.[${promotionId}]`;
        const snap: DocumentSnapshot<DocumentData> = await transaction.get(docRef);
        if (!snap.exists()) return;
        // extract redeemed promotion from pendingRedeems
        const pendingRedeems: Record<string, PromotionRedeem> = snap.data()[customerId].pendingRedeems;
        const redeemedPromotion = pendingRedeems[promotionId];
        if (!redeemedPromotion) {
            throw new Error('Promotion ID not found in pendingRedeems');
        }
        // add redeemed promotion to archivedRedeems
        const archivedRedeems: Record<string, PromotionRedeem> = snap.data()[customerId].archivedRedeems;
        archivedRedeems[promotionId] = redeemedPromotion;

        // delete redeemed promotion from pendingRedeems
        delete pendingRedeems[promotionId];

        transaction.update(docRef, { 
            [`${customerId}.pendingRedeems`]: pendingRedeems,
            [`${customerId}.archivedRedeems`]: archivedRedeems
         })

        return redeemedPromotion;
    })
    
}

export const uploadCafeLogo = async (cafeData: Partial<Cafe>) => {

    try {
        const filename = `${cafeData.id}/logo.png`;
        const response = await fetch(cafeData.logo)
        const blob = await response.blob();
        const storageRef = ref(storage, filename);
        const result = await uploadBytesResumable(storageRef, blob);

    } catch (err) {
        console.log(err);
    }
}


export const fetchCafeLogo = async (cafeId: string) => {
    try {
        const fileName: string = `${cafeId}/logo.png`;
        const imageRef = ref(storage, fileName);
        const url = await getDownloadURL(imageRef);
        return url;
    } catch (err) {
        console.log(err);
    }
}

/**
 * fetches all prootions from the cafes promotions document
 * both active and non-active
*/
// export const fetchAllCafePromotions = async (cafeId: string): Promise<Record<string, PromotionRecord> | void> => {
//     try {
//         const colRef = collection(firestore, 'promotions');
//         const docRef = doc(colRef, cafeId);
//         const snap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
//         if ( !snap.exists() ) return;
//         const promotions: Record<string, PromotionRecord> = snap.data();
//         return promotions;
//     } catch(err) {
//         console.log(err)
//     }
// }