const mongoose = require('mongoose');

const schema = mongoose.Schema;

const transactionSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        rDate: Date,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: Number, ref: 'TransactionType', required: true },
        document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document'},
        card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card'},
        folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder'},
        detail: String
    }

);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;