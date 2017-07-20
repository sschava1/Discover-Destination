var Destination = require("../models/destination");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkDestinationOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Destination.findById(req.params.id,function(err, foundDestination){
            if(err){
                console.log(err);
                req.flash("error","Destination not found.");
                res.redirect("back");
            }else{
                if(foundDestination.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You dont have permission to do that.");
                    res.redirect("back");
                }  
            }
        });
    }else{
        req.flash("error","You need to login first.");
        res.redirect("back");
    }
};


middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err, foundComment){
            if(err){
                req.flash("error","Comment not found.");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You dont have permission to do that.");
                    res.redirect("back");
                }  
            }
        });
    }else{
        req.flash("error","You need to login first.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to login first.");
    res.redirect("/login");
};

module.exports = middlewareObj;