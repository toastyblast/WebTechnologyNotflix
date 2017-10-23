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

//...