
import Environment from "../Environment";
import Global from "./Globals";
const results = [
    {
        itemName: "Cake",
        rating: "3.5",
        price: 400,
        ratedBy: 5,
        vendor: {
            name: "Nusrat Jahan Urme",
            Id: "625502c8769f795e30e79b2a",
            facebookToken: {
                profileImageURL: "https://graph.facebook.com/656455615445264/picture?type=large"

            },
            expoPushToken: "ExponentPushToken[7VU08nDS7lMz5Dy2s30Qwv]",

        },
        getLastPost: {

            lastPost: {
                images: ["https://upload.wikimedia.org/wikipedia/commons/0/04/Pound_layer_cake.jpg"]
            }
        }
    }
]

const searchResultDetails = {
    itemName: "Cake",
    lowerCasedName: "cake",
    amountProduced: 5,
    vendor: {
        name: "Nusrat Jahan Urme",
        Id: "625502c8769f795e30e79b2a",
        facebookToken: {
            profileImageURL: "https://graph.facebook.com/656455615445264/picture?type=large"

        },
        expoPushToken: "ExponentPushToken[7VU08nDS7lMz5Dy2s30Qwv]",

    },
    price: 450,
    ratedBy: 5,
    rating: 4.5,
    relatedPosts: [
        {
            postedOn: (new Date()) * 1,
            images: ["https://upload.wikimedia.org/wikipedia/commons/0/04/Pound_layer_cake.jpg", "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmlydGhkYXklMjBjYWtlc3xlbnwwfHwwfHw%3D&w=1000&q=80"],
            Id: "123"
        }
    ]

}

export default class SearchingServices {

    static async searchLocation(query) {
        let data = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${Environment.geoapifyAPIkey}`)
            .then(response => response.json())

        data = data.features
        data = data.map((element, index) => {
            return {
                name: element.properties.formatted,
                street: element.properties.street,
                coords: {
                    latitude: element.properties.lat,
                    longitude: element.properties.lon,
                },
                city: element.properties.city
            }
        })
        return data
    }

    static async SearhcItems(itemName, currentUserId, region) {
        let { data } = await fetch(Global.searchServerURL + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `query{
                searchByName(itemname:"${itemName}",userId:"${currentUserId}",region:"${region}"){
                  vendor{
                    id
                    name
                    facebookToken 
                    expoPushToken
                    personalInfo{
                       
                        profileImageURL
                      }
                  }
                  getRatings
                  rating
                  ratedBy
                  lowerCasedName
                  itemName
                  unitPrice
                  getLastPost{
                    images
                  }
                }
              }`})
        }).then(res => res.json())
        return data.searchByName
    }
    static async getDetails(sellerId, itemName) {
        let { data } = await fetch(Global.searchServerURL + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `query{
                    getItemDetails(tag:"${itemName}" ,userId:"${sellerId}"){
                      itemName
                      lowerCasedName
                      region
                      vendor{
                        name
                        id
                        personalInfo{
                            profileImageURL
                          }
                        currentLocationName
                        currentLatitude
                        currentLongitude
                      }
                      relatedPost{
                        id
                        images
                        postedOn
                      }
                      rating
                      ratedBy
                      unitPrice
                       
                    }
                       
                  }`})
        }).then(res => res.json())
        return data.getItemDetails
    }

    static async getTodayPostItems(region, userId) {
        let day = Math.floor(((new Date()) * 1) / (24 * 3600 * 1000))

        let { data } = await fetch(`${Global.searchServerURL}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `query{
                        getLocalItemsInfo(day:${day},region:"${region}"){
                            itemName
                            unitPrice
                            rating
                            numPeopleRated
                            isAvailable
                            getTodayPosts{
                                images
                                postedOn
                                id
                            }
                            vendor{
                                id
                                personalInfo{
                                    name
                                    profileImageURL
                                
                                }
                            }
                           
                        }
                      }`
            })

        }).then(res => res.json())
        data = data.getLocalItemsInfo
        let uniqueItems = {}
        for (let item of data) {
            if (item.getTodayPosts.length != 0) {
                if (item.vendor.id == userId) continue
                if (uniqueItems[item.itemName] == null) uniqueItems[item.itemName] = []

                let content = {
                    vendor: item.vendor,
                    posts: item.getTodayPosts,
                    unitPrice: item.unitPrice,
                    rating: item.rating,
                    numPeopleRated: item.numPeopleRated,
                    isAvailable: item.isAvailable
                }

                uniqueItems[item.itemName].push(content)
            }
        }
        let categorizedData = []
        for (let category in uniqueItems) {
            categorizedData.push({
                itemName: category,
                info: uniqueItems[category]
            })
        }
        return categorizedData

    }
}