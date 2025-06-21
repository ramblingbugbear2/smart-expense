const {Schema,model,Types} = require('mongoose');

const groupSchema = new Schema(
    {
        name: {type: String, required: true, trim: true},
        members: [{type: Types.ObjectId, ref: 'User', required: true}],
        createdBy: {type: Types.ObjectId, ref: 'User', required: true},
        settlementCurrency: {type: String, default: 'INR'}
    },
    {timestamps: true}
);

module.exports = model('Group', groupSchema);