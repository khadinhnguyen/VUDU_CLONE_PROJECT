const movieModel = require('../model/Movie');

exports.retrieveMovieById = (req,res,next) =>{
    movieModel.findById(req.params.id)
    .then((result)=>{        
        req.movie = {
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
        };
        next();
    })
    .catch(err=>console.log(`err wwhen find one movie ${err}`));
    
};

exports.retrieveAllMovieTV = (req,res,next) => {
    movieModel.find()
    .then((results)=>{
        req.movies = results.map(result=>{
            return {
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
        });
        next();
    })
    .catch(err=>console.log(`Err when load all movie and tv for admin ${err}`));
};

exports.retrieveAllTV = (req,res,next) => {
    movieModel.find({category:"tv"})
    .then((results)=>{
        req.movies = results.map(result=>{
            return {
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
        });
        next();
    })
    .catch(err=>console.log(`Err when load all movie and tv for admin ${err}`));
};

exports.retrieveAllMovie = (req,res,next) => {
    movieModel.find({category:"movie"})
    .then((results)=>{
        req.movies = results.map(result=>{
            return {
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
        });
        next();
    })
    .catch(err=>console.log(`Err when load all movie and tv for admin ${err}`));
};

exports.retrieveFeaturedRentals = (req,res,next) => {
    movieModel.find({feature:"rental"})
    .then((results)=>{
        req.featuredRentals = results.map(result=>{
            return {
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
        });
        next();
    })
    .catch(err=>console.log(`Err when load all movie and tv for admin ${err}`));
};

exports.retrieveFeaturedWeekdeal = (req,res,next) => {
    movieModel.find({feature:"week-deal"})
    .then((results)=>{
        req.featuredWeekdeals = results.map(result=>{ 
            return {
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
        });
        next();
    })
    .catch(err=>console.log(`Err when load all movie and tv for admin ${err}`));
};

exports.retrieveFeaturedNewReleases = (req,res,next) => {
    movieModel.find({feature:"new-release"})
    .then((results)=>{
        req.featuredNewRealeases = results.map(result=>{ 
            return {
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
        });
        next();
    })
    .catch(err=>console.log(`Err when load all movie and tv for admin ${err}`));
};

exports.retrieveFeaturedTVs = (req,res,next) => {
    movieModel.find({feature:"tv-season"})
    .then((results)=>{
        req.featuredTVs = results.map(result=>{ 
            return {
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
        });
        next();
    })
    .catch(err=>console.log(`Err when load all movie and tv for admin ${err}`));
};

exports.retrieveFeaturedBanners = (req,res,next) => {
    movieModel.find({feature:"banner"})
    .then((results)=>{
        req.featuredBanners = results.map(result=>{ 
            return {
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
        });
        next();
    })
    .catch(err=>console.log(`Err when load all movie and tv for admin ${err}`));
};