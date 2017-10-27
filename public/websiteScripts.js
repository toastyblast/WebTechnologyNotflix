/**
 * Special condition for the case of there being a user logged when the site is reloaded or accessed after it was closed. It makes sure that if the user didn't log out, then they stay logged in (if the token has not expired yet).
 */
if (localStorage.getItem("authorization") !== null) {
    //Check if the browser still has a valid token stored, if so, just log them into the user from that token.
    var data = {
        "token": localStorage.getItem("authorization")
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var response = JSON.parse(this.responseText);
                var tokenUsername = response.tokenUsername;
                localStorage.setItem("latestUserName", tokenUsername);

                $("#loginForm").replaceWith(
                    "<div id=\"loggedInDiv\" class=\"form-inline my-2 my-lg-0\">" +
                    "   <a class=\"nav-link\" id=\"special-text\">Welcome back, <strong>" + tokenUsername + "</strong></a>" +
                    "   <button class=\"btn btn-outline-success my-2 my-sm-0\" onclick=\"return completeMyRatings()\">My ratings</button>" +
                    "   <button class=\"btn btn-outline-success my-2 my-sm-0\" id=\"logout-button\" onclick=\"return completeLogout()\">Log out</button>" +
                    "</div>");
            } else {
                //This means the token has expired. Delete the stored data on the user in that case and don't load the logged in items.
                localStorage.removeItem("authorization");
                localStorage.removeItem("latestUserName");
            }
        }
    };
    xhttp.open("POST", "http://localhost:3000/api/authenticate/check", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}

/**
 * All functions that are called upon only once the page has fully loaded. Ensures that the user doesn't make use of
 * some functions too quickly, as replacing items can't happen if the original item hasn't loaded yet, for instance.
 */
$(document).ready(function () {
    getAllImages();

    /**
     * Function triggered when the "Browse catalog" nav link has been clicked. Loads the page of all movies through several methods.
     */
    $("#catalogButton").click(function () {
        $(".jumbotron").hide();
        $(".container").hide();
        $("#result").load("movies.html", function () {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    var response = JSON.parse(this.responseText);

                    movies(response.docs);
                    addButtons(response.total, function () {
                        newFunction();
                    });
                }
            };
            xhttp.open("GET", "http://localhost:3000/api/movies/", true);
            xhttp.send();
        });
    });

    /**
     * Function triggered when the "Home" nav link has been clicked. Loads the normal home page for the user.
     */
    $("#home").click(function () {
        $("#result").empty();
        $(".jumbotron").show();
        $(".container").show();
    });

    /**
     * Function called when the "Login" button of the login form has been clicked. Handles the response in the way
     * needed if the login succeeded or not.
     */
    $('#loginForm').submit(function (event) {
        event.preventDefault();

        var username = document.forms["userLoginForm"]["usernameBox"].value;
        var password = document.forms["userLoginForm"]["passwordBox"].value;

        var data = {
            "username": "" + username,
            "passwords": "" + password
        };

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 201) {
                    var response = JSON.parse(this.responseText);
                    var token = response.token;

                    localStorage.setItem('authorization', token);
                    localStorage.setItem("latestUserName", username);

                    $("#loginForm").replaceWith(
                        "<div id=\"loggedInDiv\" class=\"form-inline my-2 my-lg-0\">" +
                        "   <a class=\"nav-link\" id=\"special-text\">Welcome back, <strong>" + username + "</strong></a>" +
                        "   <button class=\"btn btn-outline-success my-2 my-sm-0\" onclick=\"return completeMyRatings()\">My ratings</button>" +
                        "   <button class=\"btn btn-outline-success my-2 my-sm-0\" id=\"logout-button\" onclick=\"return completeLogout()\">Log out</button>" +
                        "</div>");
                } else {
                    var errorResponse = JSON.parse(this.responseText);
                    var errorMessage = errorResponse.errorMessage;

                    //TODO - YORAN: Let user know of the error that occured, and that their request didn't work.
                }
            }
        };
        xhttp.open("POST", 'http://localhost:3000/api/authenticate/', true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(data));

        return false;
    });

    /**
     * Function called when the "Users" nav link has been clicked. Loads the page with the list of users, made by the getUsers function.
     */
    $('#users').click(function () {
        getUsers();
    });

    //More action functions here...
});

