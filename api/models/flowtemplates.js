const mongoose = require('mongoose');

const schema = mongoose.Schema;

const flowTemplateSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'FlowTemplate' },
        name: { type: String, required: true },
        authSet: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthoritySet' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        formType:{ type: mongoose.Schema.Types.ObjectId, ref: 'FormType' },
        form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
        formVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'FormVersion'},
        organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
        calendar: { type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' },
        steps : [mongoose.Schema.Types.Mixed],
        status: Number,
        currentStep: Number,
        rDate: Date
    }

);

const FlowTemplate = mongoose.model('FlowTemplate', flowTemplateSchema);

module.exports = FlowTemplate;