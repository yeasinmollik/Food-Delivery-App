import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal, StyleSheet, Dimensions } from 'react-native'
import LocalStorageService from '../../services/LocalStorageService';
import { TextInput } from 'react-native-paper'
import OTPServices from '../../services/OTPServices';
import { RootContext } from '../contexts/GlobalContext';

function PhoneVerification({ setAuthorization }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [waitModalVisible, setWaitModalVisible] = React.useState(false)
    const [tempUser, setTempUser] = React.useState({
        name: "",
        id: "",
        profilePicture: "abcd"
    })
    const [errorMessage, setErrorMessage] = React.useState(<Text>abcd</Text>)
    const [isReadonly, setReadability] = React.useState(false)
    const [isOTPAvailable, setAvailability] = React.useState(false)
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [OTP, setOTP] = React.useState("")

    React.useEffect(() => {
        LocalStorageService.get('tempUser')
            .then(data => {
                setTempUser({ ...data, profilePicture: (`https://graph.facebook.com/${data.id}/picture?type=large`) })
            })
    }, [])
    const rootContext = React.useContext(RootContext)
    function requestOTP() {
        setWaitModalVisible(true)
        OTPServices.getOTP(phoneNumber)
            .then((data) => {
                if (!data) {
                    setWaitModalVisible(false);
                    setErrorMessage(<View>
                        <Text style={styles.modalText}>Phone number is already used</Text>
                        <Text style={styles.modalText}>Please use some other phone number</Text>
                    </View>)
                    setModalVisible(1 == 1)
                }
                else {
                    setWaitModalVisible(false);
                    setReadability(true)
                    setAvailability(true)
                }
            })
    }
    function validateOTP() {

        OTPServices.confirmOTP({
            name: tempUser.name,
            profileImageURL: tempUser.profilePicture
        }, phoneNumber, OTP, tempUser.id)
            .then((data) => {
                if (!data) {
                    setErrorMessage(<View>
                        <Text style={styles.modalText}>Invalid OTP</Text>
                        <Text style={styles.modalText}>Please provide a valid OTP</Text>
                    </View>)
                }
                else {
                    data.facebookToken = JSON.parse(data.facebookToken)
                    data.isRider = 0

                    LocalStorageService.store('currentUser', (data))
                        .then(async () => {

                            rootContext.setLoginStatus(true)
                                .then(() => {
                                    rootContext.setCurrentUser(data)
                                })
                        })
                        .then(() => {
                            setTimeout(() => {
                                setAuthorization(true)
                            }, 300)

                        })



                }
            })
    }
    return (
        <View style={{
            flex: 1
        }}>
            <View style={{
                padding: 20,
                flex: 1,
            }}>
                <Text style={{
                    fontSize: 40,
                    fontFamily: "sans-serif-thin",
                    marginVertical: 20
                }}>Oregano🍽️</Text>

                <Text style={{
                    fontSize: 20
                }}>Hello!</Text>

                <ScrollView>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center",
                        marginVertical: 20
                    }}>
                        <Image style={{
                            width: 90,
                            aspectRatio: 1,
                            borderRadius: 90
                        }} source={{ uri: tempUser.profilePicture }} />
                        <Text style={{
                            fontSize: 20,
                            marginLeft: 10,
                            fontFamily: 'sans-serif-light'
                        }}>{tempUser.name}</Text>
                    </View>
                    <View>
                        <TextInput
                            label="Your phone"
                            keyboardType="numeric"
                            editable={!isReadonly}
                            value={phoneNumber}
                            style={{
                                margin: 10
                            }}
                            onChangeText={text => setPhoneNumber(text)}
                        />
                        {isOTPAvailable && <TextInput
                            label="OTP"
                            keyboardType="numeric"
                            style={{
                                margin: 10
                            }}
                            value={OTP}
                            onChangeText={text => setOTP(text)}
                        />}
                    </View>
                </ScrollView>
            </View>
            {!isOTPAvailable && <TouchableOpacity onPress={() => {
                requestOTP()
            }}>
                <View style={[styles.footer, {
                    backgroundColor: "#FFA500",
                }]}>
                    <Text>Request OTP</Text>
                </View>
            </TouchableOpacity>}
            {isOTPAvailable && <View style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",


            }}>
                <TouchableOpacity style={[styles.footer, {
                    backgroundColor: "#FFA500",
                    width: Dimensions.get('window').width * 48 / 100,
                    borderRadius: 10
                }]} onPress={() => {
                    validateOTP()
                }}>
                    <View>
                        <Text>Confirm OTP</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.footer, {
                    backgroundColor: "#FFA500",
                    width: Dimensions.get('window').width * 48 / 100,
                    borderRadius: 10
                }]} onPress={() => {
                    requestOTP()
                }}>
                    <View>
                        <Text>Resend OTP</Text>
                    </View>
                </TouchableOpacity>
            </View>}



            <ErrorModal modalVisible={modalVisible} setModalVisible={setModalVisible} errorMessage={errorMessage} />
            <WaitModal waitModalVisible={waitModalVisible} />
        </View>
    );
}
const styles = StyleSheet.create({

    footer: {

        height: 60,
        justifyContent: "center",
        alignItems: "center",

    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: Dimensions.get('window').height * 0.33,
        borderRadius: 10
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


function ErrorModal({ modalVisible, setModalVisible, errorMessage }) {
    return (
        <Modal
            animationType="slide"
            transparent={1 == 1}
            visible={modalVisible}

        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {errorMessage}
                    <TouchableOpacity style={{
                        backgroundColor: "#D2F9D4",
                        padding: 10,
                        margin: 10
                    }} onPress={() => {
                        setModalVisible(!modalVisible);
                    }}>
                        <Text>Okay</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </Modal>
    )
}

function WaitModal({ waitModalVisible, setWaitModalVisible }) {
    return (
        <Modal
            animationType="slide"
            transparent={1 == 1}
            visible={waitModalVisible}

        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Please wait..</Text>


                </View>
            </View>

        </Modal>
    )
}

export default PhoneVerification;