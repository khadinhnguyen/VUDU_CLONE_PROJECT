
const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session'); 
 
// This loads all our enviroment variable from the keys.env
require('dotenv').config({path:'./config/keys.env'});

//Import router objects
const adminRouter = require('./controllers/Admin');
const userRouter = require('./controllers/User');
const generalRouter = require('./controllers/General');
const { options } = require('./controllers/User');

//Creation of app object
var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false})); // to use req.body.<name>
 
//app.engine('handlebars', exphbs());
app.engine("handlebars",exphbs(
    {
        helpers : {
            if_eq : function(a,b,options)
            {
                const regularExpress = new RegExp(`${b}`,'i');
                return (regularExpress.test(a)) ? options.fn( this ) : options.inverse( this );
                // on line of code for the selection
            },
            if_eqNum :function(a,b,options)
            {
                return a == b ? options.fn(this) : options.inverse(this);
            },
            if_eqBool : function(a,b,options)
            {
                return a==b?options.fn(this) : options.inverse(this);
            },
            upperCase : function(str)
            {
                return str.toUpperCase();
            } 

        }
    }
));


app.set('view engine', 'handlebars');

app.use(fileUpload());

app.use((req,res,next)=>{
    if(req.query.method=="PUT"){
        req.method = "PUT";
    } else if (req.query.method=="DELETE"){
        req.method = "DELETE";
    }
    next()
});

// use express-session right before the route
app.use(session({
  secret: `${process.env.SECRET_KEY}`, // secret key - never dispose secret key to any one
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true } -> this is only work if we use https
}))

// define user as global template variable
app.use((req,res,next)=>{
    //res.locals.user = req.session.userInfo;
    // req.session.userInfo = {
    //     firstName : "Kha",
    //     lastName : "Nguyen",
    //     type : "admin"
    // }
    res.locals.user = req.session.userInfo; 
    if(res.locals.user != undefined){
        if(res.locals.user.type=="admin"){
            res.locals.admin = true;
        }
    }


    next();
})



//Maps Express to all router object
app.use('/', generalRouter);
app.use('/user',userRouter);
app.use('/admin', adminRouter);



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