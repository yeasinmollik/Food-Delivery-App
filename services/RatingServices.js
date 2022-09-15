import Global from "./Globals"
export default class RatingServices {
    static async getMyRating(lowerCasedName, userId) {
        let { data } = await fetch(`${Global.SERVER_URL}/ratings/getUserRating`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lowerCasedName: lowerCasedName,
                ratedBy: userId
            })
        }).then(response => response.json())
        return data
    }
    static async getTagRatings(ownerId) {
        let { data } = await fetch(Global.SERVER_URL + '/ratings/getTagRatings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ownerId: ownerId })
        }).then(res => res.json())
        return data
    }
    static async rateItem(lowerCasedName, userid, rating, ownerid, userName) {
        let { data } = await fetch(`${Global.SERVER_URL}/ratings/rateItem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lowerCasedName: lowerCasedName,
                ownerId: ownerid,
                ratedBy: userid,
                rating: rating,
                userName: userName,
                itemName: lowerCasedName
            })
        }).then(response => response.json())
        return data

    }
}