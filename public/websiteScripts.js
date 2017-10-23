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
    })
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
//...