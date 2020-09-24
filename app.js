var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');                 //----------USE FOR REQ.BODY
var passport      = require('passport');                  // Auth
var LocalStrategy = require('passport-local').Strategy;  //auth
var flash         = require('connect-flash');           // flash error\sucess message directly
var request       = require('request');                     
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

//----------------FOR ABLE TO USE PUBLIC DIRECTORY IN FRONTEND-----------             
app.use(express.static(__dirname + "/public"));  //__dirname is whole directory name  

//------------------MODELS USED IN PROJECT---------------------------------


// =================================_REQUIRE ROUTES_==================================
var  CourseRoutes  = require('./routes/course.js');
var  indexRoutes   = require('./routes/index.js');

// =================================_AUTH PASSPORT config_=============================
app.use(require("express-session")({
	secret: config.session.secret,
	resave: false,
	saveUninitialized: false
}))	;
app.use(passport.initialize());
app.use(passport.session());
// passport.use('stuLocal',     new LocalStrategy(Student.authenticate()));
// passport.use('professLocal', new LocalStrategy(Professor.authenticate()));
// passport.use('assistLocal',  new LocalStrategy(Assistant.authenticate()));

// // add to session
// passport.serializeUser(function(user, done) {
// 	console.log("USER SERIALIZE: "+user._id);
// 	console.log(user);
// 	done(null, {id:user.id, userType:user.userType}); 
// });

// // rechecks session login of user at every refresh/pageChange
// passport.deserializeUser(function(userDetails, done) {
// 	console.log("DEserialiize : "+userDetails.id );
// 	if(userDetails.userType === "Professor"){
// 		Professor.findById(userDetails.id, function(err, user) {
// 			if(err)
// 				console.log(err);
// 			else{
// 				console.log("DEserialiize pro: "+userDetails.id );
// 				done(err, user);
// 			}
// 		});
// 	}
// 	else if(userDetails.userType === "Student"){
// 		Student.findById(userDetails.id, function(err, user) {
// 			if(err)
// 				console.log(err);
// 			else{
// 				console.log("DEserialiize stu: "+userDetails.id );
// 				done(err, user);
// 			}
// 		});
// 	}
// 	else{
// 		Assistant.findById(userDetails.id, function(err, user) {
// 			if(err)
// 				console.log(err);
// 			else{
// 				console.log("DEserialiize assis: "+userDetails.id );
// 				done(err, user);
// 			}
// 		});
// 	}
	
// });
// =================================_GLOBAL VARIABLES ACCESS_============================
app.use(async function(req,res,next){
	res.locals.userDetails=req.user;                    // USER DETAILS
	res.locals.error=req.flash("error");                // FLASH ERROR MESSAGE
	res.locals.success=req.flash("success");            // FLASH SUCcESS MESSAGE
	next();
});

// ===========================================_Refactored routes use_======================
app.use(indexRoutes);
app.use("/course",CourseRoutes);

// ===========================================_DATABASE_===================================

// ===========================================_Server Listing_=================================
app.listen(config.PORT,config.IP,function(){
	console.log("Server On !!");
});

// -----------COVER PAGE------------------------
app.get('/', function(req, res) {
	res.render('index.ejs');
});
