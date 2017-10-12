var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient: true});
var Movie = require('../model/movies.js');
var router = express.Router();

//TODO - MARTIN: Add status returns for every case that could be reached. So also including when no list can be found (throw 500-series).

//Created ratings (On Yoran's Database):
// - tt_number = 123, title = 'Title of the movie', publication_date = '12-12-2012', length_min = 121, director = 'Director of this movie', description = 'This is the first movie in the database'
// - ...

// var post = new Movie({
//     tt_number: ???,
//     title: '???',
//     publication_date: DD-MM-YYYY,
//     length_min: ???,
//     director: '??? ???',
//     description: '???'});
//
// post.save(function (err, result) {
//     if (err) {
//         return console.error(err);
//     }
// });

router.get('/', function (req, res) {
    Movie.find({}, function (err, movies) {

        if (err) {
            res.status(500);
            res.json({errorMessage: 'No list of movies could be found in the database.'});
            return console.error(err);
        }

        res.status(200);
        res.json(movies);
    })
});

router.get('/:search', function (req, res) {

    function findTitle(value, callback) {
        Movie.find({title: value}, function (err, movies) {
            if (movies.length > 0) {
                res.json(movies);
            } else {
                callback();
            }
        });
    }

    function findDirector(value, callback) {
        Movie.find({director: value}, function (err, movies) {
            if (movies.length > 0) {
                console.log(movies);
                res.json(movies);
            } else {
                callback();
            }
        });
    }

    function findTTNumber(value, callback) {
        Movie.find({tt_number: value}, function (err, movies) {
            if (movies.length > 0) {
                res.json(movies);
            } else {
                callback();
            }
        });
    }

    function showMessage(value, callback) {
        res.json(value);
    }

    var query = req.params.search;

    if (isNaN(query)) {

        findTitle(query, function () {
            findDirector(query, function () {
                showMessage('There is no such movie.', function () {

                })
            });
        });

    } else {

        findTTNumber(query, function () {
            showMessage('There is no such movie.', function () {

            })
        });

    }


});

module.exports = router;