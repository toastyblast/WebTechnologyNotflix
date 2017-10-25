if(localStorage.getItem("authorization") !== null) {
    //Check if the browser still has a valid token stored, if so, just log them into the user from that token.
    var data = {
        "token":localStorage.getItem("authorization")
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var response = JSON.parse(this.responseText);
                var tokenUsername = response.tokenUsername;

                $("#loginForm").replaceWith(
                    "<div id=\"loggedInDiv\" class=\"form-inline my-2 my-lg-0\">" +
                    "   <a class=\"nav-link\" id=\"special-text\">Welcome back, <strong>" + tokenUsername + "</strong></a>" +
                    "   <button class=\"btn btn-outline-success my-2 my-sm-0\" onclick=\"return completeMyRatings\">My ratings</button>" +
                    "   <button class=\"btn btn-outline-success my-2 my-sm-0\" id=\"logout-button\" onclick=\"return completeLogout()\">Log out</button>" +
                    "</div>");
            } else {
                localStorage.removeItem("authorization");

                // completeLogout();
            }
        }
    };
    xhttp.open("POST", "http://localhost:3000/api/authenticate/check", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}

$(document).ready(function () {
    $("#catalogButton").click(function () {
        $(".jumbotron").hide();
        $(".container").hide();
        $("#result").load("movies.html");

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var response = JSON.parse(this.responseText);

                for (var i = 0; i < response.length; i++) {
                    var number = response[i].imdb_tt_number;
                    var title = response[i].title;

                    getIMG(number, title);

                    var url = localStorage.getItem('' + title + '');

                    var newIn = "<div class=\"col-md-4\">\n" +
                        "            <div class=\"card\" style=\"width: 20rem;\">" +
                        "                <h4 id=\"" + i + "ab\" class=\"card-header\">" + response[i].title + "</h4>\n" +
                        "                <img class=\"card-img-top\" src=\"" + url + "\" alt=\"Could not find poster for this movie.\">\n" +
                        "                <div class=\"card-body\">\n" +
                        "                    <h5 class=\"card-title\">" + response[i].director + "</h5>\n" +
                        "                    <p class=\"card-text\">" + response[i].description + "</p>\n" +
                        "                    <a id=\""+i+"\" class=\"btn btn-primary\">Favourite</a>\n" +
                        "                </div>\n" +
                        "                <a class=\"card-footer text-muted\">Movie TT: " + number + "</a>\n" +
                        "            </div>\n" +
                        "        </div>\n";
                    $("#movieRow").append(newIn);

                    buttonClick(i, title);
                }
                newFunction();
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

                    $("#loginForm").replaceWith(
                        "<div id=\"loggedInDiv\" class=\"form-inline my-2 my-lg-0\">" +
                        "   <a class=\"nav-link\" id=\"special-text\">Welcome back, <strong>" + username + "</strong></a>" +
                        "   <button class=\"btn btn-outline-success my-2 my-sm-0\" onclick=\"return completeMyRatings\">My ratings</button>" +
                        "   <button class=\"btn btn-outline-success my-2 my-sm-0\" id=\"logout-button\" onclick=\"return completeLogout()\">Log out</button>" +
                        "</div>");
                } else {
                    var errorResponse = JSON.parse(this.responseText);
                    var errorMessage = errorResponse.errorMessage;

                    //TODO: Let the user know about the issue in some way, like with error bubbles or something.
                }
            }
        };
        xhttp.open("POST", 'http://localhost:3000/api/authenticate/', true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(data));

        return false;
    });

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
            for (var i = 0; i < response.Movies.length; i++) {
                var number = response.Movies[i].imdb_tt_number;
                var title = response.Movies[i].title;
                // getIMG(number, title);
                var url = localStorage.getItem(''+response.Movies[i].title+'');
                var newIn = "<div class=\"col-md-4\">\n" +
                    "            <div class=\"card\" style=\"width: 20rem;\">\n" +
                    "                <img class=\"card-img-top\" src="+url+" alt=\"Card image cap\">" +
                    "                <div class=\"card-body\">" +
                    "                    <h4 class=\"card-title\">" + response.Movies[i].title + "</h4>\n" +
                    "                    <h5 class=\"card-title\">" + response.Movies[i].director + "</h5>\n" +
                    "                    <p class=\"card-text\">" + response.Movies[i].description + "</p>\n" +
                    "                    <a id=\""+i+"\" class=\"btn btn-primary\">Favourite</a>\n" +
                    "                </div>\n" +
                    "            </div>\n" +
                    "        </div>";
                $("#movieRow").append(newIn);
                buttonClick(i, title)
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

    location.reload();
}

