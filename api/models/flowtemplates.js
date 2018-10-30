const mongoose = require('mongoose');

const schema = mongoose.Schema;

const flowTemplateSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'FlowTemplate' },
        name: { type: String, required: true },
        authSet: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthoritySet' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        type:Number, //1- Dosya Karti 2- Kabinet
        form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
        formVer: { type: mongoose.Schema.Types.ObjectId, ref: 'FormVer' },
        
        calendar: { type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' },
        steps : [mongoose.Schema.Types.Mixed],
        status: Number,
        currentStep: Number,
        rDate: Date
    }

);

const FlowTemplate = mongoose.model('FlowTemplate', flowTemplateSchema);

module.exports = FlowTemplate;