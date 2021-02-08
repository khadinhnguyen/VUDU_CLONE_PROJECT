var express = require('express');
var exphbs  = require('express-handlebars');
 
var app = express();

app.use(express.static('public'));
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
 
app.get('/', function (req, res) {
    res.render('home');
});
 
PORT = 3000;
app.listen(PORT, () =>{
    console.log(`we are connecting to PORT: ${PORT}`);
});