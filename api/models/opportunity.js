const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const opportunitySchema = new Schema({
    opId : {
        type : String,
        required : true,
        unique:true,
        uppercase : true,
        trim : true
    },
    productCode: {
        type : String,
        required : true,
        uppercase : true,
        trim : true
    },
    productName: {
        type : String,
        required: true,
        uppercase : true,
        trim : true
    }
}, {timestamps : true});



const Opportunity = mongoose.model('opportunity', opportunitySchema);

module.exports = Opportunity;