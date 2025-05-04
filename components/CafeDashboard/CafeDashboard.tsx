import { Cafe } from "@/types/User";
import { memo } from "react";
import { View, Text } from "react-native"

interface CafeDashboardProps {
    loading: boolean;
    error: boolean;
    data: Cafe | undefined;
}

const CafeDashboard: React.FC<CafeDashboardProps> = ({loading, error, data}) => {

    if (!loading && error) {
        return (
            <Text>Error loading data</Text>
        )
    }

    if (data) {
        return (
            <View>
                <Text>{JSON.stringify(data)}</Text>
            </View>
        )
    }

    return (
        <Text>Loading...</Text>
    )
}

export default memo(CafeDashboard);