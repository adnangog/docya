const mongoose = require('mongoose');

const schema = mongoose.Schema;

const roleSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        rDate: Date
    }

);

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;