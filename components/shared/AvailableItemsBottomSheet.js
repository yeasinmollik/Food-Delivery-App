import React from 'react';
import { SafeAreaView, ScrollView, RefreshControl, Text, View, StyleSheet, LogBox, TouchableOpacity } from 'react-native';
import { BottomSheet } from 'react-native-btr';

function AvailableItemsBottomSheet(props) {
    return (
        <View>
            <BottomSheet visible={props.bottomSheetVisibility}
                onBackButtonPress={() => {
                    props.popupBottomSheet(false)
                }}
                onBackdropPress={() => {

                    props.popupBottomSheet(false)
                }}
            >
                <View>
                    <View style={styles.bottomNavigationView}>

                    </View>
                </View>
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: Dimensions.get('window').height * 0.8,
        borderRadius: 10,
        padding: 10,

    },
})

export default AvailableItemsBottomSheet;