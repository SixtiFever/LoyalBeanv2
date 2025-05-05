import { firestore } from "@/firebaseconfig";
import { Card } from "@/types/Card";
import { collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const useFetchCard = (userId: string, cafeId: string) => {
    const [card, setCard] = useState<Card>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchCard = async () => {
            setIsLoading(true);
            try {
                const colRef = collection(firestore, 'cards');
                const docRef = doc(colRef, cafeId);
                const snap = await getDoc(docRef);

                if (!snap.exists()) {
                    setError(true);
                } else {
                    const data = snap.data();
                    const fetchedCard = data[userId] as Card | undefined;

                    if (fetchedCard) {
                        setCard(fetchedCard);
                    } else {
                        setError(true);
                    }
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCard();
    }, [userId, cafeId]);

    return [card, isLoading, error];
};

export default useFetchCard;