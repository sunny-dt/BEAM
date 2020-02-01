const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const productSchema = new Schema({
    name : {
        type : String,
        required : true,
        uppercase : true,
        trim : true
    },
    code:{
        type : String,
        required : true,
        uppercase : true,
        trim : true
    },
    isRndType:{
        type : Boolean,
        required : true,
        default: false
    },
    platform:{
        type : Schema.Types.ObjectId,
        ref : 'platform'
    },
    chambers:[{
        type : Schema.Types.ObjectId,
        ref: 'chamber'
    }],
    chamberPositions: [{
        name : {type : String, uppercase : true, trim : true},
        positions : {type : [Number]},
        _id : false
    }]
}, {timestamps : true});

productSchema.index({ name: 1, platform: 1 }, { unique: true });


productSchema.pre('remove', function (next) {
    var product = this;
    product.model('platform').update(
        {}, 
        { $pull: { products: product._id } }, 
        { multi: true }
     );

     product.model('chamber').update(
        {}, 
        { $pull: { products: product._id } }, 
        { multi: true },
        next
     );
});


const Product = mongoose.model('product', productSchema);

module.exports = Product;