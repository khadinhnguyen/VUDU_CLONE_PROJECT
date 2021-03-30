const express = require('express');
const router = express.Router();
const movieModel = require('../model/Movie');
const path = require('path');

const validation = require('../model/validation.js');


router.get('/addMovieTv', (req,res) => {
    res.render("./admin/adminMovieAddForm", {
        pageTitle : "Add Movie or TV",
    });
});

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

    const movie = new movieModel(newMovie);
    movie.save()
    .then((movie)=>{     
        console.log(req.files.smallPosterImg.name); 
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

});

module.exports=router;