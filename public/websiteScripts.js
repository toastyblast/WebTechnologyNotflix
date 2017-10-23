$('#loginForm').submit(function (event) {
    event.preventDefault();

    var $form = $(this),
        usernameGiven = $form.find("input[name='usernameBox']").val(),
        passwordGiven = $form.find("input[name='passwordBox']").val();

    var posting = $.post("http://localhost:3000/api/authentication/", {'username':usernameGiven, 'passwords':passwordGiven});

    posting.done(function (data) {
        console.log(data.errorMessage);
        console.log(data.token);
        var content = $(data).find("#content");
        console.log(content.errorMessage);
        console.log(content.token);
        $("#loginForm").empty().append(content);
    });
});

$(document).ready(function () {

    $("#catalogButton").click(function () {
        $(".jumbotron").hide();
        $(".container").hide();
        $("#result").load("movies.html");

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                var response = 0;
                response = JSON.parse(this.responseText);

                for (var i = 0 ; i < response.length ; i++){
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

});

function formFunction() {
    var searchQuery = document.forms["searchForm"]["searchQuery"].value;
    var searchCategory = $("#exampleFormControlSelect1").val();
    // window.alert(searchCategory);
    $("#movieRow").empty();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var response = 0;
            response = JSON.parse(this.responseText);
            for (var i = 0 ; i < response.Movies.length ; i++){
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
    if(searchCategory === "Title"){
        xhttp.open("GET", "http://localhost:3000/api/movies/?title="+ searchQuery, true);
        // xhttp.send();
    } else if (searchCategory === "Director"){
        xhttp.open("GET", "http://localhost:3000/api/movies/?director="+ searchQuery, true);
        // xhttp.send();
    } else if (searchCategory === "Description"){
        xhttp.open("GET", "http://localhost:3000/api/movies/?description="+ searchQuery, true);
        // xhttp.send();
    } else if (searchCategory === "tt_number"){
        xhttp.open("GET", "http://localhost:3000/api/movies/?ttnumber="+ searchQuery, true);
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
        "lastname" : " " + lastname + " ",
        "middlename" : " " + middlename + " ",
        "firstname" : " " + firstname + " ",
        "usern" : " " + username + " ",
        "password" : " " + password + " "
    };
    // window.alert(data);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
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
    return false;
}
//...