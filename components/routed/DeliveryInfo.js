import React from 'react';
import { View, Button, Modal, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ToastAndroid } from 'react-native';
import LocationView from '../shared/LocationView';
import Collapsible from 'react-native-collapsible';
import { RootContext } from '../contexts/GlobalContext';
import OrderServices from '../../services/OrderServices';
import DeliveyService from '../../services/DeliveryService'
import { useIsFocused } from '@react-navigation/native';
import call from 'react-native-phone-call'
function DeliveryInfo(props) {
    const { setHeaderString } = React.useContext(RootContext)
    const [isPickedUp, setPickupStatus] = React.useState(false)
    const [deliveryDetails, setDeliveryDetails] = React.useState({})
    const [isLoaded, setLoadedStatus] = React.useState(false)
    const [isDelivered, setDeliveredStatus] = React.useState(false)
    const isFocused = useIsFocused()

    React.useEffect(() => {
        if (isFocused) {
            setHeaderString("Delivery Info")
            OrderServices.getOrderInfo(props.route.params)
                .then(data => {
                    setDeliveryDetails(data)
                    if (data.status === 4) {
                        setPickupStatus(true)
                        setDeliveredStatus(1 == 0)
                    }
                    if (data.status >= 5) {
                        setPickupStatus(true)
                        setDeliveredStatus(1 == 1)
                    }
                }).then(() => {
                    setLoadedStatus(1 == 1)
                })
        }

    }, [isFocused])

    const [pickupLocationMapVisibility, setPickupLocationMapVisibility] = React.useState(false)
    const [modalVisible, setModalVisible] = React.useState(false)
    const [dropLocationMapVisibility, setDropLocationMapVisibility] = React.useState(false)
    const [collapsibleVisibility, setCollapsibleVisibility] = React.useState(1 == 0)
    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={1 == 1}
                visible={modalVisible}
                onRequestClose={() => {

                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Please wait...</Text>

                    </View>
                </View>
            </Modal>
            <ScrollView>
                <TouchableOpacity style={{
                    borderRadius: 20,
                    borderColor: '#a783d6',
                    borderWidth: 5,
                    margin: 5
                }} onPress={() => {
                    setCollapsibleVisibility(!collapsibleVisibility)
                }}>
                    <View style={[styles.header]}>
                        <Text style={styles.headerText}>Order Pickup info</Text>
                    </View>
                </TouchableOpacity>
                {isLoaded && <Collapsible collapsed={collapsibleVisibility} align="center">
                    <View style={styles.content}>
                        <Text style={{
                            fontSize: 20
                        }}>Pickup info</Text>
                        <View style={{
                            display: 'flex',
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 10,
                            alignItems: "center",
                            alignContent: "center",
                        }}>
                            <Image style={{
                                width: 90,
                                borderRadius: 50,
                                aspectRatio: 1
                            }} source={{
                                uri: deliveryDetails.seller.personalInfo.profileImageURL
                            }} />
                            <View>
                                <Text style={{
                                    fontSize: 15
                                }}>Vendor name:{deliveryDetails.seller.personalInfo.name}</Text>
                                <Text style={{
                                    fontSize: 15
                                }}>Phone:{deliveryDetails.seller.phone}</Text>
                                <Button title="call" onPress={() => {

                                    call({
                                        number: deliveryDetails.seller.phone,
                                        prompt: true,
                                        skipCanOpen: true
                                    }).catch(console.error)

                                }} />
                            </View>
                        </View>
                        <View>
                            <Text>Location:</Text>
                            <Text style={{
                                fontSize: 15
                            }}>{deliveryDetails.pickupLocationGeocode}</Text>
                        </View>
                        <TouchableOpacity style={{
                            margin: 10,
                            padding: 10,
                            backgroundColor: '#c4c4c4',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 5
                        }} onPress={() => {
                            setPickupLocationMapVisibility(true)
                        }}>
                            <Text>View Location 🚩</Text>
                        </TouchableOpacity>

                    </View>

                </Collapsible>}

                <TouchableOpacity style={{
                    borderRadius: 20,
                    borderColor: '#a783d6',
                    borderWidth: 5,
                    margin: 5
                }} onPress={() => {
                    setCollapsibleVisibility(!collapsibleVisibility)
                }}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Order Delivery info</Text>
                    </View>
                </TouchableOpacity>
                {isLoaded && <Collapsible collapsed={!collapsibleVisibility} align="center">
                    <View style={styles.content}>
                        <Text style={{
                            fontSize: 20
                        }}>Delivery info</Text>
                        <View style={{
                            display: 'flex',
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 10,
                            alignItems: "center",
                            alignContent: "center",
                        }}>
                            <Image style={{
                                width: 90,
                                borderRadius: 50,
                                aspectRatio: 1
                            }} source={{
                                uri: deliveryDetails.buyer.personalInfo.profileImageURL
                            }} />
                            <View>
                                <Text style={{
                                    fontSize: 15
                                }}>Customer name:{deliveryDetails.buyer.personalInfo.name}</Text>
                                <Text style={{
                                    fontSize: 15
                                }}>Phone:{deliveryDetails.buyer.phone}</Text>
                                <Button title="call" onPress={() => {

                                    call({
                                        number: deliveryDetails.buyer.phone,
                                        prompt: true,
                                        skipCanOpen: true
                                    }).catch(console.error)

                                }} />
                            </View>
                        </View>
                        <View>
                            <Text>Location:</Text>
                            <Text style={{
                                fontSize: 15
                            }}>{deliveryDetails.dropLocationGeocode}</Text>
                        </View>
                        <TouchableOpacity style={{
                            margin: 10,
                            padding: 10,
                            backgroundColor: '#c4c4c4',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 5
                        }} onPress={() => {
                            setDropLocationMapVisibility(true)
                        }}>
                            <Text>View Location 🚩</Text>
                        </TouchableOpacity>

                    </View>
                </Collapsible>}
                {isLoaded && <View>
                    <LocationView mapVisibility={dropLocationMapVisibility} setMapVisibility={setDropLocationMapVisibility} target={{
                        latitude: deliveryDetails.drop_lat,
                        longitude: deliveryDetails.drop_long
                    }} tagnameLabel="Deliver to" onLocationSelect={() => { }} />

                    <LocationView mapVisibility={pickupLocationMapVisibility} setMapVisibility={setPickupLocationMapVisibility} target={{
                        latitude: deliveryDetails.pickupLat,
                        longitude: deliveryDetails.pickupLong
                    }} tagnameLabel="Pick up from" onLocationSelect={() => { }} />
                </View>}
            </ScrollView>

            <View style={{
                padding: 5,
                borderColor: "black",
                borderWidth: 1,
                margin: 5,
                borderRadius: 5
            }}>
                <View style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row"
                }}>
                    <Text style={{
                        fontSize: 17
                    }}>Delivery charge:</Text>
                    <Text style={{
                        fontSize: 17
                    }}>Tk.{deliveryDetails.deliveryCharge}</Text>
                </View>
                <View style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row"
                }}>
                    <Text style={{
                        fontSize: 17
                    }}>Total charge:</Text>
                    <Text style={{
                        fontSize: 17
                    }}>Tk.{deliveryDetails.totalCharge}</Text>
                </View>
            </View>

            <View style={[styles.footer, {
                backgroundColor: ((!isPickedUp) || (!isDelivered)) ? "#FFA500" : "#c4c4c4"
            }]}>


                {(!isPickedUp || !isDelivered) && <TouchableOpacity style={{
                    margin: 10,
                    padding: 10,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 5
                }} onPress={() => {
                    setModalVisible(true)
                    if (!isPickedUp) {
                        DeliveyService.markPickedUp(deliveryDetails.id, deliveryDetails.buyer.id)
                            .then(data => {
                                ToastAndroid.showWithGravity(
                                    "The user has been notified",
                                    ToastAndroid.SHORT,
                                    ToastAndroid.CENTER
                                )
                                setPickupStatus(true)
                                setModalVisible(false)
                            })
                    }
                    else if (!isDelivered) {
                        DeliveyService.markDelivered(deliveryDetails.id, deliveryDetails.buyer.id)
                            .then(() => {
                                ToastAndroid.showWithGravity(
                                    "Order has been delivered!",
                                    ToastAndroid.SHORT,
                                    ToastAndroid.CENTER
                                );
                                setDeliveredStatus(true)
                                setModalVisible(false)
                            })
                    }
                }}>
                    {!isPickedUp && <Text>Mark as picked up</Text>}
                    {isPickedUp && !isDelivered && <Text>Mark as delivered</Text>}
                </TouchableOpacity>}
                {isDelivered && <TouchableOpacity style={{
                    margin: 10,
                    padding: 10,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 5
                }} onPress={() => {

                    ToastAndroid.showWithGravity(
                        "Order has been delivered already",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM
                    );


                }}>
                    <Text>Order has been delivered</Text>
                </TouchableOpacity>}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        paddingTop: 30,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalText: {
        textAlign: "center"
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",

        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    footer: {

        height: 60,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '300',
        marginBottom: 20,
    },
    header: {

        padding: 10,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 2,
        marginHorizontal: 5
    }
})

export default DeliveryInfo;