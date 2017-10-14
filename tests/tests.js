const superTest = require('supertest');

var server = superTest.agent("http://localhost:3000");

describe("Movies unit tests", function () {
//     //TODO: All tests with server.command("/api/movies/???"). Does it need to be /api/movies/:tt_number or /api/movies/12345 (or any other tt_number)?
//
//
    /* -=- All tests for the GET /api/movies routing -=- */
    it("Should return all movies in the system", function (done) {
        server.get("/api/movies")
            .expect("Content-type", /json/)
            .expect(200, done);
    });
//
    /* -=- All tests for the GET /api/movies/:tt_number routing -=- */
    it("Should return a movie with the given tt_number", function (done) {
        //TODO: Does it need to be /api/movies/:tt_number or /api/movies/2 (or any other number)?
        server.get("/api/movies/123") //Add existing movie number.
            .expect("Content-type", /json/)
            .expect(200, done);
    });
//
    it("Should return a 404 NOT FOUND error due to non-existant tt_number", function (done) {
        //TODO: Does it need to be /api/movies/:tt_number or /api/movies/99999 (or any other number)?
        server.get("/api/movies/NonExistentTtNumber")
            .expect("Content-type", /json/)
            .expect(404, done);
    });
//
    /* -=- All tests for the GET /api/movies/:title routing -=- */
    it("Should return a movie with the given title", function (done) {
        server.get("/api/movies/MovieOne") //Add existing move title.
            .expect("Content-type", /json/)
            .expect(200, done);
    });
//
    it("Should return a 404 NOT FOUND as the movie with the given title does not exist", function (done) {
        server.get("/api/movies/MovieTitleThatDoesntExist")
            .expect("Content-type", /json/)
            .expect(404, done);
    });
//
    /* -=- All tests for the GET /api/movies/:director routing -=- */
    it("Should return a movie with the given director", function (done) {
        server.get("/api/movies/DirectorOne") //Add existing director.
            .expect("Content-type", /json/)
            .expect(200, done);
    });
//
    it("Should return a 404 NOT FOUND as the movie with the given director does not exist", function (done) {
        server.get("/api/movies/DirectorThatDoesntExist")
            .expect("Content-type", /json/)
            .expect(404, done);
    });
});
//
describe("Users unit tests", function () {
    //TODO: All tests with server.command("/api/users/???"). Does it need to be /api/users/:username or /api/movies/slavinski (or any other username)?

    /* -=- All tests for the POST /api/users routing -=- */
    // it("Should create a new user with the given data", function (done) {
    //     server.post("/api/users")
    //     //TODO: Send a jason file with the user that you want to create
    //         .send(({
    //             "lastname" : "lastname",
    //             "middlename" : " ",
    //             "firstname" :"firstname",
    //             "usern": "UniqueName2", //Username must be unique
    //             "password": "123456"
    //         }))
    //         .expect("Content-type", /json/)
    //         .expect(201, done);
    // });

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
        //TODO: Send a jason file with the user that you want to create
            .send(({
                "lastname" : "lastname",
                "middlename" : " ",
                "firstname" :"firstname",
                "usern": "UniqueName2", //Username must exist.
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
            //TODO: Check that each user's password is not in the response
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

describe("Ratings unit tests", function () {
    /* -=- All tests for the GET /api/ratings/ routing -=- */
    it("Should return a list of average ratings per movie", function (done) {
        server.get("/api/ratings/")
            .expect("Content-type", /json/)
            .expect(200, done);
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
        //TODO: Provide a token with the right username in the body as JSON.
        server.get("/api/ratings/toastyblast")
            .expect("Content-type", /json/)
            .expect(200, done);
    });

    it("Should return a 404 NOT FOUND if this user has no ratings", function (done) {
        //TODO: Provide a token with right the username in the body as JSON.
        server.get("/api/ratings/markiplier")
            .expect("Content-type", /json/)
            .expect(404, done);
    });
});