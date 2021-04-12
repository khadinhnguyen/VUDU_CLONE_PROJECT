const express = require('express')
const router = express.Router();

const movieRetrieve = require('../middleware/movieRetrieve.js');
const {retrieveAllItems} = require('../middleware/cartRetrieve.js');
const userService = require('../services/UserService.js');

router.get('/sign-in', userService.signIn);
router.get('/dashboard',retrieveAllItems,userService.dashboard);
router.get('/account-setup', userService.accountSetup); 
router.get('/logout', userService.logout);
router.post('/registerAccount', userService.postRegisterAccount);
router.post('/signInAccount', userService.postSignin);
router.post('/addRent/:id',movieRetrieve.retrieveMovieById,userService.addRental);
router.post('/addPurchase/:id',movieRetrieve.retrieveMovieById, userService.addPurchase);
router.delete('/delete/:id',userService.deleteCartItem);


module.exports=router;

