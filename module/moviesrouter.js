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
        Movie.paginate({ "title": { "$regex": ""+req.query.title+"", "$options": "i" } },{ offset: parseInt(req.query.pag)*3, limit: 3 }, function (err, movies) {
            res.json(movies);
        });
    } else if (req.query.director !== undefined) {
        //If the user search for a movie by a director, check each movie's director if it contains the query word.
        //If it does add it to the answer string and in the end print it.
        Movie.paginate({ "director": { "$regex": ""+req.query.director+"", "$options": "i" } },{ offset: parseInt(req.query.pag)*3, limit: 3 }, function (err, movies) {
            res.json(movies);
        });
    } else if (req.query.description !== undefined) {
        //If the user search for a movie by a description, check each movie's description if it contains the query word.
        //If it does add it to the answer string and in the end print it.
        Movie.paginate({ "description": { "$regex": ""+req.query.description+"", "$options": "i" } },{ offset: parseInt(req.query.pag)*3, limit: 3 }, function (err, movies) {
            res.json(movies);
        });
    } else if (req.query.ttnumber !== undefined) {
        //If the user search for a movie by a tt_number, check each movie's tt_number if it equals the query number.
        //If it does add it to the answer string and in the end print it.
        Movie.paginate({ "imdb_tt_number": req.query.ttnumber },{ offset: 0, limit: 3 }, function (err, movies) {
            res.json(movies);
        });
    } else if (req.query.pag !== undefined){

            Movie.paginate({}, { offset: parseInt(req.query.pag)*3, limit: 3 }, function(err, result) {
                // result.docs
                // result.total
                // result.limit - 10
                // result.offset - 20
                res.json(result);
            });

    } else {
        Movie.paginate({}, { offset: 0, limit: 3 }, function(err, result) {
            // result.docs
            // result.total
            // result.limit - 10
            // result.offset - 20
            res.json(result);
        });
    }
});

router.get('/all', function (req, res) {
    //Show all the users without showing the id and password.
    Movie.find({}, {'_id': 0, 'passwords': 0}, function (err, movies) {
        if (err) {
            res.status(500);
            res.json({errorMessage: 'No list of users could be found in the database.'});
            return console.error(err);
        } else {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.json(movies);
        }
    });
});


module.exports = router;