var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');                 //----------USE FOR REQ.BODY
var passport      = require('passport');                  // Auth
var LocalStrategy = require('passport-local').Strategy;  //auth
var flash         = require('connect-flash');           // flash error\sucess message directly
var request       = require('request');                     
var busboy        = require("then-busboy"); 
var fileUpload    = require('express-fileupload');                    
var JSZip         = require('jszip');                     
var fs            = require('fs');                     
var config        = require('./config/keys');         // config details file

// ================
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
require('./config/passport')(passport); // pass passport for configuration
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// ================
// INTEGRATING LIBS
app.use(flash());``
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json());
app.use(fileUpload());

//----------------FOR ABLE TO USE PUBLIC DIRECTORY IN FRONTEND-----------             
app.use(express.static(__dirname + "/public"));  //__dirname is whole directory name  

// =================================_REQUIRE ROUTES_==================================
var  CourseRoutes     = require('./routes/course.js');
var  indexRoutes      = require('./routes/index.js');
var  AssignmentRoutes = require('./routes/assignment.js');
var  SubmissionRoutes = require('./routes/submission.js');
var  RubricsRoutes     = require('./routes/rubrics.js');

// =================================_AUTH PASSPORT config_=============================
app.use(require("express-session")({
	secret: config.session.secret,
	resave: false,
	saveUninitialized: false
}))	;
app.use(passport.initialize());
app.use(passport.session());
// =================================_GLOBAL VARIABLES ACCESS_============================
app.use(async function(req,res,next){
	res.locals.userDetails=req.user;                    // USER DETAILS
	res.locals.error=req.flash("error");                // FLASH ERROR MESSAGE
	res.locals.success=req.flash("success");            // FLASH SUCcESS MESSAGE
	next();
});

// ===========================================_Refactored routes use_======================
app.use(indexRoutes);
app.use("/courses",CourseRoutes);


// ===========================================_Server Listing_=================================
app.listen(config.PORT,config.IP,function(){
	console.log("Server On !!");
});

// -----------COVER PAGE------------------------
app.get('/', function(req, res) {
	res.render('index.ejs');
});
