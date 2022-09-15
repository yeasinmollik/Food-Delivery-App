
import { Text, View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import React from 'react'
import { Entypo } from '@expo/vector-icons';
import Home from '../Home';
import SearhcItemsRoot from '../routed/search/SearhcItemsRoot';
import CreateItem from '../routed/CreateItem';
const Tab = createBottomTabNavigator();

export default function TabNavigator(props) {
    return (

        <Tab.Navigator
            initialRouteName='Gallery'
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {

                    let iconName;
                    let iconSize = focused ? 30 : 24
                    if (route.name == 'Gallery') {
                        iconName = 'home';
                    } else if (route.name === 'Search items') {
                        iconName = 'magnifying-glass';
                    }
                    else {
                        iconName = "megaphone"
                    }

                    // You can return any component that you like here!
                    return <Entypo name={iconName} size={iconSize} color="black" />
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen options={{
                header: (prop) => {
                    return <View></View>
                }
            }} name="Gallery" >
                {(childProp) => <Home {...props} tabNav={childProp.navigation} />}

            </Tab.Screen>
            <Tab.Screen options={{
                header: (prop) => {
                    return <View></View>
                }
            }} name="Search items"  >
                {(childProp) => <SearhcItemsRoot tabNav={childProp.navigation} tabNavRoute={childProp.route} {...props} />}
            </Tab.Screen>
            <Tab.Screen options={{
                header: (prop) => {
                    return <View></View>
                }
            }} name="Express yourself!">
                {(childProp) => <CreateItem tabNav={childProp.navigation} tabNavRoute={childProp.route} {...props} />}
            </Tab.Screen>
        </Tab.Navigator>

    );
}


