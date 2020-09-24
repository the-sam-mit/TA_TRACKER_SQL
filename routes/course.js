var express=require('express');
var router=express.Router({mergeParams: true});;
var methodOverride=require("method-override");
var passport=require('passport');
var flash=require('connect-flash');

// ==============_ Model+MiddleWare _=================
var middleware  = require("../middleware/index.js");
// ==============ROUTER CONFIg=========================
var router=express.Router({mergeParams: true});;
router.use(methodOverride("_method"));
router.use(flash());

//-------------Landing GET----------------------------
router.get("/",middleware.isLoggedIn,function(req,res){
		console.log(" Root ! ");
		
		// Course.find({},function(err,emp_data){
		// 	if(err)
		// 		console.log("Cannot Find in DB");
		// 	else
		// 		res.render("./course/landing.ejs",{emp_data:emp_data});
		// });
});

//-------------SAVE COURSE POST----------------------------
router.post("/",middleware.isLoggedIn,function(req,res){
	// Form Post route redirected to /course
	console.log(" new course add route ! ");	
		var name=req.body.name;
		var url=req.body.image;
		var courseCode = makeid(10);
		var new_course={    
						name	   : name,
						image      : url,
						courseCode : courseCode
						};
	// 	Course.create(new_course,function(err,data){
	// 	   if(err)
	// 		   console.log("Couldnt create data in DB");
	// 	   else
	// 		   res.redirect("/course");
	//    });

});

// --------------NEW COURSE ADD GET--------------------------
router.get("/new",middleware.isLoggedIn,function(req,res){
		console.log("reached adding !!");
		res.render("./course/create.ejs");
});

// --------------Show Info COURSE GET --------------------------
router.get("/:id",middleware.isLoggedIn,function(req,res){
		console.log("info of id "+req.params.id);
		function findCourse() {
			return new Promise(function(resolve, reject) {
				// Course.findById(req.params.id,function(err,data){
				// 	if(err)
				// 	console.log(err);
				// 	else
				// 	resolve(data);
				// });
			})
		}
		function findUsers() {
			return new Promise(function(resolve, reject) {
			// 	Professor.find({},function(err,user_data){
			// 	if(err)
			// 	console.log("Cannotuser list  Find in DB");
			// 	else
			// 	resolve(user_data);
			// });
		})
	}
	
	async function showInfo() {
		var user_data    = await findUsers () ;
		var emp_data     = await findCourse () ;
		if(user_data !== undefined && user_data !== null && emp_data !== undefined && emp_data !== null ){
			res.render("./course/info.ejs", {user_data:user_data, emp_data:emp_data});
		}
	}
	showInfo();
});

// --------------Edit COURSE EDIT(GET) --------------------------
router.get("/:id/edit",middleware.isLoggedIn,function(req,res){
	// Course.findById(req.params.id,function(err,imp_data){
	// 	if(err)
	// 		console.log(err);
	// 	else
	// 		res.render("./course/edit.ejs",{imp_id:req.params.id, imp_data:imp_data});	
	// 	});
});

// -------------- Update  COURSE PUT--------------------------
router.put("/:id",middleware.isLoggedIn,function(req,res){
	console.log("course put");
	var name=req.body.name;
	var url=req.body.image;
	var new_imp_object={    name	   : name,
							image      : url
	 };
	// Course.findByIdAndUpdate(req.params.id,new_imp_object,function(err,data){
	// if(err)
	// 	console.log("Couldnt Create data in DB");
	// else
	// 	res.redirect("/course/"+req.params.id);
	// });
});

// -------------- Delete  COURSE DEL(GET) --------------------------
router.get("/:id/delete",middleware.isLoggedIn,function(req,res){
	console.log("OWNERSHIP GOT");
	// Course.findByIdAndRemove(req.params.id,function(err){
	// 	if(err)
	// 		console.log(err);
	// 	else
	// 		res.redirect("/course");
	// });
});

// FUNCTIONS
function makeid(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }

module.exports=router;