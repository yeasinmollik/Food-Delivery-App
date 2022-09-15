import React, { useEffect, useState } from 'react';
import { View, Text, Image, Dimensions, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, ToastAndroid, Modal } from 'react-native';
import { RootContext } from '../../contexts/GlobalContext';
import { Entypo } from '@expo/vector-icons';
import PostCardRootProfile from './PostCardRootProfile';
import UserService from '../../../services/UserService';
import { useIsFocused } from '@react-navigation/native';

import { BottomSheet } from 'react-native-btr';
import { Ionicons } from '@expo/vector-icons';
import CreatePostBottomSheet from '../../shared/CreatePostBottomSheet';
import UploadManager from '../../../services/UploadManager';
import { FontAwesome } from '@expo/vector-icons';
function UserProfile(props) {
    const [tempCoverPhoto, setTempCoverPhoto] = React.useState(null)
    async function handleUpload() {
        let tempCoverPhotoURI = await UploadManager.uploadImageFromDevice()
        if (tempCoverPhotoURI == null) return
        setTempCoverPhoto(tempCoverPhotoURI)
        setImageUploadBottomSheetVisibility(true)
    }
    const [isCurrentUser, setCurrentUserFlag] = useState(false)
    const rootContext = React.useContext(RootContext)
    const [UserProfileInfo, setUserInfo] = useState({
        "facebookToken": {
            "name": "",
            "profileImageURL": "rgreg",
            coverPhotoURL: "eerger",
            email: "",
            phone: "",
            address: ""
        },
        "id": "",
        followers: 0,
        rating: 0,
        totalItemsDelivered: 0,

    })

    const [imageUploadBottomSheet, setImageUploadBottomSheetVisibility] = React.useState(false)
    const isFocused = useIsFocused()
    const [userPosts, setPostList] = useState([])
    const [isLoaded, setLoadedStatus] = useState(false)
    const [createPostBottomSheetVisibility, popupCreatePostBottomSheet] = React.useState(false)
    const [refreshing, setRefreshing] = React.useState(false);
    const [currentUserId, setCurrentUserId] = React.useState("")
    async function loadData() {
        setRefreshing(true)
        let userId = ""
        let isMyProfile = false;
        if ((!props.route?.params?.id) || rootContext.getCurrentUser().id == props.route?.params?.id) {
            setCurrentUserFlag(true)
            isMyProfile = true
            rootContext.setHeaderString("Your profile")
            setCurrentUserId(rootContext.getCurrentUser().id)
            userId = rootContext.getCurrentUser().id

        }
        else if (rootContext.getCurrentUser().id != props.route?.params?.id) {
            setCurrentUserFlag(false)

            setCurrentUserId(props.route?.params?.id)
            userId = props.route?.params?.id
        }
        await Promise.all([
            loadPosts(userId),
            loadPersonalInfo(userId).then(data => {
                if (!isMyProfile) {
                    rootContext.setHeaderString(data.facebookToken.name)
                }

            })
        ])


    }
    const [isPersonalInfoLoaded, setPersonalInfoLoadingStatus] = React.useState(false)
    async function loadPersonalInfo(userId) {
        //setPersonalInfoLoadingStatus(false)
        //setUserInfo(null)
        let data = await UserService.findUser(userId)
        setUserInfo(data)
        setPersonalInfoLoadingStatus(true)
        return data
    }
    async function loadPosts(userId) {
        UserService.getPosts(userId)
            .then(data => {
                setPostList(data)
            })
    }
    useEffect(() => {
        if (isFocused) {
            loadData().then(() => {
                setRefreshing(1 == 0)
                setLoadedStatus(true)
            })
        }
    }, [isFocused])

    const onRefresh = React.useCallback(() => {
        loadData()
            .then(() => {
                setRefreshing(1 == 0)
                setLoadedStatus(true)

            })
    }, []);
    return (
        <View style={{
            flex: 1
        }}>

            <CreatePostBottomSheet onComplete={() => {
                loadPosts(currentUserId)
            }}  {...props} bottomSheetVisibility={createPostBottomSheetVisibility} popupBottomSheet={popupCreatePostBottomSheet} />
            <CoverPhotoBottomSheet onUploadComplete={() => {

                loadPersonalInfo(currentUserId)

            }} tempImage={tempCoverPhoto} popupBottomSheet={setImageUploadBottomSheetVisibility} bottomSheetVisibility={imageUploadBottomSheet} />
            {isLoaded && <View>
                <ScrollView
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}

                >
                    {isPersonalInfoLoaded && <View>
                        <View style={{
                            height: Dimensions.get('window').width * 9 / 16 + Dimensions.get('window').width * .2,
                            position: "relative"
                        }} >
                            <Image style={{
                                width: '100%',
                                aspectRatio: 16 / 9
                            }} source={{
                                uri: UserProfileInfo?.facebookToken.coverPhotoURL
                            }} />
                            {isCurrentUser && <View style={{
                                position: "absolute",
                                top: 10,
                                left: 10,
                                backgroundColor: "white",
                                padding: 5,
                                borderRadius: 5
                            }} >
                                <Entypo name="camera" onPress={() => {
                                    handleUpload()
                                }} size={24} color="black" />
                            </View>}

                            <Image style={{
                                width: '40%',
                                aspectRatio: 1,
                                borderRadius: 100,
                                position: "absolute",
                                top: Dimensions.get('window').width * 9 / 16 - Dimensions.get('window').width * .2,
                                alignSelf: "center"
                            }} source={{
                                uri: UserProfileInfo?.facebookToken.profileImageURL
                            }} />
                        </View>
                        <View style={{
                            alignItems: "center",

                        }}>
                            <Text style={{

                                fontSize: 30
                            }}> {UserProfileInfo?.facebookToken.name}</Text>

                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",

                            }}>
                                <Entypo name="phone" size={24} color="black" />
                                <Text>
                                    {UserProfileInfo?.phone}
                                </Text>
                            </View>
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <FontAwesome name="home" size={24} color="black" />
                                <Text>
                                    {UserProfileInfo?.currentLocationName}
                                </Text>
                            </View>


                        </View>
                    </View>}


                    {isPersonalInfoLoaded && <View style={[styles.horizontalAlign, {
                        justifyContent: "flex-start",
                        alignItems: "center",
                        alignContent: "center",
                    }]}>
                        <Text style={{
                            fontSize: 20,
                            padding: 10
                        }}> {isCurrentUser ? 'Your' : `${UserProfileInfo?.facebookToken.name}'s`} Posts and activities </Text>
                        {isCurrentUser && <Ionicons onPress={() => {
                            popupCreatePostBottomSheet(1 == 1)
                        }} name="add-circle-outline" size={24} color="black" />}
                    </View>}

                    <View style={{
                        padding: 10
                    }}>
                        <PostCardRootProfile currentUserId={currentUserId} loadPosts={loadPosts} isCurrentUser={isCurrentUser} {...props} postList={userPosts} />
                    </View>
                </ScrollView>
            </View>}
        </View>
    );
}



