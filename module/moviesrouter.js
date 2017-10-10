var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient:true});
var Movie = require('../model/movies.js');

router.get('/:search', function (req, res) {

    var query = req.params.search;
    var result = 1;
    var backup = 2;



    if (isNaN(query)){
        Movie.find({title: query}, function (err, movies) {
            result = movies;
            if (result.length > 0){
                console.log(result.length);
                res.json(result);
            }
        });

        Movie.find({director: query}, function (err, movies) {
            result = movies;
            if (result.length > 0){
                console.log(result.length);
                res.json(result);
            } else {
                Movie.find(function (err, movies) {
                    if (err) return console.error(err);
                    backup = movies;
                    res.json(backup);
                });
            }
        });
    } else {


        Movie.find({tt_number: query}, function (err, movies) {
            result = movies;
            if (result.length > 0){
                console.log(result.length);
                res.json(result);
            } else {
                Movie.find(function (err, movies) {
                    if (err) return console.error(err);
                    backup = movies;
                    res.json(backup);
                });
            }
        });
    }

    if (result.length < 1){

    }

    //TODO: Check for any queries in the link here, otherwise return all movies.
});

//TODO: Turn these into a search query you check for in the router.get above this TODO.
// router.get('/:tt_number', function (req, res) {
//     res.json({response:'Returns the movie with that tt_number!'});
// });
//
// router.get('/:title', function (req, res) {
//     res.json({response:'Returns a movie with that title!'});
// });
//
// router.get('/:director', function (req, res) {
//     res.json({response:'Returns all movies with the given director!'});
// });

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