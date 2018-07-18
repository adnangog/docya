const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        fName: {type: String, required: true},
        lName: { type: String, required: true },
        email: { type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
        rDate: Date,
        statu: Number,
        role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
        department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
        authorities: [],
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    }

);

const User = mongoose.model('User', userSchema);

module.exports = User;