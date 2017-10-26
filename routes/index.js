var express     = require("express");
var router      = express.Router({mergeParams:true});
var User        = require("../models/user");
var passport    = require("passport");

//index
router.get("/", function(req,res){
    res.render("landing");
});

//===========
//AUTH ROUTES
//===========

//show register form
router.get("/register",function(req,res){
    res.render("register");
});
//handles sign up logic
router.post("/register",function(req, res) {
    //sign up user
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            return res.render("register", {"fError": err.message});
        }
        //log new user in
        passport.authenticate("local")(req,res,function(){
        req.flash("sucess", "Successfully registered. You are now logged in as" + user.username);
        res.redirect("/campgrounds");
        });
    });
    
});

//show login form
router.get("/login",function(req, res) {
    res.render("login");
})
//handles login logic
router.post("/login", passport.authenticate("local",
{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
    
}), function(req, res) {
        
});
//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success","You have been logged out.")
    res.redirect("/campgrounds");
    
});

module.exports  = router;