import React from 'react';
import DrawerRoot from '../navigators/DrawerRoot';
import CustomHeader from '../shared/CustomHeader';
import CreatePost from '../menus/CreatePost';
import Addtags from '../menus/Addtags';
import { createStackNavigator } from '@react-navigation/stack'
import { View } from 'react-native';
import CartListView from '../routed/cartViewUtils/CartListView'
import PostDetails from '../routed/PostDetails'
import UserProfile from '../menus/UserProfile/UserProfile';
const Stack = createStackNavigator()
import { RootContext } from '../contexts/GlobalContext'
import ResultsRoot from '../routed/searchResult/ResultsRoot';
import NotificationsRoot from '../routed/NotificationsRoot';
import OrderDetails from '../routed/OrderDetails';
import DeliveryInfo from '../routed/DeliveryInfo';
import AssignedDeliveries from '../shared/AssignedDeliveries';
import AvailableTagsToSearch from '../routed/searchResult/AvailableTagsToSearch';

function StackNavigatorRoot(props) {

	return <Stack.Navigator initialRouteName='HomeView'>
		<Stack.Screen name='HomeView' options={{
			header: (prop) => {

				return <View></View>
			}
		}} >
			{(childProps) => <DrawerRoot {...childProps} setAuthorizationValue={props.setAuthorizationValue} />}
		</Stack.Screen>


		<Stack.Screen name='Post details' options={{
			header: (prop) => {
				return <CustomHeader goBackOnly={true} stackNavigation={prop.navigation} name={"Post details"} />
			}
		}} component={PostDetails} />


		<Stack.Screen name='Add tags' component={Addtags} />
		<Stack.Screen name='Cart'
			options={{
				header: props => <CustomHeader goBackOnly={true} stackNavigation={props.navigation} name={"Cart"} />
			}}
		>
			{(props) => {

				return <CartListView {...props} />
			}}
		</Stack.Screen>

		<Stack.Screen name='assigned_deliveries_stack'
			options={{
				header: props => <CustomHeader stackNavigation={props.navigation} name={"Assigned deliveries"} />
			}}
		>
			{(props) => {

				return <AssignedDeliveries {...props} />
			}}
		</Stack.Screen>

		<Stack.Screen name='profile'
			options={{
				header: props => <CustomHeader goBackOnly={true} stackNavigation={props.navigation} />
			}}
		>
			{(props) => {

				return <UserProfile stackNav={props.navigation}  {...props} />
			}}
		</Stack.Screen>

		<Stack.Screen name='availableTagList'
			options={{
				header: props => <CustomHeader goBackOnly={true} stackNavigation={props.navigation} />
			}}
		>
			{(props) => {

				return <AvailableTagsToSearch stackNav={props.navigation}  {...props} />
			}}
		</Stack.Screen>
		<Stack.Screen name='notifications'
			options={{
				header: props => <CustomHeader goBackOnly={true} stackNavigation={props.navigation} />
			}}
		>
			{(props) => {

				return <NotificationsRoot stackNav={props.navigation}  {...props} />
			}}
		</Stack.Screen>
		<Stack.Screen name='searchResult'
			options={{
				header: props => <CustomHeader goBackOnly={true} stackNavigation={props.navigation} />
			}}
		>
			{(props) => {

				return <ResultsRoot stackNav={props.navigation}  {...props} />
			}}
		</Stack.Screen>
		<Stack.Screen name='order_details'
			options={{
				header: props => <CustomHeader goBackOnly={true} stackNavigation={props.navigation} />
			}}
		>
			{(props) => {

				return <OrderDetails stackNav={props.navigation}  {...props} />
			}}
		</Stack.Screen>

		<Stack.Screen name='delivery_details'
			options={{
				header: props => <CustomHeader goBackOnly={true} stackNavigation={props.navigation} />
			}}
		>
			{(props) => {

				return <DeliveryInfo stackNav={props.navigation}  {...props} />
			}}
		</Stack.Screen>
	</Stack.Navigator>
}


export default StackNavigatorRoot;