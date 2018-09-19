const mongoose = require('mongoose');

const schema = mongoose.Schema;

const transactionTypeSchema = new schema(
    {
        _id: Number,
        name: { type: String, required: true }
    }
);

const TransactionType = mongoose.model('TransactionType', transactionTypeSchema);

module.exports = TransactionType;