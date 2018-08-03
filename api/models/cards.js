const mongoose = require('mongoose');

const schema = mongoose.Schema;

const cardSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        authSet: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthoritySet' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: Number,
        type:Number, //1- Dosya Karti 2- Kabinet
        rDate: Date,
        form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
        cardTemplate: { type: mongoose.Schema.Types.ObjectId, ref: 'CardTemplate' },
        fields : [mongoose.Schema.Types.Mixed],
        lock: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        uDate: Date,
        uUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }

);

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;