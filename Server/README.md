# UNAGI-Rahnema-Team2-Server

A Location-Based Social Network

<br /><br />

## How to run unit test

First you need to install mocha
```
sudo apt install mocha
```
After this you can test the server by using command bellow:
```
mocha /test/[testfile name]
```

<br /><br />

## Built With

* [Node.js](https://nodejs.org/) - Javascript Framework

<br /><br />

## List of API's

<br />

### Send Post

* Method: POST
* URL: /post
* Headers: 
    * accesstoken: token given by server 
    * location: Stringified JSON
* Body:
    * text: JSON
* Response:
    * {
        * text: String
        * location: JSON
    * }
* Status Success: 200
* Status Failed: 401

### Get Posts

* Method: GET
* URL: /post
* Headers: 
    * accesstoken: token given by server
    * location: Stringified JSON
* Response:
    * a List of
    * {
        * text: String
        * location: JSON
    * }
* Status Success: 200
* Status Failed: 401

### Register

* Method: POST
* URL: /auth/register
* Body:
    * {
        * username: String
        * password: String
    * }
* Response:
    * {
        * accesstoken: Access token given by server
        * refreshtoken: Refresh token given by server
    * }
* Status Success: 201
* Status Failed: 400

### Login

* Method: POST
* URL: /auth/login
* Headers: 
    * type: "token" or "password" 
    * refreshtoken: Refresh token given by server(Optional) 
    * accesstoken: Access token given by server(Optional) 
* Body:
    * {
        * username: String
        * password: String
    * }
* Response:
    * {
       * accesstoken: Access token given by server
       * refreshtoken: Refresh token given by server
    * }
* Status Success: 200
* Status Failed: 401

### Like

* Method: PUT
* URL: /post/:postId/like
* Headers:
    * accesstoken: Access token given by server
    * location: Stringified JSON
* Status Success: 200
* Status Failed: 401

### Unlike

* Method: DELETE
* URL: /post/:postId/like
* Headers:
    * accesstoken: Access token given by server
    * location: Stringified JSON
* Status Success: 200
* Status Failed: 401

### Get Hot Posts

* Method: GET
* URL: /post/hot
* Headers: 
    * accesstoken: token given by server
    * location: Stringified JSON
* Response:
    * a List of
    * {
        * text: String
        * location: JSON
    * }
* Status Success: 200
* Status Failed: 401

### Send Reply

* Method: POST
* URL: /post/:postId/reply
* Headers:
    * location: Stringified JSON
    * accesstoken: Access token given by server
* Body:
    * text: JSON
* Response:
    * {
        * text: String
        * location: JSON
    * }
* Status Success: 200
* Status Failed: 401

### Get Replies

* Method: GET
* URL: /post/:postId
* Headers: 
    * type: "token"
    * accesstoken: token given by server
    * location: Stringified JSON
* Response:
    * a List of
    * {
        * text: String
        * location: JSON
    * }
* Status Success: 200
* Status Failed: 401