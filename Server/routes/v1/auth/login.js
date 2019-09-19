var express = require("express"),
    { createAccessToken, createRefreshToken } = require("./tokenGen"),
    mongoose = require("mongoose"),
    verifyType = require("./reqVerification");
var User = mongoose.model("User");
var router = express.Router();

router.post("/", verifyType, function(req, res) {
    User.findOne(req.mydata.query, (err, user) => {
        if (user && req.mydata.isValid.bind(user)()) {
            if (user.refreshtoken === "") {
                user.refreshtoken = createRefreshToken();
                user.save();
            }
            return res.status(201).send({
                accesstoken: createAccessToken(user),
                refreshtoken: user.refreshtoken,
                message: "ok"
            });
        } else {
            return res.status(401).send({ message: "fail" });
        }
    });
});

module.exports = router;
