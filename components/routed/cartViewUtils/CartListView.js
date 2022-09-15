import React, { useEffect, useState } from 'react';
import { Dimensions, ToastAndroid, Text, View, StyleSheet, ScrollView, TouchableOpacity, Image, Button } from 'react-native';
import CartServices from '../../../services/CartServices'

import LocationService from '../../../services/LocationService';
import ItemDetailsBottomSheet from '../../shared/ItemDetailsBottomSheet'
import { RootContext } from '../../contexts/GlobalContext'
import { useIsFocused } from '@react-navigation/native';
import OrderServices from '../../../services/OrderServices'
import getDistance from 'geolib/es/getDistance';
import SearchLocation from './SearchLocation';

function CartListView(props) {
    const [itemDetailsBottomSheet, popupItemDetailsBottomSheet] = React.useState(false)
    const rootContext = React.useContext(RootContext)

    const [groupedCartList, setCartList] = useState([])
    const [isCurrentLocationInfoLoaded, setCurrentLocationInfoLoadingStatus] = React.useState(false)
    const [isListEmpty, setEmptinessStatus] = useState(false)
    const [selectedcartItem, setSelectedCartItem] = useState(null)
    const isFocused = useIsFocused()
    const [selectedLocationCoords, setSelectedLocationCoords] = React.useState(null)
    const [locationSelectionType, setLocationSelectionType] = React.useState(1)
    const [orderCity, setOrderCity] = React.useState("")
    const [selectedLocationGeocode, setSelectedLocationGeocode] = React.useState("Loading..")
    const [customLocationSelectionBottomSheetVisibility, setCustomLocationSelectionBottomSheetVisibility] = React.useState(false)
    function setDeliveryCharge(coords, cartList) {
        let groupedList = JSON.parse(JSON.stringify(cartList))
        for (let group of groupedList) {

            let distance = parseFloat(Math.floor(getDistance({

                latitude: group.currentLatitude,
                longitude: group.currentLongitude
            }, coords, 1) / 100) / 10)
            group.distance = distance
            group.deliveryCharge = Math.ceil(distance) * 5 + 30
            let totalCharge = Math.ceil(distance) * 5 + 30
            for (let item of group.items) {
                totalCharge += item.amount * item.unitPrice
            }
            group.totalCharge = totalCharge
        }
        setCartList(groupedList)

        return groupedList
    }

    let updateCartList = async function () {
        let data = await CartServices.getcartItems()
        const { cooks, items } = data
        if (!items.length) setEmptinessStatus(true)
        for (let cook of cooks) {
            cook.items = []
            cook.distance = "..."
            cook.deliveryCharge = "..."
            for (let item of items) {
                if (item.vendorId == cook.id) {

                    cook.items.push(item)
                }
            }
        }

        setCartList(cooks)
        return cooks

    }



    async function loadCurrentLocationInfo() {
        setSelectedLocationGeocode("Loading..")
        let coords = await LocationService.getCurrentLocation()
        setCurrentLocationInfoLoadingStatus(false)
        setSelectedLocationCoords({
            latitude: coords.latitude,
            longitude: coords.longitude
        })
        LocationService.getGeoApifyLocationInfo(coords)
            .then(currentLocationGeoCode => {
                setOrderCity(currentLocationGeoCode.city)
                setSelectedLocationGeocode(currentLocationGeoCode.geocode)
                setLocationSelectionType(1)
                setCurrentLocationInfoLoadingStatus(true)
            })
        return coords
    }

    async function loadInformation() {
        let currentCoords = null;
        let cartLIst = null;
        let promises = [
            updateCartList().then(data => { cartLIst = data }),
            loadCurrentLocationInfo().then(coords => {
                currentCoords = coords
            })
        ]
        await Promise.all(promises)
        setDeliveryCharge(currentCoords, cartLIst)
    }


    useEffect(() => {
        if (isFocused) {
            rootContext.setHeaderString("Cart")
            loadInformation()
        }
    }, [isFocused])
    return (
        <View style={{
            flex: 1
        }}>
            <ScrollView >
                <View style={{

                    margin: 5
                }}>
                    {groupedCartList.map((group, index) => <View key={index} style={{
                        marginVertical: 5,
                        backgroundColor: "#C4C4C4",
                        borderRadius: 5,
                        padding: 10
                    }}>

                        <View style={{
                            display: 'flex',
                            flexDirection: "row",
                            alignItems: "center",
                            alignContent: "center",
                            margin: 10,
                            justifyContent: "space-around"
                        }}>
                            <Image style={{
                                height: 70,
                                aspectRatio: 1,
                                borderRadius: 50,
                            }} source={{ uri: group.personalInfo.profileImageURL }} />
                            <View>
                                <Text>From</Text>
                                <Text>{group.name}</Text>
                                <Text>Distance: {group.distance} kms </Text>
                                <Text style={{
                                    fontSize: 15,
                                    fontWeight: "bold"
                                }}>Delivery charge: Tk.{group.deliveryCharge} </Text>
                                <Text style={{
                                    fontSize: 15,
                                    fontWeight: "bold"
                                }}>Total: Tk. {group.totalCharge}</Text>
                            </View>

                        </View>
                        {group.items.map((item, index1) => <TouchableOpacity key={index1} onPress={() => {

                            setSelectedCartItem({
                                itemName: item.itemName.toLowerCase(),
                                vendorId: item.vendorId
                            })

                            popupItemDetailsBottomSheet(true)

                        }}>
                            <View style={[styles.container, styles.alighnHorizontal]}>
                                <Image style={{
                                    height: 50,
                                    aspectRatio: 1,
                                    borderRadius: 50,
                                }} source={{ uri: JSON.parse(item.relatedPost[0]?.images)[0] }} />

                                <Text>{item.itemName}</Text>
                                <Text>Amount:{item.amount}</Text>
                                <Text>Tk.{item.amount * item.unitPrice}</Text>

                            </View>
                        </TouchableOpacity>)}
                    </View >)}
                </View>
            </ScrollView>


            {!isListEmpty && <View style={{
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 5,
                padding: 10,

                margin: 5
            }}>
                <View>
                    <Text style={{ fontSize: 20 }} >Choose delivery location</Text>

                    <View style={{
                        display: "flex"
                    }}>
                        <Text>{locationSelectionType == 1 ? "Current location" : "Selected location"}</Text>
                        <Text>{selectedLocationGeocode} </Text>
                        {locationSelectionType == 1 && <Button title='Choose a custom location' onPress={() => {
                            setCustomLocationSelectionBottomSheetVisibility(true)
                        }} />}

                        {locationSelectionType == 2 && <View style={{
                            margin: 10
                        }}>
                            <Button title='Change' onPress={() => {
                                setCustomLocationSelectionBottomSheetVisibility(true)
                            }} />
                        </View>}
                        {locationSelectionType == 2 && <View style={{
                            margin: 10
                        }}>
                            <Button title='Switch to current location' onPress={() => {
                                loadCurrentLocationInfo()
                                    .then(coords => {
                                        setDeliveryCharge(coords, groupedCartList)
                                    })
                            }} />
                        </View>}
                    </View>
                </View>
            </View>}

            {!isListEmpty && <View style={[styles.footer, {
                backgroundColor: "#FFA500"
            }]}>
                <TouchableOpacity onPress={() => {
                    if (!isCurrentLocationInfoLoaded) return
                    OrderServices.placeOrders(groupedCartList, {
                        ...selectedLocationCoords,
                        dropLocationGeocode: selectedLocationGeocode
                    }, rootContext.getCurrentUser().facebookToken.name, rootContext.getCurrentUser().id, orderCity)
                        .then(() => {
                            CartServices.clearAll()

                                .then(() => {

                                    ToastAndroid.showWithGravity(
                                        "Order placed succesfully!",
                                        ToastAndroid.SHORT,
                                        ToastAndroid.CENTER
                                    );
                                    updateCartList()
                                })
                        })


                }}>
                    <Text style={{
                        fontSize: 15,
                        fontFamily: "sans-serif"
                    }}> CONFIRM ORDER </Text>

                </TouchableOpacity>

            </View>}
            <SearchLocation visibility={customLocationSelectionBottomSheetVisibility} setVisibility={setCustomLocationSelectionBottomSheetVisibility} onSelect={(selectedLocation) => {
                setSelectedLocationGeocode(selectedLocation.name)
                setSelectedLocationCoords(selectedLocation.coords)
                setOrderCity(selectedLocation.city)
                setCustomLocationSelectionBottomSheetVisibility(false)
                setLocationSelectionType(2)
                setDeliveryCharge(selectedLocation.coords, groupedCartList)
            }} />


            <ItemDetailsBottomSheet {...props} onChange={() => {
                updateCartList()
            }} bottomSheetVisibility={itemDetailsBottomSheet} popupBottomSheet={popupItemDetailsBottomSheet} selectedSearchResult={selectedcartItem} setSearchResultItem={setSelectedCartItem} />
            {isListEmpty && <View style={[styles.footer, {
                backgroundColor: "#BDD6F4"
            }]}>
                <Text>NO ITEMS ADDED TO THE CART</Text>
            </View>}
        </View>

    );
}
const styles = StyleSheet.create({

    footer: {

        height: 60,
        justifyContent: "center",
        alignItems: "center"
    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: Dimensions.get('window').height * 0.33,
        borderRadius: 10
    },
    alighnHorizontal: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center"
    },
    container: {
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
        margin: 5,
        padding: 5
    },
    info: {
        flex: 1,
        paddingHorizontal: 5
    },
    updateAmountBtn: {
        backgroundColor: "#FA01FF",
        height: 30,
        aspectRatio: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

    }
})
export default CartListView;