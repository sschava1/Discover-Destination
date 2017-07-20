var express = require("express");
var app =  express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy =  require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");

mongoose.connect("mongodb://localhost/deiscover_destination_v1");

var User = require("./models/user");
// var seedDB = require("./seeds");

// seedDB();

var commentRoutes = require("./routes/comments");
var destinationRoutes = require("./routes/destinations");
var indexRoutes = require("./routes/index");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret:"I am chavo!",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/destinations", destinationRoutes);
app.use("/destinations/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Discover Destinations server has started!");
});