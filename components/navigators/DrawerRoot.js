import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,

} from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import React from 'react';
import Header from '../shared/Header';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UserProfile from '../menus/UserProfile/UserProfile'
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Image, StyleSheet, Text, TouchableOpacity, Modal, ToastAndroid } from 'react-native';
import CustomHeader from '../shared/CustomHeader';
import { RootContext } from '../contexts/GlobalContext';
import AssignedDeliveries from '../shared/AssignedDeliveries';
import DeliveryHistory from '../menus/DeliveryHistory';
import OrderHistory from '../menus/OrderHistory/OrderHistory';
import RegisterRider from '../menus/RegisterRider';
import { } from 'react-native-gesture-handler';
import UserService from '../../services/UserService';
import TabNavigator from './TabNavigator';
import ReceivedOrdersRoot from '../menus/receivedOrders/ReceivedOrdersRoot';
const Drawer = createDrawerNavigator();
export default function DrawerRoot({ navigation, setAuthorizationValue }) {
	const { contextObject } = React.useContext(RootContext)

	const stackNavigator = navigation
	return (
		<Drawer.Navigator
			initialRouteName='Home'
			drawerContent={(props) => {
				return <DrawerContentRoot {...props} setAuthorizationValue={setAuthorizationValue} />
			}}
		>
			<Drawer.Screen options={{
				header: (prop) => {
					return <Header {...prop} />
				},
				drawerIcon: (props) => <Entypo name="home" size={24} color="black" />

			}} name="Home">
				{props => (<TabNavigator drawerNav={props.navigation} stackNav={stackNavigator} />)}
			</Drawer.Screen>
			<Drawer.Screen options={{
				header: (prop) => {
					return <CustomHeader goBackOnly={true} name={"Profile"} stackNavigation={stackNavigator} drawerNavigation={prop.navigation} />
				},

				drawerIcon: (props) => <Entypo name="user" size={24} color="black" />

			}} name="Profile" >
				{props => <UserProfile drawerNav={props.navigation} stackNav={stackNavigator} />}
			</Drawer.Screen>

			<Drawer.Screen options={{
				drawerItemStyle: {

					display: "flex",
					justifyContent: "space-between"
				},

				header: (prop) => {
					return <CustomHeader goBackOnly={true} name={"Profile"} stackNavigation={stackNavigator} drawerNavigation={prop.navigation} />
				},
				drawerIcon: (props) => <MaterialCommunityIcons name="chef-hat" size={24} color="black" />


			}} name="Received Orders" >
				{props => <ReceivedOrdersRoot drawerNav={props.navigation} stackNav={stackNavigator} />}
			</Drawer.Screen>




			{contextObject.currentUser != null && contextObject.currentUser.isRider == 1 && <Drawer.Screen options={{
				header: (prop) => {
					return <CustomHeader name={"Assigned Deliveries"} stackNavigation={stackNavigator} drawerNavigation={prop.navigation} />
				},
				drawerIcon: (props) => <MaterialIcons name="assignment-turned-in" size={24} color="black" />
			}} name="Assigned deliveries" >
				{props => <AssignedDeliveries drawerNav={props.navigation} stackNav={stackNavigator} />}
			</Drawer.Screen>}

			{contextObject.currentUser != null && contextObject.currentUser.isRider == 0 && < Drawer.Screen options={{
				header: (prop) => {
					return <CustomHeader name={"Become a rider"} stackNavigation={stackNavigator} drawerNavigation={prop.navigation} />
				},
				drawerIcon: (props) => <MaterialIcons name="delivery-dining" size={24} color="black" />
			}} name="Become a rider" >
				{props => <RegisterRider drawerNav={props.navigation} stackNav={stackNavigator} />}
			</Drawer.Screen>}

			{contextObject.currentUser != null && contextObject.currentUser.isRider == 1 && <Drawer.Screen options={{
				header: (prop) => {
					return <CustomHeader name={"Deliveries history"} stackNavigation={stackNavigator} drawerNavigation={prop.navigation} />
				},
				drawerIcon: (props) => <MaterialCommunityIcons name="motorbike" size={24} color="black" />
			}} name="Deliveries history" >
				{props => <DeliveryHistory drawerNav={props.navigation} stackNav={stackNavigator} />}
			</Drawer.Screen>}

			<Drawer.Screen options={{
				header: (prop) => {
					return <CustomHeader name={"Order history"} stackNavigation={stackNavigator} drawerNavigation={prop.navigation} />
				},
				drawerIcon: (props) => <MaterialCommunityIcons name="format-list-checkbox" size={24} color="black" />
			}} name="Order History" >
				{props => <OrderHistory drawerNav={props.navigation} stackNav={stackNavigator} />}
			</Drawer.Screen>

		</Drawer.Navigator>

	);
}

