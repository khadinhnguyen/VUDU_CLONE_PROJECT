const express = require('express')
const router = express.Router();

const movie_ultil = require('../model/movie_ultility.js');
const heroImages = require('../model/hero_images.js');
const movieModel = require('../model/Movie');




router.get('/', (req, res) => {
    res.render("./general/home", {
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
    res.render('./general/dashboard', {
        pageTitle: "Welcome to Vudu",
        userName : ""
    })
});

router.get('/movie-list',(req,res) => {
    res.render('./general/movieList', {
        pageTitle : "Movies",
        movies : movie_ultil.getTypedMovies('movie'),
    })
});

router.get('/tv-list', (req,res) => {
    res.render('./general/tvList', {
        pageTitle : "TVs",
        TVs : movie_ultil.getTypedMovies('tv')
    })
});

router.get('/:id', (req,res) => {
    movieModel.findById(req.params.id)
    .then((movie)=>{
        const {_id,title,synopsis,rentalPrice,purchasePrice,category,genre,rating,numberOfStar,feature,smallPosterImg,largePosterImg} = movie;
        res.render("./general/productDescription", {_id,title,synopsis,rentalPrice,purchasePrice,category,genre,rating,numberOfStar,feature,smallPosterImg,largePosterImg
        });
    })
    .catch(err=>console.log(`err when find one movie ${err}`));
    const product = movie_ultil.getMovie(req.params.id); 

});

router.post('/search-result', (req,res)=>{
    const regularExpress = new RegExp(`${req.body.searchText}`,'i');
    movieModel.find({title:{"$regex": req.body.searchText, "$options":"i"}})
    .then((results)=>{
        const movies = results.map(result=>{
            return{
                id:result._id,
                title:result.title,
                synopsis:result.synopsis,
                rentalPrice:result.rentalPrice,
                purchasePrice:result.purchasePrice,
                category:result.category,
                genre:result.genre,
                rating:result.rating,
                numberOfStar:result.numberOfStar,
                feature:result.feature,
                smallPosterImg:result.smallPosterImg,
                largePosterImg:result.largePosterImg
            }
        })
        res.render('./general/allMovieTvList',{
            pageTitle : "Search Result",
            movies
        });
    })
    .catch(err=>console.log(`Err happen when search movie ${err}`))
    
})



module.exports=router;

