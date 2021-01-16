const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registerSchema = new Schema({
    domainName: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    owner: {
        type: String,
        required: true,
        trim: true
    },
    active:{
        type: String,
        required: true,
        trim: true
    },
    dltd:{
        type: String,
        required: true,
        trim: true
    },
    transaction_ID:{
        type: String,
        required: true,
        trim: true
    },
    paymentMode: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("register", registerSchema)