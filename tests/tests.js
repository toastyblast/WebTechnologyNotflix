const superTest = require('supertest');

var express = require('express');
var mongoose = require('mongoose');
var User = require('../model/user.js');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient: true});
var router = express.Router();

var server = superTest.agent("http://localhost:3000");

describe("Movies unit tests", function () {
    /* -=- All tests for the GET /api/movies routing -=- */
    it("Should return all movies in the system", function (done) {
        server.get("/api/movies")
            .expect("Content-type", /json/)
            .expect(200, done);
    });
//
    /* -=- All tests for the GET /api/movies/:tt_number routing -=- */
    it("Should return a movie with the given tt_number", function (done) {
        server.get("/api/movies/?ttnumber=tt1663662") //Add existing movie number.
            .expect("Content-type", /json/)
            .expect(function(res) {
                res.body.docs[0]._id = "1"
            })
            .expect(200, {
                "docs": [
                    {
                        "_id": "1",
                        "imdb_tt_number": "tt1663662",
                        "tt_number": 789,
                        "title": "Pacific Rim",
                        "publication_date": "2013-11-12T00:00:00.000Z",
                        "length_min": 91,
                        "director": "Guillermo del Toro  ",
                        "description": "As a war between humankind and monstrous sea creatures wages on, a former pilot and a trainee are paired up to drive a seemingly obsolete special weapon in a desperate effort to save the world from the apocalypse. ",
                        "__v": 0
                    }
                ],
                "total": 1,
                "limit": 3,
                "offset": 0
            }, done);
    });
//
    it("Should return a 404 NOT FOUND error due to non-existant tt_number", function (done) {
        server.get("/api/movies/?ttnumber=1234")
            .expect("Content-type", /json/)
            .expect(404, '"Movie could not be found"', done);
    });
//
    /* -=- All tests for the GET /api/movies/:title routing -=- */
    it("Should return a movie with the given title", function (done) {
        server.get("/api/movies/?title=hard") //Add existing move title.
            .expect("Content-type", /json/)
            .expect(function(res) {
                res.body.docs[0]._id = "1"
            })
            .expect(200, {
                "docs": [
                    {
                        "_id": "1",
                        "imdb_tt_number": "tt0095016",
                        "tt_number": 456,
                        "title": "Die Hard",
                        "publication_date": "1988-08-20T00:00:00.000Z",
                        "length_min": 97,
                        "director": "John McTiernan",
                        "description": "John McClane, officer of the NYPD, tries to save his wife Holly Gennaro and several others that were taken hostage by German terrorist Hans Gruber during a Christmas party at the Nakatomi Plaza in Los Angeles. ",
                        "__v": 0
                    }
                ],
                "total": 1,
                "limit": 3,
                "offset": null
            }, done);
    });
//
    it("Should return a 404 NOT FOUND as the movie with the given title does not exist", function (done) {
        server.get("/api/movies/?title=MovieTitleThatDoesntExist")
            .expect("Content-type", /json/)
            .expect(404, '"Movie could not be found"', done);
    });
//
    /* -=- All tests for the GET /api/movies/:director routing -=- */
    it("Should return a movie with the given director", function (done) {
        server.get("/api/movies/?director=tim") //Add existing director.
            .expect("Content-type", /json/)
            .expect(function(res) {
                res.body.docs[0]._id = "1"
            })
            .expect(200, {
                "docs": [
                    {
                        "_id": "1",
                        "imdb_tt_number": "tt1431045",
                        "tt_number": 226,
                        "title": "Deadpool",
                        "publication_date": "2013-11-12T00:00:00.000Z",
                        "length_min": 91,
                        "director": " Tim Miller ",
                        "description": "A fast-talking mercenary with a morbid sense of humor is subjected to a rogue experiment that leaves him with accelerated healing powers and a quest for revenge. ",
                        "__v": 0
                    }
                ],
                "total": 1,
                "limit": 3,
                "offset": null
            }, done);
    });
//
    it("Should return a 404 NOT FOUND as the movie with the given director does not exist", function (done) {
        server.get("/api/movies/?director=DirectorThatDoesntExist")
            .expect("Content-type", /json/)
            .expect(404, '"Movie could not be found"', done);
    });

    it("Should return a movie with the given description", function (done) {
        server.get("/api/movies/?description=evil")
            .expect("Content-type", /json/)
            .expect(function(res) {
                res.body.docs[0]._id = "1";
                res.body.docs[1]._id = "2"
            })
            .expect(200, {
                "docs": [
                    {
                        "_id": "1",
                        "imdb_tt_number": "tt1490017",
                        "tt_number": 123,
                        "title": "The Lego Movie",
                        "publication_date": "2014-04-07T00:00:00.000Z",
                        "length_min": 94,
                        "director": "Christopher Miller",
                        "description": "An ordinary Lego construction worker, thought to be the prophesied 'Special', is recruited to join a quest to stop an evil tyrant from gluing the Lego universe into eternal stasis. ",
                        "__v": 0
                    },
                    {
                        "_id": "2",
                        "imdb_tt_number": "tt0472181",
                        "tt_number": 225,
                        "title": "The Smurfs",
                        "publication_date": "2013-11-12T00:00:00.000Z",
                        "length_min": 91,
                        "director": " Raja Gosnell",
                        "description": "When the evil wizard Gargamel chases the tiny blue Smurfs out of their village, they tumble from their magical world into New York City. ",
                        "__v": 0
                    }
                ],
                "total": 2,
                "limit": 3,
                "offset": null
            }, done);
    });

    it("Should return a 404 NOT FOUND as the movie with the given description does not exist", function (done) {
        server.get("/api/movies/?description=DescriptionThatDoesntExist")
            .expect("Content-type", /json/)
            .expect(404, '"Movie could not be found"', done);
    });

});

