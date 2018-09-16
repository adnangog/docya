const mongoose = require('mongoose');

const schema = mongoose.Schema;

const authSetItemSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        authSet: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthSet' },
        name: String,
        type: Number, //1- user 2- group
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // group or user _id
        authorities: [],
        status: Number,
        rDate: Date
    }

);

const AuthSetItem = mongoose.model('AuthSetItem', authSetItemSchema);

module.exports = AuthSetItem;