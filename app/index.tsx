import Onboarding from "./screens/onboarding";
import { useFonts } from 'expo-font';
import { View, Text } from 'react-native';

export default function Home() {
  const [fontsLoaded] = useFonts({
    'NationalPark': require('../assets/fonts/NationalPark-VariableFont_wght.ttf'),
  });

  if (!fontsLoaded) {
    return null; // or a splash/loading screen
  }

  return <Onboarding />;
}