describe("Users unit tests", function () {
    /* -=- All tests for the POST /api/users routing -=- */
    it("Should create a new user with the given data", function (done) {
        server.post("/api/users")
            .send(({
                "lastname": "Test User Last Name",
                "middlename": " ",
                "firstname": "Test User First Name",
                "usern": "Test User Username", //Username must be unique
                "password": "123456"
            }))
            .expect("Content-type", /json/)
            .expect(201, done);
    });

    it("Should return a 400 BAD REQUEST as there is a missing password", function (done) {
        server.post("/api/users")
            .send(({
                "lastname": "Test User Last Name",
                "middlename": " ",
                "firstname": "Test User First Name",
                "usern": "UniqueName", //username must be unique
                "password": ""
            }))
            .expect("Content-type", /json/)
            .expect(400, done);
    });

    it("Should return a 409 CONFLICT as there is already a user with the given username", function (done) {
        server.post("/api/users")
            .send(({
                "lastname": "Test User Last Name",
                "middlename": " ",
                "firstname": "Test User First Name",
                "usern": "Test User Username", //Username must exist.
                "password": "password"
            }))
            .expect("Content-type", /json/)
            .expect(409, done);

    });

    /* -=- All tests for the GET /api/users routing -=- */
    it("Should return a 403 FORBIDDEN as the client is not logged in and thus not allowed to view the user list", function (done) {
        server.get("/api/users")
            .expect("Content-type", /json/)
            .expect(403, done);

        User.remove({username: 'Test User Username'}, function (err) {
            if (err) return handleError(err);

        });
    });

    it("Should return all users in the system (without password)", function (done) {
        server.get("/api/users")
            .set({"authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzd3h5ejE3IiwiaWF0IjoxNTA5MTg3NTQzLCJleHAiOjE1MTE2MDY3NDN9.Yk6Rk-8l5dGARr699DN29Q5_MB4ZdSOY-c0hDsHS05Y"})
            .expect("Content-type", /json/)
            .expect(200, done);
        mongoose.connection.close();
    });

    /* -=- All tests for the GET /api/users/:username routing -=- */
    it("Should return a 403 FORBIDDEN as the client is not logged in and thus not allowed to search for a user.", function (done) {
        server.get("/api/users/user/UniqueName")
            .expect("Content-type", /json/)
            .expect(403, done);
    });

    it("Should return a specific user (without password) with the given username", function (done) {
        server.get("/api/users/user/skellyton")
            .set({"authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzd3h5ejE3IiwiaWF0IjoxNTA5MTg3NTQzLCJleHAiOjE1MTE2MDY3NDN9.Yk6Rk-8l5dGARr699DN29Q5_MB4ZdSOY-c0hDsHS05Y"})
            .expect("Content-type", /json/)
            .expect(200, [
                {
                    "last_name": "Deurie",
                    "middle_name": "Bonkie",
                    "first_name": "Martyni",
                    "username": "skellyton",
                    "__v": 0,
                    "favourites": []
                }
            ], done);
    });

    it("Should return a 404 NOT FOUND as the user with the given username could not be found", function (done) {
        server.get("/api/users/user/UniqueUser3")
            .set({"authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzd3h5ejE3IiwiaWF0IjoxNTA5MTg3NTQzLCJleHAiOjE1MTE2MDY3NDN9.Yk6Rk-8l5dGARr699DN29Q5_MB4ZdSOY-c0hDsHS05Y"})
            .expect("Content-type", /json/)
            .expect(404, done);
    });

    it("Should return a list with the amount of users that was specified", function (done) {
        server.get("/api/users/2")
            .set({"authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzd3h5ejE3IiwiaWF0IjoxNTA5MTg3NTQzLCJleHAiOjE1MTE2MDY3NDN9.Yk6Rk-8l5dGARr699DN29Q5_MB4ZdSOY-c0hDsHS05Y"})
            .expect("Content-type", /json/)
            .expect(200, done);
    });

    it("Should return 400 BAD REQUEST because the value that was passed was not a number", function (done) {
        server.get("/api/users/a")
            .set({"authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzd3h5ejE3IiwiaWF0IjoxNTA5MTg3NTQzLCJleHAiOjE1MTE2MDY3NDN9.Yk6Rk-8l5dGARr699DN29Q5_MB4ZdSOY-c0hDsHS05Y"})
            .expect("Content-type", /json/)
            .expect(400, done);
    });

    it("Should return 403 FORBIDDEN because the user is not allowed to look for users when not logged in.", function (done) {
        server.get("/api/users/2")
            .expect("Content-type", /json/)
            .expect(403, done);
    });

    it("Should add a movie to the favorites of the user", function (done) {
        server.put("/api/users/favourites/The Lego Movie")
            .set({"authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzd3h5ejE3IiwiaWF0IjoxNTA5MTg3NTQzLCJleHAiOjE1MTE2MDY3NDN9.Yk6Rk-8l5dGARr699DN29Q5_MB4ZdSOY-c0hDsHS05Y"})
            .expect("Content-type", /json/)
            .expect(function (res) {
                res.body._id = '1';
            })
            .expect(200, {
                "_id": "1",
                "last_name": "Slavov",
                "middle_name": "Slavinov",
                "first_name": "Martin",
                "username": "sswxyz17",
                "passwords": "peanuts",
                "__v": 0,
                "favourites": [
                    "The Lego Movie"
                ]
            }, done);
    });

    it("Should give ERROR 404 DOES NOT EXIST because you are trying to favorite a non-existing movie.", function (done) {
        server.put("/api/users/favourites/MovieThatDoesntExist")
            .set({"authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzd3h5ejE3IiwiaWF0IjoxNTA5MTg3NTQzLCJleHAiOjE1MTE2MDY3NDN9.Yk6Rk-8l5dGARr699DN29Q5_MB4ZdSOY-c0hDsHS05Y"})
            .expect("Content-type", /json/)
            .expect(404, done);
    });

    //Usually it is impossible to get a token with non existing username from our system. But for the sake of testing
    //this token was created with the jwt website.
    it("Should give ERROR 404 DOES NOT EXIST because the token has a username which is not in the DB.", function (done) {
        server.put("/api/users/favourites/MovieOne")
            .set({"authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzd3h5ejE3NyIsImlhdCI6MTUwODA4NDkyNCwiZXhwIjoxNTEwNTA0MTI0fQ.rS1UooqWB615DNfoanO2xE5fa4Ck4Dvkv0wAURn8aSc"})
            .expect("Content-type", /json/)
            .expect(404, done);
    });

    it("Should give ERROR 403 DOES NOT EXIST because the user cannot add favourites while not logged in.", function (done) {
        server.put("/api/users/favourites/MovieOne")
            .expect("Content-type", /json/)
            .expect(403, done);
    });
});

