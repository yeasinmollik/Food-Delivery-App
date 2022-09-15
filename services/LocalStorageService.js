import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LocalStorageService {
    static async store(label, data) {

        AsyncStorage.setItem(label, JSON.stringify(data))
    }
    static async get(label) {
        let item = await AsyncStorage.getItem(label)

        if (item) return JSON.parse(item)
        else return null
    }
    static async clearAll() {
        await AsyncStorage.clear()
    }
    static async removeItem(label) {
        await AsyncStorage.removeItem(label)
    }
}