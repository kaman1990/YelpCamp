var express             = require("express");
var app                 = express();
var bodyParser          = require("body-parser");
var mongoose            = require("mongoose");
var Campground          = require("./models/campground");
var Comment             = require("./models/comment");
var seedDB              = require("./seeds");
var passport            = require("passport");
var LocalStrategy       = require("passport-local");
var User                = require("./models/user");
var methodOverride      = require("method-override");
var flash               = require("connect-flash");
//routes
var commentRoutes       = require("./routes/comments");
var campgroundRoutes    = require("./routes/campgrounds");
var indexRoutes         = require("./routes/index");

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/yelp_camp';
mongoose.connect(databaseUri, { useMongoClient: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seed the DB
//seedDB();

//passport configuration
app.use(require("express-session")({
    secret: "Secret string here",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser  = req.user;
    res.locals.fError   = req.flash("error");
    res.locals.fSuccess = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var ip = "localhost";
var port = 3000;
app.listen(port, ip,function(){
    console.log("IP: " + ip);
    console.log("PORT: " + port);
});
