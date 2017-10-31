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
                        paginationButtonsOnClick();
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