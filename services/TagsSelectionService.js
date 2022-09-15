
import AsyncStorage from '@react-native-async-storage/async-storage';

const TagsSelectionService = {
    setTagList: (tagList) => AsyncStorage.setItem('tagList', JSON.stringify(tagList)),
    getTagList: async () => {
        let item = await AsyncStorage.getItem('tagList')
        if (item) return JSON.parse(item)
        else return []
    },
    clearAll: async () => {
        await AsyncStorage.removeItem('tagList')
    }
}
export default TagsSelectionService