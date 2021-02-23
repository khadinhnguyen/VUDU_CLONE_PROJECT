const movie_ultil = require('./database/movie_ultility.js')
const heroImages = require('./database/hero_images.js')
var express = require('express');
var exphbs  = require('express-handlebars');
 
var app = express();

app.use(express.static('public'));
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
 
app.get('/', (req, res) => {
    res.render("home", {
        javaScript : 'test.js',
        movies : movie_ultil.getTypedMovies('movie',7),
        TVs : movie_ultil.getTypedMovies('tv',7),
        specials : movie_ultil.getTypedMovies('tv',5),
        backgroundImage : heroImages,  
        promotions : movie_ultil.getPromotedMovies('movie-sale',5),      
    });
});

app.get('/sign-in', (req,res) => {
    res.render("signin");
});

app.get('/account-setup', (req,res) => {
    res.render("registration");
});

app.get('/movie-list',(req,res) => {
    res.render('movieList', {
        movies : movie_ultil.getTypedMovies('movie')
    })
});

app.get('/tv-list', (req,res) => {
    res.render('tvList', {
        TVs : movie_ultil.getTypedMovies('tv')
    })
});

app.get('/:id', (req,res) => {
    console.log(req.params.id);
    res.render("productDescription", {
        product : movie_ultil.getMovie(req.params.id),
    });
});



PORT = 3000;
app.listen(PORT, () =>{
    console.log(`we are connecting to PORT: ${PORT}`);
});