function CoverPhotoBottomSheet({ bottomSheetVisibility, popupBottomSheet, tempImage, onUploadComplete }) {
    const { getCurrentUser, setCurrentUser } = React.useContext(RootContext)
    const [modalVisible, setModalVisible] = React.useState(false)
    return (<View>
        <BottomSheet visible={bottomSheetVisibility}
            onBackButtonPress={() => {

            }}
            onBackdropPress={() => {

            }}
        >
            <View style={styles.bottomNavigationView}>
                {tempImage != null && <View style={[{
                    flex: 1
                }]}>
                    <ScrollView>
                        <Image style={{
                            width: '100%',
                            aspectRatio: 4 / 3,
                            borderWidth: 1,
                            borderColor: "black"
                        }} source={{ uri: tempImage }} />
                    </ScrollView>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <TouchableOpacity onPress={() => {

                            setModalVisible(true)
                            ToastAndroid.showWithGravity(
                                "Uploading...",
                                ToastAndroid.SHORT,
                                ToastAndroid.BOTTOM
                            )
                            UploadManager.manageFileUpload(tempImage, `${getCurrentUser().id}`, "coverPhotos", (url) => {

                                let newFacebookToken = {
                                    ...getCurrentUser().facebookToken,
                                    coverPhotoURL: url
                                }
                                UserService.updateUserInfo(getCurrentUser().id, newFacebookToken)
                                    .then(data => {


                                        onUploadComplete()
                                        ToastAndroid.showWithGravity(
                                            "Image uploaded succesfully!",
                                            ToastAndroid.SHORT,
                                            ToastAndroid.BOTTOM
                                        )
                                        setModalVisible(false)
                                        popupBottomSheet(false)
                                    })

                            })

                        }} style={{
                            padding: 10,
                            backgroundColor: "#c4c4c4",
                            borderRadius: 5
                        }}>
                            <Text>Set as cover photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            popupBottomSheet(false)
                        }} style={{
                            padding: 10,
                            backgroundColor: "#c4c4c4",
                            borderRadius: 5
                        }}>
                            <Text>Discard</Text>
                        </TouchableOpacity>
                    </View>
                </View>}
            </View>
        </BottomSheet>
        <Modal
            animationType="slide"
            transparent={1 == 1}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Please wait...</Text>

                </View>
            </View>
        </Modal>
    </View>)
}


const styles = StyleSheet.create({
    horizontalAlign: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: Dimensions.get('window').height * 0.5,
        borderRadius: 10,
        padding: 10,

    },
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
})
export default UserProfile;