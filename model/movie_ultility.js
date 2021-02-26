const movies = require('./movies_database');

const movie_ultil = {


    getAllMovies(){
        return movies;
    },

    getTypedMovies(type, max = movies.length){
        const filteredMovies = [];
        for (let i = 0; i < movies.length && filteredMovies.length < max; i++){
            if (movies[i].category === type){
                filteredMovies.push(movies[i]);
            }
        }
        
        return filteredMovies;
    },

    getPromotedMovies(type, max = movies.length){
        const filteredMovies = [];
        for (let i = 0; i < movies.length && filteredMovies.length < max; i++){
            if (movies[i].promotion === type){
                filteredMovies.push(movies[i]);
            }
        }
        
        return filteredMovies;
    },

    getMovie(id) {
        const movie = movies.find((movie) => {
            return movie.id == id;
        })

        return movie;
    }

    

}

module.exports=movie_ultil;