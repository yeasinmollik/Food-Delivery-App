import Global from "./Globals"
export default class OTPServices {
    /**
     * 
     * @param {String} phone 
     */
    static async getOTP(phone) {
        let { data } = await fetch(Global.SERVER_URL + '/user/requestOTP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: phone
            })
        }).then(response => response.json())
        return data

    }
    static async confirmOTP(newUser, phone, otp, facebookId) {
        let { data } = await fetch(Global.SERVER_URL + '/user/confirmOTP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: phone,
                user: newUser,
                otp: otp,
                facebookId: facebookId
            })
        }).then(response => response.json())
        return data
    }
}