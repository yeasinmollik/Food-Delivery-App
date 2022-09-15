import React from 'react';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { EvilIcons } from '@expo/vector-icons';
import { RootContext } from '../contexts/GlobalContext'

import { Text, View, StyleSheet, Image, SafeAreaView, TouchableOpacity } from 'react-native';
const profilePictureURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4QfHXtZSr7Y9IoJWng-WknDoAHZxbxPC6QQ&usqp=CAU"
function Header(props) {
    const { contextObject, updateContext } = React.useContext(RootContext)

    function popupSidebar() {
        props.navigation.dispatch(DrawerActions.toggleDrawer())
    }
    return (
        <SafeAreaView style={[styles.navbarRoot, {
            alignContent: "center",
            alignItems: "center"
        }]}>

            <Text style={{
                paddingTop: 25,
                fontFamily: "sans-serif-thin",
                fontSize: 30
            }}>Oregano🍽️</Text>
            <View style={styles.horizontal_vert_Align} >

                <EvilIcons onPress={() => {
                    updateContext({ ...contextObject, headerString: "Notifications" })
                    props.navigation.push('notifications')
                }} name="bell" size={40} color="black" />
                <TouchableOpacity onPress={() => {
                    updateContext({ ...contextObject, headerString: "Cart" })

                    props.navigation.push('Cart')
                }} >
                    <EvilIcons name="cart" size={40} color="black" />
                </TouchableOpacity>
                {contextObject.currentUser && <TouchableOpacity onPress={() => {
                    popupSidebar()
                }}>
                    <Image style={styles.profilePicture}
                        source={{
                            uri: contextObject.currentUser.facebookToken.profileImageURL
                        }}
                    />
                </TouchableOpacity>}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    navbarRoot: {
        height: 90,
        padding: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",


        backgroundColor: "white"
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 40,

    },
    horizontal_vert_Align: {
        flex: 1,
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: "flex-end",
        alignContent: "center",
        marginTop: 30,

    }
})

export default Header;