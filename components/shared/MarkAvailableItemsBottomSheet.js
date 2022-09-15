import { ToastAndroid, SafeAreaView, FlatList, Button, Dimensions, ScrollView, Modal, RefreshControl, Text, View, StyleSheet, LogBox, TouchableOpacity } from 'react-native';
import { BottomSheet } from 'react-native-btr';
import { TextInput } from 'react-native-paper'
import Global from '../../services/Globals';
import { Entypo } from '@expo/vector-icons';
import React from 'react';
import RemovableTag from './RemovableTag';
import PostService from '../../services/PostService';
import { RootContext } from '../contexts/GlobalContext';
function MarkAvailableItemsBottomSheet(props) {
    return (
        <BottomSheet visible={props.bottomSheetVisibility}
            onBackButtonPress={() => {

                props.popupBottomSheet(false)
            }}
            onBackdropPress={() => {


                props.popupBottomSheet(false)
            }}
        >
            <View style={{
                maxHeight: Dimensions.get('window').height * .9,

            }}>
                <View style={[styles.bottomNavigationView, { height: "100%" }]}>
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center"
                    }}>
                        <Entypo onPress={() => {
                            props.popupBottomSheet(false)
                        }} name="circle-with-cross" size={30} color="black" />
                        <Text style={{
                            fontSize: 20
                        }}>Today's available items</Text>
                    </View>
                    {props.bottomSheetVisibility && <RenderMainComponent onComplete={() => {
                        props.popupBottomSheet(false)
                    }} {...props} />}
                </View>
            </View>
        </BottomSheet>
    );
}


function RenderMainComponent(props) {
    const { getCurrentUser, getCurrentLocationGeocode } = React.useContext(RootContext)
    const [searchText, setSeatchText] = React.useState("")
    const [selected, setSelected] = React.useState([{ tag: "", unitPrice: 0 }])
    const [availableTags, setAvailableTagList] = React.useState([])
    const [modalVisible, setModalVisible] = React.useState(false);

    const [doesSearchExist, setExistence] = React.useState(true)
    const [selectedTag, setSelectedTag] = React.useState({
        tag: "",
        unitPrice: 0
    })
    const [tags, setAvailableTags] = React.useState([])
    function getAvailableTags(availables) {
        PostService.getAvailableItemsToday(getCurrentUser().id)
            .then(data => {
                let tempData = availables
                for (let tag of data) {
                    let temp = []
                    for (let entry of tempData) {
                        if (entry != tag.tag) {
                            temp.push(entry)
                        }
                    }

                    tempData = temp

                }
                setAvailableTags(tempData)
                setSelected(data)
            })
    }
    React.useEffect(() => {

        fetch(Global.SERVER_URL + '/getAvailableTags/' + getCurrentUser().id)
            .then(response => response.json())
            .then(({ data }) => {
                setAvailableTagList(data)
                setAvailableTags(data)
                return data
            })
            .then((data) => {

                getAvailableTags(data)
            })
    }, [])
    function addTag(tag) {
        let selectedList = [...selected, { ...tag, tag: tag.tag.toLowerCase() }]
        setSelected(selectedList)
        let tempAvailable = availableTags
        for (let entry of selectedList) {
            tempAvailable = (tempAvailable.filter(item => item != entry.tag))
        }
        setAvailableTags(tempAvailable)
    }
    function removeTag(tagName) {
        tagName = tagName.toLowerCase()
        setSelected(selected.filter(name => name.tag != tagName))
        let temp = availableTags
        for (let tag in selected) {
            temp = temp.filter(name => name.tag != tag)
        }
        setAvailableTags([...temp])
    }
    function search(query) {
        query = query.toLowerCase()
        setSeatchText(query)
        let temp = availableTags
        for (let tag of selected) {
            temp = temp.filter(name => name != tag)
        }
        temp = temp.filter(name => name.startsWith(query))
        setAvailableTags(temp)

    }
    return (<View style={{
        margin: 10,
        backgroundColor: "white",
        flex: 1,
        padding: 10
    }}>
        <Modal
            animationType="slide"
            transparent={1 == 1}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, {
                    width: Dimensions.get('window').width * .9
                }]}>
                    <Text>Unit price</Text>
                    <TextInput
                        style={{ borderWidth: 1, borderColor: "black", width: "100%" }}
                        label="Price"
                        keyboardType="numeric"
                        value={selectedTag.unitPrice + ""}
                        onChangeText={text => {

                            setSelectedTag({ ...selectedTag, unitPrice: text })
                        }}
                    />
                    <Button title="Done" onPress={() => {
                        addTag({
                            ...selectedTag
                        })
                        setModalVisible(!modalVisible);
                    }} />
                </View>
            </View>
        </Modal>
        <View style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
        }}>
            <TextInput
                style={{ flex: 1, borderWidth: 1, borderColor: "black", margin: 2 }}
                label="Tag name"
                value={searchText}
                onChangeText={text => search(text)}
            />

        </View>
        {selected.length > 0 && <View style={{
            margin: 10
        }}>
            <Text style={{
                fontSize: 20
            }}> Selected </Text>
            <View style={{

            }} >

                <FlatList
                    horizontal={true}
                    data={selected}
                    keyExtractor={tag => tag.tag}
                    renderItem={(tag) => {
                        return <RemovableTag name={tag.item.tag} unitPrice={tag.item.unitPrice} removeTag={() => {
                            removeTag(tag.item.tag)
                        }} />

                    }}
                />


            </View>
        </View>}
        <Text style={{
            padding: 5,
            fontSize: 25
        }}>From your posts:</Text>
        <ScrollView>

            {!doesSearchExist && <View>
                <TouchableOpacity style={[styles.alighnHorizontal, {
                    paddingHorizontal: 10
                }]} onPress={() => {
                    addTag(searchText)
                    search("")
                }} >
                    <View style={styles.updateAmountBtn}>
                        <Text style={{
                            fontSize: 20
                        }}>+</Text>
                    </View>

                    <Text style={{
                        fontSize: 20,
                        marginLeft: 20
                    }}>Add tag "{searchText}"</Text>
                </TouchableOpacity>
            </View>}
            {doesSearchExist && <View>
                {tags.map((tagName, index) => {
                    return <View key={index} style={{
                        margin: 5
                    }}>
                        <Button title={tagName} onPress={() => {
                            setSelectedTag({ tag: tagName, unitPrice: 0 })
                            setModalVisible(true)
                        }} />
                    </View>
                })}
            </View>}
        </ScrollView>


        <TouchableOpacity onPress={() => {
            PostService.setAvailableItemsToday(getCurrentUser().id, selected, getCurrentLocationGeocode().city)
                .then(() => {
                    ToastAndroid.showWithGravity(
                        "Done!",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM
                    )
                    props.onComplete()
                })
        }}>
            <View style={{
                backgroundColor: "#FFA500",
                height: 40,
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Text style={{
                    fontSize: 20
                }}> Done! </Text>
            </View>
        </TouchableOpacity>
    </View>)
}


const styles = StyleSheet.create({
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',

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

export default MarkAvailableItemsBottomSheet;