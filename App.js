
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { Text, View, Button, Platform, StyleSheet, LogBox } from 'react-native';
import StackNavigatorRoot from './components/navigators/StackNavigatorRoot';
import GlobalContext, { RootContext } from './components/contexts/GlobalContext';
import RegistrationPhase0 from './components/unauthorized/RegistrationPhase0';
import PhoneVerification from './components/unauthorized/PhoneVerification';
import LocalStorageService from './services/LocalStorageService';

import Environment from './Environment';
import firebase from 'firebase'
if (!firebase.apps.length) {
	firebase.initializeApp(Environment.firebaseConfig)
}
export default function App() {

	LogBox.ignoreAllLogs(true)
	const [isAuthorized, setAuthorization] = React.useState(false)
	const [registrationStep, setRegistrationStep] = React.useState(0)
	const [loadWhiteScreen, setWhiteScreen] = React.useState(true)
	function setAuthorizationValue(status) {
		setTimeout(() => {
			setWhiteScreen(false);
			setAuthorization(status == true);
			if (!(status == true)) {
				LocalStorageService.clearAll()

			}
		}, 100)
	}
	React.useEffect(() => {
		LocalStorageService.get('isLoggedIn')
			.then(status => {

				setAuthorizationValue(status)
			})
	}, [])
	return (
		<GlobalContext>

			{!isAuthorized && !loadWhiteScreen && registrationStep == 0 && <RegistrationPhase0 setRegistrationStep={setRegistrationStep} setAuthorization={setAuthorizationValue} />}
			{!isAuthorized && !loadWhiteScreen && registrationStep == 1 && <PhoneVerification setRegistrationStep={setRegistrationStep} setAuthorization={setAuthorizationValue} />}
			{isAuthorized && !loadWhiteScreen && <NavigationContainer>
				<StackNavigatorRoot setAuthorizationValue={setAuthorizationValue} />
			</NavigationContainer>}
			{loadWhiteScreen && <WhiteScreen />}
		</GlobalContext>
	);
}


function WhiteScreen(props) {
	return (<View></View>)
}

const styles = StyleSheet.create({

});
