const express = require('express')
const router = express.Router();

const movieRetrieve = require('../middleware/movieRetrieve.js');
const generalService = require('../services/GeneralService.js');

router.get('/', movieRetrieve.retrieveFeaturedRentals,movieRetrieve.retrieveFeaturedWeekdeal,movieRetrieve.retrieveFeaturedNewReleases, movieRetrieve.retrieveFeaturedTVs,movieRetrieve.retrieveFeaturedBanners,generalService.getHomePage); 
router.get('/movie-list',movieRetrieve.retrieveAllMovie, generalService.getMovieList);
router.get('/tv-list',movieRetrieve.retrieveAllTV, generalService.getTvList);
router.get('/movie/:id', movieRetrieve.retrieveMovieById, generalService.getProductDescription); 
router.post('/search-result', generalService.searchMovies);
 
module.exports=router;

