import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import NotificationService from '../../../services/NotificationServices';
import OrderServices from '../../../services/OrderServices';
import { RootContext } from '../../contexts/GlobalContext';

function NotificationItem({ notificationItem, navigator }) {
    let { updateContext, contextObject, setHeaderString } = React.useContext(RootContext)
    return (
        <View style={{
            padding: 10,
            marginVertical: 5,
            backgroundColor: notificationItem.isSeen ? "#c4c4c4" : "#79ACD0",
            borderRadius: 5
        }}>
            <TouchableOpacity onPress={() => {
                NotificationService.updateSeenStatus(notificationItem.id)
                    .then(() => {
                        if (notificationItem.relatedSchemaId) {
                            switch (notificationItem.type) {
                                case 1:
                                    setHeaderString("Order info")
                                    navigator.push('order_details', notificationItem.relatedSchemaId)
                                    break;
                                case 4:
                                    setHeaderString("Delivery info")
                                    navigator.push('delivery_details', notificationItem.relatedSchemaId)
                                    break;
                                case 8:
                                    setHeaderString("Your post")
                                    navigator.push('Post details', {
                                        postId: notificationItem.relatedSchemaId,
                                    })
                                    break;
                                case 9:
                                    navigator.push('profile', {
                                        id: notificationItem.relatedSchemaId
                                    })
                                    break;
                            }

                        }
                    })
            }}>
                <Text style={{
                    fontSize: 15,
                    color: 'white'
                }}>{notificationItem.message} </Text>
                <Text style={{
                    textAlign: "right"
                }}>{(new Date(notificationItem.time)).toLocaleString()}</Text>
            </TouchableOpacity>

        </View>
    );
}

export default NotificationItem;