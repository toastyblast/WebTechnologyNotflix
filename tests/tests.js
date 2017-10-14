const superTest = require('supertest');

var server = superTest.agent("http://localhost:3000");

// describe("Movies unit tests", function () {
//     //TODO: All tests with server.command("/api/movies/???"). Does it need to be /api/movies/:tt_number or /api/movies/12345 (or any other tt_number)?
//
//
//     /* -=- All tests for the GET /api/movies routing -=- */
//     it("Should return all movies in the system", function (done) {
//         server.get("/api/movies")
//             .expect("Content-type", /jason/)
//             .expect(200, done);
//     });
//
//     /* -=- All tests for the GET /api/movies/:tt_number routing -=- */
//     it("Should return a user with the given tt_number", function (done) {
//         //TODO: Does it need to be /api/movies/:tt_number or /api/movies/2 (or any other number)?
//         server.get("/api/movies/???")
//             .expect("Content-type", /jason/)
//             .expect(200, done);
//     });
//
//     it("Should return a 404 NOT FOUND error due to non-existant tt_number", function (done) {
//         //TODO: Does it need to be /api/movies/:tt_number or /api/movies/99999 (or any other number)?
//         server.get("/api/movies/???")
//             .expect("Content-type", /jason/)
//             .expect(404, done);
//     });
//
//     /* -=- All tests for the GET /api/movies/:title routing -=- */
//     it("Should return a movie with the given title", function (done) {
//         server.get("/api/movies/???")
//             .expect("Content-type", /jason/)
//             .expect(200, done);
//     });
//
//     it("Should return a 404 NOT FOUND as the movie with the given title does not exist", function (done) {
//         server.get("/api/movies/???")
//             .expect("Content-type", /jason/)
//             .expect(404, done);
//     });
//
//     /* -=- All tests for the GET /api/movies/:director routing -=- */
//     it("Should return a movie with the given director", function (done) {
//         server.get("/api/movies/???")
//             .expect("Content-type", /jason/)
//             .expect(200, done);
//     });
//
//     it("Should return a 404 NOT FOUND as the movie with the given director does not exist", function (done) {
//         server.get("/api/movies/???")
//             .expect("Content-type", /jason/)
//             .expect(404, done);
//     });
// });
//
// describe("Users unit tests", function () {
//     //TODO: All tests with server.command("/api/users/???"). Does it need to be /api/users/:username or /api/movies/slavinski (or any other username)?
//
//     /* -=- All tests for the POST /api/users routing -=- */
//     it("Should create a new user with the given data", function (done) {
//         server.post("/api/users")
//         //TODO: Send a jason file with the user that you want to create
//             .expect("Content-type", /jason/)
//             .expect(201, done);
//     });
//
//     it("Should return a 400 BAD REQUEST as there is a missing password", function (done) {
//         server.post("/api/users")
//         //TODO: Send a jason file with the user that you want to create
//             .expect("Content-type", /jason/)
//             .expect(400, done);
//     });
//
//     it("Should return a 409 CONFLICT as there is already a user with the given username", function (done) {
//         server.post("/api/users")
//         //TODO: Send a jason file with the user that you want to create
//             .expect("Content-type", /jason/)
//             .expect(409, done);
//     });
//
//     /* -=- All tests for the GET /api/users routing -=- */
//     it("Should return a 403 FORBIDDEN as the client is not logged in and thus not allowed to view the user list", function (done) {
//         server.get("/api/users")
//         //TODO: Ask how to test this kind of token stuff.
//             .expect("Content-type", /jason/)
//             .expect(403, done);
//     });
//
//     it("Should return all users in the system (without password)", function (done) {
//         server.get("/api/users")
//             .expect("Content-type", /jason/)
//             //TODO: Check that each user's password is not in the response
//             .expect(200, done);
//     });
//
//     /* -=- All tests for the GET /api/users/:username routing -=- */
//     it("Should return a 403 FORBIDDEN as the client is not logged in and thus not allowed to search for a user.", function (done) {
//         server.get("/api/users/???")
//             .expect("Content-type", /jason/)
//             .expect(403, done);
//     });
//
//     it("Should return a specific user (without password) with the given username", function (done) {
//         server.get("/api/users/???")
//             .expect("Content-type", /jason/)
//             //TODO: Check that each user's password is not in the response
//             .expect(200, done);
//     });
//
//     it("Should return a 404 NOT FOUND as the user with the given username could not be found", function (done) {
//         server.get("/api/users/???")
//             .expect("Content-type", /jason/)
//             .expect(404, done);
//     });
// });

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

    /* -=- All tests for the GET /api/ratings/:username routing -=- */
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
            //TODO: Check if the right content is there.
            .expect(200, done);
    });
});