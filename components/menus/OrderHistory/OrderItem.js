import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import Global from '../../../services/Globals';
import RatingServices from '../../../services/RatingServices';
import { RootContext } from '../../contexts/GlobalContext';

function OrderItem({ orderItem, popupBottomSheet, setCurrentProduct, orderGroupIndex, orderItemIndex }) {

    return (
        <TouchableOpacity style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "#eddbdb",
            padding: 10,
            margin: 5,
            borderRadius: 5,
            alignItems: "center",
            alignContent: "center"
        }} onPress={() => {
            setCurrentProduct({
                product: orderItem,
                rating: orderItem.rating,
                orderGroupIndex: orderGroupIndex,
                orderItemIndex: orderItemIndex
            })
            popupBottomSheet(true)
        }}>
            <View>
                <Text>{orderItem.lowerCasedName}</Text>
                <Text>{orderItem.amount} Unit(s)</Text>
                <View style={{
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <Text>Your rating:{orderItem.rating}</Text>
                    <View style={{
                        display: "flex",
                        flexDirection: "row"
                    }}>
                        {[0, 1, 2, 3, 4].map((item, index) => {
                            return <Text key={index}>{item + 1 <= orderItem.rating ? "⭐" : ""}</Text>
                        })}
                    </View>
                </View>

            </View>
            <Image style={{
                height: 50,
                aspectRatio: 1,
                borderRadius: 50
            }} source={{
                uri: JSON.parse(orderItem.lastPost.images)[0]
            }} />
        </TouchableOpacity>
    );
}

export default OrderItem;