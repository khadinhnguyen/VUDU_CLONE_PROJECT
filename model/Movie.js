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
        type:String,
        require:true
    },
    purchasePrice:{
        type:String,
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
        type:String,
        require:true
    },
    feature:{
        type:String,
        require:true
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