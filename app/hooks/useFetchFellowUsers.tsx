/**
 * 
 * hook that fetches other users with the same loyalty card
 * 
*/

import { firestore } from "@/firebaseconfig";
import { Card } from "@/types/Card";
import { collection, doc, DocumentSnapshot, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";


const useFetchFellowUsers = (cafeId: string) => {
    const [users, setUsers] = useState<Record<string, Card>>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const fetchCards = async () => {
        setIsLoading(true);
        try {
            const colRef = collection(firestore, 'cards');
            const docRef = doc(colRef, cafeId);
            const snap: DocumentSnapshot<Record<string, Card>> = await getDoc(docRef);
            if (!snap.exists()) {
                setError(true);
                return;
            }
            const cards: Record<string, Card> = snap.data();
            setUsers(cards);
            return cards;
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
        
    }

    useEffect(() => {
        fetchCards();
    }, [cafeId])

    return [users, isLoading, error ];
}

export default useFetchFellowUsers;