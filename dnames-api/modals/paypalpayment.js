const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paypalPaymentSchema = new Schema({
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    transactionId: {
        type: String,
        unique:true,
        required: true,
        trim: true
    },
    paymentStatus: {
        type: String,
        trim: true
    },
    domainName:{
        type:String,
        required:true,
        trim:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Paypalpayment',paypalPaymentSchema)