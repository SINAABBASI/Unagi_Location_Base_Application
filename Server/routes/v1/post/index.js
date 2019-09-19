var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Post = mongoose.model("Post");
var User = mongoose.model("User");
var Like = mongoose.model("Like");
var geo = require("geolib");
var like = require("./like");
var async = require("async");
var radius = 1000;

router.use("/:id/", function(req, res, next) {
    req.postId = req.params.id;
    return next();
});
router.use("/:id/like", like);

router.post("/", addPost);

router.get("/", function(req, res) {
    sendPosts(req, res, false);
});
router.get("/hot", function(req, res) {
    sendPosts(req, res, true);
});
router.post("/:id/reply", function(req, res) {
    addPost(req, res);
    updatePostReplies(req, res);
});
router.get("/:id", function(req, res, next) {
    var post;
    Post.findById(req.postId, function(err, _post) {
        if (_post) {
            post = _post.toObject();
            Like.findOne({ post: req.postId, user: req.user._id }, function(
                err,
                like
            ) {
                like ? (post.isLiked = true) : (post.isLiked = false);
                var replies = [];
                var addPost = false;
                if (!req.headers.lastpost) addPost = true;
                const cursor = Post.find({ repliedTo: req.postId }, [], {
                    sort: { date: -1 }
                }).cursor();
                cursor
                    .on("data", post => {
                        if (addPost) replies = replies.concat(post);
                        if (post._id == req.headers.lastpost) addPost = true;
                        if (replies.length >= 10) addPost = false;
                    })
                    .on("end", () => {
                        async.map(
                            replies,
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
                                            Post.findById(
                                                postObject.repliedTo,
                                                function(err, post) {
                                                    postObject.fatherText =
                                                        post.text;
                                                    cb(null, postObject);
                                                }
                                            );
                                        } else cb(null, postObject);
                                    }
                                );
                            },
                            (error, response) => {
                                if (post.repliedTo) {
                                    Post.findById(post.repliedTo, function(
                                        err,
                                        postRes
                                    ) {
                                        post.fatherText = postRes.text;
                                        res.jsonp({
                                            post,
                                            posts: response,
                                            status: 0
                                        });
                                    });
                                } else {
                                    res.jsonp({
                                        post,
                                        posts: response,
                                        status: 0
                                    });
                                }
                            }
                        );
                        // return res.jsonp({
                        //     posts: replies
                        // });
                    });
            });
        }
    });
});
function addPost(req, res) {
    var repliedTo = null;
    if (req.postId) repliedTo = req.postId;
    if (req.user) {
        new Post({
            text: req.body.text,
            location: req.location,
            user: req.user._id,
            date: Date.now(),
            repliedTo: repliedTo
        }).save((err, post) => {
            if (err) {
                return res.jsonp({
                    status: -1
                });
            }
            return res.jsonp({
                status: 0,
                text: post.text,
                location: post.location
            });
        });
    } else return res.sendStatus(401);
}

function sendPosts(req, res, hotRequested) {
    var sortBy;
    if (hotRequested) sortBy = { hotRate: -1 };
    else sortBy = { date: -1 };
    var nearbyPosts = [];
    var addPost = false;
    if (!req.headers.lastpost) {
        addPost = true;
    }
    const cursor = Post.find({}, [], {
        sort: sortBy
    }).cursor();
    cursor
        .on("data", post => {
            if (
                geo.getDistance(req.location, post.location) < radius &&
                addPost
            ) {
                nearbyPosts = nearbyPosts.concat(post);
            }
            if (post._id == req.headers.lastpost) {
                addPost = true;
            }
            if (nearbyPosts.length >= 10) addPost = false;
        })
        .on("end", () => {
            if (hotRequested)
                nearbyPosts.sort((a, b) => {
                    return a.hotRate > b.hotRate
                        ? -1
                        : b.hotRate > a.hotRate ? 1 : 0;
                });
            async.map(
                nearbyPosts,
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

function updatePostReplies(req, res) {
    Post.findOne({ _id: req.postId }, function(err, post) {
        if (err) console.log(err);
        if (post) {
            post.replies += 1;
            post.save((err, post) => {
                if (err) console.log(err);
            });
        }
    });
}

module.exports = router;
