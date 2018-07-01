const mongoose = require('mongoose');

const schema = mongoose.Schema;

const transactionSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        rDate: Date,
        userId: { type: Number, required: true },
        tpId: { type: String, required: true },
        tpName: { type: String, required: true },
        dcmId: { type: String, required: true },
        dcmName: { type: String, required: true },
    }

);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;