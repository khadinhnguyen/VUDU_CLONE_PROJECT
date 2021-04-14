const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
    userId : {
        type:String,
        require:true
    },
    movieList : [Schema.Types.Mixed], // MovieId, Title, Retal/Purchase, price
    totalPrice:{
        type:Number,
        require:true
    },
    dateCreated:{
        type:Date,
        default:Date.now()
    }
})


const orderModel = mongoose.model('Order', orderSchema);

module.exports=orderModel;