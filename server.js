const movie_ultil = require('./model/movie_ultility.js');
const heroImages = require('./model/hero_images.js');
const validation = require('./model/validation.js');
const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload')
 
// This loads all our enviroment variable from the keys.env
require('dotenv').config({path:'./config/keys.env'});

//Import router objects



//Creation of app object
var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false})); // to use req.body.<name>
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
 
app.get('/', (req, res) => {
    res.render("home", {
        pageTitle : "Home Page",
        javaScript : 'hero.js',
        movies : movie_ultil.getTypedMovies('movie',7),
        TVs : movie_ultil.getTypedMovies('tv',7),
        specials : movie_ultil.getTypedMovies('tv',5),
        backgroundImage : heroImages,  
        promotions : movie_ultil.getPromotedMovies('movie-sale',5),      
    });
});

app.get('/sign-in', (req,res) => {
    res.render("signin", {
        pageTitle : "Sign In",
    });
});

app.get('/account-setup', (req,res) => {
    const initialValue = {
        firstName : "",
        lastName : "",
        email : "",
        password : ""
    }
    res.render("registration", {
        values : initialValue,
        pageTitle : "Create Account",
    });
});

app.get('/dashboard', (req,res) => {
    res.render('dashboard', {
        pageTitle: "Welcome to Vudu",
        userName : ""
    })
});

app.get('/movie-list',(req,res) => {
    res.render('movieList', {
        pageTitle : "Movies",
        movies : movie_ultil.getTypedMovies('movie'),
    })
});

app.get('/tv-list', (req,res) => {
    res.render('tvList', {
        pageTitle : "TVs",
        TVs : movie_ultil.getTypedMovies('tv')
    })
});

app.get('/:id', (req,res) => {
    const product = movie_ultil.getMovie(req.params.id); 
    res.render("productDescription", {
        pageTitle : product?.title,
        product
    });
});

app.post('/registerAccount', (req,res) => {
    const userInput = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.userName,
        password : req.body.password,
        checker : req.body.termAndPolicyCheck
    }
    const errors = validation.registerValidation(userInput);

    if (errors.errorOccured){
        res.render('registration',{
            pageTitle : "Create Account",
            values : userInput,
            errorsMessage : errors
        });    
    } else {
        console.log('no error');
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
        .catch((error) => {
            console.error(error)
        })
        
    }

});

app.post('/signInAccount', (req,res) => {
    const userInput = {
        userName : req.body.userName,
        password : req.body.password,
    }
    const errors = validation.loginValidation(userInput);

    if (errors.errorOccured){
        res.render('signin',{
            pageTitle : "Sign In",
            errorsMessage : errors
        });    
    } else {  
        res.redirect('/');
    }
    
});

// MongoDB
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('Connected to MongoDB Database');
})
.catch(err=>console.log(`Error occured when connecting to database ${err}`));
const PORT = process.env.PORT; 
app.listen(PORT, () =>{
    console.log(`we are connecting to PORT: ${PORT}`);
});