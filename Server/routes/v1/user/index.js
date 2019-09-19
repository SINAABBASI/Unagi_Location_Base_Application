var express = require("express"),
    router = express.Router(),
    mongoose = require("mongoose"),
    async = require("async");
var Post = mongoose.model("Post"),
    Like = mongoose.model("Like");

router.get("/post", sendMyPosts);

function sendMyPosts(req, res) {
    var myPosts = [];
    var addPost = false;
    if (!req.headers.lastpost) addPost = true;
    const cursor = Post.find({}, [], {
        sort: { date: -1 }
    }).cursor();
    cursor
        .on("data", post => {
            if (post.user == req.user._id && addPost)
                myPosts = myPosts.concat(post);
            if (post._id == req.headers.lastpost) addPost = true;
            if (myPosts.length >= 10) addPost = false;
        })
        .on("end", () => {
            async.map(
                myPosts,
                (post, cb) => {
                    Like.findOne(
                        {
                            user: req.user._id,
                            post: post.id
                        },
                        (err, like) => {
                            var postObject = post.toObject();
                            like
                                ? (postObject.isLiked = true)
                                : (postObject.isLiked = false);
                            if (postObject.repliedTo) {
                                Post.findById(postObject.repliedTo, function(
                                    err,
                                    post
                                ) {
                                    postObject.fatherText = post.text;
                                    cb(null, postObject);
                                });
                            } else cb(null, postObject);
                        }
                    );
                },
                (error, response) => {
                    res.jsonp({
                        posts: response,
                        status: 0
                    });
                }
            );
        })
        .on("error", err => res.jsonp(err));
}

module.exports = router;
