import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import Collapsible from 'react-native-collapsible';
import OrderItem from './OrderItem';

function Ordergroup({ orderInfo, navigator, orderGroupIndex, popupBottomSheet, setCurrentProduct }) {
    const [collapsibleVisibility, setCollapsibleVisibility] = React.useState(true)
    return (
        <View style={{
            backgroundColor: "white",
            margin: 5,
            padding: 10,
            borderRadius: 5,
        }}>

            <TouchableOpacity onPress={() => {
                setCollapsibleVisibility(!collapsibleVisibility)
            }} style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: 'center',
                backgroundColor: "#d5dbec",
                padding: 10,
                borderRadius: 10

            }}>
                <View>
                    <Text>From {orderInfo.seller.personalInfo.name} </Text>
                    <Text >{(new Date(orderInfo.time).toLocaleTimeString())}, {(new Date(orderInfo.time).toLocaleDateString())}</Text>

                </View>
                <View>
                    <Image style={{
                        height: 50,
                        aspectRatio: 1,
                        borderRadius: 50
                    }} source={{ uri: orderInfo.seller.personalInfo.profileImageURL }} />
                </View>
            </TouchableOpacity>
            <Collapsible collapsed={collapsibleVisibility} align="center">
                <View style={styles.content}>
                    {orderInfo.orderedItems.map((orderItem, index) => {
                        return <OrderItem orderGroupIndex={orderGroupIndex} orderItemIndex={index} setCurrentProduct={setCurrentProduct} key={index} popupBottomSheet={popupBottomSheet} orderItem={orderItem} navigator={navigator} />
                    })}
                </View>

            </Collapsible>
        </View>
    );
}
const styles = StyleSheet.create({
    header: {

        padding: 10,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        padding: 5,
        backgroundColor: '#fff',
        borderRadius: 5,

        marginHorizontal: 5,
    }
})
export default Ordergroup;