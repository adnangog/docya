const mongoose = require('mongoose');

const schema = mongoose.Schema;

const authoritySchema = new schema(
    {
        _id: Number,
        name: { type: String, required: true },
        rDate: Date
    }

);

const Authority = mongoose.model('Authority', authoritySchema);

module.exports = Authority;