//Load the express module and create a new app with it.
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var movieRouter = require('./module/moviesrouter.js');
var ratingRouter = require('./module/ratingsrouter.js');
var userRouter = require('./module/userrouter.js');
var authenticationRouter = require('./module/authentication.js');

var app = express();

app.set('secretkey', 'counsellorPalpatineDidNothingWrong');

//TODO: Ask the teacher on how he'll be setting up his database. Will he first go into MongoDB to set up a "Notflix" too, or are we expected to do that in some kind of way in code?

//Start the Mongoose connection.
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient: true});

//Parse the body of HTTP request and transform it to JSON.
app.use(bodyParser.json());

/* -=- AUTHENTICATION RELATED ROUTINGS -=- */
app.use('/api/authenticate/', authenticationRouter);

//Now specify all the URL routings and add their handling
/* -=- MOVIE RELATED ROUTINGS -=- */
app.use('/api/movies/', movieRouter);

/* -=- USER RELATED ROUTINGS -=- */
app.use('/api/users/', userRouter);

/* -=- RATING RELATED ROUTINGS -=- */
app.use('/api/ratings/', ratingRouter);

//Start the server at port 3000.
app.listen(3000);