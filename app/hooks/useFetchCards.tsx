import { Card } from "@/types/Card";
import { getUid } from "@/utils/FirebaseAuthentication";
import { fetchCustomerCards } from "@/utils/FirebaseController";
import { useEffect, useState } from "react";


const useFetchCards = (): Card => {

    const [cards, setCards] = useState<Card[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>()

    const getCards = async () => {

        setIsLoading(true);

        try {

            const id = await getUid();
            if ( !id ) {
                setError(true);
                return;
            }
            const cards = await fetchCustomerCards(id);
            if (!cards) {
                setError(true);
                return;
            }
            setCards(cards ?? [])
        } catch (err) {

            setError(true);
            console.log(err);

        } finally {

            setIsLoading(false);

        }

    }

    useEffect(() => {

        getCards();

    }, [])

    return [cards, false, false];

    }

export default useFetchCards;