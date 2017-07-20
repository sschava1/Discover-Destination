var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req, res){
   res.render("landing");
});

//=================
//Auth routes
//=================
router.get("/register", function(req,res){
    res.render("register");
});

router.post("/register", function(req,res){
    User.register(new User({username:req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","You signed up successfully.");
            res.redirect("/destinations");
        });
    });
});

router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/destinations",
    failureRedirect:"/login"
    
}), 
function(req, res){});

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Successfully logged out!.");
    res.redirect("/destinations");
});


module.exports =  router;