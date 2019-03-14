const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
        rDate: Date,
        status: Number,
        groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
        department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        source: String,
        title:String,
        avatar:String,
        // position: { type: mongoose.Schema.Types.ObjectId, ref: 'Position' },
        position: String,
        proxy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }

);

const User = mongoose.model('User', userSchema);

module.exports = User;