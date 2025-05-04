import { Geolocations } from "@/types/Geolocations"
import { Ionicons } from "@expo/vector-icons"
import { geocodeAsync, LocationGeocodedLocation } from "expo-location"
import { Dispatch, memo, SetStateAction, useState } from "react"
import { View, Text, TextInput, StyleSheet } from "react-native"

interface LocationAdderProps {
    setGeolocations: Dispatch<SetStateAction<Geolocations>>
}

const LocationAdder: React.FC<LocationAdderProps> = ({setGeolocations}) => {

    const [location, setLocation] = useState<string>('')
    

    const handleAddLocation = async () => {

        try {

            const url: string = `https://geocode.maps.co/search?q=${location}&api_key=6802163ae4690836323760pgi11b9bc`

            // geocode address
            const res = await fetch(url)
            const jsonArr = await res.json();
            if ( jsonArr.length > 0 ) {
                const { lat, lon } = jsonArr[0];
                console.log(lat);
                console.log(lon);
                setGeolocations((prev) => ({
                    ...prev,
                    [location]: { lat: lat, lon: lon }
                }))
            } else {
                alert('Address not found');
            }

        } catch(err) {
            console.log(err);
        }
        setLocation('')
    }

    return (
        <View style={styles.container}>
            <TextInput
                value={location}
                style={styles.input}
                placeholder="Enter address"
                onChangeText={setLocation}
                placeholderTextColor="#888" />
            <View style={styles.iconContainer}>
                <Ionicons name="add" size={32} onPress={handleAddLocation} />
            </View>
        </View>
    )
}

export default memo(LocationAdder);

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: 60,
        backgroundColor: '#FFFCF9',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconContainer: {
        backgroundColor: '#06D6A0',
        height: 60,
        width: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    input: {
        height: 60,
        flex: 1,
        paddingLeft: 15,
        fontSize: 16,
      },
})