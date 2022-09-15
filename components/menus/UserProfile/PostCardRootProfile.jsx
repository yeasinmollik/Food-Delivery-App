import React from 'react';
import { Dimensions, Text, View, Image, Button, ToastAndroid, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { FlatList } from 'react-native';
import { TextInput } from 'react-native-paper'

import PostService from '../../../services/PostService';
import { RootContext } from '../../contexts/GlobalContext';

export default function PostCardRootProfile(props) {
    return (
        <View>
            <AvailabilityGroup isAvailable={true} {...props} postList={props.postList.filter(item => item.isAvailable)} />
            <AvailabilityGroup isAvailable={false} {...props} postList={props.postList.filter(item => !item.isAvailable)} />

        </View>
    );
}
function AvailabilityGroup(props) {


    return <View style={{
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 5,
        marginVertical: 20,
        position: "relative",


    }}>
        <View style={{
            position: "absolute",
            top: -20,
            right: 10,
            zIndex: 200,
            backgroundColor: "#f2f2f2"
        }}>
            <Text style={{
                fontSize: 25,

            }}>{props.isAvailable ? "Available Today" : "Unavailable for now"}</Text>

        </View>
        {props.postList.map((item, index) => {
            return <PostGroup key={index} {...props} group={item} />
        })}
    </View>
}
function PostGroup(props) {
    const [selectedItemToMark, setSelectedItemToMark] = React.useState("")
    const [markAvailableModalVisibility, setMarkAvailableModalVisibility] = React.useState(false)
    const [markUnavailabilityModalVisibility, setMarkUnavailabilityModaVisibility] = React.useState(false)
    return <View style={{
        borderWidth: 1,
        borderColor: "black",
        marginVertical: 15,
        padding: 15,
        position: "relative",
        marginHorizontal: 10,
        borderRadius: 5

    }}>
        <MarkUnavailableItemModal {...props} modalVisible={markUnavailabilityModalVisibility} setModalVisible={setMarkUnavailabilityModaVisibility} selectedItemToUnmark={selectedItemToMark} setSelectedItemToMark={setSelectedItemToMark} />

        <MarkAvailableItemModal {...props} modalVisible={markAvailableModalVisibility} setModalVisible={setMarkAvailableModalVisibility} selectedItemToMark={selectedItemToMark} setSelectedItemToMark={setSelectedItemToMark} />
        <View style={{
            position: "absolute",
            top: -20,
            left: 5,
            zIndex: 100,
            backgroundColor: "#f2f2f2"
        }}>
            <Text style={{
                fontSize: 25
            }}>{props.group.itemName}</Text>
        </View>
        <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            <View>
                {props.group.isAvailable == 1 && <Text>Tk. {props.group.unitPrice} </Text>}
                <Text>{props.group.isAvailable == 1 ? "Available today" : "Unavailable for now"}</Text>
                <Text>{props.group.rating == 0 ? "Unrated" : `${props.group.rating}⭐`} </Text>
                {props.group.numPeopleRated != 0 && <Text>{props.group.numPeopleRated} user(s) rated</Text>}
            </View>
            {props.isCurrentUser && <View>
                {props.group.isAvailable == 1 && <TouchableOpacity style={{
                    backgroundColor: "#F7CDC3",
                    padding: 5,
                    borderRadius: 5,

                }} onPress={() => {
                    setSelectedItemToMark(props.group.itemName)
                    setMarkUnavailabilityModaVisibility(true)
                }} >
                    <Text style={{
                        fontSize: 15
                    }}>Mark
                        unavailable</Text>
                </TouchableOpacity>}
                {!props.group.isAvailable == 1 && <TouchableOpacity style={{
                    backgroundColor: "#C6F3BA",
                    padding: 5,
                    borderRadius: 5,

                }} onPress={() => {
                    setSelectedItemToMark(props.group.itemName)
                    setMarkAvailableModalVisibility(true)
                }}>
                    <Text style={{
                        fontSize: 15
                    }}>Mark
                        available</Text>
                </TouchableOpacity>}
            </View>}
        </View>
        <View>
            <FlatList
                horizontal={true}
                data={props.group.relatedPost}
                keyExtractor={(data, index) => index}
                renderItem={(data) => {
                    return <RelatedPostsCard {...props} data={data.item} />

                }}
            />
        </View>
    </View>
}


function MarkAvailableItemModal(props) {
    const [selectedItemUnitPrice, setSelectedItemUnitPrice] = React.useState("")
    const rootContext = React.useContext(RootContext)
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
                <Text>Unit price for {props.selectedItemToMark}</Text>
                <TextInput
                    style={{ borderWidth: 1, borderColor: "black", width: "100%" }}
                    label="Price"
                    keyboardType="numeric"
                    value={selectedItemUnitPrice + ""}
                    onChangeText={text => {

                        setSelectedItemUnitPrice(text)
                    }}
                />

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
                            if (selectedItemUnitPrice == "") return
                            PostService.addNewAvaialableItem(props.currentUserId,
                                props.selectedItemToMark,
                                selectedItemUnitPrice,
                                rootContext.getCurrentLocationGeocode().city
                            )
                                .then(data => {
                                    ToastAndroid.showWithGravity(
                                        `${props.selectedItemToMark} is available now`,
                                        ToastAndroid.SHORT,
                                        ToastAndroid.BOTTOM
                                    )
                                    props.loadPosts(props.currentUserId)
                                    props.setModalVisible(false);
                                    setSelectedItemUnitPrice("")
                                })
                        }} >
                        <Text>Done</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        padding: 15,
                        borderRadius: 10,
                        backgroundColor: "#FDD3B2"
                    }}
                        onPress={() => {

                            props.setModalVisible(false);
                        }} >
                        <Text>Cancel</Text>
                    </TouchableOpacity>

                </View>

            </View>
        </View>

    </Modal>
}


function MarkUnavailableItemModal(props) {

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

                            PostService.removeAvailableItem(props.currentUserId,
                                props.selectedItemToUnmark,

                            )
                                .then(data => {
                                    ToastAndroid.showWithGravity(
                                        `${props.selectedItemToUnmark} is unavailable now`,
                                        ToastAndroid.SHORT,
                                        ToastAndroid.BOTTOM
                                    )
                                    props.loadPosts(props.currentUserId)
                                    props.setModalVisible(false);
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


function RelatedPostsCard(props) {
    return <View style={{
        margin: 5,
        paddingHorizontal: 10,
        backgroundColor: "#C1F2FB",
        borderRadius: 5,
        paddingBottom: 50,
        paddingTop: 10
    }}>
        <Image source={{
            uri: JSON.parse(props.data.images)[[0]]
        }} style={{
            width: 150,
            aspectRatio: 16 / 9
        }} />
        <Text style={{
            fontSize: 15
        }}> {(new Date(props.data.postedOn).toLocaleTimeString())}, {(new Date(props.data.postedOn).toLocaleDateString())} </Text>

        <View>
            <View style={{
                position: "relative"
            }}>
                <TouchableOpacity onPress={() => {
                    props.stackNav.push('Post details', {
                        postId: props.data.id,

                    })
                }} style={{
                    backgroundColor: "#C4FDCC",
                    position: "absolute",
                    padding: 10,
                    borderRadius: 5
                }}>
                    <Text>View details</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
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