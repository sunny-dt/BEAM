const mongoose = require('mongoose');

const Product = require('../models/product');

const Schema = mongoose.Schema;

const platformSchema = new Schema({
  name: {
      type: String,
      required:true,
      unique:true,
      uppercase : true,
        trim : true
      },
  modelImage:String,
  products:[{
    type: Schema.Types.ObjectId,
    ref: 'product'
  }]  
}, {timestamps : true});

platformSchema.pre('remove', function(next){

  Product.remove({platform : this._id}).exec();
  next();
});

const Platform = mongoose.model('platform', platformSchema);

module.exports = Platform;