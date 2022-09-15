import React from 'react';
import { Text, View, StyleSheet, RefreshControl, Image, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { RootContext } from '../contexts/GlobalContext';
import { useIsFocused } from '@react-navigation/native';
import DeliveyService from '../../services/DeliveryService';
function DeliveryHistory(props) {
    const [refreshing, setRefreshing] = React.useState(false);

    const { getCurrentUser, setHeaderString } = React.useContext(RootContext)
    const isFocused = useIsFocused()
    const [previousDeliveries, setDeliveryList] = React.useState([])
    function loadData() {
        setRefreshing(true)
        DeliveyService.getDeliveredOrders(getCurrentUser().id)
            .then(data => {

                setDeliveryList(data);
            }).then(() => {
                setRefreshing(false)
            })
    }
    React.useEffect(() => {
        if (isFocused) {
            setHeaderString("Delivery history")
            loadData()
        }
    }, [isFocused])
    return (
        <View style={{
            flex: 1,
        }}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}

            >
                {!previousDeliveries.length && <View style={{
                    padding: 10
                }}>
                    <Text style={{
                        fontSize: 20
                    }}>No previous deliveries</Text>
                </View>}
                {previousDeliveries.length > 0 && <View>
                    {previousDeliveries.map((item, index) => <TouchableOpacity key={index} onPress={() => {
                        props.stackNav.navigate('delivery_details', item.id)
                    }} style={{
                        padding: 10,
                        backgroundColor: 'white',
                        margin: 10,
                        borderRadius: 10
                    }}>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignContent: "center",
                            alignItems: "flex-end",
                            padding: 5
                        }}>
                            <View>
                                <Text>Pickup from:{item.pickupLocationGeocode}</Text>
                                <Text>Deliver to:{item.dropLocationGeocode}</Text>
                                <Text>Total items:{item.itemsCount}</Text>
                                <Text>
                                    {(new Date(item.time * 1)).toLocaleString()}
                                </Text>
                                <Text style={{
                                    fontWeight: "bold",
                                    color: item.status == 6 ? "green" : "red",
                                    fontSize: 15
                                }}>{item.status == 6 ? "Paid" : "Unpaid"}</Text>
                            </View>


                        </View>

                    </TouchableOpacity>)}
                </View>}
            </ScrollView>
        </View>
    );
}

export default DeliveryHistory;