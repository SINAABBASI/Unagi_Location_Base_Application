var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
const SALT_LEN = 8;

var Schema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    date_joined: { type: Date, required: true, default: Date.now() },
    refreshtoken: { type: String, default: "" }
});

Schema.pre("save", function(next) {
    var user = this;

    //hashing password
    bcrypt.genSalt(SALT_LEN, (err, salt) => {
        if (err) {
            console.log(err);
            next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                console.log(err);
                next(err);
            }
            user.password = hash;
            next();
        });
    });
});
mongoose.model("User", Schema);
module.exports = mongoose.model("User", Schema);
