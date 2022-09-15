import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { Entypo } from '@expo/vector-icons';

function RemovableTag({ name, removeTag, unitPrice }) {
    return (
        <View style={tagStyles.container} >
            <View style={{
                display: "flex",
                flexDirection: 'row',

            }}>
                <View>
                    <Text>{name}</Text>
                    <Text>Tk.{unitPrice}</Text>
                </View>

                <Entypo name="circle-with-cross" size={25} onPress={removeTag} />
            </View>
        </View>
    );

}
const tagStyles = StyleSheet.create({
    container: {
        borderColor: "#000000",
        borderRadius: 50,
        borderWidth: 2,
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 2
    }
})
export default RemovableTag;