var express = require("express");
var router = express.Router();
var login = require("./login");
var register = require("./register");

router.use("/login", login);
router.use("/register", register);

module.exports = router;
