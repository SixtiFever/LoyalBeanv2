import * as Font from 'expo-font'

export default async function loadFont(fontName: string, path: string) {
    await Font.loadAsync({
        [fontName]: require(path)
    })
}