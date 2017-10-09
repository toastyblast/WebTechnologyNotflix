//Load the express module and create a new app with it.
var express = require('express');
var movieRouter = require('./module/moviesrouter');
var app = express();

//Parse the body of HTTP request and transform it to JSON.
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//Now specify all the URL routings and add their handling
/* -=- MOVIE RELATED ROUTINGS -=- */
app.use('/api/users/', movieRouter);

/* -=- USER RELATED ROUTINGS -=- */
app.post('/api/users', function (req, res) {
    res.send('Creates a user with the sent data, if it is original!');
});

app.get('/api/users', function (req, res) {
    res.send('Returns a list of all users, if the client requesting it is logged in!');
});

app.get('/api/users/:username', function (req, res) {
    res.send('Returns the user with that specific username (without their password, of course)');
});

/* -=- RATING RELATED ROUTINGS -=- */
app.get('/api/ratings', function (req, res) {
    res.send('Returns a list of all average ratings per movie');
});

app.post('/api/ratings', function (req, res) {
    res.send('Creates a new rating if the client is logged in');
});

app.put('/api/ratings/:username&:tt_number', function (req, res) {
    res.send('Updates the rating with that username and tt_number if the client is the one who posted said rating.');
});

app.delete('/api/ratings/:username&:tt_number', function (req, res) {
    res.send('Deletes the rating with that username and tt_number if the client is the one who posted said rating.');
});

app.get('/api/ratings/:tt_number', function (req, res) {
    res.send('Returns the average rating of the movie with the given tt_number');
});

app.get('/api/ratings/:username&:tt_number', function (req, res) {
    res.send('Returns the rating with that username and tt_number if the client is the one who posted said rating.');
});

//Start the server at port 3000.
app.listen(3000);