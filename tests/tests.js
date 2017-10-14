const superTest = require('supertest');

var server = superTest.agent("http://localhost:3000");

describe("Movies unit tests", function () {
    /* -=- All tests for the GET /api/movies routing -=- */
    it("Should return all movies in the system", function (done) {
        server.get("/api/movies")
            .expect("Content-type", /json/)
            .expect(200, done);
    });

    /* -=- All tests for the GET /api/movies/:tt_number routing -=- */
    it("Should return a movie with the given tt_number", function (done) {
        server.get("/api/movies/123") //Add existing movie number.
            .expect("Content-type", /json/)
            .expect(200, done);
    });

    it("Should return a 404 NOT FOUND error due to non-existant tt_number", function (done) {
        server.get("/api/movies/NonExistentTtNumber")
            .expect("Content-type", /json/)
            .expect(404, done);
    });

    /* -=- All tests for the GET /api/movies/:title routing -=- */
    it("Should return a movie with the given title", function (done) {
        server.get("/api/movies/The Lego Movie") //Add existing move title.
            .expect("Content-type", /json/)
            .expect(200, done);
    });

    it("Should return a 404 NOT FOUND as the movie with the given title does not exist", function (done) {
        server.get("/api/movies/MovieTitleThatDoesntExist")
            .expect("Content-type", /json/)
            .expect(404, done);
    });

    /* -=- All tests for the GET /api/movies/:director routing -=- */
    it("Should return a movie with the given director", function (done) {
        server.get("/api/movies/Leg Godt") //Add existing director.
            .expect("Content-type", /json/)
            .expect(200, done);
    });

    it("Should return a 404 NOT FOUND as the movie with the given director does not exist", function (done) {
        server.get("/api/movies/DirectorThatDoesntExist")
            .expect("Content-type", /json/)
            .expect(404, done);
    });
});

