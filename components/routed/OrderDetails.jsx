import React from 'react';
import { View, Text, Image, Button, ToastAndroid } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import LocationView from '../shared/LocationView';
import OrderListItem from './OrderListItem/OrderListItem';
import { RootContext } from '../contexts/GlobalContext';
import { useIsFocused } from '@react-navigation/native';
import OrderServices from '../../services/OrderServices';

function OrderDetails(props) {
    const [mapVisibility, setMapVisibility] = React.useState(false)
    let { updateContext, contextObject, setHeaderString } = React.useContext(RootContext)
    let orderId = props.route.params
    const [orderDetails, setOrderDetails] = React.useState({})
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [isOrderAccepted, setOrderAcceptance] = React.useState(false)
    const [isOrderRejected, setOrderRejectance] = React.useState(false)
    const [isAccepted, setAcceptance] = React.useState([])
    const isFocused = useIsFocused()
    const [buyerInfo, setBuyerInfo] = React.useState({
        id: 0,
        facebookToken: {
            name: "",
            profileImageURL: "aa"
        }
    })
    function translateStatus(status) {
        switch (status) {
            case 0:
                return 'Pending'
            case -1:
                return "Pending rider"
            case -2:
                return "Searching for rider"
            case 2:
                return "Rejected"
            case 3:
                return "Pending pickup"
            case 4:
                return "Awaiting delivery"
            default:
                return "Delivered"
        }
    }
    const [productList, setProductList] = React.useState([])
    const [orderStatus, setOrderStatus] = React.useState(0)
    const [orderCharges, setOrderCharges] = React.useState({
        totalCharge: 0,
        deliveryCharge: 0
    })
    function rejectAProduct(index) {
        let temp = [...isAccepted]
        temp[index] = 0
        setAcceptance(temp)
    }
    function acceptAProduct(index) {
        let temp = [...isAccepted]
        temp[index] = 1
        setAcceptance(temp)
    }
    React.useEffect(() => {

        (async () => {
            if (isFocused) {
                setHeaderString("Order info")
                OrderServices.getReceivedOrderInfo(orderId)
                    .then(orderInfoData => {
                        setOrderStatus(orderInfoData.status)
                        setOrderCharges({
                            totalCharge: orderInfoData.totalCharge,
                            deliveryCharge: orderInfoData.deliveryCharge
                        })
                        let productList = []
                        if (orderInfoData.status == 2) {
                            setOrderRejectance(true)
                        }
                        else if (orderInfoData.status == 1) {
                            setOrderAcceptance(true)
                        }
                        setBuyerInfo({
                            id: orderInfoData.buyer.id,
                            facebookToken: JSON.parse(orderInfoData.buyer.facebookToken)
                        })
                        let statuses = []
                        for (let item of orderInfoData.orderedItems) {
                            let data = {
                                amount: item.amount,
                                product: {
                                    lowerCasedName: item.lowerCasedName,
                                    image: JSON.parse(item.lastPost.images)[0]
                                },
                                status: item.status
                            }
                            productList.push(data)
                            statuses.push(item.status)

                        }
                        setAcceptance(statuses)
                        setProductList(productList)
                        setOrderDetails(orderInfoData)
                    })
                    .then(() => {
                        setIsLoaded(true)
                    })
            }

        })()
    }, [isFocused])
    function rejectSome() {
        let rejectedItems = []
        let acceptedItems = []
        for (let n = 0; n < productList.length; n++) {
            if (!isAccepted[n]) rejectedItems.push({
                itemName: productList[n].product.itemName,
                postid: productList[n].product.id
            })
            else acceptedItems.push({
                itemName: productList[n].product.itemName,
                postid: productList[n].product.id
            })
        }

        if (!acceptedItems.length) {
            OrderServices.rejectOrder(orderDetails.id, rejectedItems, contextObject.currentUser.facebookToken.name, buyerInfo.id)
                .then(() => {
                    ToastAndroid.showWithGravity(
                        "Order has been rejected!",
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                    )
                    props.navigation.navigate('HomeView')
                })
        }
        else {
            OrderServices.acceptOrders(orderDetails.id, rejectedItems, contextObject.currentUser.facebookToken.name, buyerInfo.id)
                .then(() => {
                    ToastAndroid.showWithGravity(
                        "Order is now moved to pending list",
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                    )
                    props.navigation.navigate('HomeView')
                })
        }

    }
    return (
        <View style={{
            flex: 1,

        }}>
            <ScrollView style={{

            }}>
                {!isLoaded && <Text>Loading...</Text>}
                {isLoaded && <View style={{
                    flex: 1,
                    padding: 5,
                    margin: 10,
                    borderRadius: 5,

                }}>

                    <Text style={{
                        fontSize: 18
                    }}>Ordered by</Text>
                    <View style={{
                        marginVertical: 5,
                        display: "flex",
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "space-around",
                        flexWrap: "wrap"
                    }}>
                        <Image style={{
                            height: 120,
                            aspectRatio: 1,
                            borderRadius: 90
                        }} source={{
                            uri: buyerInfo.facebookToken.profileImageURL
                        }} />
                        <View style={{
                            position: "relative"
                        }}>
                            <Text style={{
                                fontSize: 20,
                                flexWrap: "wrap"
                            }}>{buyerInfo.facebookToken.name}</Text>
                            <Text>
                                {orderDetails.dropLocationGeocode}
                            </Text>



                            <Text>{(new Date(orderDetails.time)).toLocaleTimeString()},{(new Date(orderDetails.time)).toDateString()}</Text>
                            <Text>{orderDetails.buyer.phone} </Text>
                        </View>
                    </View>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around"
                    }}>
                        <View style={{


                            marginVertical: 10,
                            alignItems: 'center',
                        }}>
                            <TouchableOpacity onPress={() => {
                                setMapVisibility(true)
                            }} style={{
                                backgroundColor: "#e1bee0",
                                padding: 10,
                                borderRadius: 5
                            }}>
                                <Text>View user location</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{


                            marginVertical: 10,
                            alignItems: 'center',
                        }}>
                            <TouchableOpacity onPress={() => {

                            }} style={{
                                backgroundColor: "#89E4EF",
                                padding: 10,
                                borderRadius: 5
                            }}>
                                <Text>View user profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={{
                        fontSize: 18
                    }}>Ordered items</Text>

                    <View style={{
                        padding: 10
                    }}>
                        {productList.map((order, index) => {
                            return <View key={index} style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignContent: "center",
                                justifyContent: "space-around",
                                borderWidth: 1,
                                borderColor: "black",
                                padding: 10,
                                borderRadius: 10,
                                backgroundColor: "#E9F6F7"
                            }} >
                                <OrderListItem navigation={props.navigation} order={order} />
                                {!(isOrderAccepted || isOrderRejected) && <View>

                                    {isAccepted[index] == 1 && <TouchableOpacity onPress={() => {
                                        rejectAProduct(index)
                                    }} style={{
                                        backgroundColor: "#FFBAB7",
                                        padding: 10,
                                        borderRadius: 10
                                    }}>
                                        <Text>Reject</Text>
                                    </TouchableOpacity>}
                                    {isAccepted[index] == 0 && <TouchableOpacity onPress={() => {
                                        acceptAProduct(index)
                                    }} style={{
                                        backgroundColor: "#11b015",
                                        padding: 10,
                                        borderRadius: 10
                                    }}>
                                        <Text>Accept</Text>
                                    </TouchableOpacity>}
                                </View>}

                                {isOrderAccepted && <TouchableOpacity style={{
                                    backgroundColor: "#c4c4c4",
                                    padding: 10,
                                    borderRadius: 10
                                }}>
                                    <Text>{isAccepted[index] == 0 ? "Rejected" : "Accepted"}</Text>
                                </TouchableOpacity>}
                                {isOrderRejected && <TouchableOpacity style={{
                                    backgroundColor: "#c4c4c4",
                                    padding: 10,
                                    borderRadius: 10,

                                }}>
                                    <Text>Rejected</Text>
                                </TouchableOpacity>}
                            </View>
                        })}
                    </View>
                    <LocationView mapVisibility={mapVisibility} setMapVisibility={setMapVisibility} target={{
                        latitude: orderDetails.drop_lat,
                        longitude: orderDetails.drop_long
                    }} tagnameLabel={`${buyerInfo.facebookToken.name}`} />

                </View>}

            </ScrollView>
            <View style={{
                padding: 10,
                margin: 5,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "black"
            }}>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <Text>Total Charge:</Text>
                    <Text>Tk.{orderCharges.totalCharge}</Text>
                </View>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <Text>Delivery Charge:</Text>
                    <Text>Tk.{orderCharges.deliveryCharge}</Text>
                </View>
            </View>

            {orderStatus == 0 && <View>
                {(!isOrderAccepted && !isOrderRejected) && <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10
                }}>
                    <TouchableOpacity style={[styles.footer, {
                        backgroundColor: "#AFFFD0"
                    }]} onPress={() => {
                        rejectSome()

                    }}>
                        <Text style={{
                            fontSize: 15
                        }}>ACCEPT</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.footer, {
                        backgroundColor: "#FFBAB7"
                    }]} onPress={() => {
                        setAcceptance(new Array(isAccepted.length).fill(0))
                        rejectSome()

                    }}>
                        <Text style={{
                            fontSize: 15
                        }}>REJECT ALL</Text>

                    </TouchableOpacity>
                </View>}
            </View>}

            {orderStatus != 0 && <View style={[styles.footer, {
                backgroundColor: "#BDD6F4"
            }]}>
                <Text>{translateStatus(orderStatus).toUpperCase()} </Text>
            </View>}

            {(isOrderAccepted || isOrderRejected) && <View style={[styles.footer, {
                backgroundColor: "#c4c4c4"
            }]}>
                <Text>{isOrderAccepted ? "Order has been accepted" : "Order has been rejected"}</Text>
            </View>}

        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        paddingHorizontal: 40,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,

    },

})

export default OrderDetails;