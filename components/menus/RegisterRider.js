import React from 'react';
import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RootContext } from '../contexts/GlobalContext';
import { RadioButton, TextInput } from 'react-native-paper';
import UserService from '../../services/UserService';

function RegisterRider(props) {
    const { setCurrentUser, setHeaderString, getCurrentUser } = React.useContext(RootContext)
    React.useEffect(() => {
        setHeaderString("Become a rider")
    }, [])
    const [isAccepted, setAcceptance] = React.useState(false)
    return (
        <View style={{
            flex: 1
        }}>
            <View style={{
                flex: 1,
                margin: 10
            }}>
                <Text>Terms and Conditions</Text>
                <ScrollView style={{
                    margin: 10,
                    padding: 5,
                    borderWidth: 2,
                    borderColor: "black"
                }}>
                    <Text>The terms and conditions for becoming a rider is simple..</Text>
                </ScrollView>
            </View>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
            }}>
                <RadioButton

                    value={isAccepted}
                    status={isAccepted === true ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setAcceptance(!isAccepted);
                    }}
                />
                <Text style={{

                    flexWrap: "wrap"
                }}>I accept the terms and conditions</Text>
            </View>
            <TouchableOpacity onPress={() => {
                if (isAccepted) {
                    UserService.registerRider(getCurrentUser().id)
                        .then(() => {
                            setCurrentUser({
                                ...getCurrentUser(),
                                isRider: 1
                            })
                            return 1
                        })
                        .then(() => {
                            ToastAndroid.showWithGravity(
                                "You are now a rider",
                                ToastAndroid.SHORT,
                                ToastAndroid.BOTTOM
                            )
                            props.drawerNav.navigate("Home")
                        })
                }

            }}>
                <View style={[styles.footer, {
                    backgroundColor: !isAccepted ? "#c4c4c4" : "#FFA500",
                }]}>
                    <Text>Register</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({

    footer: {

        height: 60,
        justifyContent: "center",
        alignItems: "center"
    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: Dimensions.get('window').height * 0.33,
        borderRadius: 10
    },
})

export default RegisterRider;