const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const movieSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    synopsis : {
        type:String,
        require:true
    },
    rentalPrice:{
        type:Number,
        require:true
    },
    purchasePrice:{
        type:Number,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    genre:{
        type:String,
        require:true
    },
    rating:{
        type:Number,
        require:true
    },
    numberOfStar:{
        type:Number,
        require:true
    },
    feature:{
        type:String,
        require:true
    },
    smallPosterImg:{
        type:String,
    },
    largePosterImg:{
        type:String
    },
    dateCreated:    {
        type:Date,
        default:Date.now()
    },
    inputBy:{
        type:String,
    }
})


const movieModel = mongoose.model('Movie', movieSchema);

module.exports=movieModel;