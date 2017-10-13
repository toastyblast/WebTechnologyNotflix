var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient: true});
var Movie = require('../model/movies.js');
var router = express.Router();

//TODO - MARTIN: Add status returns for every case that could be reached. So also including when no list can be found, throw 404 if the query cannot be found.

//TODO: Find a way to have these search just on a part of a director's name or movie title (so less specific), and without case sensitivity. (So "title of" and "director of" should return the movie as well, and not only "Title of the movie" and "Director of the movie").

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