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