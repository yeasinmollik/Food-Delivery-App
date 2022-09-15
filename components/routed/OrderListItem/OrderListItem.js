import React from 'react';
import { View, Image, Text, TouchableOpacity, Button } from 'react-native';


function OrderListItem(props) {
    React.useEffect(() => { }, [props.order])
    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignContent: "center",
            
        }}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                
                borderRadius: 10,
                width: "80%",
                justifyContent: "space-around",

            }}>
                <Image style={{
                    width: 80,
                    aspectRatio: 1,
                    borderRadius: 50
                }} source={{
                    uri: props.order.product.image
                }} />
                <View>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold"
                    }}>{props.order.product.lowerCasedName}</Text>
                    <Text>Amount: {props.order.amount}{props.order.product.unitType} </Text>
                </View>
            </View>

        </View>
    );
}

export default OrderListItem;