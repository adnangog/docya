const mongoose = require('mongoose');

const schema = mongoose.Schema;

const cardTemplateSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        authSet: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthoritySet' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: Number,
        type:Number, //1- Dosya Karti 2- Kabinet
        rDate: Date,
        form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' }
    }

);

const CardTemplate = mongoose.model('CardTemplate', cardTemplateSchema);

module.exports = CardTemplate;