var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/");

//================
//COMMENT ROUTES
//================

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log("err");
        }
        else {
            res.render("comments/new", { campground: campground });
        }
    });

});
//ADD NEW COMMENT
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    res.redirect("/campgrounds");
                }
                else {
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment posted");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });

        }
    });
});

//edit comment page
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    });
});
//update comment
router.put("/:comment_id/", middleware.checkCommentOwner, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment successfully edited");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//delete comment
router.delete("/:comment_id/", middleware.checkCommentOwner, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        }
        else {
            req.flash("error", "Comment deleted");
            res.redirect("back");
        }
    });
});

module.exports = router;
