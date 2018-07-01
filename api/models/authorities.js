const mongoose = require('mongoose');

const schema = mongoose.Schema;

const authoritySchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        aId: { type: Number, required: true, unique: true },
        rDate: Date
    }

);

const Authority = mongoose.model('Authority', authoritySchema);

module.exports = Authority;