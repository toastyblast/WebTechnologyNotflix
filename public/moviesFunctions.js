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

        favouirteButton(i, title);

        getRatingOfSpecificMovie(i, fakeNumber)
    }
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
function paginationButtonsOnClick(query) {
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