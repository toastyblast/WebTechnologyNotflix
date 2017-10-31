/**
 * When film cards are loaded, every favourite button is assigned an unique id. After that each of these buttons is given
 * an onclick which executes a ajax request that adds the movie that the button is assigned to, to the current user's favourite
 * list.
 * @param i ID of the button.
 * @param title Title of the movie that the button is assigned to. (The button is part of that movies card.)
 */
function favouirteButton(i, title) {
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
                        "                            <p class=\"card-text\">Favourites: " + response[i].favourites.join(", ") + "</p>\n" +
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