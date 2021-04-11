const express = require('express')
const router = express.Router();

const movie_ultil = require('../model/movie_ultility.js');
const heroImages = require('../model/hero_images.js');
const movieModel = require('../model/Movie');
//const {retrieveMovieById} = require('../middleware/movieRetrieve.js');
const movieRetrieve = require('../middleware/movieRetrieve.js');



router.get('/', movieRetrieve.retrieveFeaturedRentals,movieRetrieve.retrieveFeaturedWeekdeal,movieRetrieve.retrieveFeaturedNewReleases, movieRetrieve.retrieveFeaturedTVs,movieRetrieve.retrieveFeaturedBanners,(req, res) => {
    res.render("./general/home", {
        pageTitle : "Home Page",
        javaScript : 'hero.js',
        rentals : req.featuredRentals,
        weekdeals : req.featuredWeekdeals, 
        newReleases : req.featuredNewRealeases,
        TVs : req.featuredTVs,
        specials : movie_ultil.getTypedMovies('tv',5),
        backgroundImage : heroImages,  
        banners : req.featuredBanners, // 5      
    }); 
});
  


router.get('/dashboard', (req,res) => {
    res.render('./general/dashboard', {
        pageTitle: "Welcome to Vudu",
        userName : ""
    })
});

router.get('/movie-list',movieRetrieve.retrieveAllMovie,(req,res) => {
    res.render('./general/allMovieTvList', {
        pageTitle : "Movies",
        movies: req.movies
    });

});

router.get('/tv-list',movieRetrieve.retrieveAllTV, (req,res) => {
    res.render('./general/allMovieTvList', {
        pageTitle : "TVs",
        movies : req.movies
    }); 
});

router.get('/movie/:id', movieRetrieve.retrieveMovieById,(req,res) => {
    res.render("./general/productDescription", {movie:req.movie}); 
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

