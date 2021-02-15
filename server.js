const movie_ultil = require('./database/movie_ultility.js')
const heroImages = require('./database/hero_images.js')
var express = require('express');
var exphbs  = require('express-handlebars');
 
var app = express();

app.use(express.static('public'));
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
 
app.get('/', (req, res) => {
    res.render("home", {
        movies : movie_ultil.getTypedMovies('movie',8),
        TVs : movie_ultil.getTypedMovies('tv',8),
        backgroundImage : heroImages,        
    });
});

app.get('/sign-in', (req,res) => {
    res.render("signin");
});

app.get('/account-setup', (req,res) => {
    res.render("registration");
});

// app.get('/hero-test', (req,res)=>{
//     res.render("heroTest", {
//         // backgroundImage : heroImages,
//         backgroundImage : heroImages,
//     });
// });

app.get('/:id', (req,res) => {
    console.log(req.params.id);
    res.render("productDescription", {
        // product : {
        //     id : 1398601,
        //     title : 'Trolls World Tour',
        //     year : 2020,
        //     rating: 4, // stars
        //     description: "Poppy and Branch discover that they are but one of six different Troll tribes scattered over six different lands, each devoted to a different form of music: Pop, Funk, Classical, Techno, Country and Rock. Their world is about to get a lot bigger, and a whole lot louder. A member of hard-rock royalty, Queen Barb, wants to destroy all other kinds of music to let rock reign supreme. Poppy, Branch and their friends set out to visit all the other lands to unify the Trolls in harmony.",
        //     category : "movie",
        //     rent : 3.99,
        //     buy : 14.00,
        //     posterImage : "https://images2.vudu.com/poster2/1398601-168",
        //     backgroundImage : "https://images2.vudu.com/background/1398601-1280a.jpg"
    
        // }
        product : movie_ultil.getMovie(req.params.id),
    });
});



PORT = 3000;
app.listen(PORT, () =>{
    console.log(`we are connecting to PORT: ${PORT}`);
});