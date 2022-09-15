
const CartServices = {
    storedCookDatas: [],
    storedItems: [],
    clearAll: async function () {
        this.storedCookDatas = []
        this.storedItems = []
    },

    restructureCartGroups: function (cartGroups) {

    },
    isAddedToCart: async function (cookId, lowerCasedName) {
        for (let item of this.storedItems) {
            if (item.lowerCasedName === lowerCasedName && item.vendorId == cookId) {
                return item.amount
            }
        }
        return null
    },
    addItem: async function (cook, item, amount) {
        let isFound = 0
        cook.region = item.region
        item.vendorId = item.vendor.id
        item.vendor = null
        for (let cookInfo of this.storedCookDatas) {
            if (cookInfo.id == cook.id) {
                isFound = 1
                break
            }
        }
        if (!isFound) this.storedCookDatas.push(cook)

        this.storedItems.push({
            ...item,
            amount: amount
        })

    },
    delete: async function (cookId, lowerCasedName) {
        this.storedItems = this.storedItems.filter(item => !(item.lowerCasedName == lowerCasedName && item.vendorId == cookId))
        for (let item of this.storedItems) {
            if (item.vendorId == cookId) return
        }
        this.storedCookDatas = this.storedCookDatas.filter(item => !(item.id == cookId))
    },
    getcartItems: async function () {

        return {
            cooks: this.storedCookDatas,
            items: this.storedItems
        }
    }
}
export default CartServices