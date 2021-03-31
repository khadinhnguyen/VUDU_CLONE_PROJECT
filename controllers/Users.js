const express = require('express')
const router = express.Router();
const userModel = require('../model/User');

const {registerValidation, loginValidation} = require('../model/validation.js');


router.get('/sign-in', (req,res) => {
    res.render("./user/signin", {
        pageTitle : "Sign In",
    });
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

router.post('/registerAccount', (req,res) => {
    const userInput = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.userName,
        password : req.body.password,
        checker : req.body.termAndPolicyCheck
    }
    const errors = registerValidation(userInput);

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
                res.render('dashboard', {
                    pageTitle: "Welcome to Vudu",
                    userName : `${userInput.firstName} ${userInput.lastName}`
                }) 
            })
            .catch(err=>console.error(`Error while emailing confirmation ${err}`))
            
        })
        .catch(err=>console.log(`Error while inserting user registration into database ${err}`));
        
    }
});

router.post('/signInAccount', (req,res) => {
    const userInput = {
        userName : req.body.userName,
        password : req.body.password,
    }
    const errors = loginValidation(userInput);

    if (errors.errorOccured){
        res.render('./user/signin',{
            pageTitle : "Sign In",
            errorsMessage : errors
        });    
    } else {  
        res.redirect('/');
    }
    
});


module.exports=router;