function formFunction() {
    var searchQuery = document.forms["searchForm"]["searchQuery"].value;
    var searchCategory = $("#exampleFormControlSelect1").val();
    // window.alert(searchCategory);
    $("#movieRow").empty();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = 0;
            response = JSON.parse(this.responseText);
            movies(response.docs);
            addButtons(response.total, function () {
                newFunction(searchCategory + "=" + searchQuery)
            });
        }
    };
    if (searchCategory === "Title") {
        xhttp.open("GET", "http://localhost:3000/api/movies/?title=" + searchQuery + "&pag=0", true);
        // xhttp.send();
    } else if (searchCategory === "Director") {
        xhttp.open("GET", "http://localhost:3000/api/movies/?director=" + searchQuery + "&pag=0", true);
        // xhttp.send();
    } else if (searchCategory === "Description") {
        xhttp.open("GET", "http://localhost:3000/api/movies/?description=" + searchQuery + "&pag=0", true);
        // xhttp.send();
    } else if (searchCategory === "tt_number") {
        xhttp.open("GET", "http://localhost:3000/api/movies/?ttnumber=" + searchQuery + "&pag=0", true);
        // xhttp.send();
    }
    xhttp.send();
    return false;
}

function registerFunction() {
    var username = document.forms["registerForm"]["username"].value;
    var password = document.forms["registerForm"]["password"].value;
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    $("#registerButton").hide();

    var eyy = "<form id='nameForm' name=\"registerFormNames\" class=\"form-inline my-2 my-lg-0\" method=\"post\" onsubmit=\"return completeFunction()\">\n" +
        "    <input name=\"firstname\" class=\"form-control mr-sm-2\" type=\"text\" placeholder=\"First name\" aria-label=\"UsernameRegister\">\n" +
        "    <input name=\"middlename\" class=\"form-control mr-sm-2\" type=\"text\" placeholder=\"Middle name (optional)\" aria-label=\"PasswordRegister\">\n" +
        "    <input name=\"lastname\" class=\"form-control mr-sm-2\" type=\"text\" placeholder=\"Last name\" aria-label=\"PasswordRegister\">\n" +
        "    <button class=\"btn btn-outline-success my-2 my-sm-0\" type=\"submit\">Complete Registration</button>\n" +
        "</form>";
    $(".container").append(eyy);

    return false;
}

function completeFunction() {
    var firstname = document.forms["registerFormNames"]["firstname"].value;
    var middlename = document.forms["registerFormNames"]["middlename"].value;
    var lastname = document.forms["registerFormNames"]["lastname"].value;
    var username = localStorage.getItem("username");
    var password = localStorage.getItem("password");

    var data = {
        "lastname": "" + lastname,
        "middlename": "" + middlename,
        "firstname": "" + firstname,
        "usern": "" + username,
        "password": "" + password
    };

    // window.alert(data);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 201) {
            $("#topContainer").append("<div class=\"alert alert-success alert-dismissable\">\n" +
                "            <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                "            <strong>Success!</strong> This alert box could indicate a successful or positive action.\n" +
                "        </div>");
            $("#form")[0].reset();
        } else if (this.readyState === 4 && this.status === 409) {
            $("#topContainer").append("<div class=\"alert alert-danger alert-dismissable\">\n" +
                "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                "    <strong>Danger!</strong>" + JSON.parse(this.responseText).errorMessage + "" +
                "  </div>");
        } else if (this.readyState === 4 && this.status === 400) {
            $("#topContainer").append("<div class=\"alert alert-warning alert-dismissable\">\n" +
                "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                "    <strong>Warning!</strong>" + JSON.parse(this.responseText).errorMessage + "" +
                "  </div>");
        }
    };
    xhttp.open("POST", 'http://localhost:3000/api/users/', true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));

    $("#nameForm").remove();
    $("#registerButton").show();

    return false;
}

/**
 * Function that is triggered when the user clicks the "Log out" button. It deletes all local data on the user and resets the page.
 */
function completeLogout() {
    localStorage.removeItem("authorization");
    localStorage.removeItem("latestUserName");

    //TODO - YORAN - IDEA - Have a little balloon pop up in the right of the navbar saying they have been successfully logged out.

    location.reload();
}

/**
 * Function that handles the event of when a user searches for one of their specific ratings. It sends the specific rating to the ratings function so it can load the card.
 *
 * @returns {boolean}
 */
