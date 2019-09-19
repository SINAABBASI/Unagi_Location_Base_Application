var supertest = require("supertest");
var should = require("should");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/college", { useMongoClient: true });
mongoose.Promise = require("bluebird");

var User = require("../models/User");

var Post = require("../models/Post");

var server = supertest.agent("http://localhost:3000");

var testJson = {
    username: "mahdi1234",
    password: "ma19961996"
};

var testLocation = {
    latitude: 35.7293757,
    longitude: 51.4224622
};

var testPost = {
    text: "I am Mahdi"
};

var access_token;
var refresh_token;
var post_id;

describe("Send Post Test", function() {
    it("making a user", function(done) {
        server
            .post("/auth/register")
            .send(testJson)
            .expect(201)
            .end((err, res) => {
                res.status.should.equal(201);
                done();
            });
    });
    it("login and get tokens", function(done) {
        server
            .post("/auth/login")
            .set("type", "password")
            .send(testJson)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                refresh_token = res.body.refreshtoken;
                access_token = res.body.accesstoken;
                done();
            });
    });

    it("creating a post", function(done) {
        server
            .post("/post")
            .set("Content-Type", "application/json")
            .set("accesstoken", access_token)
            .set("location", JSON.stringify(testLocation))
            .send(testPost)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                done();
            });
    });
    it("get valid posts", function(done) {
        server
            .get("/post")
            .set("Content-Type", "application/json")
            .set("accesstoken", access_token)
            .set("location", JSON.stringify(testLocation))
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                post_id = res.body.posts[0]._id;
                done();
            });
    });
    it("send a reply", function(done) {
        server
            .post("/post/" + post_id + "/reply")
            .set("Content-Type", "application/json")
            .set("accesstoken", access_token)
            .set("location", JSON.stringify(testLocation))
            .send(testPost)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                done();
            });
    });

    it("get reply", function(done) {
        server
            .get("/post/" + post_id)
            .set("Content-Type", "application/json")
            .set("accesstoken", access_token)
            .set("location", JSON.stringify(testLocation))
            .send(testPost)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                done();
            });
    });

    it("deleting posts", function(done) {
        Post.remove({ text: testPost.text }, function(error) {
            done();
        });
    });

    it("deleting user", function(done) {
        User.remove({ username: testJson.username }, function(error) {
            done();
        });
    });
});
