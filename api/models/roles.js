const mongoose = require('mongoose');

const schema = mongoose.Schema;

const roleSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        rId: { type: Number, unique: true, required: true },
        rDate: Date,
        authorities: []
    }

);

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;