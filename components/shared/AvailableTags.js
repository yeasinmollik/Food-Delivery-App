import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Global from '../../services/Globals';
import { RootContext } from '../contexts/GlobalContext';


function AvailableTags(props) {
    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around"
        }}>
            {props.localItems.map((item, index) => {
                return (<TouchableOpacity style={{
                    backgroundColor: "#4da5ffe0",
                    padding: 10,
                    borderRadius: 5,
                    width: '30%',
                    margin: 5,

                }} key={index} onPress={() => {
                    props.tabNav.navigate('Search items', {
                        query: item
                    })
                }}>
                    <Text style={{
                        textAlign: "center",
                        fontSize: 15,
                        color: "white"
                    }}>{item}</Text>
                </TouchableOpacity>)
            })}
        </View>

    );
}

export default AvailableTags;