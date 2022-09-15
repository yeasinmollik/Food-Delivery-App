import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Global from '../../services/Globals';


import UserService from '../../services/UserService';
import { RootContext } from '../contexts/GlobalContext'
function Favourites(props) {
    const rootContext = React.useContext(RootContext)
    const [followingList, setFollowingList] = useState([])
    const [followers, setFollowersList] = useState([])
    const isFocused = useIsFocused()
    useEffect(() => {
        if (isFocused) {
            rootContext.setHeaderString("Connections")
            UserService.findFollowingList(rootContext.getCurrentUser().id)
                .then(data => {
                    setFollowingList([...data])
                })
            UserService.getFollowers(rootContext.getCurrentUser().id)
                .then(data => {
                    setFollowersList([...data])
                })
        }

    }, [isFocused])

    return (
        <View style={{
            flex: 1,

        }}>
            <Text style={{
                textAlign: "center",
                fontSize: 20,

            }}>People you follow</Text>
            <View>
                <ScrollView>
                    <View style={{
                        padding: 5
                    }} >
                        {followingList.map((entry, index) => {
                            return <FollowingListItem {...props} followee={entry.followee} key={index} />
                        })}
                    </View>
                </ScrollView>
            </View>
            <Text style={{
                textAlign: "center",
                fontSize: 20,

            }}>People following you</Text>
            <View>
                <ScrollView>
                    <View style={{
                        padding: 5
                    }} >
                        {followers.map((entry, index) => {
                            return <FollowerListItem {...props} follower={entry.follower} key={index} />
                        })}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}


function FollowingListItem({ followee, stackNav }) {


    return (
        <TouchableOpacity style={{
            backgroundColor: "white",
            padding: 15,
            margin: 5,
            borderRadius: 5,

            // width: "45%"
        }} onPress={() => {
            stackNav.push('profile', {
                id: followee.id
            })
        }}>
            <View style={[styles.horizontalAlign, {

                marginVertical: .5
            }]}>
                <Image style={{
                    width: 50,
                    aspectRatio: 1,
                    borderRadius: 50
                }} source={{
                    uri: followee.facebookToken.profileImageURL
                }} />
                <Text style={{
                    fontWeight: 'bold',
                    marginLeft: 20,
                    fontSize: 18
                }}> {(followee.facebookToken.name)} </Text>
            </View>
            <View style={{
                marginVertical: 5
            }}>


            </View>
            <View >
                <Text style={{
                    marginVertical: 5
                }}>Recently posted:</Text>
                {followee.lastPost && <View style={[styles.horizontalAlign, , {
                    justifyContent: "space-between",
                }]}>
                    <View style={[styles.horizontalAlign]}>
                        <Image style={{
                            height: 30,
                            aspectRatio: 1,
                            borderRadius: 50
                        }} source={{
                            uri: followee.lastPost.images[0]
                        }} />
                        <Text style={{ fontSize: 15, marginLeft: 10 }}> {(followee.lastPost.itemName)} </Text>
                    </View>
                    <Text style={{

                        marginVertical: 5
                    }}> {Math.floor(Math.random() * 3) + 1} hour(s) ago </Text>
                </View>}
                {!followee.lastPost && <Text>No last post</Text>}
            </View>
        </TouchableOpacity>
    )
}

function FollowerListItem({ follower }) {


    return (
        <TouchableOpacity style={{
            backgroundColor: "white",
            padding: 15,
            margin: 5,
            borderRadius: 5,

            // width: "45%"
        }}>
            <View style={[styles.horizontalAlign, {

                marginVertical: .5
            }]}>
                <Image style={{
                    width: 50,
                    aspectRatio: 1,
                    borderRadius: 50
                }} source={{
                    uri: follower.facebookToken.profileImageURL
                }} />
                <Text style={{
                    fontWeight: 'bold',
                    marginLeft: 20,
                    fontSize: 18
                }}> {(follower.facebookToken.name)} </Text>
            </View>
            <View style={{
                marginVertical: 5
            }}>


            </View>
            <View >
                <Text style={{
                    marginVertical: 5
                }}>Recently posted:</Text>
                {follower.lastPost && <View style={[styles.horizontalAlign, , {
                    justifyContent: "space-between",
                }]}>
                    <View style={[styles.horizontalAlign]}>
                        <Image style={{
                            height: 30,
                            aspectRatio: 1,
                            borderRadius: 50
                        }} source={{
                            uri: follower.lastPost.images[0]
                        }} />
                        <Text style={{ fontSize: 15, marginLeft: 10 }}> {(follower.lastPost.itemName)} </Text>
                    </View>
                    <Text style={{

                        marginVertical: 5
                    }}> {Math.floor(Math.random() * 3) + 1} hour(s) ago </Text>
                </View>}
                {!follower.lastPost && <Text>No last post</Text>}
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    horizontalAlign: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center"
    }
})
export default Favourites;