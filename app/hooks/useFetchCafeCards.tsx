import { getUid } from "@/utils/FirebaseAuthentication";
import { fetchCards } from "@/utils/FirebaseController";
import { useEffect, useState } from "react";

const useFetchCafeCards = () => {
    
    const [cards, setCards] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false)
    
    const getCards = async () => {

        setIsLoading(true);

        try {

            const id: string | null = await getUid();
            if ( id === null ) {
                setError(true);
                return;
            }

            const cards = await fetchCards(id);
            if ( !cards ) {
                setError(true);
                return;
            }

            setCards(cards);
            setIsLoading(false)
        } catch (err) {
            console.log(err);
            setError(true)
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        getCards();
    }, [])

    return [cards, isLoading, error]
}

export default useFetchCafeCards;