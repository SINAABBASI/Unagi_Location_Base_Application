var bcrypt = require("bcrypt");

function verifyType(req, res, next) {
    if (!req.headers.type)
        return res.status(401).send("please specify request type");
    req.mydata = {};
    if (req.headers.type == "password") return verifyPass(req, res, next);
    else if (req.headers.type == "token") return verifyToken(req, res, next);
    else return res.status(400).send("please specify a correct request type");
    return next();
}

function verifyToken(req, res, next) {
    if (!req.headers.refreshtoken || req.headers.refreshtoken === "")
        return res.status(400).send("You must send the refreshtoken");
    req.mydata.query = { refreshtoken: req.headers.refreshtoken };
    req.mydata.msg = "refresh token is wrong";
    req.mydata.isValid = function() {
        return true;
    };
    return next();
}

function verifyPass(req, res, next) {
    if (!req.body.password || !req.body.username)
        return res
            .status(400)
            .send("You must send the username and the password");
    req.mydata.query = { username: req.body.username };
    req.mydata.msg = "The username or password don't match";
    req.mydata.isValid = function() {
        var user = this;
        return bcrypt.compareSync(req.body.password, user.password);
    };
    return next();
}

module.exports = verifyType;
