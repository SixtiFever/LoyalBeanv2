import { Cafe, Customer } from "@/types/User";
import { getUid } from "@/utils/FirebaseAuthentication";
import { fetchData } from "@/utils/FirebaseController";
import { useEffect, useState } from "react";

const useFetchCafeData = () => {
    const [data, setData] = useState<Cafe>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const getCafeData = async () => {

        setIsLoading(true);

        try {

            // get cafe id
            const id: string | null = await getUid();
            if ( typeof id !== 'string' ) {
                setError(true);
                return;
            }

            // fetch cafe data from firestore
            const data: Cafe | Customer | boolean = await fetchData(id, 'cafes');
            if (data === false) {
                setError(true);
                return;
            }

            setData(data as Cafe);
            setIsLoading(false)

        } catch(err) {
            console.log(err);
            setError(true);
        }
        finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        getCafeData();
    }, [])

    return [data, isLoading, error];
};

export default useFetchCafeData;