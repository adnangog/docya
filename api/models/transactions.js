const mongoose = require('mongoose');

const schema = mongoose.Schema;

const transactionSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        rDate: Date,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'TransactionType', required: true },
        document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    }

);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;