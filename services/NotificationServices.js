import Global from "./Globals";
export default class NotificationService {
    static async getNotifications(currentUserid) {
        let { data } = await fetch(Global.SERVER_URL + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `query{
                    getNotifications(id:"${currentUserid}"){
                        type
                        isSeen
                        message
                        time
                        relatedSchemaId
                        id
                  }
                }`
            })

        }).then(res => res.json());

        return data.getNotifications
    }
    static async updateSeenStatus(notificationId) {
        let { data } = await fetch(Global.SERVER_URL + '/updateSeenStatus/' + notificationId)
            .then(res => res.json());
        return data;
    }
}

