var mongoose = require("mongoose");
var User = mongoose.model("User");
var Schema = mongoose.Schema({
    text: { type: String, required: true },
    location: { type: Object, required: true },
    date: { type: Date, required: true, default: Date.now() },
    user: { type: String, ref: "User" },
    likes: { type: Number, default: 0 },
    repliedTo: { type: String, ref: "Post", default: null },
    replies: { type: Number, default: 0 },
    hotRate: { type: Number, default: 0 }
});

Schema.index({ date: 1 });
Schema.index({ hotRate: 1 });

mongoose.model("Post", Schema);

module.exports = mongoose.model("Post", Schema);
