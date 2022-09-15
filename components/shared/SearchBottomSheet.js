import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions, FlatList, ToastAndroid } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import { BottomSheet } from 'react-native-btr';
import { TextInput } from 'react-native-paper'
import UserService from '../../services/UserService'
function SearchBottomSheet(props) {
    const [queryText, setQueryText] = React.useState("")
    const [searchResult, setSearchResult] = React.useState([])

    function searchUser(query) {
        UserService.searchUser(query)
            .then(data => {

                setSearchResult(data)
            })
    }
    return (
        <View>
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
                    <View style={[styles.bottomNavigationView, { height: '100%' }]}>
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
                            }}>Search users</Text>
                        </View>
                        <TextInput

                            label="Name or phone"
                            value={queryText}
                            onChangeText={text => {
                                setQueryText(text)
                                searchUser(text)
                            }} />
                        <View style={{ flex: 1 }}>
                            <ScrollView>

                                <SearchResults {...props} searchResult={searchResult} />

                            </ScrollView>
                        </View>
                    </View>

                </View>
            </BottomSheet>
        </View>
    );
}
const styles = StyleSheet.create({
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',

        borderRadius: 10,
        padding: 10,

    },
})

function SearchResults(props) {
    return (
        <View>
            {props.searchResult.map((user, index) => {
                return <TouchableOpacity onPress={() => {
                    props.stackNav.navigate('profile', {
                        id: user.id
                    })
                }} key={index}>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignContent: "center",
                        margin: 5,
                        padding: 10,
                        borderRadius: 5,
                        backgroundColor: "#DBF7FA",
                        justifyContent: "space-between",
                    }}>
                        <Image source={{
                            uri: user.personalInfo.profileImageURL
                        }} style={{
                            width: 50,
                            aspectRatio: 1,
                            borderRadius: 50
                        }} />
                        <View>
                            <Text style={{
                                fontSize: 20
                            }}>{user.name}</Text>
                            <Text style={{
                                fontSize: 10
                            }}>{user.currentLocationName}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            })}
        </View>
    )
}

export default SearchBottomSheet;