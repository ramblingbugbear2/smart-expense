const { Schema, model, Types } = require('mongoose');

const SettlementSchema = new Schema ({
    group : { type : Types.ObjectId, ref: 'Group', required: true},
    from : { type : Types.ObjectId, ref : 'User', required : true},
    to : { type : Types.ObjectId, ref : 'User', required : true},
    amount : {type : Number, required : true, min : 0.01 },
    note : { type : String },
    date : { type : Date, default: Date.now}
});

module.exports = model('Settlement', SettlementSchema);