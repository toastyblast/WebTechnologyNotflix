//Load the express module and create a new app with it.
var express = require('express');
var mongoose = require('mongoose');
var movieRouter = require('./module/moviesrouter.js');
var ratingRouter = require('./module/ratingsrouter.js');
var app = express();

//Start the Mongoose connection.
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient:true});

//Parse the body of HTTP request and transform it to JSON.
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//Now specify all the URL routings and add their handling
/* -=- MOVIE RELATED ROUTINGS -=- */
app.use('/api/movies/', movieRouter);

/* -=- USER RELATED ROUTINGS -=- */
app.use('/api/users/', ratingRouter);

/* -=- RATING RELATED ROUTINGS -=- */
app.use('/api/ratings/', ratingRouter);

//Start the server at port 3000.
app.listen(3000);