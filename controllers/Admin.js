const express = require('express');
const router = express.Router();

const {adminAuthentication} = require('../middleware/userValidation.js');
const movieRetrive = require('../middleware/movieRetrieve.js');
const adminService = require('../services/AdminService.js');

router.get('/addMovieTv',adminAuthentication,adminService.getAddMovieTv);

router.get('/updateMovieTv/:id', adminAuthentication,movieRetrive.retrieveMovieById, adminService.getUpdateMovieTv);

router.get('/dashboard', adminAuthentication, adminService.getDashboard);

router.get('/allMovieTv', adminAuthentication,movieRetrive.retrieveAllMovieTV,adminService.getAllMovieTv);

router.post('/addMovieTv', adminAuthentication, adminService.addMovieTv);

router.put('/updateMovieTv/:id',adminAuthentication, movieRetrive.retrieveMovieById, adminService.updateMovieTv);

router.delete('/deleteMovieTv/:id',adminAuthentication,adminService.deleteMovie);

module.exports=router;