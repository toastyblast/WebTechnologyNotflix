//This JS has the functions that deal with the ratings portion of the assignment.

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
        //Once your request is done...
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

        //Create a new card for the rating item at the currend index and put it in the div.
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
 * Function that is not used on any of the rating pages, but instead on the catalog. It loads the avarage rating of a
 * movie that is currently shown on said page.
 *
 * @param index is the index of the movie on the catalog page's movie grid container
 * @param tt_number is the TT number of the movie that we want the average rating of.
 * @returns {boolean} to prevent standard behaviour of any of the commands or forms found on the page.
 */
function getRatingOfSpecificMovie(index, tt_number) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                //This movie does have ratings, meaning it also has an average rating all users, even non-logged in
                // ones, are allowed to see.
                var response = JSON.parse(this.responseText);

                $("#" + index).before("<p class=\"card-text\">Average rating: " + response.averageRating + "</p>\n");
            } else {
                //The movie has no ratings yet, so there can't be any average ratings either.
                $("#" + index).before("<p class=\"card-text\">Average rating: None yet!</p>\n");
            }
        }
    };

    xhttp.open("GET", "http://localhost:3000/api/ratings/" + tt_number, true);
    xhttp.send();

    return false;
}