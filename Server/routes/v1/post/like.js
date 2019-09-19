var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Like = mongoose.model("Like");
var Post = mongoose.model("Post");
function updatePostLikes(increment, req) {
  Post.findOneAndUpdate(
    { _id: req.postId },
    { $inc: { likes: increment ? 1 : -1 } },
    { new: true },
    function(err, post) {
      if (err) console.log(err);
      if (post) {
        post.hotRate = getHotRate(post.likes, post.date);
        post.save((err, post) => {
          if (err) console.log(err);
          return;
        });
      }
    }
  );
}

function getHotRate(likes, date) {
  var y, z;
  likes > 0 ? (y = 1) : (y = 0);
  likes == 0 ? (z = 1) : (z = likes);
  return (
    Math.log(z) / Math.log(10) + y * (date - new Date(1134028003000)) / 45000
  );
}

router.put("/", function(req, res, next) {
  new Like({ user: req.user._id, post: req.postId }).save((err, like) => {
    if (like) updatePostLikes(true, req);
    res.jsonp(like);
  });
});

router.delete("/", function(req, res, next) {
  Like.findOneAndRemove(
    { user: req.user._id, post: req.postId },
    (err, response) => {
      if (err) console.log(err);
      updatePostLikes(false, req);
      return res.jsonp(response);
    }
  );
});
module.exports = router;
