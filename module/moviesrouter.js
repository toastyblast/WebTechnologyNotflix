var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient: true});
var Movie = require('../model/movies.js');
var router = express.Router();

//TODO - MARTIN: Add status returns for every case that could be reached. So also including when no list can be found, throw 404 if the query cannot be found.

//TODO: Find a way to have these search just on a part of a director's name or movie title (so less specific), and without case sensitivity. (So "title of" and "director of" should return the movie as well, and not only "Title of the movie" and "Director of the movie").

router.get('/', function (req, res) {
    var jsonString = '{"Movies":[]}';
    var obj = JSON.parse(jsonString);
    var allmovies;

    if (req.query.title !== undefined){
        Movie.find({}, function (err, movies) {

            if (err) {
                res.status(500);
                res.json({errorMessage: 'No list of movies could be found in the database.'});
                return console.error(err);
            }

            movies.forEach(function(movie, i){
                var title = movie.title;
                console.log(movie);
                if (title.toLowerCase().indexOf(req.query.title.toLowerCase()) !== -1) {
                    obj["Movies"].push({
                        tt_number : movie.tt_number,
                        title : movie.title,
                        date : movie.publication_date,
                        length : movie.length,
                        director : movie.director,
                        description : movie.description
                    });
                }
                if (movies.length-1 === i) {
                    if (obj.Movies.length === 0){
                        res.status(404);
                        res.json("Sorry we could not find a movie that matches your search.")
                    } else {
                        res.json(obj);
                    }
                }
            })
        });
    } else if (req.query.director !== undefined) {
        console.log("hi");
        Movie.find({}, function (err, movies) {

            if (err) {
                res.status(500);
                res.json({errorMessage: 'No list of movies could be found in the database.'});
                return console.error(err);
            }

            movies.forEach(function(movie, i){
                var title = movie.director;
                console.log(title);
                if (title.toLowerCase().indexOf(req.query.director.toLowerCase()) !== -1) {
                    obj["Movies"].push({
                        tt_number : movie.tt_number,
                        title : movie.title,
                        date : movie.publication_date,
                        length : movie.length,
                        director : movie.director,
                        description : movie.description
                    });
                }
                if (movies.length-1 === i) {
                    if (obj.Movies.length === 0){
                        res.status(404);
                        res.json("Sorry we could not find a movie that matches your search.")
                    } else {
                        res.json(obj);
                    }
                }
            })
        });
    } else if (req.query.description !== undefined){
        Movie.find({}, function (err, movies) {

            if (err) {
                res.status(500);
                res.json({errorMessage: 'No list of movies could be found in the database.'});
                return console.error(err);
            }

            movies.forEach(function(movie, i){
                var title = movie.description;
                console.log(title);
                if (title.toLowerCase().indexOf(req.query.description.toLowerCase()) !== -1) {
                    obj["Movies"].push({
                        tt_number : movie.tt_number,
                        title : movie.title,
                        date : movie.publication_date,
                        length : movie.length,
                        director : movie.director,
                        description : movie.description
                    });
                }
                if (movies.length-1 === i) {
                    if (obj.Movies.length === 0){
                        res.status(404);
                        res.json("Sorry we could not find a movie that matches your search.")
                    } else {
                        res.json(obj);
                    }
                }
            })
        });
    } else if (req.query.ttnumber !== undefined){
        Movie.find({}, function (err, movies) {

            if (err) {
                res.status(500);
                res.json({errorMessage: 'No list of movies could be found in the database.'});
                return console.error(err);
            }

            movies.forEach(function(movie, i){
                var title = movie.tt_number;
                console.log(title);
                if (title === parseInt(req.query.ttnumber)) {
                    obj["Movies"].push({
                        tt_number : movie.tt_number,
                        title : movie.title,
                        date : movie.publication_date,
                        length : movie.length,
                        director : movie.director,
                        description : movie.description
                    });
                    console.log(obj);
                }
                if (movies.length-1 === i) {
                    if (obj.Movies.length === 0){
                        res.status(404);
                        res.json("Sorry we could not find a movie that matches your search.")
                    } else {
                        res.json(obj);
                    }
                }
            })
        });
    }  else {
        Movie.find({}, function (err, movies) {

            if (err) {
                res.status(500);
                res.json({errorMessage: 'No list of movies could be found in the database.'});
                return console.error(err);
            }

            res.status(200);
            res.json(movies);
        })
    }
});


module.exports = router;