const express = require('express');
const router = express.Router();
const path = require('path');

const movieModel = require('../model/Movie');
const validation = require('../model/validation.js');
const movie_ultil = require('../model/movie_ultility');
const { movieAddValidation} = require('../model/validation')
const movieRetrive = require('../middleware/movieRetrieve.js');

router.get('/addMovieTv', (req,res) => {
    const movie = {
        feature: "no"
    }
    res.render("./admin/adminMovieAddForm", {
        pageTitle : "Add Movie or TV",
        movie
    });
});

router.get('/updateMovieTv/:id', (req,res)=>{
    movieModel.findById(req.params.id)
    .then((movie)=>{
        const {_id,title,synopsis,rentalPrice,purchasePrice,category,genre,rating,numberOfStar,feature} = movie;
        res.render("./admin/adminMovieUpdateForm", {_id,title,synopsis,rentalPrice,purchasePrice,category,genre,rating,numberOfStar,feature})

    })
    .catch(err=>console.log(`Error when find a movie for edit ${err}`)); 


})

router.get('/dashboard', (req,res)=>{
    res.render("./admin/adminDashboard", {
        pageTitle : "Admin Dashboard"
    })
});

router.get('/allMovieTv', movieRetrive.retrieveAllMovieTV,(req,res)=>{
    res.render('./general/allMovieTvList',{
        pageTitle : "All Movie and TV (Admin Only)", 
        movies: req.movies
    })
})

router.post('/addMovieTv', (req,res)=>{
    const newMovie = {
        title: req.body.title,
        synopsis: req.body.synopsis, 
        rentalPrice: req.body.rentalPrice,
        purchasePrice: req.body.purchasePrice,
        category: req.body.category,
        genre: req.body.genre,
        rating: req.body.rating,
        numberOfStar:req.body.numberOfStar,
        feature: req.body.feature,
        smallPosterImg: "",
        largePosterImg: ""
    }

    // const imgUpload = {
    //     smallPosterImg: "",
    //     largePosterImg: "",
    // };
    if(req.files){
        if(req.files.smallPosterImg){
            console.log(path.parse(req.files.smallPosterImg.name).ext)
            newMovie.smallPosterImg = path.parse(req.files.smallPosterImg.name).ext
        }
        if(req.files.largePosterImg){
            console.log(path.parse(req.files.largePosterImg.name).ext)
            newMovie.largePosterImg = path.parse(req.files.largePosterImg.name).ext
        }        
    }
    
    const errors = movieAddValidation(newMovie);
    if(errors.errorOccured){
        res.render("./admin/adminMovieAddForm", {
            pageTitle : "Add Movie or TV",
            errors,
            movie : newMovie
        });
    }else{
        const movie = new movieModel(newMovie);
        movie.save()
        .then((movie)=>{     
            req.files.smallPosterImg.name = `small_poster_pic_${movie._id}${path.parse(req.files.smallPosterImg.name).ext}`;
            req.files.largePosterImg.name = `large_poster_pic_${movie._id}${path.parse(req.files.smallPosterImg.name).ext}`;
            req.files.smallPosterImg.mv(`public/img/movie/${req.files.smallPosterImg.name}`)        
            .then(()=>{
                console.log("after smallPoster mv")
                req.files.largePosterImg.mv(`public/img/movie/${req.files.largePosterImg.name}`)
                .then(()=>{
                    movieModel.updateOne({_id:movie._id},{
                        smallPosterImg:req.files.smallPosterImg.name,
                        largePosterImg:req.files.largePosterImg.name
                    })
                    .then(()=>{
                        console.log('movie is successfully save');
                        res.redirect('/admin/addMovieTV'); 
                    })
                    .catch(err=>console.log(`Err while update poster Img ${err}`));
                })
                .catch(err=>console.log(`Error while inserting large poster img${err}`));                        
            })
            .catch(err=>console.log(`Err while mv small poster Img ${err}`));            
        })
        .catch(err=>console.log(`Error while inserting movie the data ${err}`));
    }

    

});

router.put('/updateMovieTv/:id',movieRetrive.retrieveMovieById, (req,res)=>{
    let smallImgUpdate = false;
    let largeImgUpdate = false;

    const updatedMovie = {
        title: req.body.title,
        synopsis: req.body.synopsis,
        rentalPrice: req.body.rentalPrice,
        purchasePrice: req.body.purchasePrice,
        category: req.body.category,
        genre: req.body.genre,
        rating: req.body.rating,
        numberOfStar:req.body.numberOfStar,
        feature: req.body.feature,
        smallPosterImg: req.movie.smallPosterImg,
        largePosterImg: req.movie.largePosterImg
    }

    if(req.files){
        if(req.files.smallPosterImg){
            updatedMovie.smallPosterImg = `small_poster_pic_${req.params.id}${path.parse(req.files.smallPosterImg.name).ext}`;
            smallImgUpdate = true;
            req.files.smallPosterImg.mv(`public/img/movie/${updatedMovie.smallPosterImg}`).catch(err=>console.log(`Err when .mv small Image ${err}`));
        }
        if(req.files.largePosterImg){
            updatedMovie.largePosterImg = `large_poster_pic_${req.params.id}${path.parse(req.files.smallPosterImg.name).ext}`;
            largeImgUpdate = true;
            req.files.largePosterImg.mv(`public/img/movie/${updatedMovie.largePosterImg}`).catch(err=>console.log(`Err when .mv large Image ${err}`));
        }        
    }

    const errors = movieAddValidation(updatedMovie);
    if(errors.errorOccured){
        const {title,synopsis,rentalPrice,purchasePrice,category,genre,rating,numberOfStar,feature} = updatedMovie;
        res.render("./admin/adminMovieUpdateForm", {
            pageTitle : "Update Movie or TV",
            errors,
            _id:req.params.id,
            title,synopsis,rentalPrice,purchasePrice,category,genre,rating,numberOfStar,feature

        });
    }else{
        console.log("to be update");
        movieModel.updateOne({_id:req.params.id}, updatedMovie)
        .then(()=>{
            console.log("sucessful update");
            res.redirect('/');            
        })
        .catch(err=>console.log(`Err when update movie ${err}`));


    }
})

module.exports=router;