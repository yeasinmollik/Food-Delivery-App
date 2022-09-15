import Global from "./Globals"

export default class DeliveyService {
    static async markDelivered(orderId, buyerId) {
        let { data } = await fetch(Global.SERVER_URL + `/orders/markDelivered`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId: orderId,
                buyerId: buyerId
            })
        }).then(res => res.json())
        return data
    }
    static async markPickedUp(orderId, buyerId) {
        let { data } = await fetch(Global.SERVER_URL + `/orders/markPickedUp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId: orderId,
                buyerId: buyerId
            })
        }).then(res => res.json())
        return data
    }
    static async getAssignedDeliveries(userId) {
        let { data } = await fetch(Global.SERVER_URL + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `query{
                            getAssignedOrders(id:"${userId}"){
                                id
                                time
                                status
                                pickupLocationGeocode
                                dropLocationGeocode
                                itemsCount
                            }
                        }`
            })
        }).then(res => res.json())
        return data.getAssignedOrders
    }

    static async getDeliveredOrders(userId) {
        let { data } = await fetch(Global.SERVER_URL + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `query{
                        getDeliveredOrders(id:"${userId}"){
                                id
                                time
                                status
                                pickupLocationGeocode
                                dropLocationGeocode
                                itemsCount
                                isPaid
                            }
                        }`
            })
        }).then(res => res.json())
        return data.getDeliveredOrders
    }
}