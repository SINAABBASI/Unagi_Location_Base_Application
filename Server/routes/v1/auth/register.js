var express = require("express"),
    mongoose = require("mongoose"),
    { createAccessToken, createRefreshToken } = require("./tokenGen");
var router = express.Router();
var User = mongoose.model("User");

router.post("/", function(req, res) {
    console.log(req.body.username.length);
    if (
        !req.body.username ||
        !req.body.password ||
        req.body.username.length < 6 ||
        req.body.password.length < 6 ||
        req.body.password === req.body.username
    ) {
        return res.status(400).send("invalid username or password");
    }

    User.findOne({ username: req.body.username }, (err, user) => {
        if (user) {
            return res.status(400).send({ message: "exists" });
        } else {
            new User({
                username: req.body.username,
                password: req.body.password,
                refreshtoken: createRefreshToken()
            }).save((err, user) => {
                if (user) {
                    return res.status(201).send({
                        message: "ok",
                        accesstoken: createAccessToken(user),
                        refreshtoken: user.refreshtoken
                    });
                } else console.error(err);
            });
        }
    });
});

module.exports = router;
