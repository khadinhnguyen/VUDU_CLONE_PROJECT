const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//This indicates the shape of the documents that will be entered into database

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName : {
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})

userSchema.pre('save', function(next){
    bcrypt.genSalt(10)
    .then((salt)=>{
        bcrypt.hash(this.password,salt)
        .then((encryptedPassword)=>{
            this.password=encryptedPassword;
            next();
        })
        .catch(err=>console.log(`Error occures when hashing password ${err}`));
    })
    .catch(err=>console.log(`Error occurs when salting password ${err}`));
})


const userModel = mongoose.model('User', userSchema);

module.exports=userModel;