describe("Authorization routing tests", function () {
    it("Should not generate a token if the request body is undefined or incorrect (400)", function (done) {
        var credentials = {'userna': 'toastyblast', 'pawords': 'cheese'};

        server.post('/api/authenticate/')
            .send(credentials)
            .expect('Content-Length', '92') //Length of the correct error message.
            .expect(400, done);
    });

    it("Should not generate a token if the username does not even exist (404)", function (done) {
        var credentials = {'username': 'toasty', 'passwords': 'cheese'};

        server.post('/api/authenticate/')
            .send(credentials)
            .expect('Content-Length', '70') //Length of the correct error message.
            .expect(404, done);
    });

    it("Should not generate a token if the username + password combination is wrong (400)", function (done) {
        var credentials = {'username': 'toastyblast', 'passwords': 'kaas'};

        server.post('/api/authenticate/')
            .send(credentials)
            .expect('Content-Length', '83') //Length of the correct error message.
            .expect(400, done);
    });

    it("Should generate a token if the username + password combination is correct (201)", function (done) {
        var credentials = {'username': 'toastyblast', 'passwords': 'cheese'};

        server.post('/api/authenticate/')
            .send(credentials)
            .expect('Content-type', /json/) //Length of the correct error message.
            .expect(201, done);//We can't check for much more as a length of a token is always random due to the date when it expires being included too.
    });
});

