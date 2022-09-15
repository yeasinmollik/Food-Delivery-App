import React from 'react';
import CreatePostBottomSheet from '../shared/CreatePostBottomSheet'
import MarkAvailableItemsBottomSheet from '../shared/MarkAvailableItemsBottomSheet'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
function CreateItem(props) {
    const [createPostBottomSheetVisibility, popupCreatePostBottomSheet] = React.useState(false)
    const [showAvailableItemsBottomSheet, toggleAvailableItemsBottomSheet] = React.useState(false)

    return (
        <View style={{
            padding: 10
        }}>
            <CreatePostBottomSheet {...props} bottomSheetVisibility={createPostBottomSheetVisibility} popupBottomSheet={popupCreatePostBottomSheet} />
            <MarkAvailableItemsBottomSheet  {...props} bottomSheetVisibility={showAvailableItemsBottomSheet} popupBottomSheet={toggleAvailableItemsBottomSheet} />

            <Text style={{
                fontSize: 24,
                fontFamily: "sans-serif-light"
            }}>Express your inner chef to the people near you!</Text>

            <TouchableOpacity onPress={() => {
                popupCreatePostBottomSheet(true)
            }} style={styles.btn}>
                <AntDesign style={{
                    margin: 10
                }} name="camera" size={24} color="black" />
                <Text style={{
                    fontSize: 15
                }}>Create a post</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                toggleAvailableItemsBottomSheet(true)
            }} style={styles.btn}>
                <FontAwesome style={{
                    margin: 10
                }} name="list-ol" size={24} color="black" />
                <Text style={{
                    fontSize: 15
                }}>List your available items of today!</Text>

            </TouchableOpacity>
        </View>
    );
}
let styles = StyleSheet.create({
    btn: {
        backgroundColor: "#E8F99E",
        margin: 5,
        padding: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        borderRadius: 10,

    }
})
export default CreateItem;