function DrawerContentRoot(props) {
	const { getCurrentUser, setCurrentUser } = React.useContext(RootContext)
	const [modalVisible, setModalVisible] = React.useState(false)
	const [unRegisterModal, toggleUnregisterModal] = React.useState(false)
	return (
		<SafeAreaView style={{ flex: 1 }}>

			<Modal
				animationType="slide"
				transparent={1 == 1}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>Are you sure?</Text>
						<View style={{
							display: 'flex',
							flexDirection: "row",
							justifyContent: "space-between"
						}}>
							<TouchableOpacity onPress={() => {
								setModalVisible(!modalVisible);
								UserService.logout(getCurrentUser().id)
									.then(data => {
										props.setAuthorizationValue(false)
										ToastAndroid.showWithGravity(
											"Hoping to see you again!",
											ToastAndroid.SHORT,
											ToastAndroid.BOTTOM
										)
									})

							}} style={{
								padding: 10,
								borderRadius: 10,
								margin: 10,
								backgroundColor: "#FED6D2"
							}}>
								<Text>Yes</Text>
							</TouchableOpacity>
							<TouchableOpacity style={{
								padding: 10,
								borderRadius: 10,
								margin: 10,
								backgroundColor: "#90FCA9"
							}} onPress={() => {
								setModalVisible(!modalVisible);
							}}>
								<Text>No</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>


			<Modal
				animationType="slide"
				transparent={1 == 1}
				visible={unRegisterModal}
				onRequestClose={() => {
					toggleUnregisterModal(!unRegisterModal);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>Are you sure?</Text>
						<View style={{
							display: 'flex',
							flexDirection: "row",
							justifyContent: "space-between"
						}}>
							<TouchableOpacity onPress={() => {
								toggleUnregisterModal(false);
								UserService.unRegister(getCurrentUser().id)
									.then(data => {
										setCurrentUser({
											...getCurrentUser(),
											isRider: 2
										})

										ToastAndroid.showWithGravity(
											"You are no longer a rider",
											ToastAndroid.SHORT,
											ToastAndroid.BOTTOM
										)
									})

							}} style={{
								padding: 10,
								borderRadius: 10,
								margin: 10,
								backgroundColor: "#FED6D2"
							}}>
								<Text>Yes</Text>
							</TouchableOpacity>
							<TouchableOpacity style={{
								padding: 10,
								borderRadius: 10,
								margin: 10,
								backgroundColor: "#90FCA9"
							}} onPress={() => {
								toggleUnregisterModal(!unRegisterModal);
							}}>
								<Text>No</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<View style={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between",
				paddingHorizontal: 10
			}} >
				{getCurrentUser() && <Image style={styles.sideMenuProfileIcon} source={{
					uri: getCurrentUser().facebookToken.profileImageURL
				}} />}
				{getCurrentUser() && <Text
					style={{
						paddingVertical: 15
					}}
				> {getCurrentUser().facebookToken.name} </Text>}
			</View>
			<DrawerContentScrollView>
				<DrawerItemList {...props} />
			</DrawerContentScrollView>
			{getCurrentUser() && getCurrentUser().isRider == 1 && <View style={{

				padding: 10,
				backgroundColor: "#FFF4F3",
				marginHorizontal: 20,
				marginBottom: 10
			}} >
				<TouchableOpacity onPress={() => {
					toggleUnregisterModal(true);
				}}>
					<Text>Unregister rider</Text>
				</TouchableOpacity>
			</View>}


			<View style={{

				padding: 10,
				backgroundColor: "#FFF4F3",
				marginHorizontal: 20,
				marginBottom: 20
			}} >
				<TouchableOpacity onPress={() => {
					setModalVisible(true);
				}}>
					<Text>Log out</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}


const styles = StyleSheet.create({
	sideMenuProfileIcon: {
		resizeMode: 'center',
		width: 50,

		borderRadius: 50,
		aspectRatio: 1
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5
	},
})