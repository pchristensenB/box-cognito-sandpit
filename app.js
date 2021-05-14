// Cogito + Box Platform integration

////////////////////////////////////////////////////

require('dotenv').config()
const jwtDecode = require('jwt-decode');

var bodyParser = require('body-parser');

const box = require('box-node-sdk');

const express = require('express');

var fs = require('fs');

var http = require("https");

var nJwt = require('njwt');

var util = require('util');

var request = require('request');
const boxAppSettings =process.env.BOX_JWT

///////////////////////////////////////////////////

// SET UP WEB SERVER
const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var port = process.env.PORT || 3000;

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.listen(port, function () {
	console.log('App listening on port ' + port + '...');
})


 var jsonParser = bodyParser.json()
 var urlencodedParser = bodyParser.urlencoded({ extended: false });

//////////////////////////////////////////////////


let serviceAccountClient;

let session = box.getPreconfiguredInstance(JSON.parse(boxAppSettings));
serviceAccountClient = session.getAppAuthClient('enterprise');

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//////////////////////////////////////////////////
app.post('/boxUI', urlencodedParser, function (req, res) {
	console.log("tok:" + req.body.accessToken);
	console.log("id:" + req.body.idToken);
	const cognitoID = retrieveCognitoID(req.body.accessToken);
	const cognitoEmail = retrieveCognitoEmail(req.body.idToken);
	console.log(`Cognito ID: ${cognitoID}`);
	getAppUserID(cognitoID)
		.then((appUserID) => {
			//If the box user is not present in Cognito, throw error
			if (!appUserID.id) {
				res.json({error: "some error"});
			}
			else {
				console.log(`App User ID is: ${appUserID.id}`);
				session.getAppUserTokens(appUserID.id).then(function(accessToken) {
					console.log("the access token is: " + accessToken);
					res.json({
						accessToken: accessToken.accessToken,
						cognitoId:cognitoID,
						email:cognitoEmail,
						userName:appUserID.name,
						login:appUserID.login,
						extId:appUserID.extId,
						boxId:appUserID.id

					});
				})
			}
		});
});
app.get('/cognito.js', function(req, res) {
	res.render('cognito', { 
		user: req.user,
		cognitoClientId:process.env.COGNITO_CLIENT_ID,
		cognitoAppDomain:process.env.COGNITO_APP_WEB_DOMAIN,
		cognitoIdentityProvider:process.env.COGNITO_IDENTIFY_PROVIDER,
		cognitoUserPoolId:process.env.COGNITO_USER_POOL_ID,
		cognitoRedirectUrl:process.env.COGNITO_REDIRECT_URL
  });
});
  
app.get('/', function(req, res) {
  console.log(req.session);
  res.render('index', { user: req.user });
});

const getAppUserID = (cognitoID) => {
    return serviceAccountClient.enterprise.getUsers({ "external_app_user_id": cognitoID,"fields":"id,name,login,external_app_user_id" })
        .then((result) => {
            console.log(result);
            if (result.total_count > 0) {
                return {id:result.entries[0].id,name:result.entries[0].name,login:result.entries[0].login,extId:result.entries[0].external_app_user_id};
            } else {
                throw new Error("Couldn't find an App User for this user.");
            }
        });
}
const retrieveCognitoID = (accessToken) => {
    var decoded = jwtDecode(accessToken);
    console.log("dec:" + JSON.stringify(decoded));
    if (decoded ) {
        return decoded.sub;
    } else {
        return "NOTFOUND";
    }
}
const retrieveCognitoEmail = (idToken) => {
    var decoded = jwtDecode(idToken);
    console.log("dec:" + JSON.stringify(idToken));
    if (decoded ) {
        return decoded.email;
    } else {
        return "NOTFOUND";
    }
}