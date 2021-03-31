const express = require('express');
const router = express.Router();
const path = require('path');

const movieModel = require('../model/Movie');
const validation = require('../model/validation.js');
const movie_ultil = require('../model/movie_ultility');
const { movieAddValidation} = require('../model/validation')

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

router.get('/allMovieTv', (req,res)=>{
    movieModel.find()
    .then((results)=>{
        const movies = results.map(result=>{
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
        res.render('./admin/allMovieTvList',{
            pageTitle : "All Movie and TV (Admin Only)",
            movies

    })
    .catch(err=>console.log(`Err when load all movie for admin ${err}`));


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

router.put('/updateMovieTv/:id',(req,res)=>{
    const updatedMovie = {
        title: req.body.title,
        synopsis: req.body.synopsis,
        rentalPrice: req.body.rentalPrice,
        purchasePrice: req.body.purchasePrice,
        category: req.body.category,
        genre: req.body.genre,
        rating: req.body.rating,
        numberOfStar:req.body.numberOfStar,
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

    const errors = movieAddValidation(updatedMovie,imgUpload);
    if(errors.errorOccured){
        const {title,synopsis,rentalPrice,purchasePrice,category,genre,rating,numberOfStar,feature} = updatedMovie;
        res.render("./admin/adminMovieUpdateForm", {
            pageTitle : "Update Movie or TV",
            errors,
            _id:req.params.id,
            title,synopsis,rentalPrice,purchasePrice,category,genre,rating,numberOfStar,feature
        });
    }else{
        console.log("sucessful update");
        res.redirect('/');


        movieModel.updateOne({_id:req.params.id}, updatedMovie)
        .then((movie)=>{
            if(imgUpload.smallPosterImg.length > 0 && imgUpload.largePosterImg.length == 0){
                req.files.smallPosterImg.name = `small_poster_pic_${movie._id}${path.parse(req.files.smallPosterImg.name).ext}`;
                req.files.smallPosterImg.mv(`public/img/movie/${req.files.smallPosterImg.name}`)
                .then(()=>{
                    movieModel.updateOne({_id:req.params.id}, {smallPosterImg:req.files.smallPosterImg.name})
                    .then(()=>{
                        console.log('movie is successfully updated with small Poster');
                        res.redirect('/admin/allMovieTV'); 
                    })
                    .catch(err=>consolee.log(`err: ${err}`));
                })
                .catch(err=>console.log(`err ${err}`))
            } else if(imgUpload.smallPosterImg.length == 0 && imgUpload.largePosterImg.length > 0){
                req.files.largePosterImg.name = `small_poster_pic_${movie._id}${path.parse(req.files.largePosterImg.name).ext}`;
                req.files.largePosterImg.mv(`public/img/movie/${req.files.largePosterImg.name}`)
                .then(()=>{
                    movieModel.updateOne({_id:req.params.id}, {largePosterImg:req.files.largePosterImg.name})
                    .then(()=>{
                        console.log('movie is successfully updated with large Poster');
                        res.redirect('/admin/allMovieTV'); 
                    })
                    .catch(err=>consolee.log(`err: ${err}`));
                })
                .catch(err=>console.log(`err ${err}`))
            } else if(imgUpload.smallPosterImg.length > 0 && imgUpload.largePosterImg.length > 0){

                req.files.smallPosterImg.name = `small_poster_pic_${movie._id}${path.parse(req.files.smallPosterImg.name).ext}`;
                req.files.largePosterImg.name = `large_poster_pic_${movie._id}${path.parse(req.files.smallPosterImg.name).ext}`;
                req.files.smallPosterImg.mv(`public/img/movie/${req.files.smallPosterImg.name}`)        
                .then(()=>{
                    req.files.largePosterImg.mv(`public/img/movie/${req.files.largePosterImg.name}`)
                    .then(()=>{
                        movieModel.updateOne({_id:req.params.id},{
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

            } else {
                console.log('movie is successfully updated without any Poster');
                res.redirect('/admin/allMovieTV'); 
            }
        })
        .catch(err=>console.log(`Err when update movie ${err}`));

        movie.save()
        .then((movie)=>{     
            req.files.smallPosterImg.name = `small_poster_pic_${movie._id}${path.parse(req.files.smallPosterImg.name).ext}`;
            req.files.largePosterImg.name = `large_poster_pic_${movie._id}${path.parse(req.files.smallPosterImg.name).ext}`;
            req.files.smallPosterImg.mv(`public/img/movie/${req.files.smallPosterImg.name}`)        
            .then(()=>{
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
})

module.exports=router;