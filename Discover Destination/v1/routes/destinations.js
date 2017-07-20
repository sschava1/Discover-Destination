var express = require("express");
var router = express.Router();
var Destination = require("../models/destination");
var middleware = require("../middleware");

router.get("/", function(req, res){
   
    Destination.find(
      {}, function(err, allDestinations){
        if(err){
            console.log(err);
        }else{
            res.render("destinations/index",{destinations:allDestinations}); 
        }  
    });
    
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("destinations/new");   
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    Destination.create(
        {
            name:name,
            price:price,
            image:image,
            description:desc,
            author:author
        }, 
        function(err, destination){
            if(err){
                req.flash("error","Unable to add Destination.");
                console.log(err);
            }else{
                res.redirect("/destinations");
            }
        }
    );
});


router.get("/:id", function(req, res){
    Destination.findById(req.params.id).populate("comments").exec(function(err, foundDestination){
        if(err){
            console.log(err);
            req.flash("error","Destination not found.");
            res.redirect("/destinations");
        }else{
            res.render("destinations/show", {destination:foundDestination});  
        }
    }); 
});

router.get("/:id/edit", middleware.checkDestinationOwnership, function(req, res){
        Destination.findById(req.params.id,function(err, foundDestination){
            if(err){
                req.flash("error","Destination not found.");
                console.log(err);
            }
            res.render("destinations/edit", {destination:foundDestination});
        });
        
});

router.put("/:id", middleware.checkDestinationOwnership, function(req, res){
    Destination.findByIdAndUpdate(req.params.id, req.body.destination, function(err, updatedCampground){
        if(err){
            req.flash("error","Unable to update Destination.");
            res.redirect("/destinations");
        }else{
            req.flash("success","Destination successfully updated.");
            res.redirect("/destinations/"+req.params.id);  
        }
    });
});

router.delete("/:id", middleware.checkDestinationOwnership, function(req, res){
    Destination.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error","Unable to delete Destination.");
            res.redirect("/destinations");
        }else{
            req.flash("success","Destination successfully deleted.");
            res.redirect("/destinations");
        }
    });
});

module.exports =  router;