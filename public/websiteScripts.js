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
     * Check if the user logged out before this loading. If so, show a little message to let them know.
     */
    if (localStorage.getItem("loggedOut") !== null) {
        //If the page is reloaded because the user logged out, then show a special notice for the user!
        $("#navbarsExampleDefault").append("<div class=\"alert alert-success alert-dismissable\">\n" +
            "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
            "    <strong>Success!</strong> You have been logged out.\n" +
            "  </div>");

        localStorage.removeItem("loggedOut");
    }

    /**
     * Function triggered when the "Browse catalog" nav link has been clicked. Loads the page of all movies through several methods.
     */
    $("#catalogButton, #browse").click(function () {
        $(".jumbotron").hide();
        $(".container").hide();
        $("#result").load("LoadHTMLFiles/movies.html", function () {
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
                var response = JSON.parse(this.responseText);

                if (this.status === 201) {
                    var token = response.token;

                    localStorage.setItem('authorization', token);
                    localStorage.setItem("latestUserName", username);

                    $("#loginForm").replaceWith(
                        "<div id=\"loggedInDiv\" class=\"form-inline my-2 my-lg-0\">" +
                        "   <a class=\"nav-link\" id=\"special-text\">Welcome back, <strong>" + username + "</strong></a>" +
                        "   <button class=\"btn btn-outline-success my-2 my-sm-0\" onclick=\"return completeMyRatings()\">My ratings</button>" +
                        "   <button class=\"btn btn-outline-success my-2 my-sm-0\" id=\"logout-button\" onclick=\"return completeLogout()\">Log out</button>" +
                        "</div>");
                } else if (this.status === 404) {
                    //There is no account with this username, let the user know.
                    $("#loginForm").before("<div class=\"alert alert-warning alert-dismissable\">\n" +
                        "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                        "    <strong>Warning!</strong> " + response.errorMessage +
                        "  </div>");
                } else if (this.status === 400) {
                    //The combination given by the user is incorrect, or something is wrong code-wise on the server-side
                    $("#loginForm").before("<div class=\"alert alert-danger alert-dismissable\">\n" +
                        "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                        "    <strong>Danger!</strong> " + response.errorMessage +
                        "  </div>");
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


/**
 * Function that is triggered when the user clicks the "Log out" button. It deletes all local data on the user and resets the page.
 */
function completeLogout() {
    localStorage.removeItem("authorization");
    localStorage.removeItem("latestUserName");
    //Since the user has logged out, set a item that lets the reloaded page know to show a notification telling the
    // user it successfully happened.
    localStorage.setItem("loggedOut", true);

    window.location.reload();
}


/**
 * Function that handles when the rating create button is clicked. Calls the database to create said ratings.
 *
 * @param databaseTTNumber are the seven valid IMDB TT digits the user has filled in.
 * @returns {boolean} To prevent standard behaviour of the form.
 */
function ratingCreateFormFunction(databaseTTNumber) {
    var givenTTNumber = $("#ratingMovieBox").val();
    var givenScore = parseFloat($("#ratingScoreBox").val());

    var userToken = localStorage.getItem("authorization");

    var data = {
        "imdb_tt_number": "tt" + givenTTNumber,
        "tt_number": databaseTTNumber,
        "rating": givenScore
    };

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            var response = JSON.parse(this.responseText);
            //Remove the temporarily stored fake TT number just to be sure.
            localStorage.removeItem("temporaryTT");

            if (xhttp.status === 201) {
                //The rating has been created, so now reload the div with ratings and it should be there!
                completeMyRatings();
            } else if (this.status === 400) {
                //This means something in the request body was wrong, which is most likely caused by programming issues
                // server-side. (Or the user found some way to intercept the request and alter it.)
                $("#ratingCreateContainer").append("<div class=\"alert alert-danger alert-dismissable\">\n" +
                    "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                    "    <strong>Error!</strong> " + response.errorMessage + " Please contact us and let us know what caused this issue." +
                    "  </div>");
            } else if (this.status === 403) {
                //This means the user was not authorized, meaning they had no token, or it expired.
                $("#ratingCreateContainer").append("<div class=\"alert alert-danger alert-dismissable\">\n" +
                    "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                    "    <strong>Danger!</strong> " + response.errorMessage +
                    "  </div>");
            } else if (this.status === 409) {
                //This means that the user already has a rating for the movie they are trying to make a rating for.
                $("#ratingCreateContainer").append("<div class=\"alert alert-warning alert-dismissable\">\n" +
                    "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                    "    <strong>Warning!</strong> " + response.errorMessage +
                    "  </div>");
            } else if (this.status === 500) {
                //This means something is going on server-side that the user can't do anything about.
                $("#ratingCreateContainer").append("<div class=\"alert alert-danger alert-dismissable\">\n" +
                    "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                    "    <strong>Danger!</strong> " + response.errorMessage + " This most likely means that the website is being worked on. Please come back later!" +
                    "  </div>");
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
    $("#result").load("LoadHTMLFiles/ratings.html");

    var userToken = localStorage.getItem("authorization");
    var userName = localStorage.getItem("latestUserName");
    var url = "http://localhost:3000/api/ratings/" + userName;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            var response = JSON.parse(this.responseText);

            if (this.status === 200) {
                ratings(response);
            } else if (this.status === 400) {
                //This means something in the request body was wrong, which is most likely caused by programming issues server-side
                $("#ratingsListContainer").prepend("<div class=\"alert alert-danger alert-dismissable\">\n" +
                    "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                    "    <strong>Danger!</strong> " + response.errorMessage + " Please contact us and let us know what caused this issue." +
                    "  </div>");
            } else if (this.status === 403) {
                //This means the user was not authorized, meaning they had no token, or it expired.
                $("#ratingsListContainer").prepend("<div class=\"alert alert-danger alert-dismissable\">\n" +
                    "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                    "    <strong>Danger!</strong> " + response.errorMessage +
                    "  </div>");
            } else if (this.status === 404) {
                //This means that the user either has no ratings, or the movie they searched for does not exist.
                $("#ratingsListContainer").prepend("<div class=\"alert alert-warning alert-dismissable\">\n" +
                    "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                    "    <strong>Warning!</strong> " + response.errorMessage +
                    "  </div>");
            } else if (this.status === 500) {
                //This means something is going on server-side that the user can't do anything about.
                $("#ratingsListContainer").prepend("<div class=\"alert alert-danger alert-dismissable\">\n" +
                    "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                    "    <strong>Danger!</strong> " + response.errorMessage + " This most likely means that the website is being worked on. Please come back later!" +
                    "  </div>");
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
        var newScore = parseFloat($("#ratingCardScoreBox" + i).val());

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
                } else if (this.status === 400) {
                    //This means something in the request body was wrong, which is most likely caused by programming issues
                    // server-side. (Or the user found some way to intercept the request and alter it.)
                    $("#ratingsListContainer").prepend("<div class=\"alert alert-danger alert-dismissable\">\n" +
                        "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                        "    <strong>Error!</strong> " + response.errorMessage + " Please contact us and let us know what caused this issue." +
                        "  </div>");
                } else if (this.status === 403) {
                    //This means the user was not authorized, meaning they had no token, or it expired.
                    $("#ratingsListContainer").prepend("<div class=\"alert alert-danger alert-dismissable\">\n" +
                        "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                        "    <strong>Danger!</strong> " + response.errorMessage +
                        "  </div>");
                } else if (this.status === 404) {
                    //This means that the user does not have a rating for this movie, so nothing can be edited.
                    $("#ratingsListContainer").prepend("<div class=\"alert alert-warning alert-dismissable\">\n" +
                        "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                        "    <strong>Warning!</strong> " + response.errorMessage +
                        "  </div>");
                } else if (this.status === 500) {
                    //This means something is going on server-side that the user can't do anything about.
                    $("#ratingsListContainer").prepend("<div class=\"alert alert-danger alert-dismissable\">\n" +
                        "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                        "    <strong>Danger!</strong> " + response.errorMessage + " This most likely means that the website is being worked on. Please come back later!" +
                        "  </div>");
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
                var response = JSON.parse(this.responseText);

                if (this.status === 200) {
                    //Reload the page, so that the list resets all the counters and places the still existing items nicely.
                    completeMyRatings();
                } else if (this.status === 400) {
                    //This means something in the request body was wrong, which is most likely caused by programming issues
                    // server-side. (Or the user found some way to intercept the request and alter it.)
                    $("#ratingsListContainer").prepend("<div class=\"alert alert-danger alert-dismissable\">\n" +
                        "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                        "    <strong>Error!</strong> " + response.errorMessage + " Please contact us and let us know what caused this issue." +
                        "  </div>");
                } else if (this.status === 403) {
                    //This means the user was not authorized, meaning they had no token, or it expired.
                    $("#ratingsListContainer").prepend("<div class=\"alert alert-danger alert-dismissable\">\n" +
                        "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                        "    <strong>Danger!</strong> " + response.errorMessage +
                        "  </div>");
                } else if (this.status === 404) {
                    //This means that the user does not have a rating for this movie, so nothing can be edited.
                    $("#ratingsListContainer").prepend("<div class=\"alert alert-warning alert-dismissable\">\n" +
                        "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                        "    <strong>Warning!</strong> " + response.errorMessage +
                        "  </div>");
                } else if (this.status === 500) {
                    //This means something is going on server-side that the user can't do anything about.
                    $("#ratingsListContainer").prepend("<div class=\"alert alert-danger alert-dismissable\">\n" +
                        "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                        "    <strong>Danger!</strong> " + response.errorMessage + " This most likely means that the website is being worked on. Please come back later!" +
                        "  </div>");
                }
            }
        };
        xhttp.open("DELETE", url, true);
        xhttp.setRequestHeader("authorization", token);
        xhttp.send();
    });
}

/**
 * Function that makes an ajax request to the themoviedb api(for each movie). If the request is successful the poster URL
 * that was recieved from the request is stored in the localStorage with the name of the movie being the key.
 * @param tt_number IMDB tt_number of the movie.
 * @param title Title of the movie.
 */
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


/**
 * Function that gets all of the users, or if a query is specified retrieves that user.
 * @param search A query param for individual user search.
 */
function getUsers(search) {
    var colors = ["primary", "secondary", "success", "danger", "warning", "info", "dark"];
    $(".jumbotron").hide();
    $(".container").hide();
    $("#result").load("LoadHTMLFiles/users.html", function () {
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

        //If there is no search query defined get all of the users. Else get a single user.
        if (search === undefined) {
            xhttp.open("GET", "http://localhost:3000/api/users/", true);
        } else {
            xhttp.open("GET", "http://localhost:3000/api/users/" + search, true);
        }
        xhttp.setRequestHeader("authorization", token);
        xhttp.send(token);
    });
}

/**
 * When film cards are loaded, every favourite button is assigned an unique id. After that each of these buttons is given
 * an onclick which executes a ajax request that adds the movie that the button is assigned to, to the current user's favourite
 * list.
 * @param i ID of the button.
 * @param title Title of the movie that the button is assigned to. (The button is part of that movies card.)
 */
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

/**
 * Function that is used for the pagination. After all of the pagination buttons have been loaded, this function assigns
 * an on click listener to them. This on click sends a pagination ajax request with the offset parameter being the number of the
 * pagination button.
 * A page can have only 3 movies. Pages start from zero. (EX: If page number is 1, it will skip the first 3 movies, and show
 * the next 3, if the number is 2 it will skip the first six movies and show the next three, if the number is 0, it will show
 * the first three movies.)
 * @param query
 */
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

/**
 * Function that is executed when the website is READY. It uses the the movie db api(getIMG) to get posters for all of the movies,
 * in the database, so other methods can use the posters when needed.
 */
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

/**
 * Function that loads the movies into the movieRow so the user can see them.
 * @param response The response that is returned from the AJAX request containing a list of movies.
 */
function movies(response) {
    for (var i = 0; i < response.length; i++) {
        var number = response[i].imdb_tt_number;
        var fakeNumber = response[i].tt_number;
        var title = response[i].title;

        var url = localStorage.getItem('' + title + '');

        var newIn = "<div class=\"col-md-4\">\n" +
            "            <div class=\"card\" style=\"width: 20rem; min-height: 60rem\">" +
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

        getRatingOfSpecificMovie(i, fakeNumber)
    }
}

function getRatingOfSpecificMovie(index, tt_number) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var response = JSON.parse(this.responseText);

                $("#" + index).before("<p class=\"card-text\">Average rating: " + response.averageRating + "</p>\n");
            } else {
                $("#" + index).before("<p class=\"card-text\">Average rating: None yet!</p>\n");
            }
        }
    };

    xhttp.open("GET", "http://localhost:3000/api/ratings/" + tt_number, true);
    xhttp.send();

    return false;
}

/**
 * Function that adds a navigation page for each 3 movies. (If there are 9 movies it adds 3 pages).
 * @param number Number of total movies.
 * @param callback A callback.
 */
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