//
describe("Users unit tests", function () {
    /* -=- All tests for the POST /api/users routing -=- */
    it("Should return a 400 BAD REQUEST as there is a missing password", function (done) {
        server.post("/api/users")
        //TODO: Send a jason file with the user that you want to create
            .send(({
                "lastname" : "LastName",
                "middlename" : " ",
                "firstname" :"FirstName",
                "usern": "UniqueName", //username must be unique
                "password": ""
            }))
            .expect("Content-type", /json/)
            .expect(400, done);
    });

    it("Should return a 409 CONFLICT as there is already a user with the given username", function (done) {
        server.post("/api/users")
            .send(({
                "lastname" : "lastname",
                "middlename" : "",
                "firstname" :"firstname",
                "usern": "toastyblast", //Username must be non-unique in this test
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
    });

    it("Should return all users in the system (without password)", function (done) {
        server.get("/api/users")
            .set({"authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0ZWxrbyIsImlhdCI6MTUwNzk4NTYyMiwiZXhwIjoxNTA4MDcyMDIyfQ.MszoU_wvtU58th2xZG5sv-Gk656NwtCKNWkwjd5gAyU"})
            .expect("Content-type", /json/)
            .expect(200, done);
    });

    /* -=- All tests for the GET /api/users/:username routing -=- */
    it("Should return a 403 FORBIDDEN as the client is not logged in and thus not allowed to search for a user.", function (done) {
        server.get("/api/users/user/UniqueName")
            .expect("Content-type", /json/)
            .expect(403, done);
    });

    it("Should return a specific user (without password) with the given username", function (done) {
        server.get("/api/users/user/UniqueName2")
            .set({"authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0ZWxrbyIsImlhdCI6MTUwNzk4NTYyMiwiZXhwIjoxNTA4MDcyMDIyfQ.MszoU_wvtU58th2xZG5sv-Gk656NwtCKNWkwjd5gAyU"})
            .expect("Content-type", /json/)
            .expect(200, {
                "last_name": "lastname",
                "middle_name": " ",
                "first_name": "firstname",
                "username": "username",
                "__v": 0,
                "favourites": [
                    "MovieOne",
                    "Title of the movie"
                ]
            },done);
    });

    it("Should return a 404 NOT FOUND as the user with the given username could not be found", function (done) {
        server.get("/api/users/user/UniqueUser3")
            .set({"authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0ZWxrbyIsImlhdCI6MTUwNzk4NTYyMiwiZXhwIjoxNTA4MDcyMDIyfQ.MszoU_wvtU58th2xZG5sv-Gk656NwtCKNWkwjd5gAyU"})
            .expect("Content-type", /json/)
            .expect(404, done);
    });

    it("Should return a list with the amount of users that was specified", function (done) {
        server.get("/api/users/2")
            .set({"authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0ZWxrbyIsImlhdCI6MTUwNzk4NTYyMiwiZXhwIjoxNTA4MDcyMDIyfQ.MszoU_wvtU58th2xZG5sv-Gk656NwtCKNWkwjd5gAyU"})
            .expect("Content-type", /json/)
            .expect(200,
                [
                    {
                        "last_name": "Slavov",
                        "first_name": "Martin",
                        "username": "sswxyz2"
                    },
                    {
                        "last_name": "lastname",
                        "first_name": "firstname",
                        "username": "username"
                    }
                ]
                ,done);
    });

    it("Should return 400 BAD REQUEST because the value that was passed was not a number",function (done) {
        server.get("/api/users/a")
            .set({"authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0ZWxrbyIsImlhdCI6MTUwNzk4NTYyMiwiZXhwIjoxNTA4MDcyMDIyfQ.MszoU_wvtU58th2xZG5sv-Gk656NwtCKNWkwjd5gAyU"})
            .expect("Content-type", /json/)
            .expect(400, done);
    });

    it("Should return 403 FORBIDDEN because the user is not allowed to look for users when not logged in.",function (done) {
        server.get("/api/users/2")
            .expect("Content-type", /json/)
            .expect(403, done);
    });

    it("Should add a movie to the favorites of the user",function (done) {
        server.put("/api/users/favourites/Title of the movie")
            .set({"authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlVuaXF1ZU5hbWUyIiwiaWF0IjoxNTA3OTk0MDk5LCJleHAiOjE1MDgwODA0OTl9.9TiATypcc_pSKqvAYqIGFBfCx5CUJaYzlz-71YceJBs"})
            .expect("Content-type", /json/)
            .expect(200, {
                "_id": "59e221c5e89ce012cc0b90fd",
                "last_name": "lastname",
                "middle_name": " ",
                "first_name": "firstname",
                "username": "UniqueName2",
                "passwords": "123456",
                "__v": 0,
                "favourites": [
                    "MovieOne",
                    "Title of the movie"
                ]
            }, done);
    });

    it("Should give ERROR 404 DOES NOT EXIST because you are trying to favorite a non-existing movie.",function (done) {
        server.put("/api/users/favourites/MovieThatDoesntExist")
            .set({"authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlVuaXF1ZU5hbWUyIiwiaWF0IjoxNTA3OTk0MDk5LCJleHAiOjE1MDgwODA0OTl9.9TiATypcc_pSKqvAYqIGFBfCx5CUJaYzlz-71YceJBs"})
            .expect("Content-type", /json/)
            .expect(404, done);
    });

    it("Should give ERROR 404 DOES NOT EXIST because the token has a username which is not in the DB.",function (done) {
        server.put("/api/users/favourites/MovieOne")
            .set({"authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlVuaXF1ZU5hbSIsImlhdCI6MTUwNzk5NDA5OSwiZXhwIjoxNTA4MDgwNDk5fQ.hd4TXqY0zaIpr4J71v4uNMeNgZ1AckcGY8K4gMWFdDQ"})
            .expect("Content-type", /json/)
            .expect(404, done);
    })

});

describe("Authorization routing tests", function () {
    it("Should not generate a token if the request body is undefined or incorrect (400)", function (done) {
        var credentials = {'userna':'toastyblast', 'pawords':'cheese'};

        server.post('/api/authenticate/')
            .send(credentials)
            .expect('Content-Length', '92') //Length of the correct error message.
            .expect(400, done);
    });

    it("Should not generate a token if the username does not even exist (404)", function (done) {
        var credentials = {'username':'toasty', 'passwords':'cheese'};

        server.post('/api/authenticate/')
            .send(credentials)
            .expect('Content-Length', '70') //Length of the correct error message.
            .expect(404, done);
    });

    it("Should not generate a token if the username + password combination is wrong (400)", function (done) {
        var credentials = {'username':'toastyblast', 'passwords':'kaas'};

        server.post('/api/authenticate/')
            .send(credentials)
            .expect('Content-Length', '83') //Length of the correct error message.
            .expect(400, done);
    });
});

describe("Ratings routings tests", function () {
    /* -=- All tests for the GET /api/ratings/ routing -=- */
    it("Should return a list of average ratings per movie", function (done) {
        server.get("/api/ratings/")
            .expect("Content-type", /json/)
            .expect(function (res) {
                res.body.theAverageRatings = [];
            })
            .expect(200, {
                'theAverageRatings':[] //Check if the body actually has an averageRatingsArray. We do not care about the contents, as those can be different for everyone testing this REST service.
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
                'confirmationMessage':'200 OK - Average rating for the sought movie has been retrieved.',
                'tt_number':123, //We really only want to check if it retrieved the same movie, the rest doesn't matter.
                'averageRating':3.5
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
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzd3h5ejE3IiwiaWF0IjoxNTA3OTkxMzgwLCJleHAiOjE1MDgwNzc3ODB9.y56UEBjW51FNgksHu3e5HA4FGcWodWeFxnRnYMKPGsw') //This is the auth token of sswxyz17, not toastyblast
            .expect("Content-type", /json/)
            .expect("Content-Length", "104") //Exact length of the error message given when the token is wrong.
            .expect(400, done);
    });

    it("Should show the ratings for the user with that username", function (done) {
        server.get("/api/ratings/toastyblast")
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvYXN0eWJsYXN0IiwiaWF0IjoxNTA3OTg5NjY3LCJleHAiOjE1MDgwNzYwNjd9.03pExyw3gDub9khGNcZZHZnPVXrh54-UTQIklemsusQ') //Auth token for toastyblast
            .expect("Content-type", /json/)
            //We cannot truly check what's inside of the response as this may be different for every user of this RESTful service, if they changed anything.
            .expect(200, done);
    });

    //TODO: needs a new user with no ratings created.
    // it("Should return a 404 NOT FOUND if this user has no ratings", function (done) {
    //     //TODO: Provide a token with right the username in the body as JSON.
    //     server.get("/api/ratings/markiplier")
    //         .expect("Content-type", /json/)
    //         .expect(404, done);
    // });

    it("Should show nothing as the user has no token (403)", function (done) {
        server.get("/api/ratings/toastyblast") //Different user than the token holder.
            .expect("Content-type", /json/)
            .expect('Content-Length', '136') //Length of the appropriate error message.
            .expect(403, done);
    });

    it("Should not show a specific movie's rating from a different user than the one logged in (403)", function (done) {
        server.get("/api/ratings/sswxyz17/123") //Different user than the token holder.
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvYXN0eWJsYXN0IiwiaWF0IjoxNTA3OTg5NjY3LCJleHAiOjE1MDgwNzYwNjd9.03pExyw3gDub9khGNcZZHZnPVXrh54-UTQIklemsusQ') //Auth token for toastyblast
            .expect("Content-type", /json/)
            .expect('Content-Length', '101') //Length of the appropriate error message.
            .expect(400, done);
    });

    it("Should let the user know when they do not have a rating for that specific movie tt_number (404)", function (done) {
        server.get("/api/ratings/toastyblast/456") //Different user than the token holder.
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvYXN0eWJsYXN0IiwiaWF0IjoxNTA3OTg5NjY3LCJleHAiOjE1MDgwNzYwNjd9.03pExyw3gDub9khGNcZZHZnPVXrh54-UTQIklemsusQ') //Auth token for toastyblast
            .expect("Content-type", /json/)
            .expect('Content-Length', '121') //Length of the appropriate error message.
            .expect(404, done);
    });

    it("Should return the logged in user's rating for a specific movie with the tt_number", function (done) {
        server.get("/api/ratings/toastyblast/123") //Different user than the token holder.
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvYXN0eWJsYXN0IiwiaWF0IjoxNTA3OTg5NjY3LCJleHAiOjE1MDgwNzYwNjd9.03pExyw3gDub9khGNcZZHZnPVXrh54-UTQIklemsusQ') //Auth token for toastyblast
            .expect("Content-type", /json/)
            .expect(function (res) {
                res.body[0].rating = 3.5;
                res.body[0].date = '2017-01-01'//These don't matter, but we have to declare in the final expect. These
                // might've changed as the server is being used, so just give it some default value.
            })
            .expect(200, [{
                'tt_number':123,
                'username':'toastyblast',
                'rating':3.5,
                'date':'2017-01-01'
            }], done);
    });

    //ROUTING TESTS FOR POST /api/ratings/ AND THE MIDDLEWARE USED TO CHECK IF THE RATINGS ARE VALID
    it("Should not add rating as the items are identified wrong (400)", function (done) {
        //Should be tt_number and rating.
        var ratingToAdd = {'tt_numb':123, 'rate':4.5};

        server.post('/api/ratings/')
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvYXN0eWJsYXN0IiwiaWF0IjoxNTA3OTg5NjY3LCJleHAiOjE1MDgwNzYwNjd9.03pExyw3gDub9khGNcZZHZnPVXrh54-UTQIklemsusQ') //Auth token for toastyblast
            .send(ratingToAdd)
            .expect('Content-Length', '157') //Length of the appropriate error message.
            .expect(400, done);
    });

    //Middleware...
    it("Should not add rating as the rating is higher than 5.0 (or smaller than 0.0) (400)", function (done) {
        //Should be tt_number and rating.
        var ratingToAdd = {'tt_number':123, 'rating':6.5};

        server.post('/api/ratings/')
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvYXN0eWJsYXN0IiwiaWF0IjoxNTA3OTg5NjY3LCJleHAiOjE1MDgwNzYwNjd9.03pExyw3gDub9khGNcZZHZnPVXrh54-UTQIklemsusQ') //Auth token for toastyblast
            .send(ratingToAdd)
            .expect('Content-Length', '117') //Length of the appropriate error message.
            .expect(400, done);
    });

    //Middleware...
    it("Should not add rating as the rating is not in increments of X.0 or X.5 (400)", function (done) {
        //Should be tt_number and rating.
        var ratingToAdd = {'tt_number':123, 'rating':3.3};

        server.post('/api/ratings/')
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvYXN0eWJsYXN0IiwiaWF0IjoxNTA3OTg5NjY3LCJleHAiOjE1MDgwNzYwNjd9.03pExyw3gDub9khGNcZZHZnPVXrh54-UTQIklemsusQ') //Auth token for toastyblast
            .send(ratingToAdd)
            .expect('Content-Length', '78') //Length of the appropriate error message.
            .expect(400, done);
    });

    it("Should not add rating as the user already has a rating on this movie (409)", function (done) {
        //Should be tt_number and rating.
        var ratingToAdd = {'tt_number':123, 'rating':4.0}; //Actual rating on tt_number 123 has a score of 4.5

        server.post('/api/ratings/')
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvYXN0eWJsYXN0IiwiaWF0IjoxNTA3OTg5NjY3LCJleHAiOjE1MDgwNzYwNjd9.03pExyw3gDub9khGNcZZHZnPVXrh54-UTQIklemsusQ') //Auth token for toastyblast
            .send(ratingToAdd)
            .expect('Content-Length', '120') //Length of the appropriate error message.
            .expect(409, done);
    });

    it("Should add a new rating under this user's name (201)", function (done) {
        //Should be tt_number and rating.
        var ratingToAdd = {'tt_number':456, 'rating':0.5};

        server.post('/api/ratings/')
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvYXN0eWJsYXN0IiwiaWF0IjoxNTA3OTg5NjY3LCJleHAiOjE1MDgwNzYwNjd9.03pExyw3gDub9khGNcZZHZnPVXrh54-UTQIklemsusQ') //Auth token for toastyblast
            .send(ratingToAdd)
            .expect(function (res) {
                res.body._id = '1'; //These don't matter for the test but still have to be accounted for in the next .expect, so make sure you set them to something easily checked.
                res.body.date = '2017-01-01'
            })
            .expect(201, {
                '__v':0,
                'tt_number':456,
                'username':'toastyblast',
                'rating':0.5,
                '_id':'1',
                'date':'2017-01-01'
            }, done);
    });

    //ROUTING TESTS FOR PUT /api/ratings/
    it(("Should not update a rating that does not exist under this tt_number and/or username (404)"), function (done) {
        //Should be tt_number and rating.
        var ratingToChange = {'tt_number':1234567890, 'rating':1.0};

        server.put('/api/ratings/')
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvYXN0eWJsYXN0IiwiaWF0IjoxNTA3OTg5NjY3LCJleHAiOjE1MDgwNzYwNjd9.03pExyw3gDub9khGNcZZHZnPVXrh54-UTQIklemsusQ') //Auth token for toastyblast
            .send(ratingToChange)
            .expect('Content-Length', '92') //Specific size of the error message for a non-existent rating under this username and/or tt_number
            .expect(404, done);
    });

    it("Should change the rating for the specified movie under this user's name (200)", function (done) {
        //Should be tt_number and rating.
        var ratingToChange = {'tt_number':456, 'rating':1.0};

        server.put('/api/ratings/')
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvYXN0eWJsYXN0IiwiaWF0IjoxNTA3OTg5NjY3LCJleHAiOjE1MDgwNzYwNjd9.03pExyw3gDub9khGNcZZHZnPVXrh54-UTQIklemsusQ') //Auth token for toastyblast
            .send(ratingToChange)
            .expect('Content-Length', '83') //Specific size of the successfully changed message.
            .expect(200, done);
    });

    //ROUTING TESTS FOR PUT /api/ratings/:username/:tt_number (Also uses the middleware previously added in the POST tests.)
    it("Should delete the logged-in user's rating. (200)", function (done) {
        //Remove the rating we made in the POST section of these tests.
        server.delete('/api/ratings/toastyblast/456')
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvYXN0eWJsYXN0IiwiaWF0IjoxNTA3OTg5NjY3LCJleHAiOjE1MDgwNzYwNjd9.03pExyw3gDub9khGNcZZHZnPVXrh54-UTQIklemsusQ') //Auth token for toastyblast
            .expect('Content-Length', '72') //Size of the message that will be given when you successfully removed the rating with the tt_number.
            .expect(200, done);
    });
});