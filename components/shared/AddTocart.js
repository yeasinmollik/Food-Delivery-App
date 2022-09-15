import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import CartServices from '../../services/CartServices'
function AddTocart({ post, togglePopup, addToCart, unitPrice }) {
    const [cartList, setCartList] = useState([])
    useEffect(() => {
        // CartServices.getCartList().then(carts => {
        //     setCartList(carts)
        // })
    }, [])
    const [itemChosen, setItemChosen] = useState(1)
    function updateAmount(type) {
        setItemChosen(Math.min(Math.max(1, itemChosen + type), 100))
    }
    return (
        <View style={{

            flex: 1
        }}>
            <ScrollView>
                <View style={{
                    padding: 15,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"

                }}>
                    <Text style={{
                        fontSize: 30
                    }}>Amount</Text>
                    <View style={styles.alighnHorizontal}>
                        <TouchableOpacity onPress={() => updateAmount(1)}>
                            <View style={{
                                backgroundColor: "#C4C4C4",
                                height: 50,
                                aspectRatio: 1,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}>
                                <Text style={{
                                    fontSize: 20
                                }}>+</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{
                            backgroundColor: "#FA01FF",
                            height: 50,
                            aspectRatio: 1,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}>
                            <Text style={{
                                fontSize: 20
                            }}>{itemChosen}</Text>
                        </View>
                        <TouchableOpacity onPress={() => updateAmount(-1)}>
                            <View style={{
                                backgroundColor: "#C4C4C4",
                                height: 50,
                                aspectRatio: 1,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}>
                                <Text style={{
                                    fontSize: 40
                                }}>-</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: 10,
                    padding: 5
                }} >
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold"
                    }}>Total Charge</Text>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold"
                    }}> Tk {itemChosen * unitPrice} </Text>
                </View>
            </ScrollView>
            <TouchableOpacity onPress={() => {
                try {
                    let dataToStore = {
                        itemName: post.itemName,
                        lowerCasedName: post.lowerCasedName,
                        amountProduced: 5,
                        vendor: {
                            name: post.owner.name,
                            Id: post.owner.id,
                            facebookToken: {
                                profileImageURL: post.owner.facebookToken.profileImageURL

                            },
                            expoPushToken: "ExponentPushToken[7VU08nDS7lMz5Dy2s30Qwv]",

                        },
                        price: post.unitPrice,
                        ratedBy: 5,
                        rating: 4.5,
                        relatedPosts: [
                            {
                                postedOn: post.postedOn,
                                images: post.images,
                                Id: post.id
                            }
                        ]
                    }

                    CartServices.addItem(dataToStore.vendor, dataToStore, itemChosen)
                        .then(() => {
                            addToCart()
                            togglePopup(false)
                        })
                }
                catch {
                    //   CartServices.setCartList([{ ...post, amount: itemChosen }])
                }

            }}>
                <View style={styles.footer}>
                    <Text style={{
                        fontSize: 20
                    }}> Done </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    alighnHorizontal: {
        display: "flex",
        flexDirection: "row",

    },
    footer: {
        backgroundColor: "#FFA500",
        height: 60,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default AddTocart;