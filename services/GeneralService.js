const movie_ultil = require('../model/movie_ultility.js');
const heroImages = require('../model/hero_images.js');
const movieModel = require('../model/Movie');

exports.getHomePage = (req,res,next) => {
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
};

exports.getDashboard =(req,res,next) => {
    res.render('./general/dashboard', {
        pageTitle: "Welcome to Vudu",
        userName : ""
    });
};

exports.getMovieList = (req,res,next) => {
    res.render('./general/allMovieTvList', {
        pageTitle : "Movies",
        movies: req.movies
    });
};

exports.getTvList = (req,res,next) => {
    res.render('./general/allMovieTvList', {
        pageTitle : "TVs",
        movies : req.movies
    }); 
};

exports.getProductDescription = (req,res,next) => {
    res.render("./general/productDescription", {movie:req.movie}); 
};

exports.searchMovies = (req,res,next) => {
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
};