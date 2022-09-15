import React from 'react';
import { Text, TouchableOpacity, View, Image, FlatList } from 'react-native';
import SearchingServices from '../../../services/SearchingServices'
import { RootContext } from '../../contexts/GlobalContext';
import ItemDetailsBottomSheet from '../../shared/ItemDetailsBottomSheet'
import CartServices from '../../../services/CartServices';
function SimilarItemViewRoot(props) {
    const { getCurrentUser, getCurrentLocationGeocode } = React.useContext(RootContext)
    const [similarItemList, setSimilarItemList] = React.useState([])
    React.useEffect(() => {
        SearchingServices.SearhcItems(props.itemName, getCurrentUser().id, getCurrentLocationGeocode().city)
            .then(data => {
                setSimilarItemList(data.filter(item => item.vendor.id != props.currentPostOwnerId))
            })
    }, [])
    return (
        <View style={{
            padding: 10,
            backgroundColor: "#FBF0F5"
        }}>
            <Text style={{
                fontSize: 20,
                fontFamily: "sans-serif"
            }}>Similar items available from other users</Text>
            <FlatList
                horizontal={true}
                data={similarItemList}
                keyExtractor={(item, index) => index}
                renderItem={(item) => <SimilarItemCard {...props} item={item.item} />}
            />
        </View>
    );
}


function SimilarItemCard(props) {
    const [selectedSearchResult, setSearchResultItem] = React.useState(null)
    const [dropDownVisibility, popupBottomSheet] = React.useState(false)
    return (<View>
        <ItemDetailsBottomSheet {...props} bottomSheetVisibility={dropDownVisibility} popupBottomSheet={popupBottomSheet} selectedSearchResult={selectedSearchResult} setSearchResultItem={setSearchResultItem} />
        <TouchableOpacity style={{
            width: 200,
            borderRadius: 10,
            padding: 10,
            margin:5,
            backgroundColor: "#D1E8F3"
        }} onPress={() => {
            setSearchResultItem({
                vendorId: props.item.vendor.id,
                itemName: props.item.itemName
            })
            popupBottomSheet(true)


        }}>
            <Image
                source={{
                    uri: JSON.parse(props.item.getLastPost.images)[0]
                }}
                style={{
                    width: "100%",
                    aspectRatio: 16 / 9
                }}
            />
            <View style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignContent: "center",
                alignItems: "center"
            }}>
                <Image
                    source={{
                        uri: props.item.vendor.personalInfo.profileImageURL
                    }}
                    style={{
                        width: 50,
                        aspectRatio: 1 / 1,
                        borderRadius: 50,
                        margin: 5
                    }}
                />
                <View>
                    <Text>Prepared by:</Text>
                    <Text>{props.item.vendor.name} </Text>
                    <View style={{

                    }}>
                        <Text >Tk. {props.item.unitPrice}</Text>
                        <Text >rating: {props.item.getRatings == 0 ? "unrated" : `${props.item.getRatings}⭐`}</Text>

                    </View>
                </View>
            </View>

        </TouchableOpacity></View>
    )
}

export default SimilarItemViewRoot;