function ratingSearchFormFunction() {
    var soughtTTNumber = $("#ratingSearchQuery").val();

    var userToken = localStorage.getItem("authorization");
    var userName = localStorage.getItem("latestUserName");
    var url = "http://localhost:3000/api/ratings/" + userName;

    $("#ratingRow").empty();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var response = JSON.parse(this.responseText);

                ratings(response);
            } else {
                var errorResponse = JSON.parse(this.responseText);
                var errorMessage = errorResponse.errorMessage;

                console.log(errorMessage)
                //TODO - YORAN: Let user know of the error that occured, and that their request didn't work.
            }
        }
    };

    if (soughtTTNumber !== '') {
        //If the user did fill in a rating, look for the given rating. The router will check if the given value complies with "tt<7 digits>"
        soughtTTNumber = "tt" + soughtTTNumber;
        xhttp.open("GET", url + "/" + soughtTTNumber, true);
    } else {
        //If the user didn't fill in anything but still clicked the search button, just reload the page and show all the ratings they made.
        xhttp.open("GET", url, true);
    }
    xhttp.setRequestHeader('authorization', userToken);
    xhttp.send();

    return false;
}

/**
 * Helper function that gets the internal database TT number of a movie with the given IMDB TT number. Sends this fake TT number to the ratingCreateFormFunction
 */
function getMovieFakeTT() {
    var givenTTNumber = $("#ratingMovieBox").val();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var response = JSON.parse(this.responseText);

                ratingCreateFormFunction(response.docs[0].tt_number);
            } else {
                var firstErrorResponse = JSON.parse(this.responseText);
                var errorMessage = firstErrorResponse.errorMessage;

                console.log(errorMessage)
                //TODO - YORAN: Let user know of the error that occured, and that their request didn't work.
            }
        }
    };

    xhttp.open("GET", "http://localhost:3000/api/movies/?ttnumber=tt" + givenTTNumber + "&pag=0", true);
    xhttp.send();
}

/**
 * Function that handles when the rating create button is clicked. Calls the database to create said ratings.
 *
 * @param databaseTTNumber are the seven valid IMDB TT digits the user has filled in.
 * @returns {boolean} To prevent standard behaviour of the form.
 */
function ratingCreateFormFunction(databaseTTNumber) {
    var givenTTNumber = $("#ratingMovieBox").val();
    var givenScore = $("#ratingScoreBox").val();

    var userToken = localStorage.getItem("authorization");

    var data = {
        "imdb_tt_number": "tt" + givenTTNumber,
        "tt_number": databaseTTNumber,
        "rating": givenScore
    };

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            //Remove the temporarily stored fake TT number just to be sure.
            localStorage.removeItem("temporaryTT");

            if (xhttp.status === 201) {
                //The rating has been created, so now reload the div with ratings and it should be there!
                completeMyRatings();
            } else {
                var errorResponse = JSON.parse(xhttp.responseText);
                var errorMessage = errorResponse.errorMessage;

                console.log(errorMessage)
                //TODO - YORAN: Let user know of the error that occured, and that their request didn't work.
            }
        }
    };

    xhttp.open("POST", "http://localhost:3000/api/ratings/", true);
    xhttp.setRequestHeader('authorization', userToken);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));

    return false;
}

/**
 * Function that loads in the list of rating cards of the user that is currently logged in, when they press the "My ratings" button.
 */
function completeMyRatings() {
    $(".jumbotron").hide();
    $(".container").hide();
    $("#result").load("ratings.html");

    var userToken = localStorage.getItem("authorization");
    var userName = localStorage.getItem("latestUserName");
    var url = "http://localhost:3000/api/ratings/" + userName;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var response = JSON.parse(this.responseText);

                ratings(response);
            } else {
                var errorResponse = JSON.parse(this.responseText);
                var errorMessage = errorResponse.errorMessage;

                console.log(errorMessage)
                //TODO - YORAN: Let user know of the error that occured, and that their request didn't work.
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('authorization', userToken);
    xhttp.send();
}

/**
 * Function that loads the the cards show inside of the div loaded by "completeMyRatings" function.
 *
 * @param response is the list of ratings made by the user, given by the function that calls this function.
 */
