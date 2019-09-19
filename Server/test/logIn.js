var supertest = require("supertest");
var should = require("should");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/college", { useMongoClient: true });
mongoose.Promise = require("bluebird");

var User = require("../models/User");

var server = supertest.agent("http://localhost:3000");

var testJson = {
    username: "mahdi1234",
    password: "ma19961996"
};

var testJson2 = {
    username: undefined,
    password: undefined
};

var testJson3 = {
    username: "",
    password: ""
};

var testJson4 = {
    username: "mahdi",
    password: "mohammad"
};

describe("login test", function() {
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
    it("valid login", function(done) {
        server
            .post("/auth/login")
            .set("type", "password")
            .send(testJson)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                done();
            });
    });

    it("invalid login undefined", function(done) {
        server
            .post("/auth/login")
            .set("type", "password")
            .send(testJson2)
            .expect(400)
            .end(function(err, res) {
                res.status.should.equal(400);
                done();
            });
    });

    it("invalid login null", function(done) {
        server
            .post("/auth/login")
            .set("type", "password")
            .send(testJson3)
            .expect(400)
            .end(function(err, res) {
                res.status.should.equal(400);
                done();
            });
    });

    it("invalid login wrong password", function(done) {
        server
            .post("/auth/login")
            .set("type", "password")
            .send(testJson3)
            .expect(400)
            .end(function(err, res) {
                res.status.should.equal(400);
                done();
            });
    });

    it("deleting user", function(done) {
        User.remove({ username: testJson.username }, function(error) {
            done();
        });
    });
});
