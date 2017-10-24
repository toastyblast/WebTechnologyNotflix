$(document).ready(function () {

    $("#catalogButton").click(function () {
        $(".jumbotron").hide();
        $(".container").hide();
        $("#result").load("movies.html");

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var response = 0;
                response = JSON.parse(this.responseText);

                for (var i = 0; i < response.length; i++) {
                    var newIn = "<div class=\"col-md-4\">\n" +
                        "            <div class=\"card\" style=\"width: 20rem;\">\n" +
                        "                <!--<img class=\"card-img-top\" src=\"...\" alt=\"Card image cap\">-->\n" +
                        "                <div class=\"card-body\">\n" +
                        "                    <h4 class=\"card-title\">" + response[i].title + "</h4>\n" +
                        "                    <h5 class=\"card-title\">" + response[i].director + "</h5>\n" +
                        "                    <p class=\"card-text\">" + response[i].description + "</p>\n" +
                        "                    <a href=\"#\" class=\"btn btn-primary\">Go somewhere</a>\n" +
                        "                </div>\n" +
                        "            </div>\n" +
                        "        </div>";
                    $("#movieRow").append(newIn);
                }
            }
        };
        xhttp.open("GET", "http://localhost:3000/api/movies/", true);
        xhttp.send();
    });

    $("#home").click(function () {
        $("#result").empty();
        $(".jumbotron").show();
        $(".container").show();
    });

    $('#loginForm').submit(function (event) {
        //TODO - IDEA (No idea if possible) - CHECK IF THE USER HAS LOGGED IN SHORTLY BEFORE AND ALREADY DO MAKE THEM LOGGED IN.

        event.preventDefault();

        var username = document.forms["userLoginForm"]["usernameBox"].value;
        var password = document.forms["userLoginForm"]["passwordBox"].value;

        var data = {
            "username": "" + username,
            "passwords": "" + password
        };

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            console.log(this.responseText);

            if (this.readyState === 4 && this.status === 201) {
                var response = JSON.parse(this.responseText);
                var token = response.token;

                // console.log(token);

                localStorage.setItem('authorization', token);

                $("#loginForm").replaceWith(
                    "<div id=\"loggedInDiv\" class=\"form-inline my-2 my-lg-0\">" +
                    "   <a class=\"nav-link\" id=\"special-text\">Welcome back, <strong>" + username + "</strong></a>" +
                    "   <button class=\"btn btn-outline-success my-2 my-sm-0\" onclick=\"return completeMyRatings\">My ratings</button>" +
                    "   <button class=\"btn btn-outline-success my-2 my-sm-0\" id=\"logout-button\" onclick=\"return completeLogout()\">Log out</button>" +
                    "</div>");
            } else {
                var errorResponse = JSON.parse(this.responseText);
                var errorMessage = errorResponse.errorMessage;

                // console.log(errorMessage);

                //TODO: Let the user know about the issue in some way.
            }
        };

        xhttp.open("POST", 'http://localhost:3000/api/authenticate/', true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(data));
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
            for (var i = 0; i < response.Movies.length; i++) {
                // window.alert(JSON.stringify(response.Movies[0]));
                var newIn = "<div class=\"col-md-4\">\n" +
                    "            <div class=\"card\" style=\"width: 20rem;\">\n" +
                    "                <!--<img class=\"card-img-top\" src=\"...\" alt=\"Card image cap\">-->\n" +
                    "                <div class=\"card-body\">\n" +
                    "                    <h4 class=\"card-title\">" + response.Movies[i].title + "</h4>\n" +
                    "                    <h5 class=\"card-title\">" + response.Movies[i].director + "</h5>\n" +
                    "                    <p class=\"card-text\">" + response.Movies[i].description + "</p>\n" +
                    "                    <a href=\"#\" class=\"btn btn-primary\">Go somewhere</a>\n" +
                    "                </div>\n" +
                    "            </div>\n" +
                    "        </div>";
                $("#movieRow").append(newIn);
            }
        }
    };
    if (searchCategory === "Title") {
        xhttp.open("GET", "http://localhost:3000/api/movies/?title=" + searchQuery, true);
        // xhttp.send();
    } else if (searchCategory === "Director") {
        xhttp.open("GET", "http://localhost:3000/api/movies/?director=" + searchQuery, true);
        // xhttp.send();
    } else if (searchCategory === "Description") {
        xhttp.open("GET", "http://localhost:3000/api/movies/?description=" + searchQuery, true);
        // xhttp.send();
    } else if (searchCategory === "tt_number") {
        xhttp.open("GET", "http://localhost:3000/api/movies/?ttnumber=" + searchQuery, true);
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
        "    <input name=\"middlename\" class=\"form-control mr-sm-2\" type=\"text\" placeholder=\"Middle name\" aria-label=\"PasswordRegister\">\n" +
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
            // window.alert(JSON.parse(this.responseText));
        } else {
            // window.alert(this.responseText);
        }
        // window.alert(this.responseText);
    };
    xhttp.open("POST", 'http://localhost:3000/api/users/', true);
    // xhttp.setRequestHeader("authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzd3h5ejE3IiwiaWF0IjoxNTA4Nzc0NTk0LCJleHAiOjE1MTExOTM3OTR9.3QynZmUjP74Goaligk-FA9HAt50op3r6sy2pqtCyDvc");
    // xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));

    $("#nameForm").remove();
    $("#registerButton").show();

    return false;
}

function completeLogout() {
    localStorage.removeItem("authorization");

    //TODO - IDEA - Have a little balloon pop up in the right of the navbar saying they have been successfully logged out.

    $("#loggedInDiv").replaceWith(
        "<form class=\"form-inline my-2 my-lg-0\" id=\"loginForm\" name=\"userLoginForm\">" +
        "   <input class=\"form-control mr-sm-2\" name=\"usernameBox\" type=\"text\" placeholder=\"Username\" aria-label=\"Username\">" +
        "   <input class=\"form-control mr-sm-2\" name=\"passwordBox\" type=\"password\" placeholder=\"Password\" aria-label=\"Password\">" +
        "   <button class=\"btn btn-outline-success my-2 my-sm-0\" type=\"submit\">Login</button>" +
        "</form>");
}

function completeMyRatings() {
    //TODO: Show a page with all of the user's ratings, and an option for them to search for specific ratings of theirs.
}

//...