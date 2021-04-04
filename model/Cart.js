const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cartSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    userId : {
        type:String,
        require:true
    },
    movieId :{
        type:String,
        require:true
    },
    type:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    dateCreated:    {
        type:Date,
        default:Date.now()
    }
})


const cartModel = mongoose.model('Cart', cartSchema);

module.exports=cartModel;