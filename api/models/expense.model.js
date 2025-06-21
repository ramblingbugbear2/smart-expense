const {Schema,model,Types} = require('mongoose');
const { required } = require('zod/v4-mini');

const partSchema = new Schema({
    user: {type: Types.ObjectId, ref: 'User', required: true},
    share : {type: Number, required: true, min: 0}
}, {_id:false});

const expenseSchema = new Schema (
    {
        group: {type: Types.ObjectId, ref: 'Group', required: true},
        payer: {type: Types.ObjectId, ref: 'User', required: true},
        participants: {type: [partSchema], validate:v => v.length>0},
        amount: {type: Number, required: true, min: 0},
        description: {type: String, trim: true},
        date: {type: Date, default: Date.now}
    }, {timestamps: true}
);

module.exports = model('Expense', expenseSchema);