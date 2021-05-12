function showBoxUI(boxAccessToken) {
    console.log("tok:" + boxAccessToken)
    $(".view").hide();
    var folderId = '0';
    var contentExplorer = new Box.ContentExplorer();
    contentExplorer.show(folderId, boxAccessToken, {
        container: '#app-container',
        logoUrl: 'box'
    })

    $("#app-container").height(600);
    $(".collapsible").show();
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
                $("#userinfo").text("Show user info");
            } else {
                content.style.display = "block";
                $("#userinfo").text("Hide user info");
            }
        });
    }
    $("#app-container").show();
    $("#myModal").toggle();
    $(".load").hide();
}
// Operations when the web page is loaded.
$(document).ready(function() {

    $("#imagemodal").toggle();

    $("#popreg").on("click", function () {
        $('#imagepreview').attr('src', '/img/register.png');
        $('#imagemodal').modal('show'); // imagemodal is the id attribute assigned to the bootstrap modal, then i use the show function
    });
    $("#poplog").on("click", function () {
        $('#imagepreview').attr('src', '/img/login.png');
        $('#imagemodal').modal('show'); // imagemodal is the id attribute assigned to the bootstrap modal, then i use the show function
    });
    $(".tab-pane").hide();;
    $("#statusNotAuth").hide();
    $("#statusAuth").hide();
    // Initiatlize CognitoAuth object
    var auth = initCognitoSDK();
    $("#signInButton").click( function () {
        var state = $('#signInButton').text();
        console.log(state);
        if (state.contains('Login/Register')) {
            userButton(auth);
        }
        else {
            auth.signOut();
            //showSignedOut();
        }
    });
    var curUrl = window.location.href;
    auth.parseCognitoWebResponse(curUrl);
});
// Perform user operations.
function userButton(auth) {
    var state = document.getElementById('signInButton').innerHTML;
    if (state === "Sign Out") {
        $("#signInButton").innerHTML = "Login/Register";
        auth.signOut();
        showSignedOut();
    } else {
        //auth.getSession();
        window.location.href = 'https://boxsandpitdemoapp.auth.eu-west-2.amazoncognito.com/login?client_id=l8ajfjlh0lsrspnknvnqnunpq&response_type=token&scope=email+openid&redirect_uri=https://box-cognito-sandpit.herokuapp.com';
    }
}

// Operations when signed in.
function showSignedIn(session) {
    $("#statusNotAuth").hide();
    $("#statusAuth").show();
    $(".signInButton").innerHTML = "Sign Out";
}

// Operations when signed out.
function showSignedOut() {
    $("#statusNotAuth").show();
    $("#statusAuth").hide();
    closeTab("userdetails");
}

// Initialize a cognito auth object.
function initCognitoSDK() {
    var authData = {
        ClientId: 'l8ajfjlh0lsrspnknvnqnunpq', // Your client id here
        AppWebDomain: 'boxsandpitdemoapp.auth.eu-west-2.amazoncognito.com', // Exclude the "https://" part. 
        TokenScopesArray: ['email', 'openid'], // like ['openid','email','phone']...
        RedirectUriSignIn: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''),
        RedirectUriSignOut: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''),
        IdentityProvider: 'box-cognito-sandpit',
        UserPoolId: 'eu-west-2_T8FRIx8R8',
        AdvancedSecurityDataCollectionFlag: false
    };
    var auth = new AmazonCognitoIdentity.CognitoAuth(authData);
    // You can also set state parameter 
    // auth.setState(<state parameter>);  
    auth.userhandler = {
        onSuccess: function (result) {
            showSignedIn(result);
            $(".view").hide();
            $(".load").html("<img src='https://pcboxdemo.github.io/load.gif'/>").show();

            getBoxToken(result);
        },
        onFailure: function (err) {
            alert("Error!" + err);
        }
    };
    return auth;
}
function getBoxToken(cognitoAccess) {
    $.post("/boxUI", { accessToken: cognitoAccess.accessToken.jwtToken, idToken: cognitoAccess.idToken.jwtToken }, function (json) {
        boxAccessToken = json.accessToken;
        showBoxUI(boxAccessToken);
        $("#user").append("Cognito User:" + json.userName).append("<br/>");
        $("#user").append("Cognito Email:" + json.email).append("<br/>");
        $("#user").append("Cognito ID:" + json.cognitoId).append("<br/>");
        $("#user").append("Box User ID:" + json.boxId).append("<br/>");
        $("#user").append("Box external app user ID:" + json.extId).append("<br/>");
        $("#user").append("Box User Name:" + json.userName).append("<br/>");
        $("#user").append("Box User Login:" + json.login).append("<br/>");

    })
    showSignedIn();
}