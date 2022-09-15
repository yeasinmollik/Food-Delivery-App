import RatingServices from './RatingServices'
import UserService from './UserService'
import Global from "./Globals";
import LocationService from './LocationService';

export default class OrderServices {

    static async requestRider(orderid) {
        let { data } = await fetch(Global.SERVER_URL + `/orders/requestRider/${orderid}`).then(response => response.json())
        return data
    }
    static async getPreviousOrders(buyerId) {
        let { data } = await fetch(Global.SERVER_URL + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `query{
                    getPreviousOrders(buyerId:"${buyerId}"){
                        status
                        id
                        time
                        seller{
                          id
                          personalInfo{
                            profileImageURL
                            name
                             
                          }
                        }
                        orderedItems{
                            amount
                            itemName
                            lowerCasedName
                            lastPost{
                              id
                              images
                              postedBy
                            }
                          }
                        }
                  }`
            })
        }).then(res => res.json())

        data = data.getPreviousOrders

        let promises = []
        for (let n = 0; n < data.length; n++) {
            for (let k = 0; k < data[n].orderedItems.length; k++) {
                promises.push(OrderServices.setRating(data, n, k, buyerId))
            }
        }
        await Promise.all(promises)

        return data
    }

    static async setRating(datas, row, col, buyerId) {
        let data = await RatingServices.getMyRating(datas[row].orderedItems[col].lowerCasedName, buyerId)
        datas[row].orderedItems[col].rating = data?.rating ? data.rating : 0
    }

    static async rejectOrderItem(orderId, postId, shouldGenerateNotification, itemName, sellerName, buyerId) {
        let { data } = await fetch(Global.SERVER_URL + `/orders/rejectOrderItem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId: orderId,
                postId: postId,
                shouldGenerateNotification: shouldGenerateNotification,
                buyerId: buyerId,
                notificationMessage: `${sellerName} is unable to provide the ${itemName} you've ordered.`
            })
        }).then(response => response.json())
        return data;
    }
    static async rejectOrder(orderId, items, sellerName, buyerId) {
        let promises = []
        for (let item of items) {
            promises.push(OrderServices.rejectOrderItem(orderId, item.postid, 0, item.itemName, sellerName, buyerId))
        }
        await Promise.all([...promises, fetch(Global.SERVER_URL + '/orders/rejectOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId: orderId,
                buyerId: buyerId,
                notificationMessage: `Unfortunately, ${sellerName} is unable to accept your orders.`
            })
        }).then(res => res.json())])

        return

    }
    static async getReceivedOrderInfo(orderId) {
        let { data } = await fetch(Global.SERVER_URL + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `query{
                    getOrderInfo(id:"${orderId}"){
                        buyer{
                            facebookToken
                            id
                            personalInfo{
                                name
                                profileImageURL
                                coverPhotoURL
                            }
                            phone
                        }
                            orderedItems{
                                lowerCasedName
                                lastPost{
                                  images
                                }
                                amount
                                status
                                totalPrice
                            }
                         
                        drop_lat
                        drop_long
                        status
                        dropLocationGeocode
                        id
                        pickupLat
                        pickupLong
                        pickupLocationGeocode
                        time
                        deliveryCharge
                        totalCharge
                    }
                }`
            })
        }).then(res => res.json())
        return data.getOrderInfo
    }
    static async getOrderInfo(orderId) {

        let { data } = await fetch(Global.SERVER_URL + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `query{
                    getOrderInfo(id:"${orderId}"){
                        buyer{
                            facebookToken
                            id
                            personalInfo{
                                name
                                profileImageURL
                                coverPhotoURL
                            }
                            phone
                        }
                        seller{
                            facebookToken
                            id
                            personalInfo{
                                name
                                profileImageURL
                                coverPhotoURL
                            }
                            phone
                        }
                        
                            orderedItems{
                                lowerCasedName
                                lastPost{
                                  images
                                }
                                amount
                                status
                            }
                         
                        drop_lat
                        drop_long
                        status
                        dropLocationGeocode
                        id
                        pickupLat
                        pickupLong
                        pickupLocationGeocode
                        time
                        totalCharge
    					deliveryCharge
                    }
                }`
            })
        }).then(res => res.json())
        return data.getOrderInfo
    }



    static async acceptOrders(orderId, rejectedItems, acceptedItems, sellerName, buyerId) {
        let promises = [];
        for (let item of rejectedItems) {
            promises.push(OrderServices.rejectOrderItem(orderId, item.postid, 1, item.itemName, sellerName, buyerId))
        }
        promises.push(fetch(Global.SERVER_URL + '/orders/acceptOrder/' + orderId)
            .then(response => response.json())
            .catch(e => {
            })
        )
        await Promise.all(promises)
        return
    }


    static async createOrder(groupInfo, orderLocationInfo, buyerName, buyerId, itemsCount, orderCity) {
        let notificationMessage = `${buyerName} has ordered some of your products. Please check.`
        console.log("orderService", groupInfo)
        let { geocode } = await LocationService.getGeoApifyLocationInfo({
            latitude: groupInfo.currentLatitude,
            longitude: groupInfo.currentLongitude
        })

        let orderInfo = await fetch(Global.SERVER_URL + '/orders/createNewOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                drop_lat: orderLocationInfo.latitude,
                drop_long: orderLocationInfo.longitude,
                dropLocationGeocode: orderLocationInfo.dropLocationGeocode,
                buyerId: buyerId,
                sellerId: groupInfo.cookId,
                riderId: null,
                status: 0,
                charge: 30,
                city: orderCity,
                time: (new Date()) * 1,
                pickupLat: groupInfo.currentLatitude,
                pickupLong: groupInfo.currentLongitude,
                pickupLocationGeocode: geocode,
                notificationMessage: notificationMessage,
                itemsCount: itemsCount,
                deliveryCharge: groupInfo.deliveryCharge,
                totalCharge: groupInfo.totalCharge
            })
        }).then(res => res.json())
        return orderInfo.data

    }
    static async createOrderItem(orderItem, orderId) {
        let orderItemData = await fetch(Global.SERVER_URL + '/graphql', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                query: `mutation{
                    createOrderItem(
                      orderId:"${orderId}",
                      itemName:"${orderItem.itemName}",
                      lowerCasedName:"${orderItem.lowerCasedName}",
                      amount:${orderItem.amount},
                        totalPrice:${orderItem.amount * orderItem.unitPrice}
                    ){
                        orderId
                    }
                  }`
            })
        }).then(res => res.json())
        return orderItemData.data.createOrderItem
    }
    static async placeOrders(orderItems, orderLocationInfo, buyerName, buyerId, orderCity) {
        for (let group of orderItems) {
            let newOrderId = await OrderServices.createOrder({
                "cookId": group.id,
                "currentLongitude": group.currentLongitude,
                currentLatitude: group.currentLatitude,
                "region": group.region,
                deliveryCharge: group.deliveryCharge,
                totalCharge: group.totalCharge
            }, orderLocationInfo, buyerName, buyerId, group.items.length, orderCity)
            let promises = []
            for (let item of group.items) {
                promises.push(OrderServices.createOrderItem(item, newOrderId._id))
            }
            await Promise.all(promises)

        }

    }

    static async getReceivedOrders(sellerId) {
        let { data } = await fetch(Global.SERVER_URL + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `query{
                    getReceivedOrders(id:"${sellerId}"){
                      id
                      time
                      pickupLat
                      pickupLong
                      drop_lat
                      drop_long
                      status
                      pickupLocationGeocode
                      dropLocationGeocode
                      buyer{
                        id
                        name
                        personalInfo{
                          profileImageURL
                        }
                         
                      }
                    }
                  }`
            })
        }).then(res => res.json())
        return data.getReceivedOrders
    }
}


