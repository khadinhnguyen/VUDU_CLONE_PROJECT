const express = require('express')
const router = express.Router();
const userModel = require('../model/User');
const bcrypt = require('bcryptjs');

const {registerValidation, loginValidation} = require('../model/validation.js');
const movieModel = require('../model/Movie');
const cartModel = require('../model/Cart');


router.get('/sign-in', (req,res) => {
    res.render("./user/signin", {
        pageTitle : "Sign In",
    });
});

router.get('/dashboard',(req,res) => {
    console.log(req.session.userInfo)
    cartModel.find({userId:req.session.userInfo._id})
    .then((results)=>{
        if(results){
            //let sum = 0.0;
            const carts = results.map(result=>{
                return{
                    _id:result._id,
                    title:result.title,
                    userId:result.userId, 
                    movieId:result.movieId,
                    type:result.type,
                    price:result.price 
                }
            })
            // for (let i = 0; i < carts.length(); i++){
            //     sum += carts[i].price;
            // }
            res.render("./user/dashboard",{
                carts
                
            });
        } else {
            res.render("./user/dashboard");
        }

    })
    .catch(err=>console.log(`err when retrive cart${err}`));

});

router.get('/account-setup', (req,res) => {
    const initialValue = {
        firstName : "",
        lastName : "",
        email : "",
        password : ""
    }
    res.render("./user/registration", {
        values : initialValue,
        pageTitle : "Create Account",
    });
});

router.get('/logout', (req,res)=>{
    req.session.destroy();
    res.redirect('/');
})

router.post('/registerAccount', (req,res) => {
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




    // if (errors.errorOccured){
    //     res.render('./user/registration',{
    //         pageTitle : "Create Account",
    //         values : userInput,
    //         errorsMessage : errors
    //     });    
    // } else {
    //     console.log('no error');
    //     // save userinformation into database
    //     const user = new userModel(userInput);
    //     user.save()
    //     .then(()=>{

    //         const sgMail = require('@sendgrid/mail')
    //         sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    //         const msg = {
    //         to: userInput.email, // Change to your recipient
    //         from: 'nguyendkha@gmail.com', // Change to your verified sender
    //         subject: '//WEB322// Welcome to Vudu',
    //         text: 'Welcome you to Vudu Community',
    //         html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    //         }
    //         sgMail
    //         .send(msg)
    //         .then(() => {
    //             console.log('Email sent');
    //             res.render('dashboard', {
    //                 pageTitle: "Welcome to Vudu",
    //                 userName : `${userInput.firstName} ${userInput.lastName}`
    //             }) 
    //         })
    //         .catch(err=>console.error(`Error while emailing confirmation ${err}`))
            
    //     })
    //     .catch(err=>console.log(`Error while inserting user registration into database ${err}`));
        
    // }
});

router.post('/signInAccount', (req,res) => {
    // const userInput = {
    //     userName : req.body.userName,
    //     password : req.body.password,
    // }
    // const errors = loginValidation(userInput);

    // if (errors.errorOccured){
    //     res.render('./user/signin',{
    //         pageTitle : "Sign In",
    //         errorsMessage : errors
    //     });    
    // } else {  
    //     res.redirect('/');
    // }

 
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
    
});

router.post('/addRent/:id',(req,res)=>{
    movieModel.findById(req.params.id)
    .then((movie)=>{
        const {_id,rentalPrice} = movie;
        const selectedMovie = { 
            title:movie.title,
            userId:req.session.userInfo._id,
            movieId:movie._id,
            type:"Rental",
            price:movie.rentalPrice
        }
        const cart = new cartModel(selectedMovie)
        cart.save()
        .then(()=>{
            res.redirect('/');
        })
        .catch(err=>console.log(`err when insert cart to database ${err}`))
    })
    .catch(err=>console.log(`Err when add rental to cart ${err}`));

}); 


module.exports=router;

