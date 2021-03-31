const express = require('express');
const router = express.Router();
const path = require('path');

const movieModel = require('../model/Movie');
const validation = require('../model/validation.js');
const movie_ultil = require('../model/movie_ultility');
const { movieAddValidation} = require('../model/validation')

router.get('/addMovieTv', (req,res) => {
    res.render("./admin/adminMovieAddForm", {
        pageTitle : "Add Movie or TV",
    });
});

router.get('/dashboard', (req,res)=>{
    res.render("./admin/adminDashboard", {
        pageTitle : "Admin Dashboard"
    })
});

router.get('/allMovieTv', (req,res)=>{
    res.render('./admin/allMovieTvList',{
        pageTitle : "All Movie and TV (Admin Only)",
        movies : movie_ultil.getAllMovies()
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
        feature: req.body.feature
    }

    const imgUpload = {
        smallPosterImg: "",
        largePosterImg: "",
    };
    if(req.files){
        if(req.files.smallPosterImg){
            console.log(path.parse(req.files.smallPosterImg.name).ext)
            imgUpload.smallPosterImg = path.parse(req.files.smallPosterImg.name).ext
        }
        if(req.files.largePosterImg){
            console.log(path.parse(req.files.largePosterImg.name).ext)
            imgUpload.largePosterImg = path.parse(req.files.largePosterImg.name).ext
        }        
    }
    
    const errors = movieAddValidation(newMovie,imgUpload);
    if(errors.errorOccured){
        res.render("./admin/adminMovieAddForm", {
            pageTitle : "Add Movie or TV",
            errors
        });
    }

    // const movie = new movieModel(newMovie);
    // movie.save()
    // .then((movie)=>{     
    //     console.log(req.files.smallPosterImg.name); 
    //     req.files.smallPosterImg.name = `small_poster_pic_${movie._id}${path.parse(req.files.smallPosterImg.name).ext}`;
    //     req.files.largePosterImg.name = `large_poster_pic_${movie._id}${path.parse(req.files.smallPosterImg.name).ext}`;
    //     req.files.smallPosterImg.mv(`public/img/movie/${req.files.smallPosterImg.name}`)        
    //     .then(()=>{
    //         console.log("after smallPoster mv")
    //         req.files.largePosterImg.mv(`public/img/movie/${req.files.largePosterImg.name}`)
    //         .then(()=>{
    //             movieModel.updateOne({_id:movie._id},{
    //                 smallPosterImg:req.files.smallPosterImg.name,
    //                 largePosterImg:req.files.largePosterImg.name
    //             })
    //             .then(()=>{
    //                 console.log('movie is successfully save');
    //                 res.redirect('/admin/addMovieTV'); 
    //             })
    //             .catch(err=>console.log(`Err while update poster Img ${err}`));
    //         })
    //         .catch(err=>console.log(`Error while inserting large poster img${err}`));                        
    //     })
    //     .catch(err=>console.log(`Err while mv small poster Img ${err}`));

        
    // })
    // .catch(err=>console.log(`Error while inserting movie the data ${err}`));

});

module.exports=router;