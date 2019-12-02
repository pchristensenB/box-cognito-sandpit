// Okta + Box Platform integration

////////////////////////////////////////////////////

require('dotenv').config()

var bodyParser = require('body-parser');

var BoxSDK = require('box-node-sdk');

const express = require('express');

var fs = require('fs');

var http = require("https");

var nJwt = require('njwt');

var util = require('util');

var request = require('request');

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

// SET UP BOX SDK

// Look to see if the key has already been loaded into the
// environment - through heroku config vars for example
// If not, then load the key from a local file
if (!(process.env.BOX_PRIVATE_KEY)) {
	process.env.BOX_PRIVATE_KEY = fs.readFileSync('boxKey.pem', 'utf8')
}

var sdk = new BoxSDK({
	clientID: process.env.BOX_CLIENT_ID,
	clientSecret: process.env.BOX_CLIENT_SECRET,

	appAuth: {
		keyID: process.env.BOX_PUBLIC_KEY_ID,
		privateKey: process.env.BOX_PRIVATE_KEY,
		passphrase: process.env.BOX_PASSPHRASE
	}
})

//////////////////////////////////////////////////

// HOME PAGE
app.get('/', function (req, res) {
	fs.readFile('index.html', 'utf8', (err, page) => {
		if (err) {
			console.log("error reading the index.html file")
		}

		

		res.send(page)
	})
})
