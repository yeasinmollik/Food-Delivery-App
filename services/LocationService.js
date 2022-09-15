import * as Location from 'expo-location';
import Environment from '../Environment'
export default class LocationService {
    static async getCurrentLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return;
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        };
    }
    static async getCurrentLocationName() {
        let currentLocation = await LocationService.getCurrentLocation()

        let data = await LocationService.getLocationGeocode(currentLocation)
        return `${data[0]?.city},${data[0]?.district},${data[0]?.subregion},${data[0]?.region} `
    }


    static async getGeoApifyLocationInfo(location) {

        let { results } = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json&apiKey=${Environment.geoapifyAPIkey}`)
            .then(res => res.json())
        return {
            city: results[0].city ? results[0].city : results[0].county,
            geocode: results[0].formatted,
            street: results[0].street
        }
    }

    static async getCurrentLocationInfoGeoApify() {
        let currentCoords = await LocationService.getCurrentLocation()
        return await LocationService.getGeoApifyLocationInfo(currentCoords)
    }

    static async getLocationGeocode(location) {


        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return;
        }

        return await Location.reverseGeocodeAsync({
            latitude: location.latitude,
            longitude: location.longitude
        })

    }
}