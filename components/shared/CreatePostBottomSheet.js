import React from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Image, Button, TouchableOpacity, Dimensions, ToastAndroid, Modal } from 'react-native';
import { BottomSheet } from 'react-native-btr';
import { Entypo } from '@expo/vector-icons';
import CreatePost from '../menus/CreatePost';

function CreatePostBottomSheet(props) {
    return (
        <BottomSheet visible={props.bottomSheetVisibility}
            onBackButtonPress={() => {
                props.popupBottomSheet(false)
            }}
            onBackdropPress={() => {
                props.popupBottomSheet(false)
            }}
        >
            <View style={{
                maxHeight: Dimensions.get('window').height * .75,

            }}>
                <View style={[styles.bottomNavigationView, { height: "100%" }]}>
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center"
                    }}>
                        <Entypo onPress={() => {
                            props.popupBottomSheet(false)
                        }} name="circle-with-cross" size={30} color="black" />
                        <Text style={{
                            fontSize: 20
                        }}>Create post</Text>
                    </View>
                    <CreatePost onComplete={props.onComplete} popupBottomSheet={props.popupBottomSheet} />
                </View>
            </View>
        </BottomSheet>
    );
}
const styles = StyleSheet.create({
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',

        borderRadius: 10,
        padding: 10,

    },
})

export default CreatePostBottomSheet;