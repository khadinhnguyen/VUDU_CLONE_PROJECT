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
            req.sumShoppingCart = 0.0;
            for(let i = 0; i< req.cartItems.length; i++){
                req.sumShoppingCart = req.sumShoppingCart + req.cartItems[i].price;
            }
            req.sumShoppingCart = req.sumShoppingCart.toFixed(2);
        }
        next();
    })
    .catch(err=>console.log(`err when retrive cart${err}`));
};