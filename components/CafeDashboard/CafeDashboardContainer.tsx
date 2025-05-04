import { memo, useEffect, useState } from "react"
import { Text } from 'react-native'
import CafeDashboard from "./CafeDashboard"
import { Cafe } from "@/types/User";
import { fetchData, fetchId } from "@/utils/FirestoreController";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { isLoaded } from "expo-font";

interface CafeDashboardContainerProps {

}

const CafeDashboardContainer: React.FC = () => {

    // states
    const [data, setData] = useState<Cafe>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [email, setEmail] = useState<string>();

    const [cid, setCid] = useState<string>() // holds cafe id

    useEffect(() => {

        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            if ( user?.email ) {
                setEmail(user?.email)
            } else {
                console.log('No authenticated user')
            }
        })

        return () => unsubscribe();

    }, [])

    useEffect(() => {

        if (email) getData(email);

    }, [email])

    const getData = async (email: string) => {

        setLoading(true);

        if ( !email ) return;  // check auth email

        const cid: string | boolean = await fetchId(email, 'cafeids');

        if (typeof cid === 'boolean') {
            setError(true);
            setLoading(false);
            return;
        }  // validate id has been obtained

        const data = await fetchData(cid, 'cafes');
        setData(data as Cafe);

        setLoading(false)

    }

    return (
        <CafeDashboard loading={loading} error={error} data={data} />
    )
}

export default memo(CafeDashboardContainer);