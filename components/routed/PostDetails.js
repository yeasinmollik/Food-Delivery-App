import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView, Button, Dimensions, Modal, ToastAndroid } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

import ItemDetailsBottomSheet from '../shared/ItemDetailsBottomSheet';

import { TouchableOpacity } from 'react-native';
import CartServices from '../../services/CartServices';
import ImageViewer from 'react-native-image-zoom-viewer';
import { RootContext } from '../contexts/GlobalContext'
import LocationView from '../shared/LocationView';
import PostService from '../../services/PostService';
import SimilarItemViewRoot from './postDetailsUtils/SimilarItemViewRoot';
import LocationService from '../../services/LocationService';
import SearchingServices from '../../services/SearchingServices';

function PostDetails(props) {
    const [isOwnPost, setOwnershipStatus] = React.useState(false)
    const [itemAvailability, setItemAvailability] = React.useState({
        isAvailable: 0,
        unitPrice: 0
    })
    const [postLocationName, setPostLocationName] = React.useState("Loading..")
    const [selectedSearchResult, setSearchResultItem] = React.useState(null)
    const [dropDownVisibility, popupBottomSheet] = React.useState(false)

    const [mapVisibility, setMapVisibility] = useState(false)
    const isFocused = useIsFocused()
    const { getCurrentUser, setHeaderString } = useContext(RootContext)
    const postId = props.route.params.postId
    const [post, setCurrentPost] = useState(null)
    const [currentUserRating, setCurrentUserRating] = useState(0)
    const [cartInfo, setCartInfo] = useState({
        amount: 0
    })
    const [ratingList, setRatingList] = useState([])
    const [images, setImageList] = useState([{ url: "abcd", props: "" }])
    const [isAddedToCart, setCartStatus] = useState(false)

    function addToCart() {
        setCartStatus(true)
        updateCartInfo(post)
    }

    function updateCartInfo(postInfo) {
        CartServices.isAddedToCart(postInfo.postedBy, postInfo.lowerCasedName).then(carts => {
            try {
                if (!carts) setCartStatus(false)

                else {
                    setCartStatus(true)
                    setCartInfo({ amount: carts })
                }
            } catch (error) {
                setCartStatus(false)
            }


        })
    }

    const [canPopUpImageModal, setImageModalVisibility] = useState(false)
    useEffect(() => {

        if (isFocused) {

            setHeaderString("")

            PostService.findPost(postId)
                .then(postInfo => {

                    LocationService.getGeoApifyLocationInfo({
                        latitude: postInfo.latitude,
                        longitude: postInfo.longitude
                    }).then(data => {
                        let locationName = data.geocode
                        setPostLocationName(locationName)
                    })

                    PostService.getPostRatings(postInfo.lowerCasedName, postInfo.postedBy)
                        .then(data => {
                            for (let ratingInfo of data) {
                                if (ratingInfo.getUser.id == getCurrentUser().id) {
                                    setCurrentUserRating(ratingInfo.rating)
                                }
                            }
                            setRatingList(data)
                        })
                    setCurrentPost(postInfo)
                    setOwnershipStatus(postInfo.owner.id == getCurrentUser().id)


                    PostService.isItemAvailable(postInfo.lowerCasedName, postInfo.postedBy)
                        .then(data => {
                            setItemAvailability(data)
                        })

                    setHeaderString(`${postInfo.owner.id == getCurrentUser().id ? "Your post" : postInfo.owner.facebookToken.name + "'s post"}`)
                    let images = []
                    for (let image of postInfo.images) {
                        images.push({
                            url: image,
                            props: ""
                        })
                    }

                    setImageList(images)
                    updateCartInfo(postInfo)
                    return postInfo
                })
        }
    }, [isFocused])


    const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = React.useState(false)

    return (
        <View style={{
            height: Dimensions.get('window').height,
            flex: 1
        }}>
            {post && <View style={{
                flex: 1
            }}>
                <PostDeletionConfirmationModal {...props} modalVisible={deleteConfirmationModalVisible}
                    setModalVisible={setDeleteConfirmationModalVisible}
                    postId={props.route.params.postId} />

                <ScrollView style={{

                    margin: 10,
                    backgroundColor: "white",
                    borderRadius: 10
                }}>
                    <View style={{
                        padding: 20, flex: 1
                    }}>
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                            alignContent: "center"
                        }}>
                            <Image style={{
                                width: 100,
                                aspectRatio: 1,
                                borderRadius: 100
                            }} source={{
                                uri: post.images[0]
                            }} />
                            <View style={styles.primaryInfo}>
                                <Text style={{
                                    fontSize: 30,
                                    fontWeight: "bold"
                                }}> {post.itemName} </Text>



                            </View>
                        </View>
                        <View style={{
                            marginHorizontal: 5,
                            marginVertical: 20
                        }}>
                            <Text style={{
                                fontSize: 20,
                                paddingVertical: 10
                            }}> Prepared By: </Text>
                            <TouchableOpacity onPress={() => {
                                setHeaderString('')
                                props.navigation.push('profile', {
                                    id: post.owner.id
                                })
                            }}>
                                <View style={[styles.horizontal_vert_Align, {
                                    backgroundColor: "#a1ef781f",
                                    padding: 10,
                                    borderRadius: 10
                                }]}>
                                    <Image style={{
                                        width: 50,
                                        aspectRatio: 1,
                                        borderRadius: 50
                                    }} source={{
                                        uri: post.owner.facebookToken.profileImageURL
                                    }} />
                                    <Text style={{
                                        fontSize: 20,
                                        fontWeight: "bold"
                                    }}> {post.owner.facebookToken.name} </Text>
                                </View>
                            </TouchableOpacity>

                        </View>

                        <Text style={{
                            fontSize: 20
                        }}>Details: </Text>
                        <FlatList
                            horizontal={true}
                            data={post.images}
                            keyExtractor={image => image}
                            renderItem={(image) => {
                                return <View style={{
                                    padding: 5
                                }}>
                                    <TouchableOpacity onPress={() => {
                                        setImageModalVisibility(true)
                                    }}>
                                        <Image source={{ uri: image.item }} style={{
                                            width: 200,
                                            aspectRatio: 1,

                                        }} />
                                    </TouchableOpacity>
                                </View>

                            }}
                        />
                        <View style={styles.horizontalAlign}>
                            <Text style={styles.infoText}>Tk. {(itemAvailability.isAvailable ? itemAvailability.unitPrice : "Item unavailable")} </Text>
                        </View>
                        <View style={styles.horizontalAlign}>
                            <Text style={styles.infoText}>Posted on:</Text>
                            <Text style={styles.infoText}>{(new Date(post.postedOn)).toLocaleTimeString()},{(new Date(post.postedOn)).toLocaleDateString()}</Text>

                        </View>
                        <Text>{postLocationName}</Text>
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <Button onPress={() => {
                                setMapVisibility(true)
                            }} style={{
                                paddingHorizontal: 15,
                                paddingVertical: 5,
                                backgroundColor: "#c4c4c4",
                                borderRadius: 5,
                                flex: 1
                            }} title="View post location" />



                        </View>

                    </View>
                    <SimilarItemViewRoot {...props} stackNav={props.navigation} itemName={post.lowerCasedName} currentPostOwnerId={post.postedBy} />
                    {!ratingList.length && <View>
                        <Text style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            margin: 10
                        }}>Unrated</Text>
                    </View>}

                    {ratingList.length > 0 && <View>
                        <View>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: 'bold',
                                margin: 10
                            }}>Ratings</Text>
                        </View>
                        {ratingList.map((rating, index) => {
                            return <TouchableOpacity key={index}>
                                <View style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: "space-between",
                                    alignItems: 'center',
                                    alignContent: "center",
                                    padding: 15,
                                    backgroundColor: "#E6E6E6",
                                    borderRadius: 10,
                                    margin: 10
                                }}>
                                    <Image style={{
                                        width: 50,
                                        borderRadius: 50,
                                        aspectRatio: 1
                                    }} source={{ uri: rating.getUser.personalInfo.profileImageURL }} />
                                    <View>
                                        <Text>{rating.getUser.personalInfo.name}</Text>
                                        {rating.getUser.id != getCurrentUser().id && <Text>{rating.rating}⭐</Text>}
                                        {rating.getUser.id == getCurrentUser().id && <Text>{currentUserRating}⭐</Text>}

                                    </View>
                                </View>
                            </TouchableOpacity>
                        })}
                    </View>}



                </ScrollView>

                {!isOwnPost && <View>
                    {(!isAddedToCart && itemAvailability.isAvailable == 1) && <View style={styles.footer}>
                        <TouchableOpacity onPress={() => {
                            setSearchResultItem({
                                vendorId: post.postedBy,
                                itemName: post.itemName
                            })
                            popupBottomSheet(true)
                        }}>
                            <Text style={{
                                fontSize: 15
                            }}>ADD TO CART</Text>

                        </TouchableOpacity>

                    </View>}
                    {(!isAddedToCart && itemAvailability.isAvailable == 0) && <View style={[styles.footer, { backgroundColor: "#c4c4c4" }]}>
                        <TouchableOpacity onPress={() => {

                        }}>
                            <Text style={{
                                fontSize: 15
                            }}>ITEM UNAVAILABLE</Text>

                        </TouchableOpacity>

                    </View>}
                    {isAddedToCart && <View style={[styles.alighnHorizontal, {
                        justifyContent: "space-between",
                        width: "100%",
                        padding: 20,
                    }]}>
                        <View>
                            <Text>Amount:{cartInfo.amount}</Text>
                            <Text>Tk.{cartInfo.amount * itemAvailability.unitPrice}</Text>
                        </View>

                        <FontAwesome5 onPress={() => {
                            CartServices.delete(post.postedBy, post.lowerCasedName)
                                .then(() => {
                                    updateCartInfo(post)
                                })

                        }} name="trash" size={24} color="black" />


                    </View>}
                </View>}

                {isOwnPost && <View>

                    <TouchableOpacity style={{
                        backgroundColor: "#FD918E",

                        height: 60,
                        justifyContent: "center",
                        alignItems: "center",
                    }} onPress={() => {
                        setDeleteConfirmationModalVisible(true)
                    }}>
                        <Text>DELETE POST</Text>
                    </TouchableOpacity>

                </View>}



                <Modal visible={canPopUpImageModal} transparent={true}>
                    <ImageViewer onDoubleClick={() => {
                        setImageModalVisibility(false)
                    }} imageUrls={images.map(item => { return { ...item, url: item.url } })} />
                </Modal>

                <LocationView mapVisibility={mapVisibility} setMapVisibility={setMapVisibility} target={post} tagnameLabel="Post location" />

            </View>
            }
            <ItemDetailsBottomSheet onChange={() => {
                updateCartInfo(post)
            }} {...props} bottomSheetVisibility={dropDownVisibility} popupBottomSheet={popupBottomSheet} selectedSearchResult={selectedSearchResult} setSearchResultItem={setSearchResultItem} />
        </View>


    );
}

