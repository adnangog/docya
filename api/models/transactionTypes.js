const mongoose = require('mongoose');

const schema = mongoose.Schema;

const transactionTypeSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true }
    }
);

const TransactionType = mongoose.model('TransactionType', transactionTypeSchema);

module.exports = TransactionType;