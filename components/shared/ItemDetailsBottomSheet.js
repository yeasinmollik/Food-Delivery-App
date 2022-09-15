import React from 'react';
import { View, Text, Image, Dimensions, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, ToastAndroid } from 'react-native';
import { BottomSheet } from 'react-native-btr';
import CartServices from '../../services/CartServices'
import { FontAwesome5 } from '@expo/vector-icons';
import SearchingServices from '../../services/SearchingServices';
import LocationService from '../../services/LocationService';

function ItemDetailsBottomSheet(props) {
    return (
        <View>
            {props.selectedSearchResult && <BottomSheet visible={props.bottomSheetVisibility}
                onBackButtonPress={() => {
                    props.popupBottomSheet(false)
                    props.setSearchResultItem(null)
                }}
                onBackdropPress={() => {
                    props.popupBottomSheet(false)
                    props.setSearchResultItem(null)
                }}
            >
                <View style={styles.bottomNavigationView}>
                    <SearchDetails {...props} />
                </View>
            </BottomSheet>}
        </View>
    );
}


function SearchDetails(props) {
    const [selectedSearchResult, setSearchResultItem] = React.useState(null)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [itemLocationName, setItemLocationName] = React.useState("Loading...")

    let updateItemLocationName = function (coords) {
        LocationService.getGeoApifyLocationInfo(coords)
            .then(data => {
                setItemLocationName(data.geocode)
            })
    }
    React.useEffect(() => {
        SearchingServices.getDetails(props.selectedSearchResult.vendorId, props.selectedSearchResult.itemName)
            .then((searchResultInfo) => {
                setSearchResultItem(searchResultInfo)
                updateItemLocationName({
                    latitude: searchResultInfo.vendor.currentLatitude,
                    longitude: searchResultInfo.vendor.currentLongitude
                })
                return searchResultInfo
            }).then((searchResultInfo) => {
                CartServices.isAddedToCart(props.selectedSearchResult.vendorId, props.selectedSearchResult.itemName)
                    .then(cartData => {
                        setSearchResultItem({ ...searchResultInfo, amount: null })
                        if (cartData) {
                            setSearchResultItem({ ...searchResultInfo, amount: cartData })
                        }
                    })
                    .then(() => {
                        setIsLoaded(true)
                    })
            })
    }, [])
    const [amount, setAmount] = React.useState(1)
    function updatecartAmount(inc) {
        setAmount(Math.max(1, Math.min(amount + inc, 100)))
    }
    const placeHolderImage = "https://previews.123rf.com/images/takasumi/takasumi1510/takasumi151000226/46196249-%E3%83%87%E3%82%A3%E3%83%8A%E3%83%BC%E7%9A%BF%E3%80%81%E3%83%8A%E3%82%A4%E3%83%95%E3%80%81%E3%82%B9%E3%83%97%E3%83%BC%E3%83%B3%E3%80%81%E3%83%9B%E3%83%AF%E3%82%A4%E3%83%88-%E3%83%90%E3%83%83%E3%82%AF-%E3%82%B0%E3%83%A9%E3%82%A6%E3%83%B3%E3%83%89%E3%81%AB%E3%83%95%E3%82%A9%E3%83%BC%E3%82%AF.jpg"
    return (
        <View style={{
            flex: 1
        }} >
            {isLoaded && <View style={{
                flex: 1
            }} >
                <View style={{
                    flex: 1,
                    padding: 10
                }}>
                    <Text style={{
                        fontSize: 24
                    }}>{selectedSearchResult.lowerCasedName}</Text>
                    <View style={[styles.alighnHorizontal, {

                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "space-between"
                    }]}>
                        <View style={[styles.alighnHorizontal, {

                            alignItems: "center",
                            alignContent: "center"
                        }]}>
                            <Image style={{
                                width: 80,
                                aspectRatio: 1,
                                borderRadius: 50,
                            }} source={{
                                uri: selectedSearchResult.relatedPost.length ? JSON.parse(selectedSearchResult.relatedPost[0].images)[0] : placeHolderImage
                            }} />
                            <View style={{
                                marginLeft: 20
                            }}>

                                <Text>⭐{selectedSearchResult.getRatings}</Text>

                                <Text>💰Tk.{selectedSearchResult.unitPrice}</Text>
                            </View>
                        </View>

                        <View>
                            <Text>By:</Text>
                            <View style={[styles.alighnHorizontal, {

                                alignItems: "center",
                                alignContent: "center",

                            }]}>
                                <Image style={{
                                    height: 40,
                                    aspectRatio: 1,
                                    borderRadius: 40,
                                    marginRight: 10
                                }} source={{ uri: selectedSearchResult.vendor.personalInfo.profileImageURL }} />
                                <Text>{selectedSearchResult.vendor.name}</Text>
                            </View>


                        </View>
                    </View>

                    <Text>Recent posts</Text>
                    <ScrollView>
                        {selectedSearchResult.relatedPost.map((item, index) => {
                            return <RenderPost {...props} item={item} key={index} />
                        })}


                    </ScrollView>
                </View>

                <View style={styles.footer}>
                    <Text style={{
                        fontSize: 12
                    }}>Location: {itemLocationName}</Text>

                    <View style={[styles.alighnHorizontal, {
                        padding: 20,
                        justifyContent: "space-between",
                        width: "100%"
                    }]}>


                        {!selectedSearchResult.amount && <TouchableOpacity style={{
                            paddingVertical: 10,
                            paddingHorizontal: 60,
                            backgroundColor: "#77cf8e",
                            borderRadius: 10,
                            marginHorizontal: 10
                        }} onPress={() => {
                            CartServices.addItem(selectedSearchResult.vendor, { ...selectedSearchResult }, amount)
                                .then(() => {
                                    setSearchResultItem({
                                        ...selectedSearchResult, amount: amount
                                    })
                                    props.setSearchResultItem({
                                        ...selectedSearchResult, amount: amount
                                    })
                                    return
                                })
                                .then(() => {
                                    if (props.onChange) props.onChange()
                                    // add toastAndroid
                                })

                        }} >
                            <Text>Add to cart</Text>
                        </TouchableOpacity>}

                        {!selectedSearchResult.amount && <View style={[styles.alighnHorizontal, {
                            marginHorizontal: 5,
                            justifyContent: "space-between"
                        }]}>
                            <TouchableOpacity onPress={() => {
                                updatecartAmount(1)

                            }} >
                                <View style={styles.updateAmountBtn}>
                                    <Text style={{
                                        fontSize: 20
                                    }}>+</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={[styles.updateAmountBtn, {
                                backgroundColor: "#C4C4C4"
                            }]}>
                                <Text style={{
                                    fontSize: 20
                                }}>{amount}</Text>
                            </View>
                            <TouchableOpacity onPress={() => {
                                updatecartAmount(-1)


                            }}>
                                <View style={styles.updateAmountBtn}>
                                    <Text style={{
                                        fontSize: 20
                                    }}>-</Text>
                                </View>
                            </TouchableOpacity>
                        </View>}

                        {selectedSearchResult.amount && <View style={[styles.alighnHorizontal, {
                            justifyContent: "space-between",
                            width: "100%"
                        }]}>
                            <View>
                                <Text>Amount:{selectedSearchResult.amount}</Text>
                                <Text>Tk.{selectedSearchResult.amount * selectedSearchResult.unitPrice}</Text>
                            </View>

                            <FontAwesome5 onPress={() => {
                                CartServices.delete(selectedSearchResult.vendor.id, selectedSearchResult.lowerCasedName)
                                    .then(() => {
                                        setSearchResultItem({
                                            ...selectedSearchResult, amount: null
                                        })
                                        props.setSearchResultItem({
                                            ...selectedSearchResult, amount: null
                                        })
                                        return
                                    })
                                    .then(() => {
                                        if (props.onChange) props.onChange()

                                        // add toastAndroid
                                    })
                            }} name="trash" size={24} color="black" />


                        </View>}

                    </View>

                </View>

            </View>}
        </View>
    )
}

