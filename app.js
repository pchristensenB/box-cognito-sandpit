// Okta + Box Platform integration

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
const boxAppSettings ={
	"boxAppSettings": {
	  "clientID": "5qwptmt2m3pe0sckxbp09bx0p9acvl73",
	  "clientSecret": "PuD9h0ioE47wr2p9i1lprLLg56KJPWb0",
	  "appAuth": {
		"publicKeyID": "fu504g0f",
		"privateKey": "-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIqSg1d1BsWgwCAggA\nMBQGCCqGSIb3DQMHBAiWgAWlAyAXDQSCBMiVjUySBMpLBhi1JkZnVleEQ/R0hM7H\nmCiNnBlEaM0/QMkI/Tqe9oGEYDVsilwyC19j+rLQE77glNFzFrFp5iTYEgzML2Ds\nbOHbgeBUOVNkMb0p65hOQyFoP+JOWdqJ0gRS+/W++ndNz6kzCo7MtiaRMAu1/G2W\n4QYIiPNHqs51s4Qxq+zOgy4K+h0QWueDQyW4Zwon3mXVitHPoQilJiwFbssWhrBE\nhu2EnSOHiBWI4CqNknCuOAvE+x102AwS2brXDouP2JK9F2PUSEdpDeJoF0ZzCizu\n8ESm2AdfoCeokVHu4OMhvFEanhgPLyMnMq//D23v0b2wLMmPfSyGY6gCyW05vUns\nzRsy9OyeqnZiqrwccvMV2INq1bzJU2BB8kcTGId5Rb5tzFyNvwgSAME8QfDkrJQb\nTje2m/UuiLNfVB9doB2o7ioSMv2uXd8UuV58sygYXNpT9HsM1254NZFFBtOt37yY\nWL48LiECIMU9wDGfFAY4qAzQ8JfWysKSuVM1xV6+NjNc7ysKgKMogHhEUYpcwa1P\nO2uyfpI1M2W089Mf3Ala86Z3HhslehQ4+0evTjHaYPCT1Gz8iCWlzS3OUXz239iQ\nl9B4+c0frProZMatIYyDNezQOQOQU5keefGdOUczUTNPpwFTGY6lgtXCC0pPYy8i\nUXGWyIvIP0K9Q9jZdVvDdvrIS5n9BbSBgh84hRdjQa/gDNbvaFexyQxo/zE/5Q/z\nAJK6Iw0lDkwbDDIE6oeH5QdD6DTafIvv/lsv5q2QTO1AYVQlRHa1QDGJdbzSXdX3\nEwOcoNLlE1SlYSSo4rRs/BQ++hOcFcjr10d3ZqB/lwLWedsabp43lor8pT4V8AQs\nL+LdhpjRFw13vpfTlDQrkOm4AsyrI/WcsIub7Mcs13DUlUxjrI49WTZBs01Q/+pW\nl1WWcZGB1RhoKf3bVq7Ms4Lcgp8xy+NCuNjVAH4HDxPloy6SIkkHF58EyiOxiKeu\nvD0Y7LLmIm5vwQK/Mu0481RFmIpEJ47iGphPoAr/9rKcViaasZvRSHVzdYbz7NvP\n5BDemgDJ8VCj3Wmd+3lbCdvKsd4wVq/aKO8TbK3lF5PGCEy4wJ32by1a97ph6kBp\nYN9/cshXvWklWGB/0BslTz9LSyAIDi2ggYHG01lDd1biXOjzMwzDCjo3x4JHAxM6\nePd0e2GAmZqS4G/WDQsamo9OnzcA557y1IO4vgyVJXzxcdC8VMEy2pv9b9Z2u+LR\nTS6Tj6EmsMI7ccKSngATMiZshjp2XPdILhzq2cEItI/SWYAB64TJj1k5jjILKbo2\nbVzsPXLDjG+10LLCJ7SWtoVVMgReKR8jOR3nF2rXdJbXjKF9aqDBTIKob5a6vcrE\nO6V2YIciKtSgNFWy92MwXWvqQwWNzMctIlY6kPUHSttTorcRHebxDvg7sV7VwJYq\nmepAQESO++DN2IGaXX7Ey5I8tfQVQWBWoVQQCb+CTL1e36AyGrq+vOaKyBUBV8dp\n5K3oDrteP4JvioRArZg36hWqHAQxg+yGf7CX7dBIpmxXQ8AYqW5YAp9ln0uoHsfZ\niVT4vOKz0emSgFmfyh8qpM9QPLpeYsEs3MKTULCgHKpj3/w/y6yCxDca0V9L7Ux2\nJ+k=\n-----END ENCRYPTED PRIVATE KEY-----\n",
		"passphrase": "7b8f65cc10e300e97daa2768ad4c916f"
	  }
	},
	"enterpriseID": "47757585"
  }

///////////////////////////////////////////////////

// SET UP WEB SERVER
const app = express();

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

console.log("Using config file...");
let configFile =boxAppSettings;
let session = box.getPreconfiguredInstance(configFile);
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
// HOME PAGE
app.get('/', function (req, res) {
	fs.readFile('index.html', 'utf8', (err, page) => {
		if (err) {
			console.log("error reading the index.html file")
		}

		

		res.send(page)
	})
})

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