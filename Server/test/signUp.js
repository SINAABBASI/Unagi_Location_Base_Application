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

var testJson4 = {
    username: "mahdi1234",
    password: "mahdi"
};

var testJson5 = {
    username: "mahdi",
    password: "mahdi1234"
};

var testJson6 = {
    username: "mahdi1234",
    password: "mahdi1234"
};

var testJson2 = {
    username: undefined,
    password: undefined
};

var testJson3 = {
    username: "",
    password: ""
};

describe("Registration Test", function() {
    it("Test1: valid register", function(done) {
        server
            .post("/auth/register")
            .send(testJson)
            .expect(201)
            .end(function(err, res) {
                User.remove({ username: testJson.username }, function(error) {
                    res.status.should.equal(201);
                    done();
                });
            });
    });
    it("Test2: user exists", function(done) {
        server
            .post("/auth/register")
            .send(testJson)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                server
                    .post("/auth/register")
                    .send(testJson)
                    .expect(400)
                    .end(function(err, res) {
                        res.status.should.equal(400);
                        User.remove({ username: testJson.username }, err2 =>
                            done()
                        );
                    });
            });
    });
    it("Test3: invalid register: undefined", function(done) {
        server
            .post("/auth/register")
            .send(testJson2)
            .expect(500)
            .end(function(err, res) {
                res.status.should.equal(500);
                done();
            });
    });
    it("Test4: invalid register: null username", function(done) {
        server
            .post("/auth/register")
            .send(testJson3)
            .expect(400)
            .end(function(err, res) {
                res.status.should.equal(400);
                done();
            });
    });
    it("Test5: invalid register: bad password", function(done) {
        server
            .post("/auth/register")
            .send(testJson4)
            .expect(400)
            .end(function(err, res) {
                res.status.should.equal(400);
                done();
            });
    });
    it("Test6: invalid register: bad username", function(done) {
        server
            .post("/auth/register")
            .send(testJson5)
            .expect(400)
            .end(function(err, res) {
                res.status.should.equal(400);
                done();
            });
    });

    it("Test7: invalid register: username and password are the same", function(
        done
    ) {
        server
            .post("/auth/register")
            .send(testJson6)
            .expect(400)
            .end(function(err, res) {
                res.status.should.equal(400);
                done();
            });
    });
});