function completeMyRatings() {
    //TODO: Show a page with all of the user's ratings, and an option for them to search for specific ratings of theirs.
}

function getIMG(tt_number, title) {
    var movie;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            movie = JSON.parse(this.responseText);
            var posterPath = movie.poster_path;
            var ulrString = 'https://image.tmdb.org/t/p/w500' + posterPath;
            localStorage.setItem(''+title+'', ulrString);
        }
    };
    xhr.open("GET", "https://api.themoviedb.org/3/movie/"+tt_number+"?api_key=af1b95e9f890b9b6840cf6f08d0e6710&language=en-US", true);
    xhr.send();
}

function searchUser() {
    var firstname = document.forms["searchFormUser"]["searchQuery"].value;
    $("#usersGrid").empty();
    getUsers('user/'+firstname+'');
    return false;
}

function getUsers(search) {
    var colors = ["primary", "secondary", "success", "danger", "warning", "info", "dark"];
    $(".jumbotron").hide();
    $(".container").hide();
    $("#result").load("users.html");
    var token = localStorage.getItem('authorization');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.responseText);

            for (var i = 0 ; i < response.length ; i++){
                var x = Math.floor((Math.random() * 7));
                var newIn = " <div class=\"col-lg-4\">\n" +
                    "                    <div class=\"card text-white bg-"+colors[x]+" mb-3\" style=\"max-width: 20rem;\">\n" +
                    "                        <div class=\"card-header\">"+response[i].username+"</div>\n" +
                    "                        <div class=\"card-body\">\n" +
                    "                            <h4 class=\"card-title\">"+response[i].first_name+ ' ' +response[i].middle_name+ ' ' +response[i].last_name+"</h4>\n" +
                    "                            <p class=\"card-text\">Favourites: "+response[i].favourites+"</p>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                </div>";
                $("#usersGrid").append(newIn);
            }
        }
    };
    if (search === undefined){
        xhttp.open("GET", "http://localhost:3000/api/users/", true);
    } else {
        xhttp.open("GET", "http://localhost:3000/api/users/"+search, true);
    }
    xhttp.setRequestHeader("authorization", token);
    xhttp.send(token);
}

function buttonClick(i, title) {
    var token = localStorage.getItem('authorization');
    $("#"+i).click(function () {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

            }
        };
        xhttp.open("PUT", "http://localhost:3000/api/users/favourites/"+title, true);
        xhttp.setRequestHeader("authorization", token);
        xhttp.send();
    });
}

function  newFunction() {
    $(".page-item").click(function () {
        $("#movieRow").empty();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var response = JSON.parse(this.responseText);
                for (var i = 0 ; i < response.length ; i++){
                    var url = localStorage.getItem(''+response[i].title+'');
                    var newIn = "<div class=\"col-md-4\">\n" +
                        "            <div class=\"card\" style=\"width: 20rem;\">\n" +
                        "                <img class=\"card-img-top\" src="+url+" alt=\"Card image cap\">" +
                        "                <div class=\"card-body\">" +
                        "                    <h4 class=\"card-title\">" + response[i].title + "</h4>\n" +
                        "                    <h5 class=\"card-title\">" + response[i].director + "</h5>\n" +
                        "                    <p class=\"card-text\">" + response[i].description + "</p>\n" +
                        "                    <a id=\""+i+"\" class=\"btn btn-primary\">Favourite</a>\n" +
                        "                </div>\n" +
                        "            </div>\n" +
                        "        </div>";
                    $("#movieRow").append(newIn);
                }
            }
        };
        xhttp.open("GET", "http://localhost:3000/api/movies/?pag="+($(this).text()), true);
        xhttp.send();
    })
}
//...