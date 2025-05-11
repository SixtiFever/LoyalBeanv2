import { firestore } from "@/firebaseconfig";
import { PromotionRecord } from "@/types/Promotion";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, DocumentData, DocumentSnapshot, getDoc } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";

const useFetchPromotions = () => {
    const [user, setUser] = useState<User>();
    const [promotions, setPromotions] = useState<Record<string, PromotionRecord>>({});
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useLayoutEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
            if (user) setUser(user);
        })

        return () => unsubscribe();
    }, [])

    const fetchPromotions = async () => {
        // if don't have user id
        if (!user) {
            setError(true);
            return;
        }
        setIsLoading(true);
        try {

            const colRef = collection(firestore, 'promotions');
            const docRef = doc(colRef, user.uid);
            const snap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
            if (!snap.exists()) {
                setError(true);
                return;
            }

            const fetchedPromotions: Record<string, PromotionRecord> = snap.data();
            if (fetchedPromotions) {
                setPromotions(fetchedPromotions);
            }

        } catch (err) {
            console.log(err);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {

        fetchPromotions();

    }, [user])

    return [promotions, isLoading, error];
}

export default useFetchPromotions;