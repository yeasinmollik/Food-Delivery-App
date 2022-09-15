import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, StyleSheet, Image, FlatList, ScrollView, Button, Dimensions, Modal } from 'react-native';
import { BottomSheet } from 'react-native-btr';
import { TouchableOpacity } from 'react-native';

import * as Location from 'expo-location';
import openMap from 'react-native-open-maps';
function LocationView({ setTargetCoordinates, mapVisibility, setMapVisibility, target, tagnameLabel, shouldChangeOnDrag, onLocationSelect }) {
    const [currentLocationGeoCode, setCurrentLocationGeoCode] = React.useState("")

    const [targetLocationGeoCode, setTargetLocationGeoCode] = React.useState("")
    const [currentCoords, setCurrentCoords] = React.useState({
        latitude: 0,
        longitude: 0
    })
    const [targetCoords, setTargetCoords] = React.useState({
        latitude: target.latitude,
        longitude: target.longitude
    })
    React.useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setCurrentCoords({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
            let currentLocationGeoCode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })
            setCurrentLocationGeoCode(`${currentLocationGeoCode[0].name}, ${currentLocationGeoCode[0].street}, ${currentLocationGeoCode[0].postalCode}, ${currentLocationGeoCode[0].city}`)
            let targetLocationGeocode = await Location.reverseGeocodeAsync({
                latitude: target.latitude,
                longitude: target.longitude
            })
            setTargetLocationGeoCode(`${targetLocationGeocode[0].name}, ${targetLocationGeocode[0].street}, ${targetLocationGeocode[0].postalCode}, ${targetLocationGeocode[0].city}`)
        })();
    }, [])
    return (
        <BottomSheet
            visible={mapVisibility}
            onBackButtonPress={() => {
                setMapVisibility(false)
            }}
            onBackdropPress={() => {
                setMapVisibility(false)
            }}
        >

            <View style={{
                backgroundColor: '#fff',
                width: '100%',
                height: Dimensions.get('window').height * 0.65,
                borderRadius: 10
            }}>
                <View style={{
                    display: "flex",
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    zIndex: 1000,

                }}>
                    {!shouldChangeOnDrag && <TouchableOpacity onPress={() => {

                        openMap({
                            start: currentLocationGeoCode,
                            end: targetLocationGeoCode,
                            navigate: true

                        })
                    }} style={{

                        padding: 20,
                        backgroundColor: "#c4c4c4",

                    }}>
                        <Text>Expand</Text>
                    </TouchableOpacity>}
                    {shouldChangeOnDrag && <TouchableOpacity onPress={() => {
                        onLocationSelect()
                    }} style={{

                        padding: 20,
                        backgroundColor: "#c4c4c4",
                        width: '100%',
                        alignItems: 'center',
                        alignContent: "center",
                        borderRadius: 5
                    }}>
                        <Text>Select location</Text>
                    </TouchableOpacity>}
                </View>
                <MapView style={{ flex: 1 }} region={{
                    latitude: targetCoords.latitude,
                    longitude: targetCoords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                }} onRegionChangeComplete={(e) => {
                    if (shouldChangeOnDrag) {
                        setTargetCoords({
                            latitude: e.latitude,
                            longitude: e.longitude
                        })
                        setTargetCoordinates({
                            latitude: e.latitude,
                            longitude: e.longitude
                        })
                    }
                }}  >

                    <Marker style={{
                        position: "absolute",
                        top: 0
                    }} coordinate={{
                        latitude: targetCoords.latitude,
                        longitude: targetCoords.longitude,
                        atitudeDelta: 0.05,
                        longitudeDelta: 0.05
                    }} title={tagnameLabel} />
                </MapView>
            </View>
        </BottomSheet>
    );
}

export default LocationView;