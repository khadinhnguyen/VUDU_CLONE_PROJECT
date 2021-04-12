const cartModel = require('../model/Cart');

exports.retrieveAllItems = (req,res,next) => {
    cartModel.find({userId:req.session.userInfo._id})
    .then((results)=>{
        if(results){
            req.cartItems = results.map(result=>{
                return{
                    id:result._id,
                    title:result.title,
                    userId:result.userId, 
                    movieId:result.movieId,
                    type:result.type,
                    price:result.price 
                }
            })
        }
        next();
    })
    .catch(err=>console.log(`err when retrive cart${err}`));
};