function PostDeletionConfirmationModal(props) {

    return <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible}
        onRequestClose={() => {
            props.setModalVisible(false);
        }}

    >
        <View style={styles.centeredView}>
            <View style={[styles.modalView, {
                width: Dimensions.get('window').width * .9
            }]}>
                <Text>Are you sure?</Text>


                <View style={{
                    display: "flex",
                    justifyContent: "space-around",
                    flexDirection: "row",
                    width: "100%",
                    margin: 10

                }} >
                    <TouchableOpacity style={{
                        padding: 15,
                        borderRadius: 10,
                        backgroundColor: "#CBFCDA"
                    }}
                        onPress={() => {

                            PostService.deletePost(props.postId

                            )
                                .then(data => {
                                    ToastAndroid.showWithGravity(
                                        `Post deleted successfully`,
                                        ToastAndroid.SHORT,
                                        ToastAndroid.BOTTOM
                                    )
                                    props.navigation.navigate("HomeView")
                                })
                        }} >
                        <Text>Yes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        padding: 15,
                        borderRadius: 10,
                        backgroundColor: "#FDD3B2"
                    }}
                        onPress={() => {

                            props.setModalVisible(false);
                        }} >
                        <Text>No</Text>
                    </TouchableOpacity>

                </View>

            </View>
        </View>

    </Modal>
}



const styles = StyleSheet.create({
    container: {},
    heading: {},
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
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
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: Dimensions.get('window').height * 0.33,
        borderRadius: 10,

    },
    horizontalAlign: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    infoText: {
        fontSize: 15,
        fontStyle: "italic"
    },
    horizontal_vert_Align: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: 'row',

    },
    tagIcon: {
        padding: 0,
        fontSize: 30
    },
    tags: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    popular: {
        backgroundColor: "#FCEEC7",
        borderRadius: 30,
        height: 30,
        borderWidth: 2,
        paddingHorizontal: 10,
        marginTop: 15,
        width: 100
    },
    footer: {
        backgroundColor: "#FFA500",
        height: 60,
        justifyContent: "center",
        alignItems: "center",

    },
    footer2: {
        backgroundColor: "#ffffff",
        height: 60,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
        padding: 10
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
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center"
    }
})
export default PostDetails;