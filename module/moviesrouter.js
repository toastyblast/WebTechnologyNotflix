var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Notflix', {useMongoClient: true});
var Movie = require('../model/movies.js');

var router = express.Router();

router.get('/', function (req, res) {
    var jsonString = '{"Movies":[]}';
    var obj = JSON.parse(jsonString);
    var allmovies;

    //Check what the user is querying, and depending on query execute on of the if's.
    if (req.query.title !== undefined) {
        //If the user search for a movie by a title, check each movie's title if it contains the query word.
        //If it does add it to the answer string and in the end print it.
        Movie.find({}, function (err, movies) {

            if (err) {
                res.status(500);
                res.json({errorMessage: 'No list of movies could be found in the database.'});
                return console.error(err);
            }

            movies.forEach(function (movie, i) {
                var title = movie.title;
                console.log(movie);

                //Add the movie to the response string.
                if (title.toLowerCase().indexOf(req.query.title.toLowerCase()) !== -1) {
                    obj["Movies"].push({
                        tt_number: movie.tt_number,
                        title: movie.title,
                        date: movie.publication_date,
                        length: movie.length,
                        director: movie.director,
                        description: movie.description
                    });
                }

                if (movies.length - 1 === i) {

                    if (obj.Movies.length === 0) {
                        res.status(404);
                        res.json("Sorry we could not find a movie that matches your search.")
                    } else {
                        res.status(200);
                        res.header("Access-Control-Allow-Origin", "*");
                        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                        res.json(obj);
                    }
                }
            })
        });
    } else if (req.query.director !== undefined) {
        //If the user search for a movie by a director, check each movie's director if it contains the query word.
        //If it does add it to the answer string and in the end print it.
        Movie.find({}, function (err, movies) {

            if (err) {
                res.status(500);
                res.json({errorMessage: 'No list of movies could be found in the database.'});
                return console.error(err);
            }

            movies.forEach(function (movie, i) {
                var director = movie.director;
                console.log(director);

                //Add the movie to the response string.
                if (director.toLowerCase().indexOf(req.query.director.toLowerCase()) !== -1) {
                    obj["Movies"].push({
                        tt_number: movie.tt_number,
                        title: movie.title,
                        date: movie.publication_date,
                        length: movie.length,
                        director: movie.director,
                        description: movie.description
                    });
                }

                if (movies.length - 1 === i) {

                    if (obj.Movies.length === 0) {
                        res.status(404);
                        res.json("Sorry we could not find a movie that matches your search.")
                    } else {
                        res.status(200);
                        res.header("Access-Control-Allow-Origin", "*");
                        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                        res.json(obj);
                    }
                }
            })
        });
    } else if (req.query.description !== undefined) {
        //If the user search for a movie by a description, check each movie's description if it contains the query word.
        //If it does add it to the answer string and in the end print it.
        Movie.find({}, function (err, movies) {

            if (err) {
                res.status(500);
                res.json({errorMessage: 'No list of movies could be found in the database.'});
                return console.error(err);
            }

            movies.forEach(function (movie, i) {
                var description = movie.description;
                console.log(description);

                //Add the movie to the response string.
                if (description.toLowerCase().indexOf(req.query.description.toLowerCase()) !== -1) {
                    obj["Movies"].push({
                        tt_number: movie.tt_number,
                        title: movie.title,
                        date: movie.publication_date,
                        length: movie.length,
                        director: movie.director,
                        description: movie.description
                    });
                }

                if (movies.length - 1 === i) {

                    if (obj.Movies.length === 0) {
                        res.status(404);
                        res.json("Sorry we could not find a movie that matches your search.")
                    } else {
                        res.status(200);
                        res.header("Access-Control-Allow-Origin", "*");
                        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                        res.json(obj);
                    }
                }
            })
        });
    } else if (req.query.ttnumber !== undefined) {
        //If the user search for a movie by a tt_number, check each movie's tt_number if it equals the query number.
        //If it does add it to the answer string and in the end print it.
        Movie.find({}, function (err, movies) {

            if (err) {
                res.status(500);
                res.json({errorMessage: 'No list of movies could be found in the database.'});
                return console.error(err);
            }

            movies.forEach(function (movie, i) {
                var ttnumber = movie.tt_number;
                console.log(ttnumber);

                //Add the movie to the response string.
                if (ttnumber === parseInt(req.query.ttnumber)) {
                    obj["Movies"].push({
                        tt_number: movie.tt_number,
                        title: movie.title,
                        date: movie.publication_date,
                        length: movie.length,
                        director: movie.director,
                        description: movie.description
                    });
                    console.log(obj);
                }

                if (movies.length - 1 === i) {

                    if (obj.Movies.length === 0) {
                        res.status(404);
                        res.json("Sorry we could not find a movie that matches your search.")
                    } else {
                        res.status(200);
                        res.header("Access-Control-Allow-Origin", "*");
                        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                        res.json(obj);
                    }
                }
            })
        });
    } else if (req.query.pag !== undefined){

            Movie.paginate({}, { offset: parseInt(req.query.pag)*3, limit: 3 }, function(err, result) {
                // result.docs
                // result.total
                // result.limit - 10
                // result.offset - 20
                res.json(result.docs);
            });

    } else {
        Movie.paginate({}, { offset: 0, limit: 3 }, function(err, result) {
            // result.docs
            // result.total
            // result.limit - 10
            // result.offset - 20
            res.json(result.docs);
        });
    }
});


module.exports = router;