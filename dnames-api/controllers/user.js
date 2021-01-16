
const Paypalpayment = require('../modals/paypalpayment')
const CryptPaymentmodal = require('../modals/cryptopayment')
const RegisterModal = require('../modals/Register');
// ----------register------------------
const Rsn = require('arisenjsv1')
const config_arisen = require('../config/arisen')

const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const payPalClient = require('../paypalclient')
const axios = require('axios');

require('dotenv').config()



class Users {

  register(req, res) {

    let { domainName, owner, active, dltd, transaction_ID, paymentMode, buttonID } = req.body;
    console.log('reqbodyRegister========', domainName, owner, active, dltd, transaction_ID, paymentMode)

    if (!domainName || !owner || !active || !dltd || !transaction_ID || !paymentMode)
      return res.status(401).send({ success: false, message: "Fields are missing" })

    RegisterModal.findOne({ domainName: domainName }).then((repo) => {

      if (repo) {
        return res.send({ status: false, message: "Domain name already exist,Try with another!" })
      } else {

        if (paymentMode == "Paypal") {
          Paypalpayment.findOne({ transactionId: transaction_ID })
            .then((respos) => {

              if (!respos) {
                return res.send({ status: false, message: "Payment not done." })
              }

              else {

                if (respos.domainName == domainName) {
                  let newregistermodal = new RegisterModal({
                    domainName: domainName,
                    owner: owner,
                    active: active,
                    dltd: dltd,
                    transaction_ID: transaction_ID,
                    paymentMode: paymentMode
                  })


                  config_arisen.keyname(dltd).then((response) => {

                    // if there is a + in the account name, stake extra CPU/NET.
                    let shouldStakeExtra = Boolean(domainName.indexOf("+") > 1)
                    let stakeAmt = shouldStakeExtra ? '0.0600 RIX' : '0.0100 RIX'

                    // remove the plus+ in the account name (if it was added).
                    domainName = domainName.replace("+", "")

                    const rsn = Rsn(response)

                    rsn.transaction(tr => {
                      tr.newaccount({
                        creator: response.creatorAccountName,
                        name: domainName,
                        owner: owner,
                        active: active
                      })
                      tr.buyrambytes({
                        payer: response.creatorAccountName,
                        receiver: domainName,
                        bytes: 5000
                      })
                      tr.delegatebw({
                        from: response.creatorAccountName,
                        receiver: domainName,
                        stake_net_quantity: stakeAmt,
                        stake_cpu_quantity: stakeAmt,
                        transfer: 1
                      })
                    }).then((data) => {

                      newregistermodal.save().then((rap) => {

                        console.log("NEW ARISEN NAME REGISTERED")
                        res.send({ status: true, data })

                      }).catch((er) => {
                        //res.send({ status: false, message: "Something went wrong." })
                      })


                    }).catch((e) => {
                      let error = JSON.stringify(e);
                      return res.status(401).json({
                        success: false,
                        message: `Something went wrong${e}`
                      })
                      // callback(false)
                    })

                  });

                }
                else {
                  return res.send({ status: false, message: "Transection Id missmatched." })
                }
              }
            })
            .catch((e) => {
              res.send({ status: false, message: "Something went wrong" })
            })

        } else if (paymentMode == "Crypto") {

          if (!buttonID)
            return res.status(401).send({ success: false, message: "Fields are missing" })

          CryptPaymentmodal.findOne({ code: transaction_ID })
            .then((respo) => {
              console.log('=====respo', respo, domainName);
              if (respo.domainName == domainName) {

                let newregistermodal = new RegisterModal({
                  domainName: domainName,
                  owner: owner,
                  active: active,
                  dltd: dltd,
                  transaction_ID: transaction_ID,
                  paymentMode: paymentMode
                })

                config_arisen.keyname(dltd).then((response) => {

                  // if there is a + in the account name, stake extra CPU/NET.
                  let shouldStakeExtra = Boolean(domainName.indexOf("+") > 1)
                  let stakeAmt = shouldStakeExtra ? '0.0600 RIX' : '0.0100 RIX'

                  // remove the plus+ in the account name (if it was added).
                  domainName = domainName.replace("+", "")
                  const rsn = Rsn(response)

                  rsn.transaction(tr => {
                    tr.newaccount({
                      creator: response.creatorAccountName,
                      name: domainName,
                      owner: owner,
                      active: active
                    })
                    tr.buyrambytes({
                      payer: response.creatorAccountName,
                      receiver: domainName,
                      bytes: 5000
                    })
                    tr.delegatebw({
                      from: response.creatorAccountName,
                      receiver: domainName,
                      stake_net_quantity: stakeAmt,
                      stake_cpu_quantity: stakeAmt,
                      transfer: 1
                    })
                  }).then((data) => {

                    newregistermodal.save().then((rap) => {
                      console.log("NEW ARISEN NAME REGISTERED")
                      res.status(200).send({
                        success: true,
                        data
                      })

                    }).catch((ers) => {
                      res.send({ status: false, message: "Something went wrong." })
                    })


                  }).catch((e) => {
                    let error = JSON.stringify(e);
                    return res.status(401).json({ success: false, message: `Something went wrong${e}` })
                    // callback(false)
                  })

                });

              }
              else{
                res.send({ status: false, message: "Transaction Id missmatched." })

              }
            })
            .catch((e) => {
              console.log('e=======', e)
            })
        }
      }
    })
  }



