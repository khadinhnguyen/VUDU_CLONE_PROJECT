
const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload') 
 
// This loads all our enviroment variable from the keys.env
require('dotenv').config({path:'./config/keys.env'});

//Import router objects
const userRouter = require('./controllers/Users');
const generalRouter = require('./controllers/General')

//Creation of app object
var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false})); // to use req.body.<name>
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


//Maps Express to all router object
app.use('/', generalRouter);
app.use('/user',userRouter);



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