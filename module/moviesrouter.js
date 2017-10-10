var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient:true});
var Movie = require('../model/movies.js');
var router = express.Router();

//TODO - MARTIN: Add status returns for every case that could be reached. So also including when no list can be found (throw 500-series).

router.get('/', function (req, res) {
    Movie.find({}, function (err, movies) {

        if (err) {
            res.status(500);
            res.json({errorMessage:'No list of movies could be found in the database.'});
            return console.error(err);
        }

        res.status(200);
        res.json(movies);
    })
});

router.get('/:search', function (req, res) {
    var query = req.params.search;
    var result = 1;
    var backup = 2;

    if (isNaN(query)){

        Movie.find({title: query}, function (err, movies) {
            result = movies;

            if (result.length > 0){
                console.log(result.length);
                res.status(200);
                res.json(result);
            }
        });

        Movie.find({director: query}, function (err, movies) {
            result = movies;

            if (result.length > 0){
                console.log(result.length);
                res.status(200);
                res.json(result);
            } else {

                Movie.find(function (err, movies) {

                    if (err) return console.error(err);

                    backup = movies;
                    //TODO: which status should be given here?
                    // res.status(200);
                    res.json(backup);
                });
            }
        });
    } else {

        Movie.find({tt_number: query}, function (err, movies) {
            result = movies;

            if (result.length > 0){
                console.log(result.length);
                res.status(200);
                res.json(result);
            } else {

                Movie.find(function (err, movies) {

                    if (err) return console.error(err);

                    backup = movies;
                    //TODO: which status should be given here?
                    // res.status(200);
                    res.json(backup);
                });
            }
        });
    }

    if (result.length < 1){

    }
});

router.get('/:id', function (req, res) {
    res.json({response:'Returns the movie with that database ID!'});
});

module.exports = router;

// var post = new Movie({
//     tt_number: 123,
//     title: 'Title of the movie',
//     publication_date: 12-12-1212,
//     length_min: 123,
//     director: 'Director of this movie',
//     description: 'This is the first movie.'});

// post.save(function (err, result) {
//     if (err) {
//         return console.error(err);
//     }
// });