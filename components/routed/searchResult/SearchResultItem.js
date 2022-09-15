import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, TouchableOpacityBase } from 'react-native';
import Global from '../../../services/Globals';
import { RootContext } from '../../contexts/GlobalContext';


function SearchResultItem(props) {

    const rootContext = React.useContext(RootContext)


    return (
        <TouchableOpacity style={{
            margin: 2,
        }} onPress={() => {
            let headerString = `${props.item.owner.facebookToken.name}'s post`
            let postId = props.item.id
            rootContext.updateContext({ ...rootContext.contextObject, headerString: headerString })
            props.navigation.push('Post details', {
                postId: postId,
                headerString: headerString
            })
        }}>
            <View>
                <View style={[styles.container, styles.alighnHorizontal]}>
                    <View style={styles.img}>
                        <Image style={{
                            aspectRatio: 1,
                            width: 110,
                            borderRadius: 60
                        }} source={{
                            uri: props.item['images'][0]
                        }} />
                    </View>
                    <View style={styles.info}>
                        <View style={[styles.alighnHorizontal, {
                            paddingVertical: 5
                        }]}>
                            <Text>{props.item.itemName} </Text>

                        </View>
                        <View style={[styles.alighnHorizontal, {
                            paddingVertical: 5
                        }]}>
                            <View>
                                <Text>Tk{props.item.unitPrice}</Text>

                            </View>
                            <View style={styles.alighnHorizontal}>
                                <Text style={{
                                    fontSize: 15
                                }}>{props.item.amountProduced} {props.item.unitType}</Text>
                            </View>
                        </View>
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            backgroundColor: "white",
                            borderRadius: 10,

                            alignContent: "center",
                            alignItems: "center"
                        }} >
                            <Image style={{
                                width: 35,
                                borderRadius: 90,
                                aspectRatio: 1
                            }} source={{
                                uri: props.item.owner.facebookToken.profileImageURL
                            }} />
                            <Text> {props.item.owner.facebookToken.name} </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    alighnHorizontal: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center"
    },
    container: {
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
        margin: 5,
        padding: 5
    },
    info: {
        flex: 1,
        paddingHorizontal: 5
    },
    updateAmountBtn: {
        backgroundColor: "#FA01FF",
        height: 30,
        aspectRatio: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

    }
})

export default SearchResultItem;