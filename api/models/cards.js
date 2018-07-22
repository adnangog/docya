const mongoose = require('mongoose');

const schema = mongoose.Schema;

const cardSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        rDate: Date,
        authSet: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthoritySet' },
        status: Number,
        type:Number //1- Dosya Karti 2- Kabinet
    }

);

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;