function ratings(response) {
    for (var i = 0; i < response.length; i++) {
        var imdb_number = response[i].imdb_tt_number;
        var number = response[i].tt_number;

        var newIn = "<div class=\"col-md-4\">\n" +
            "            <div class=\"card\" style=\"width: 20rem;\">" +
            "                <h4 id=\"" + i + "ab\" class=\"card-header\">Rating #" + (i + 1) + "</h4>\n" +
            "                <div class=\"card-body\">\n" +
            "                    <h5 class=\"card-title\">Movie TT number: " + imdb_number + "</h5>\n" +
            "                    <label for=\"ratingCardScoreBox\">Your rating:</label>\n" +
            "                    <div class=\"form-inline\">\n" +
            "                       <input id=\"ratingCardScoreBox" + i + "\" class=\"form-control mr-sm-2 col-md-4\" type=\"number\" placeholder=\"Score...\" aria-label=\"RatingCardScoreBox\" value=\"" + response[i].rating + "\" min=\"0.0\" max=\"5.0\" step=\"0.5\" required>\n" +
            "                       <a id=\"ChangeRating" + i + "\" class=\"btn btn-info\">Edit</a>\n" +
            "                       <a id=\"RemoveRating" + i + "\" class=\"btn btn-danger\">Remove</a>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "                <a class=\"card-footer text-muted\">Date: " + response[i].date + "</a>\n" +
            "            </div>\n" +
            "        </div>\n";
        $("#ratingRow").append(newIn);

        changeButtonClick(i, imdb_number, number);
        removeButtonClick(i, number);
    }
}

/**
 * Function that handles the event when a user clicks the "Edit" button on one of their ratings. Sends this to the database and handles the response.
 *
 * @param i is the index of the rating that the user clicked the "Edit" button of.
 * @param imdb_number is the IMDB TT number of said rating.
 * @param number is the internal database TT number of said rating.
 */
function changeButtonClick(i, imdb_number, number) {
    var userToken = localStorage.getItem("authorization");

    $("#ChangeRating" + i).click(function () {
        var newScore = $("#ratingCardScoreBox" + i).val();

        var data = {
            "imdb_tt_number": imdb_number,
            "tt_number": number,
            "rating": newScore
        };

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    //The rating has been updated, so now reload the div with ratings and it should be there!
                    completeMyRatings();
                } else {
                    var errorResponse = JSON.parse(xhttp.responseText);
                    var errorMessage = errorResponse.errorMessage;

                    console.log(errorMessage)
                    //TODO - YORAN: Let user know of the error that occured, and that their request didn't work.
                }
            }
        };

        console.log(JSON.stringify(data));

        xhttp.open("PUT", "http://localhost:3000/api/ratings/", true);
        xhttp.setRequestHeader('authorization', userToken);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(data));
    });
}

/**
 * Function that handles the event when a user clicks the "Remove" button on one of their ratings. Sends this to the database and handles the response.
 *
 * @param i is the index of the rating that the user clicked the "Remove" button of.
 * @param tt_number is the internal database TT number of said rating.
 */
function removeButtonClick(i, tt_number) {
    var token = localStorage.getItem('authorization');
    var username = localStorage.getItem("latestUserName");

    var url = "http://localhost:3000/api/ratings/" + username + "/" + tt_number;

    $("#RemoveRating" + i).click(function () {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    //Reload the page, so that the list resets all the counters and places the still existing items nicely.
                    completeMyRatings();
                } else {
                    var errorResponse = JSON.parse(this.responseText);
                    var errorMessage = errorResponse.errorMessage;

                    console.log(errorMessage)
                    //TODO - YORAN: Let user know of the error that occured, and that their request didn't work.
                }
            }
        };
        xhttp.open("DELETE", url, true);
        xhttp.setRequestHeader("authorization", token);
        xhttp.send();
    });
}

function getIMG(tt_number, title) {
    var movie;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            movie = JSON.parse(this.responseText);
            var posterPath = movie.poster_path;
            var ulrString = 'https://image.tmdb.org/t/p/w500' + posterPath;
            localStorage.setItem('' + title + '', ulrString);
        }
    };
    xhr.open("GET", "https://api.themoviedb.org/3/movie/" + tt_number + "?api_key=af1b95e9f890b9b6840cf6f08d0e6710&language=en-US", true);
    xhr.send();
}

function searchUser() {
    var firstname = document.forms["searchFormUser"]["searchQuery"].value;
    $("#usersGrid").empty();
    getUsers('user/' + firstname + '');
    return false;
}

