# Setup Box app users with Cognito
This configuration will allow you to use Cognito as the identity management solution for an demo application that use Box app users to login to Box. This will allow a user to register an email with Cognito and this will automatically create a Box app user and map it to the Cognito user. The app itself consists of a Box UI Element loaded as the app user logged in. 


See the below diagrams for details

Registration flow

<img src="/public/img/register.png" width="90%" height="90%">
        
Login flow

<img src="/public/img/login.png" width="90%" height="90%">


## Pre-requisites
You will need both a AWS  account and a Box account
- AWS account: https://aws.amazon.com/free/
- Free Box Developer account: https://account.box.com/signup/developer

## Cognito

1. Go to Cognito in your AWS Console
    Create new User Pool
  
    Give a name like 'box-cognito-demo' or similar
  
    After creation, go to 'Attributes' and setup like below
    
    <img src="/images/cogsetup.png" width="75%" height="75%">


2. Go to App clients
   
   Add new app client
   
   <img src="/images/appclientsettings.png" width="75%" height="75%">

3. Go to App integration-> App Client Settings (for you client)
  
    Add 'http://localhost:3000' to Callback URLs

    Add 'http://localhost:3000' and 'http://localhost:3000/signout' to Sign out URLs
  
    Setup should be like below
    
    <img src="/images/appsetup.png" width="75%" height="75%">

3. (Optional) Go to App integration->UI Customization
    
   Here you can upload a logo for the sign in page


## Box

1. Create a new JWT Application https://developer.box.com/guides/authentication/jwt/jwt-setup/
  - App access level: App access only
  - Application scopes: Read, Write, Manage users, Manage groups
  - Advanced features: Generate user access tokens
  - CORS Domains: http://localhost:3000 

2. Download the json file with the private key
   This will be downloaded as json file with 12 lines. Remove all line ending to make it a single line
  
    From

    <img src="/images/multi.png" width="50%" height="50%">

    
    To
    
    <img src="/images/single.png" width="50%" height="50%">

## Setup and run the app

1. Clone this repository and create an '.env' file in the root and add the following key/value pair
  -  COGNITO_CLIENT_ID=..from the settings page of your Cognito app
  -  COGNITO_APP_WEB_DOMAIN=..from the settings page of your Cognito app
  -  COGNITO_IDENTIFY_PROVIDER=..name of your user pool
  -  COGNITO_USER_POOL_ID=..id of your user pool
  -  COGNITO_REDIRECT_URL=http://localhost:3000
  -  BOX_JWT=..jwt json config in a single line

2. Install dependencies

    npm install

3. Run the app

    npm start

    This should bring up this website on localhost:3000 and you can go through the registration process
  
    Welcome screen
    
    <img src="/images/screen.png" width="100%" height="100%">
    
    Registration (sign up)
    
    <img src="/images/register.png" width="50%" height="50%">
    
    User mapping info
    
    <img src="/images/loggedin.png" width="100%" height="100%">    
    
    Folder created as the app user
    
    <img src="/images/folder.png" width="100%" height="100%">
    
    
# License
The MIT License (MIT)

Copyright (c) 2021 Peter Christensen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

