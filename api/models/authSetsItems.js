const mongoose = require('mongoose');

const schema = mongoose.Schema;

const authSetItemSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        autSeth: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthSet' },
        type: Number, //1- user 2- role
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // role or user _id
        authorities: [],
        status: Number,
        rDate: Date
    }

);

const AuthSetItem = mongoose.model('AuthSetItem', authSetItemSchema);

module.exports = AuthSetItem;