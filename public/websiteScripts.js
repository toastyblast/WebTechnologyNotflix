$(document).ready(function () {
    $("#home").click(function () {
        $("#result").empty();
        $(".jumbotron").show();
        $(".container").show();
    });

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

    $("#registrationForm").submit(function (event) {
        var usernameGiven = $("input[name='usernameRegistration']", this).val();
        var passwordGiven = $("input[name='passwordRegistration']", this).val();

        var data = JSON.stringify({username:usernameGiven, passwords:passwordGiven});
        console.log(data);

        // $.post("http://localhost:63342/api/users/", data, function () {
        //     alert(data);
        // }, "json");

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/api/users/", true);

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var response = JSON.parse(this.responseText);

                console.log(response);
            }
        };

        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(data);

        event.preventDefault();
    })

    //Document calls here...
});

function formFunction() {
    var searchQuery = document.forms["searchForm"]["searchQuery"].value;
    var searchCategory = $("#exampleFormControlSelect1").val();
    // window.alert(searchCategory);
    $("#movieRow").empty();

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.responseText);

            for (var i = 0 ; i < response.Movies.length ; i++){
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

//Other functions here...