  paypalpayment(req, res) {
    const { amount, transactionId, paymentStatus, domainName } = req.body
    console.log('===========paypal shikharrararr', amount, transactionId, paymentStatus, domainName)

    if (!amount || !paymentStatus || !domainName || !transactionId)
      return res.status(401).send({ success: false, message: "Fields are missing!" })

    let request = new checkoutNodeJssdk.orders.OrdersGetRequest(transactionId);

    payPalClient.client().execute(request).then((respo) => {

      if (respo.result.status == 'COMPLETED') {

        Paypalpayment.findOne({ transactionId: transactionId }).then((resps) => {
          if (resps) {
            return res.json({ status: false, message: "transactionId already used,Try again." })
          } else {
            let paypalpayment = new Paypalpayment({
              amount: amount,
              transactionId: transactionId,
              paymentStatus: paymentStatus,
              domainName: domainName,

            })
            paypalpayment.save().then((docsres) => {
              if (docsres) {
                return res.json({ status: true, message: "Data saved" })
              } else {
                return res.json({ status: false, message: "Data not saved" })
              }

            }).catch((errobj) => {
              return res.json({ status: false, message: "Error,Something went wrong" })
            })
          }
        }).catch((errorses) => {
          return res.json({ status: false, message: "Error,Something went wrong" })
        })
      }
    }).catch((e) => {
      return res.json({ status: false, message: "Error,Something went wrong" })
    })

  }

  cryptopayment(req, res) {
    const { amount, paymentStatus, domainName, buttonId, code } = req.body
    console.log('req.body', amount, paymentStatus, domainName, buttonId, code)

    if (!amount || !paymentStatus || !domainName || !buttonId || !code)
      return res.status(401).send({ success: false, message: "Fields are missing!" })

    CryptPaymentmodal.findOne({ code: code })
      .then((resp) => {
        if (resp) {
          return res.json({ status: false, message: "transection ID already exist,Try again" })
        } else {
          axios.get('https://api.commerce.coinbase.com/charges/' + code, {
            headers: {
              "X-CC-Api-Key": process.env.coinbase_api,
              "X-CC-Version": "2018-03-22"
            }
          })
            .then((respp) => {
              //let dataParsed = JSON.stringify(respp);
              console.log("ghfgfgfdfd", respp.data.data.payments.length)


              if (respp.data.data.payments.length > 0) {

                let cryptopayment = new CryptPaymentmodal({
                  amount: amount,
                  paymentStatus: paymentStatus,
                  domainName: domainName,
                  buttonId: buttonId,
                  code: code
                })
                cryptopayment
                  .save()
                  .then((docs) => {
                    return res.json({ status: true, message: "transectionID saved succesfully" })
                  })
                  .catch((errors) => {
                    return res.send({ status: 201, message: "Not saved. Try again." })
                  })
              }
              else {
                return res.send({ status: 201, message: "Payment not completed" })

              }
            })
            .catch((Errors) => {
              console.log('=========errors', Errors.response)
              return res.send({ status: 201, message: "Payment Not detected.try again." })
            })
        }
      })
      .catch((err) => {
        return res.send({ status: 201, message: "try again." })
      })
  }

}

module.exports = new Users();