import React from 'react';
import { SafeAreaView, Text, Image, View, TouchableOpacity } from 'react-native';

function LocalUser(props) {

    return (
        <TouchableOpacity onPress={() => {
            props.stackNav.navigate('profile', {
                id: props.user.id
            })
        }} style={{
            display: 'flex',
            flexDirection: "row",
            alignItems: 'center',
            alignContent: "center",
            padding: 15,
            borderRadius: 5,
            margin: 5,
            justifyContent: "space-between",
            backgroundColor: "#D8E6E6"
        }}>
            <Image style={{
                width: 60,
                borderRadius: 50,
                aspectRatio: 1
            }} source={{ uri: props.user.personalInfo.profileImageURL }} />
            <Text style={{
                marginLeft: 10
            }}>
                {props.user.name}
            </Text>
        </TouchableOpacity>
    );
}

export default LocalUser;