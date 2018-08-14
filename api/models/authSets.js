const mongoose = require('mongoose');

const schema = mongoose.Schema;

const authSetSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        status: Number,
        rDate: Date
    }

);

const AuthSet = mongoose.model('AuthSet', authSetSchema);

module.exports = AuthSet;