function getUsers(search) {
    var colors = ["primary", "secondary", "success", "danger", "warning", "info", "dark"];
    $(".jumbotron").hide();
    $(".container").hide();
    $("#result").load("users.html", function () {
        var token = localStorage.getItem('authorization');

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var response = JSON.parse(this.responseText);

                for (var i = 0; i < response.length; i++) {
                    var x = Math.floor((Math.random() * 7));
                    var newIn = " <div class=\"col-lg-4\">\n" +
                        "                    <div class=\"card text-white bg-" + colors[x] + " mb-3\" style=\"max-width: 20rem;\">\n" +
                        "                        <div class=\"card-header\">" + response[i].username + "</div>\n" +
                        "                        <div class=\"card-body\">\n" +
                        "                            <h4 class=\"card-title\">" + response[i].first_name + ' ' + response[i].middle_name + ' ' + response[i].last_name + "</h4>\n" +
                        "                            <p class=\"card-text\">Favourites: " + response[i].favourites + "</p>\n" +
                        "                        </div>\n" +
                        "                    </div>\n" +
                        "                </div>";
                    $("#usersGrid").append(newIn);
                }
            }
        };
        if (search === undefined) {
            xhttp.open("GET", "http://localhost:3000/api/users/", true);
        } else {
            xhttp.open("GET", "http://localhost:3000/api/users/" + search, true);
        }
        xhttp.setRequestHeader("authorization", token);
        xhttp.send(token);
    });
}

function buttonClick(i, title) {
    var token = localStorage.getItem('authorization');

    $("#" + i).click(function () {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                window(alert(title + " has been added to your favourites list.\nCurrent list: " + JSON.parse(this.responseText).favourites));
            }
        };

        xhttp.open("PUT", "http://localhost:3000/api/users/favourites/" + title, true);
        xhttp.setRequestHeader("authorization", token);
        xhttp.send();
    });
}

//Function to bind buttons for pagination.
function newFunction(query) {
    $(".page-item").off();
    $(".page-item").click(function () {
        $("#movieRow").empty();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var response = JSON.parse(this.responseText);
                movies(response.docs);
            }
        };
        if (query !== undefined) {
            var str = query.toLowerCase();
            xhttp.open("GET", "http://localhost:3000/api/movies/?" + str + "&pag=" + ($(this).text()), true);
        } else {
            xhttp.open("GET", "http://localhost:3000/api/movies/?pag=" + ($(this).text()), true);
        }

        xhttp.send();
    })
}

function getAllImages() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.responseText);

            for (var i = 0; i < response.length; i++) {
                var number = response[i].imdb_tt_number;
                var title = response[i].title;
                getIMG(number, title);
            }
        }
    };
    xhttp.open("GET", "http://localhost:3000/api/movies/all", true);
    xhttp.send();
}

function movies(response) {
    for (var i = 0; i < response.length; i++) {
        var number = response[i].imdb_tt_number;
        var title = response[i].title;

        var url = localStorage.getItem('' + title + '');

        var newIn = "<div class=\"col-md-4\">\n" +
            "            <div class=\"card\" style=\"width: 20rem\">" +
            "                <h4 id=\"" + i + "ab\" class=\"card-header\">" + response[i].title + "</h4>\n" +
            "                <img class=\"card-img-top\" src=\"" + url + "\" alt=\"Could not find poster for this movie.\">\n" +
            "                <div class=\"card-body\">\n" +
            "                    <h5 class=\"card-title\">" + response[i].director + "</h5>\n" +
            "                    <p class=\"card-text\">" + response[i].description + "</p>\n" +
            "                    <a id=\"" + i + "\" class=\"btn btn-primary\">Favourite</a>\n" +
            "                </div>\n" +
            "                <a class=\"card-footer text-muted\">Movie TT: " + number + "</a>\n" +
            "            </div>\n" +
            "        </div>\n";
        $("#movieRow").append(newIn);

        buttonClick(i, title);
    }
}

function addButtons(number, callback) {
    $(".pagination").empty();
    var int = 0;
    while (number > 0) {
        $(".pagination").append(" <li class=\"page-item\"><a class=\"page-link\" href=\"#\">" + int + "</a></li>");
        int = int + 1;
        number = number - 3;
    }
    callback();
}

//...