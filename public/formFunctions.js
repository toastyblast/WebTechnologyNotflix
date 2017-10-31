/**
 * This function is executed when the search button on the movie's search form is clicked. When that happens the category
 * of the search is retrieved from the drop down select menu. Depending on the search category one of 4 ajax requests is
 * exectued(search by title/director/description/imdb tt_number).
 * @returns {boolean}
 */
function searchMoviesFunction() {
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
                paginationButtonsOnClick(searchCategory + "=" + searchQuery)
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
            var response = JSON.parse(this.responseText);

            if (this.status === 200) {
                //At least one or more ratings made by the user have been found, show them using this function.
                ratings(response);
            } else if (this.status === 400) {
                //This means something in the request body was wrong, which is most likely caused by programming issues server-side
                $("#ratingSearchContainer").append("<div class=\"alert alert-danger alert-dismissable\">\n" +
                    "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                    "    <strong>Danger!</strong> " + response.errorMessage + " Please contact us and let us know what caused this issue." +
                    "  </div>");
            } else if (this.status === 403) {
                //This means the user was not authorized, meaning they had no token, or it expired.
                $("#ratingSearchContainer").append("<div class=\"alert alert-danger alert-dismissable\">\n" +
                    "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                    "    <strong>Danger!</strong> " + response.errorMessage +
                    "  </div>");
            } else if (this.status === 404) {
                //This means that the user either has no ratings, or the movie they searched for does not exist.
                $("#ratingSearchContainer").append("<div class=\"alert alert-warning alert-dismissable\">\n" +
                    "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                    "    <strong>Warning!</strong> " + response.errorMessage +
                    "  </div>");
            } else if (this.status === 500) {
                //This means something is going on server-side that the user can't do anything about.
                $("#ratingSearchContainer").append("<div class=\"alert alert-danger alert-dismissable\">\n" +
                    "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                    "    <strong>Danger!</strong> " + response.errorMessage + " This most likely means that the website is being worked on. Please come back later!" +
                    "  </div>");
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
            var response = JSON.parse(this.responseText);

            if (this.status === 200) {
                ratingCreateFormFunction(response.docs[0].tt_number);
            } else {
                //This means something is going on server-side that the user can't do anything about.
                $("#ratingSearchContainer").append("<div class=\"alert alert-danger alert-dismissable\">\n" +
                    "    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>\n" +
                    "    <strong>Danger - Unknown error!</strong> " + response + " Please contact us about this!" +
                    "  </div>");
            }
        }
    };

    xhttp.open("GET", "http://localhost:3000/api/movies/?ttnumber=tt" + givenTTNumber + "&pag=0", true);
    xhttp.send();

    return false;
}

/**
 * Function that gets the username query from the form on the users page, and after that passes the query to the ajax
 * request(getUsers).
 * @returns {boolean}
 */
function searchUser() {
    var firstname = document.forms["searchFormUser"]["searchQuery"].value;
    $("#usersGrid").empty();
    getUsers('user/' + firstname + '');
    return false;
}

/**
 * This function is executed when the register button is clicked. When that happens a new form is loaded where the user
 * can enter his/her name.
 * @returns {boolean}
 */
function beginRegistrationFunction() {
    $("#registerButton").hide();

    var eyy = "<form id='nameForm' name=\"registerFormNames\" class=\"form-inline my-2 my-lg-0\" method=\"post\" onsubmit=\"return completeRegistrationFunction()\">\n" +
        "    <input name=\"firstname\" class=\"form-control mr-sm-2\" type=\"text\" placeholder=\"First name\" aria-label=\"UsernameRegister\">\n" +
        "    <input name=\"middlename\" class=\"form-control mr-sm-2\" type=\"text\" placeholder=\"Middle name (optional)\" aria-label=\"PasswordRegister\">\n" +
        "    <input name=\"lastname\" class=\"form-control mr-sm-2\" type=\"text\" placeholder=\"Last name\" aria-label=\"PasswordRegister\">\n" +
        "    <button class=\"btn btn-outline-success my-2 my-sm-0\" type=\"submit\">Complete Registration</button>\n" +
        "</form>";
    $("#topContainer").append(eyy);

    return false;
}

/**
 * This function is executed when the complete registration button is clicked. When that happens the information from all
 * input fields is retrieved and is send via the body of the ajax request. Depending on the outcome of the request different
 * messages will be returned to the user, signaling success or if something went wrong.
 * @returns {boolean}
 */
function completeRegistrationFunction() {
    var firstname = document.forms["registerFormNames"]["firstname"].value;
    var middlename = document.forms["registerFormNames"]["middlename"].value;
    var lastname = document.forms["registerFormNames"]["lastname"].value;
    var username = document.forms["registerForm"]["username"].value;
    var password = document.forms["registerForm"]["password"].value;

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