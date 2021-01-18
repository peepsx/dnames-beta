


var api = "https://api.dnames.network/users"
//var api = "http://localhost:3000/users"

let cryptoPaymentApi = api + "/cryptopayment"
let paypalPaymentApi = api + "/paypalpayment"
let registerApi = api + "/registeraccount"

module.exports = {
    cryptoPaymentApi,
    paypalPaymentApi,
    registerApi
}