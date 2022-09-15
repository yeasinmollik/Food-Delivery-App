import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Image, Button, TouchableOpacity, Dimensions, ToastAndroid, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton, TextInput } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { RootContext } from '../contexts/GlobalContext'
import LocationService from '../../services/LocationService';
import PostService from '../../services/PostService';
import Addtags from './Addtags';
import UploadManager from '../../services/UploadManager'
function CreatePost(props) {
	const [modalVisible, setModalVisible] = useState(false);
	const [imagesCount, setImagesCount] = useState(0);
	const isFocused = useIsFocused()
	const rootContext = React.useContext(RootContext)
	const [isNameSelected, setSelectionStatus] = useState(false)
	const [isVaidPost, setPostValidity] = React.useState(false)
	const [item, setItemProperty] = useState({
		itemName: "Please select",
		tags: [],
		images: "",
		unitPrice: "",
		amountProduced: "",
		unitType: "Units",
		country: "",
		district: "",
		city: "",
		latitude: "",
		longitude: "",
		postedOn: "",
		postedBy: "",
	})
	function checkValidity(numImages, isNameFixed) {
		if (isNameFixed == false) { setPostValidity(false); return }
		if (numImages == 0) { setPostValidity(false); return }
		else setPostValidity(1 == 1)
	}

	const [tagSelectionModal, setTagSelectionModalVisibility] = React.useState(false)
	async function setGeoInfo() {
		let currentCoords = await LocationService.getCurrentLocation()
		let { city } = await LocationService.getCurrentLocationInfoGeoApify()
		return {
			...currentCoords,
			region: city
		}
	}
	const [isMarkedAvailable, setAvailability] = React.useState(false)
	useEffect(() => {
		if (isFocused) {
			setItemProperty({ ...item, postedBy: rootContext.getCurrentUser().id })
		}

	}, [isFocused])
	const [images, setImagesList] = useState([
		{
			index: 4,
			body: null,
			type: "",
			base64: ""
		}])
	const [lastImageId, setLastImageId] = useState(0)
	const [unitPrice, setUnitPrice] = React.useState(0)
	async function handleUpload() {

		UploadManager.uploadImageFromDevice()
			.then(newImageURI => {
				if (newImageURI == null) return null
				setImagesList([...images, {
					index: lastImageId,
					body: newImageURI
				}])
				return newImageURI
			}).then((newImageURI) => {
				if (newImageURI == null) return
				if (lastImageId == 3) setLastImageId(5)
				else setLastImageId(lastImageId + 1)
				setImagesCount(imagesCount + 1)
			})
	}
	function removeImage(index) {
		if (imagesCount == 1) setPostValidity(false)
		else checkValidity(imagesCount - 1, isNameSelected)
		setImagesCount(Math.max(0, imagesCount - 1))
		setImagesList(images.filter(image => image.index != index))


	}
	return (
		<View style={{
			flex: 1,
			backgroundColor: "#DFDFDF"
		}}>
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
						<Text style={styles.modalText}>Please wait...</Text>

					</View>
				</View>
			</Modal>
			<Modal
				animationType="slide"
				transparent={1 == 1}
				visible={tagSelectionModal}
				onRequestClose={() => {
					setTagSelectionModalVisibility(!tagSelectionModal);
				}}
			>
				<View style={styles.centeredView1}>
					<View style={styles.modalView1}>
						<Addtags {...props} setSelectedTags={(tagName) => {
							setItemProperty({ ...item, itemName: tagName })
							setTagSelectionModalVisibility(!tagSelectionModal);
							checkValidity(imagesCount, true);
							setSelectionStatus(true)
						}} selectedNames={item.tags} />
					</View>
				</View>
			</Modal>
			<ScrollView style={{

				backgroundColor: "white",
				margin: 10,
				borderRadius: 10,
				overflow: "scroll"
			}}>
				<View style={{
					flex: 1,
					padding: 10
				}}>
					{isFocused && <View>
						<Text></Text>
					</View>}

					{/* images section */}

					<Text style={{
						fontSize: 20
					}}>Add Images (4 max) </Text>

					<FlatList
						horizontal={true}
						data={images}
						keyExtractor={image => image.index}
						renderItem={(image) => {
							return <View style={{
								padding: 10
							}}>
								{image.item.index == 4 && images.length <= 4 && <MaterialCommunityIcons onPress={() => {
									handleUpload()
								}} name="image-plus" size={120} color="black" />}
								{image.item.index != 4 && <View>

									<Entypo name="circle-with-cross" style={{
										position: "absolute",
										top: -10,
										right: -10,
										zIndex: 100,
									}} size={25} onPress={() => { removeImage(image.item.index) }} color="black" />
									<Image style={{
										width: 160,
										aspectRatio: 4 / 3
									}} source={{
										uri: image.item.body
									}} />
								</View>}
							</View>
						}}
					/>
					<Button title='Set item name' onPress={() => {

						setTagSelectionModalVisibility(1 == 1)
					}} />

					<Text style={{
						fontSize: 20
					}}>Item name:{item.itemName}</Text>

					<View style={{
						display: "flex",
						flexDirection: "row",
						alignContent: "center",
						alignItems: "center",
					}}>
						<RadioButton

							value={isMarkedAvailable}
							status={isMarkedAvailable ? 'checked' : 'unchecked'}
							onPress={() => {
								setAvailability(!isMarkedAvailable)
							}}
						/>
						<Text style={{
							fontSize: 20,
							flexWrap: "wrap"
						}}>Item is available today</Text>
					</View>

					{isMarkedAvailable && <TextInput
						onChangeText={text => setUnitPrice(text)}
						label="Price"
						value={unitPrice.toString()}
						keyboardType="numeric"
					/>}

				</View>
			</ScrollView>

			<TouchableOpacity onPress={() => {
				if (!isVaidPost) return
				ToastAndroid.showWithGravity(
					"Uploading...",
					ToastAndroid.SHORT,
					ToastAndroid.BOTTOM
				)
				props.popupBottomSheet(false)
				//setModalVisible(1 == 1)
				setGeoInfo()
					.then((locationData) => {
						let newPost = {
							...item,
							...locationData,
							isMarkedAvailable: isMarkedAvailable,
							unitPrice: unitPrice,
							postedBy: rootContext.getCurrentUser().id,
							tags: JSON.stringify(item.tags),
							postedOn: (new Date()) * 1,
							lowerCasedName: item.itemName.toLowerCase()
						};
						return newPost
					})
					.then((newPost) => {
						//setModalVisible(true);

						let urls = []
						UploadManager.uploadMany(images.filter(image => image.index != 4).map(image => image.body),
							`post/`,
							`${rootContext.getCurrentUser().id}/${item.itemName}/${(new Date()) * 1}/image-`
							, 0, urls,
							(urls) => {
								PostService.createPost({ ...newPost, images: JSON.stringify(urls) })
									.then(() => {

										ToastAndroid.showWithGravity(
											"Post created succesfully!",
											ToastAndroid.SHORT,
											ToastAndroid.BOTTOM
										)

										if (props.onComplete) props.onComplete()
										//setModalVisible(false);
									})
							}
						)


					})
			}}>
				<View style={{
					backgroundColor: isVaidPost ? "#FFA500" : "#809599",
					height: 60,
					justifyContent: "center",
					alignItems: "center"
				}}>
					<Text style={{
						fontSize: 20
					}}> POST </Text>
				</View>
			</TouchableOpacity>
		</View >
	);
}
const styles = StyleSheet.create({
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
	centeredView1: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height * .8,
	},
	modalView1: {
		width: Dimensions.get('window').width * .8,
		maxHeight: Dimensions.get('window').height * .8,
		height: '100%',
		backgroundColor: "white",
		borderRadius: 20,


		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2
	},
	buttonOpen: {
		backgroundColor: "#F194FF",
	},
	buttonClose: {
		backgroundColor: "#2196F3",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	},
	modalText: {
		textAlign: "center"
	}
})
export default CreatePost;