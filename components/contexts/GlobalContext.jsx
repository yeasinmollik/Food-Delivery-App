import React, { useState } from 'react';
import Global from '../../services/Globals';
import LocationService from '../../services/LocationService';
export const RootContext = React.createContext()
import LocalStorageService from '../../services/LocalStorageService'

import users from './users';

export default function GlobalContext({ children }) {
    React.useEffect(() => {
        (isLoggedIn()).then(status => {
            if (status) {
                LocalStorageService.get('currentUser')
                    .then(data => {
                        //setCurrentUser(data)
                        setCurrentUser(users.data[1])
                    })
            }
            // LocalStorageService.clearAll()
        })


    }, [])
    function getCurrentLocationGeocode() {
        return globalObject.currentLocation.currentLocationGeoCode
    }
    const [globalObject, setGlobalObject] = useState({
        isLoggedIn: false,
        headerString: "",
        tagList: [],
        currentUser: null,
        currentLocation: {
            coords: {
                latitude: 0,
                longitude: 0
            },

        },
        expoPushToken: ""
    })

    async function setCurrentUser(user) {
        //await LocalStorageService.store('currentUser', user)
        setGlobalObject({ ...globalObject, currentUser: user })
        return user


    }

    function updatePushToken(token) {
        fetch(Global.SERVER_URL + '/updatePushToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                userId: globalObject.currentUser.id
            })
        })
    }
    function setHeaderString(title) {
        setGlobalObject({ ...globalObject, headerString: title })
    }
    async function isLoggedIn() {
        let status = await LocalStorageService.get('isLoggedIn');

        status != null ? setGlobalObject({ ...globalObject, isLoggedIn: true }) : setGlobalObject({ ...globalObject, isLoggedIn: false })
        return status != null// status != null
    }
    async function setLoginStatus(status) {
        await LocalStorageService.store('isLoggedIn', status)
        setGlobalObject({ ...globalObject, isLoggedIn: status })
    }
    async function updateCurrentLocationInfo() {
        let locationInfo = await LocationService.getCurrentLocation()
            .then(coords => {
                let locationInfo = {
                    coords: {
                        ...coords
                    }
                }
                return locationInfo
            })

        let geoApifyLocationData = await LocationService.getGeoApifyLocationInfo(locationInfo.coords)
        let locationData = {
            ...locationInfo,

            city: geoApifyLocationData.city,
            currentLocationName: geoApifyLocationData.geocode,
            currentLocationGeoCode: geoApifyLocationData,
        }
        setGlobalObject({ ...globalObject, currentLocation: locationData })
        await fetch(Global.SERVER_URL + '/user/updateUserLocation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                region: locationData.city,
                userId: globalObject.currentUser.id,
                currentLatitude: locationData.coords.latitude,
                currentLongitude: locationData.coords.longitude,
                currentLocationName: geoApifyLocationData.geocode
            })
        }).then(res => res.json())

        return locationData


    }
    return (
        <RootContext.Provider value={{
            contextObject: globalObject,
            updateContext: setGlobalObject,
            updateCurrentLocationInfo: updateCurrentLocationInfo,
            setHeaderString: setHeaderString,
            updatePushToken: updatePushToken,
            setCurrentUser: setCurrentUser,
            setLoginStatus: setLoginStatus,
            isLoggedIn: isLoggedIn,
            getCurrentLocationGeocode: getCurrentLocationGeocode,
            getCurrentLocationName: LocationService.getCurrentLocationName(),
            getCurrentUser: () => {
                return globalObject.currentUser
            }
        }}>
            {children}
        </RootContext.Provider>
    );
}

