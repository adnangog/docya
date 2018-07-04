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
        roleId: { type: Number, required: true },
        departmentId: Number,
        authorities: [],
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    }

);

const User = mongoose.model('User', userSchema);

module.exports = User;