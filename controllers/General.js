const express = require('express')
const router = express.Router();

const movie_ultil = require('../model/movie_ultility.js');
const heroImages = require('../model/hero_images.js');




router.get('/', (req, res) => {
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

router.get('/dashboard', (req,res) => {
    res.render('dashboard', {
        pageTitle: "Welcome to Vudu",
        userName : ""
    })
});

router.get('/movie-list',(req,res) => {
    res.render('movieList', {
        pageTitle : "Movies",
        movies : movie_ultil.getTypedMovies('movie'),
    })
});

router.get('/tv-list', (req,res) => {
    res.render('tvList', {
        pageTitle : "TVs",
        TVs : movie_ultil.getTypedMovies('tv')
    })
});

router.get('/:id', (req,res) => {
    const product = movie_ultil.getMovie(req.params.id); 
    res.render("productDescription", {
        pageTitle : product?.title,
        product
    });
});



module.exports=router;

