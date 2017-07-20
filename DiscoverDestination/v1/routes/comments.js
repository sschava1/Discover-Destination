var express = require("express");
var router = express.Router({mergeParams:true});
var Destination = require("../models/destination");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//=========================
// Comment routes 
//=========================
router.get("/new", middleware.isLoggedIn, function(req, res){
    Destination.findById(req.params.id,function(err, foundDestination){
        if(err){
            req.flash("error","Destination not found.");
            console.log(err);
        }else{
            res.render("comments/new", {destination:foundDestination});  
        }
    }); 
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Destination.findById(req.params.id,function(err, destination){
        if(err){
            console.log(err);
            req.flash("error","Destination not found.");
            res.redirect("/destinations");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    req.flash("error","Unable to add comment.");
                    res.redirect("/destinations/"+req.params.id);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    destination.comments.push(comment);
                    destination.save();
                    res.redirect("/destinations/"+req.params.id);
                }
            });
        }
    }); 
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            return res.redirect("back");
        }
        res.render("comments/edit", {destination_id:req.params.id, comment:foundComment});
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error","Unable to update comment.");
            return res.redirect("back");
        }
        res.redirect("/destinations/"+req.params.id);
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            return res.redirect("back");
        }
        req.flash("success","Comment successfully deleted.");
        res.redirect("/destinations/"+req.params.id);
    });
});


module.exports =  router;