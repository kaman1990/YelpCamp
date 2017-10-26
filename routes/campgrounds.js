var express     = require("express");
var router      = express.Router({ mergeParams: true });
var Campground  = require("../models/campground");
var middleware  = require("../middleware/");
//=================
//campground routes
//=================

//GOTO NEW CAMPGROUND PAGE
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW A CAMPGROUND
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//SHOW ALL CAMPGROUNDS
router.get("/", function(req, res) {
    req.user
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: campgrounds, currentUser: req.user });
        }
    });
});
//EDIT CAMPGROUND

router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res) {

    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    })

})
//UPDATE CAMPGROUNDS
router.put("/:id", middleware.checkCampgroundOwner, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds")
        }
        else {
            req.flash("sucess", "Campground successfully updated.");
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})
//DELETE CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Campground successfully deleted.");
            res.redirect("/campgrounds");
        }
    })
})

//ADD NEW CAMPGROUND
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name        = req.body.name;
    var image       = req.body.image;
    var description = req.body.description;
    var author      = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, description: description, author: author };
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            req.flash("success", "New campground created");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;
