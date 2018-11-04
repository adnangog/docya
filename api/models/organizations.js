const mongoose = require('mongoose');

const schema = mongoose.Schema;

const organizationSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        tree : [mongoose.Schema.Types.Mixed],
        rDate: Date
    }

);

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;