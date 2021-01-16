const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cryptoPaymentSchema = new Schema({
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    paymentStatus: {
        type: String,
        required: true,
        trim: true
    },
    domainName: {
        type: String,
        required: true,
        trim: true
    },
    buttonId: {
        type: String,
        required: true,
        trim: true

    },
    code: {
        type: String,
        unique:true,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})


module.exports = mongoose.model("Cryptopayment", cryptoPaymentSchema)