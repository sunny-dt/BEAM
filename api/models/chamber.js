const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chamberSchema = new Schema({
    name : {
        type : String,
        required : true,
        unique:true,
        uppercase : true,
        trim : true
    },
    products:[{
        type : Schema.Types.ObjectId,
        ref: 'product'
    }]
}, {timestamps : true});

chamberSchema.pre('remove', function(next){

    var chamber = this;
    chamber.model('product').updateMany(
        {chambers : {$in : chamber._id}}, 
        { $pull:  {chambers: chamber._id}, $unset : { chamberPositions : {name : chamber.name} }}, 
        { multi: true },
        next
     );

     /* chamber.model('product').update(
        {}, 
        { $pull:  {chamberPositions : {name : chamber.name}}}, 
        { multi: true }, 
        next
     ); */

     
    
  });

const Chamber = mongoose.model('chamber', chamberSchema);

module.exports = Chamber;