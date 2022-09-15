import React, { useEffect, useState, useRef, useContext } from 'react';
import PostCardRoot from './shared/PostCardRoot';
import { SafeAreaView, ScrollView, RefreshControl, Text, View, StyleSheet } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { AntDesign } from '@expo/vector-icons';
import { RootContext } from './contexts/GlobalContext'
import PostService from '../services/PostService';
import UserService from '../services/UserService';
import AvailableTags from './shared/AvailableTags';
import PostCard from './shared/PostCard';
import LocalUsersRoot from './shared/LocalUsers/LocalUsersRoot';
import SearchBottomSheet from './shared/SearchBottomSheet';
import Global from '../services/Globals';
import SearchingServices from '../services/SearchingServices';
import LocalItemsPostsRoot from './shared/localItemsWithPosts/LocalItemsPostsRoot';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


function Home(props) {

    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const rootContext = React.useContext(RootContext)

    let initialPost = {
        itemName: "Loading..",
        id: -1,
        images: ["https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/articles/2016/02/plate-1508865660.jpg?crop=1xw:0.75xh;center,top&resize=480"],
        tags: "[]",
        owner: {
            facebookToken: {
                name: "Loading..."
            }
        }
    }

    const [refreshing, setRefreshing] = React.useState(false);
    const [localUsers, setLocalUsers] = React.useState([])
    const [localItems, setLocalItems] = React.useState([])
    const [todayPostItems, setTodayPOstItems] = React.useState([])
    async function loadLocalItems(userId, region) {
        let { data } = await fetch(Global.searchServerURL + `/getLocalAvailableItems/${userId}/${region}`)
            .then(response => response.json())
        setLocalItems(data)
    }
    async function loadLocalDatas(location) {
        return Promise.all([
            UserService.getLocalUsers(location.city, rootContext.getCurrentUser().id)
                .then(data => {
                    setLocalUsers(data);
                }),
            SearchingServices.getTodayPostItems(location.city, rootContext.getCurrentUser().id)
                .then(data => {
                    setTodayPOstItems(data)
                })
        ])
    }

    async function loadData() {
        setRefreshing(true)

        rootContext.updateCurrentLocationInfo()
            .then((data) => {
                return Promise.all([loadLocalItems(rootContext.getCurrentUser().id, data.city), loadLocalDatas(data)])
            })
            .then(() => {
                setRefreshing(false)
            })
    }

    const onRefresh = React.useCallback(() => {
        loadData()

    }, []);
    const [searchBottomSheet, setBottomsheetVisible] = React.useState(false)
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            rootContext.updatePushToken(token)
        });
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {

            setNotification(notification);
        });
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        });
        loadData()
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [])
    return (
        <SafeAreaView style={{
            flex: 1,

        }}>
            <SearchBottomSheet {...props} popupBottomSheet={setBottomsheetVisible} bottomSheetVisibility={searchBottomSheet} />
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                style={{

                }}>
                <View style={{
                    overflow: "visible"
                }}>



                    <Text
                        style={{
                            fontSize: 20,
                            marginVertical: 5,
                            paddingLeft: 5
                        }}
                    >Available Items in your area</Text>
                    <AvailableTags localItems={localItems} {...props} />
                    <Text
                        style={{
                            fontSize: 20,
                            marginVertical: 5,
                            paddingLeft: 5
                        }}
                    >Posts from people near you</Text>
                    <LocalItemsPostsRoot {...props} data={todayPostItems} />
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',

                        alignItems: 'center',
                        alignContent: "center",
                        padding: 10
                    }}>
                        <Text
                            style={{
                                fontSize: 20,
                                marginVertical: 5,
                                paddingLeft: 5
                            }}
                        >People near you</Text>
                        <AntDesign onPress={() => {
                            setBottomsheetVisible(true)
                        }} style={{
                            marginLeft: 20
                        }} name="search1" size={24} color="black" />
                    </View>
                    <LocalUsersRoot {...props} users={localUsers} />

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}




async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            sound: true,
        });
    }

    return token;
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },


})

export default Home;