const cartModel = require('../model/Cart');
const orderModel = require('../model/Order');
const userModel = require('../model/User');
const {registerValidation, loginValidation} = require('../model/validation.js');
const bcrypt = require('bcryptjs');

exports.signIn = (req,res,next) => {
    res.render("./user/signin", {
        pageTitle : "Sign In",
    });
};

exports.logout = (req,res,next) => {
    req.session.destroy();
    res.redirect('/');
};

exports.accountSetup = (req,res,next) => {
    const initialValue = {
        firstName : "",
        lastName : "",
        email : "",
        password : ""
    };
    res.render("./user/registration", {
        values : initialValue,
        pageTitle : "Create Account",
    });
};

exports.postRegisterAccount = (req,res,next) => {
    const userInput = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.userName,
        password : req.body.password,
        checker : req.body.termAndPolicyCheck
    }
    var errors = registerValidation(userInput);
    userModel.findOne({email:userInput.email})
    .then((result)=>{
        console.log(result); 
        if(result != null){
            errors.errorOccured = true;
            errors.emailError = "Email is already used. Please enter different email";
            console.log("email found");
            console.log(errors);
        } 

        if (errors.errorOccured){
            res.render('./user/registration',{
                pageTitle : "Create Account",
                values : userInput,
                errorsMessage : errors
            });    
        } else {
            console.log('no error');
            // save userinformation into database
            const user = new userModel(userInput);
            user.save()
            .then(()=>{
    
                const sgMail = require('@sendgrid/mail')
                sgMail.setApiKey(process.env.SENDGRID_API_KEY)
                const msg = {
                to: userInput.email, // Change to your recipient
                from: 'nguyendkha@gmail.com', // Change to your verified sender
                subject: '//WEB322// Welcome to Vudu',
                text: 'Welcome you to Vudu Community',
                html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                }
                sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent');
                    res.redirect('/user/sign-in');
                })
                .catch(err=>console.error(`Error while emailing confirmation ${err}`))
                
            })
            .catch(err=>console.log(`Error while inserting user registration into database ${err}`));            
        }

    })
    .catch(err=>console.log(`err when validate email ${err}`));

};

exports.postSignin = (req,res,next) => {

    userModel.findOne({email:req.body.userName})
    .then(user=>{
        // email not found
        const errors = [];
        if(user==null){
            errors.push("Sorry, your email and/or password incorrect");
            res.render("./user/signin", {
                pageTitle: "Sign In",
                errors
            })
        }
        // email is found
        else{            
            bcrypt.compare(req.body.password, user.password)
            .then(isMatched=>{
                if(isMatched){
                    // if password is true -> create a session and redirect
                    // create a session called userInfo -> userInfo is global variable 
                    req.session.userInfo = user;
                    if(user.type == "admin"){
                        res.redirect('/admin/dashboard');
                    }else{
                       res.redirect('/'); 
                    }
                    

                } else {
                    errors.push("Sorry, your email and/or password incorrect");
                    res.render("./user/signin", {
                        errors
                    })
                }
            })
            .catch(err=>console.log(`error with decrypt password ${err}`));
        }
    })
    .catch(err=>console.log(`Error when trying to login ${err}`));
   
};

exports.dashboard = (req,res,next) => {    
    res.render("./user/dashboard",{
        carts : req.cartItems,
        sum : req.sumShoppingCart              
    });
}

exports.addRental = (req,res,next) =>{
    const selectedMovie = { 
        title:req.movie.title,
        userId:req.session.userInfo._id,
        movieId:req.movie.id,
        type:"Rental",
        price:req.movie.rentalPrice
    };
    const cart = new cartModel(selectedMovie) 
    cart.save()
    .then(()=>{
        res.redirect('/');
    })
    .catch(err=>console.log(`err when insert cart to database ${err}`))
};

exports.addPurchase = (req,res,next) => {
    const selectedMovie = { 
        title:req.movie.title,
        userId:req.session.userInfo._id,
        movieId:req.movie.id,
        type:"Purchase",
        price:req.movie.purchasePrice
    };
    const cart = new cartModel(selectedMovie)
    cart.save()
    .then(()=>{
        res.redirect('/');
    })
    .catch(err=>console.log(`err when insert cart to database ${err}`))
};

exports.deleteCartItem = (req,res,next) => {
    cartModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect('/user/dashboard');
    })
    .catch(err=>console.log(`Err when delete an item ${err}`));
}

exports.checkout = (req,res,next) =>{
    let checkOutMsg = `<h1> Order Confirmation </h1><br><br> 
                        <table><thead>
                        <th>Movie Name</th>
                        <th>Type</th>
                        <th>Price</th>
                        </thead><tbody>`;
    const movieList = req.cartItems.map(item=>{
        return{
            movieId:item.movieId,
            title:item.title,
            type:item.type,
            price:item.price 
        }
    });
    
    for (let i = 0; i< movieList.length; i++){
        checkOutMsg += `<tr>
        <td>${movieList[i].title}</td>
        <td>${movieList[i].type}</td>
        <td>${movieList[i].price}</td></tr>`;
    }
    checkOutMsg += `</tbody></table>`;

    const checkoutOrder = {
        userId: req.session.userInfo._id,
        movieList : movieList,
        totalPrice: req.sumShoppingCart
    };
    const order = new orderModel(checkoutOrder);
    order.save()
    .then(()=>{
        console.log("Order is successfully ender");
        cartModel.deleteMany({userId:req.session.userInfo._id})
        .then(()=>{
            console.log(req.session.userInfo.email);
            const sgMail = require('@sendgrid/mail')
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
            to: req.session.userInfo.email, // Change to your recipient
            from: 'nguyendkha@gmail.com', // Change to your verified sender
            subject: '//WEB322// Order Confirmation',
            text: 'Thanks for doing business with Vudu',
            html: `${checkOutMsg}`,
            }
            sgMail
            .send(msg)
            .then(() => {
                console.log(checkOutMsg);
                res.redirect('/');
            })
            .catch(err=>console.error(`Error while emailing confirmation ${err}`))

            
        })
        .catch(err=>console.log(`Err when clear shopping cart ${err}`));
    })
    .catch(err=>console.log(`Err when save order ${err}`));
};