var correctAuthenticationCode = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvYXN0eWJsYXN0IiwiaWF0IjoxNTA5ODI0Nzc3LCJleHAiOjE1MTIyNDM5Nzd9.wbEc0OiBYlNEsKthKW0WqiTytRDCJI-pPFRHvB0D_w4'; //Auth token for toastyblast
//THIS TOKEN IS VALID UNTIL SUNDAY THE 12TH OF NOVEMBER 2017

describe("Ratings routings tests", function () {
    /* -=- All tests for the GET /api/ratings/ routing -=- */
    it("Should return a list of average ratings per movie", function (done) {
        server.get("/api/ratings/")
            .expect("Content-type", /json/)
            .expect(function (res) {
                res.body.theAverageRatings = [];
            })
            .expect(200, {
                'theAverageRatings': [] //Check if the body actually has an averageRatingsArray. We do not care about the contents, as those can be different for everyone testing this REST service.
            }, done);
    });

    /* -=- All tests for the GET /api/ratings/:tt_number routing -=- */
    it("Should show the average rating for the movie with the given tt_number (200)", function (done) {
        server.get("/api/ratings/123")
            .expect("Content-type", /json/)
            .expect(function (res) {
                res.body.averageRating = 3.5; //This doesn't matter, but we have to declare in the final expect. This
                // might've changed as the server is being used, so just give it some default value.
            })
            .expect(200, {
                'confirmationMessage': '200 OK - Average rating for the sought movie has been retrieved.',
                'tt_number': 123, //We really only want to check if it retrieved the same movie, the rest doesn't matter.
                'averageRating': 3.5
            }, done);
    });

    it("Should return a 404 if there is no movie with the given tt_number", function (done) {
        server.get("/api/ratings/147")
            .expect("Content-type", /json/)
            .expect("Content-Length", '144')
            .expect(404, done);
    });

    /* -=- All tests for the GET /api/ratings/:username routing & authorization integrity checks -=- */
    it("Should not show the ratings of a different user than the one logged in (400)", function (done) {
        server.get("/api/ratings/toastyblast")
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hcmtpcGxpZXIiLCJpYXQiOjE1MDk4MjQ4MTAsImV4cCI6MTUxMjI0NDAxMH0.lGWwwdVDBj0E2B4y4-MjJHuyj_U-HxxJe7qymq82I2Q') //This is the auth token of markiplier, not toastyblast
            //THIS TOKEN IS VALID UNTIL SUNDAY THE 12TH OF NOVEMBER 2017
            .expect("Content-type", /json/)
            .expect("Content-Length", "104") //Exact length of the error message given when the token is wrong.
            .expect(400, done);
    });

    it("Should show the ratings for the user with that username", function (done) {
        server.get("/api/ratings/toastyblast")
            .set('authorization', correctAuthenticationCode) //Auth token for toastyblast.set('authorization', correctAuthenticationCode) //Auth token for toastyblast
            .expect("Content-type", /json/)
            //We cannot truly check what's inside of the response as this may be different for every user of this RESTful service, if they changed anything.
            .expect(200, done);
    });

    it("Should return a 404 NOT FOUND if this user has no ratings", function (done) {
        server.get("/api/ratings/markiplier") //This user should have no ratings yet
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hcmtpcGxpZXIiLCJpYXQiOjE1MDk4MjQ4MTAsImV4cCI6MTUxMjI0NDAxMH0.lGWwwdVDBj0E2B4y4-MjJHuyj_U-HxxJe7qymq82I2Q') //Auth token for markiplier
            //THIS TOKEN IS VALID UNTIL SUNDAY THE 12TH OF NOVEMBER 2017
            .expect("Content-type", /json/)
            .expect('Content-Length', '72') //Length of the correct code.
            .expect(404, done);
    });

    it("Should show nothing as the user has no token (403)", function (done) {
        server.get("/api/ratings/toastyblast") //Different user than the token holder.
            .expect("Content-type", /json/)
            .expect('Content-Length', '136') //Length of the appropriate error message.
            .expect(403, done);
    });

    /* -=- All tests for the GET /api/ratings/:username/:tt_number routing -=- */
    it("Should not show a specific movie's rating from a different user than the one logged in (403)", function (done) {
        server.get("/api/ratings/sswxyz17/tt1490017") //Different user than the token holder.
            .set('authorization', correctAuthenticationCode) //Auth token for toastyblast
            .expect("Content-type", /json/)
            .expect('Content-Length', '101') //Length of the appropriate error message.
            .expect(400, done);
    });

    it("Should let the user know when they do not have a rating for that specific movie tt_number (404)", function (done) {
        server.get("/api/ratings/toastyblast/tt1386697") //Different user than the token holder.
            .set('authorization', correctAuthenticationCode) //Auth token for toastyblast
            .expect("Content-type", /json/)
            .expect('Content-Length', '121') //Length of the appropriate error message.
            .expect(404, done);
    });

    it("Should return the logged in user's rating for a specific movie with the tt_number", function (done) {
        server.get("/api/ratings/toastyblast/tt1490017") //Different user than the token holder.
            .set('authorization', correctAuthenticationCode) //Auth token for toastyblast
            .expect("Content-type", /json/)
            .expect(function (res) {
                res.body[0].rating = 3.5;
                res.body[0].date = '2017-01-01'//These don't matter, but we have to declare in the final expect. These
                // might've changed as the server is being used, so just give it some default value.
            })
            .expect(200, [{
                'imdb_tt_number': 'tt1490017',
                'tt_number': 123,
                'username': 'toastyblast',
                'rating': 3.5,
                'date': '2017-01-01'
            }], done);
    });

    //ROUTING TESTS FOR POST /api/ratings/ AND THE MIDDLEWARE USED TO CHECK IF THE RATINGS ARE VALID
    it("Should not add rating as the items are identified wrong (400)", function (done) {
        //Should be tt_number and rating.
        var ratingToAdd = {'imdb_tt_numb': 'tt1490017', 'tt_numb': 123, 'rate': 4.5};

        server.post('/api/ratings/')
            .set('authorization', correctAuthenticationCode) //Auth token for toastyblast
            .send(ratingToAdd)
            .expect('Content-Length', '147') //Length of the appropriate error message.
            .expect(400, done);
    });

    //Middleware...
    it("Should not add rating as the rating is higher than 5.0 (or smaller than 0.0) (400)", function (done) {
        //Should be tt_number and rating.
        var ratingToAdd = {'imdb_tt_number': 'tt1490017', 'tt_number': 123, 'rating': 6.5};

        server.post('/api/ratings/')
            .set('authorization', correctAuthenticationCode) //Auth token for toastyblast
            .send(ratingToAdd)
            .expect('Content-Length', '117') //Length of the appropriate error message.
            .expect(400, done);
    });

    //Middleware...
    it("Should not add rating as the rating is not in increments of X.0 or X.5 (400)", function (done) {
        //Should be tt_number and rating.
        var ratingToAdd = {'imdb_tt_number': 'tt1490017', 'tt_number': 123, 'rating': 3.3};

        server.post('/api/ratings/')
            .set('authorization', correctAuthenticationCode) //Auth token for toastyblast
            .send(ratingToAdd)
            .expect('Content-Length', '78') //Length of the appropriate error message.
            .expect(400, done);
    });

    it("Should not add rating as the user already has a rating on this movie (409)", function (done) {
        //Should be tt_number and rating.
        var ratingToAdd = {'imdb_tt_number': 'tt1490017','tt_number': 123, 'rating': 4.0}; //Actual rating on tt_number 123 has a score of 4.5

        server.post('/api/ratings/')
            .set('authorization', correctAuthenticationCode) //Auth token for toastyblast
            .send(ratingToAdd)
            .expect('Content-Length', '120') //Length of the appropriate error message.
            .expect(409, done);
    });

    it("Should add a new rating under this user's name (201)", function (done) {
        //Should be tt_number and rating.
        var ratingToAdd = {'imdb_tt_number': 'tt0095016', 'tt_number': 456, 'rating': 0.5};

        server.post('/api/ratings/')
            .set('authorization', correctAuthenticationCode) //Auth token for toastyblast
            .send(ratingToAdd)
            .expect(function (res) {
                res.body._id = '1'; //These don't matter for the test but still have to be accounted for in the next .expect, so make sure you set them to something easily checked.
                res.body.date = '2017-01-01'
            })
            .expect(201, {
                '__v': 0,
                'imdb_tt_number': 'tt0095016',
                'tt_number': 456,
                'username': 'toastyblast',
                'rating': 0.5,
                '_id': '1',
                'date': '2017-01-01'
            }, done);
    });

    /* -=- ROUTING TESTS FOR PUT /api/ratings/ -=- */
    it(("Should not update a rating that does not exist under this tt_number and/or username (404)"), function (done) {
        //Should be tt_number and rating.
        var ratingToChange = {'imdb_tt_number': 'tt1234567', 'tt_number': 1234567890, 'rating': 1.0};

        server.put('/api/ratings/')
            .set('authorization', correctAuthenticationCode) //Auth token for toastyblast
            .send(ratingToChange)
            .expect('Content-Length', '92') //Specific size of the error message for a non-existent rating under this username and/or tt_number
            .expect(404, done);
    });

    it("Should change the rating for the specified movie under this user's name (200)", function (done) {
        //Should be tt_number and rating.
        var ratingToChange = {'imdb_tt_number': 'tt0095016', 'tt_number': 456, 'rating': 1.0};

        server.put('/api/ratings/')
            .set('authorization', correctAuthenticationCode) //Auth token for toastyblast
            .send(ratingToChange)
            .expect('Content-Length', '83') //Specific size of the successfully changed message.
            .expect(200, done);
    });

    //ROUTING TESTS FOR PUT /api/ratings/:username/:tt_number (Also uses the middleware previously added in the POST tests.)
    it("Should delete the logged-in user's rating. (200)", function (done) {
        //Remove the rating we made in the POST section of these tests.
        server.delete('/api/ratings/toastyblast/456')
            .set('authorization', correctAuthenticationCode) //Auth token for toastyblast
            .expect('Content-Length', '72') //Size of the message that will be given when you successfully removed the rating with the tt_number.
            .expect(200, done);
    });
});