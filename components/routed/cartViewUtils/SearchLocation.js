import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
} from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { BottomSheet } from 'react-native-btr';
import { TextInput } from 'react-native-paper';
import SearchingServices from '../../../services/SearchingServices';
import LocationService from '../../../services/LocationService';

function SearchLocation(props) {
    const [query, setQuery] = React.useState("")
    const [searchResulsts, setSearchResults] = React.useState([])
    return (
        <View>
            <BottomSheet
                visible={props.visibility}
                onBackButtonPress={() => {
                    props.setVisibility(false);
                }}
                onBackdropPress={() => {
                    props.setVisibility(false);
                }}>
                <View style={styles.bottomNavigationView}>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignContent: "center",
                        alignItems: "center"
                    }}>
                        <Text style={{
                            margin: 10,
                            fontSize: 20
                        }}>Search for your location</Text>
                        <EvilIcons onPress={() => {
                            props.setVisibility(false);
                        }} name="close-o" size={30} color="black" />
                    </View>

                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center"
                    }}>
                        <TextInput
                            style={{
                                width: "80%"
                            }}
                            label="Search name"
                            value={query}
                            onChangeText={text => {
                                setQuery(text)

                            }}
                        />
                        <TouchableOpacity style={{
                            width: "20%",
                            display: "flex",
                            flexDirection: 'row',
                            justifyContent: "center",
                            backgroundColor: "#B8F1D4",
                            padding: 15,
                            margin: 2,
                            borderRadius: 5
                        }} onPress={() => {
                            setSearchResults([{
                                name: "Loading...",
                                street: "",
                                notSelectable: 1
                            }])
                            SearchingServices.searchLocation(query)
                                .then(data => {
                                    setSearchResults(data)

                                })
                        }} >
                            <EvilIcons
                                name="search" size={40} color="black" />
                        </TouchableOpacity>

                    </View>

                    <ScrollView>
                        {searchResulsts.map((item, index) => {
                            return <TouchableOpacity onPress={() => {
                                if (item.notSelectable) return

                                props.setVisibility(false);
                                props.onSelect(item)
                                // LocationService.getLocationGeocode(item.coords)
                                //     .then(data => {
                                //         console.log(JSON.stringify(item))
                                //         if (data[0]) {
                                //             if (data[0].city?.toLowerCase() == productLocation.toLowerCase()) {

                                //                 return
                                //             }
                                //         }
                                //         ToastAndroid.showWithGravity(
                                //             `Order location must be inside of ${productLocation}`,
                                //             ToastAndroid.SHORT,
                                //             ToastAndroid.BOTTOM
                                //         )
                                //     })



                            }} key={index} style={{
                                margin: 1,
                                padding: 5,
                                borderColor: "black",
                                borderWidth: 1
                            }}>
                                <Text style={{
                                    fontWeight: "bold"
                                }}>{item.name}</Text>
                                <Text>{item.street}</Text>
                            </TouchableOpacity>
                        })}
                    </ScrollView>

                </View>

            </BottomSheet>
        </View>
    );
}
const styles = StyleSheet.create({
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: "90%",
        borderRadius: 10,
        padding: 10,

    }
});
export default SearchLocation;