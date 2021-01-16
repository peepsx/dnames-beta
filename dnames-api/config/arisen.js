'use strict';

require('dotenv').config()

class KeyName {
    constructor(){

    }

    
    keyname(domainName){
        return new Promise((resolve,reject)=>{
            
            if (domainName === "DCOM") {
               resolve({
                    chainId: '136ce1b8190928711b8bb50fcae6c22fb620fd2c340d760873cf8f7ec3aba2b3', // 32 byte (64 char) hex string
                    keyProvider: process.env.DCOM_PK, // WIF string or array of keys..
                    httpEndpoint: 'https://greatchains.arisennodes.io',
                    expireInSeconds: 60,
                    broadcast: true,
                    authorization: process.env.CREATER_DCOM + '@active',
                    debug: true, // API activity
                    sign: true,
                    creatorAccountName: process.env.CREATER_DCOM
               }) 
            } else if (domainName === "DINFO") {
                 
                 resolve({
                    chainId: '136ce1b8190928711b8bb50fcae6c22fb620fd2c340d760873cf8f7ec3aba2b3', // 32 byte (64 char) hex string
                    keyProvider: process.env.DINFO_PK, // WIF string or array of keys..
                    httpEndpoint: 'https://greatchains.arisennodes.io',
                    expireInSeconds: 60,
                    broadcast: true,
                    authorization: process.env.CREATER_DINFO + '@active',
                    debug: true, // API activity
                    sign: true,
                    creatorAccountName: process.env.CREATER_DINFO
                })
            } else if (domainName === "DNET") {
                 resolve({
                    
                    chainId: '136ce1b8190928711b8bb50fcae6c22fb620fd2c340d760873cf8f7ec3aba2b3', // 32 byte (64 char) hex string
                    keyProvider: process.env.DNET_PK, // WIF string or array of keys..
                    httpEndpoint: 'https://greatchains.arisennodes.io',
                    expireInSeconds: 60,
                    broadcast: true,
                    authorization: process.env.CREATER_DNET + '@active',
                    debug: true, // API activity
                    sign: true,
                    creatorAccountName: process.env.CREATER_DNET
                 })
            } else if (domainName === "DORG") {
              resolve({
                
                chainId: '136ce1b8190928711b8bb50fcae6c22fb620fd2c340d760873cf8f7ec3aba2b3', // 32 byte (64 char) hex string
                keyProvider: process.env.DORG_PK, // WIF string or array of keys..
                httpEndpoint: 'https://greatchains.arisennodes.io',
                expireInSeconds: 60,
                broadcast: true,
                authorization: process.env.CREATER_DORG + '@active',
                debug: true, // API activity
                sign: true,
                creatorAccountName: process.env.CREATER_DORG
              })
            } else if (domainName === "DWEB") {
                resolve({
                 chainId: '136ce1b8190928711b8bb50fcae6c22fb620fd2c340d760873cf8f7ec3aba2b3', // 32 byte (64 char) hex string
                 keyProvider: process.env.DWEB_PK, // WIF string or array of keys..
                 httpEndpoint: 'https://greatchains.arisennodes.io',
                 expireInSeconds: 60,
                 broadcast: true,
                 authorization: process.env.CREATER_DWEB + '@active',
                 debug: true, // API activity
                 sign: true,
                 creatorAccountName: process.env.CREATER_DWEB})
            }else{
                reject(false);
            }
        })
    }
    // keyConfigration ={
    //     chainId: '136ce1b8190928711b8bb50fcae6c22fb620fd2c340d760873cf8f7ec3aba2b3', // 32 byte (64 char) hex string
    //     keyProvider:"", // WIF string or array of keys..
    //     httpEndpoint: 'https://greatchains.arisennodes.io',
    //     expireInSeconds: 60,
    //     broadcast: true,
    //     authorization: 'peeps' + '@active',
    //     debug: true, // API activity
    //     sign: true,
    //     creatorAccountName: ""
    // }
}
module.exports=new KeyName();

// module.exports = {
//     chainId: '136ce1b8190928711b8bb50fcae6c22fb620fd2c340d760873cf8f7ec3aba2b3', // 32 byte (64 char) hex string
//     keyProvider: rsn_pk, // WIF string or array of keys..
//     httpEndpoint: 'https://greatchains.arisennodes.io',
//     expireInSeconds: 60,
//     broadcast: true,
//     authorization: 'peeps' + '@active',
//     debug: true, // API activity
//     sign: true,
//     creatorAccountName: 'peeps'
// }