function RenderPost(props) {
    return (<View style={[styles.horizontalAlign, {
        margin: 2,
        padding: 10,
        backgroundColor: "#F6EFE1",
        borderRadius: 10,
    }]}>
        <Image style={{
            height: 140,
            aspectRatio: 1,
        }} source={{
            uri: JSON.parse(props.item.images)[0]
        }} />
        <View style={[styles.horizontalAlign]}>
            <View>
                <Image style={{
                    height: 60,
                    aspectRatio: 1,
                    margin: 5
                }} source={{
                    uri: JSON.parse(props.item.images)[1]
                }} />
                <Image style={{
                    height: 60,
                    aspectRatio: 1,
                    margin: 5
                }} source={{
                    uri: JSON.parse(props.item.images)[2]
                }} />
            </View>
            <View>
                <Text style={{
                    fontSize: 12
                }}>{(new Date(props.item.postedOn)).toLocaleTimeString()},{(new Date(props.item.postedOn)).toLocaleDateString()}</Text>
                <TouchableOpacity onPress={() => {
                    props.popupBottomSheet(false)
                    props.stackNav.push('Post details', {
                        postId: props.item.id,

                    })
                }} style={{
                    backgroundColor: "#E1E8F6",
                    padding: 5
                }}>
                    <Text>View Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>)
}

const styles = StyleSheet.create({
    horizontalAlign: {
        display: 'flex',
        flexDirection: 'row',

    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: Dimensions.get('window').height * 0.75,
        borderRadius: 10,


    },
    footer: {

        minHeight: 60,
        justifyContent: "center",
        alignItems: "center"
    },
    updateAmountBtn: {
        backgroundColor: "#FA01FF",
        height: 40,
        aspectRatio: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

    },
    alighnHorizontal: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 10,

        alignContent: "center",
        alignItems: "center"
    }
})

export default ItemDetailsBottomSheet;