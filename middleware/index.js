// ==============_ Model+MiddleWare _==================

var middleware  = require("../middleware/index.js");

// middlewares storage
middlewareObj={};
middlewareObj.check="success";
// common camp+comment
middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please Login first !");
	res.redirect("/login");
};
// emp ownwner
// middlewareObj.OwnershipAuth=function (req,res,next){
// 	if(req.isAuthenticated())
// 	{
// 		console.log("USER-AUTH DONE")
// 		Course.findById(req.params.id,function(err,emp_data){
// 			if(err)
// 				res.redirect("back");
// 			else if(req.user._id.equals(emp_data.author.id))
// 				next();
// 			else
// 			{
// 				req.flash("error","You are not authorized to perform this task");
// 				res.redirect("back");
// 			}
// 		});
// 	}
// 	else
// 	{
// 		req.flash("error","Please Login first !");
// 		res.redirect("back");
// 	}
// }


// // comments
//  middlewareObj.OwnershipAuthComment=function(req,res,next){
// 	if(req.isAuthenticated())
// 	{
// 		console.log("USER-AUTH DONE")
// 		Comment.findById(req.params.id2,function(err,comment_data){
// 			if(err)
// 				res.redirect("back");
// 			else if(req.user._id.equals(comment_data.author.id))
// 				next();
// 			else
// 			{
// 				req.flash("error","You are not authorized to perform this task");
// 				res.redirect("back");
// 			}
// 		});
// 	}
// 	else
// 	{
// 		req.flash("error","Please Login first !");
// 		res.redirect("back");
// 	}
// }
//  middlewareObj.OwnershipAuthPlusCampAdminDeleteRights=function(req,res,next){
// 	if(req.isAuthenticated())
// 	{
// 		console.log("USER-AUTH DONE")
// 		Comment.findById(req.params.id2,function(err,comment_data){
// 			if(err)
// 				res.redirect("back");
// 			else if(req.user._id.equals(comment_data.author.id))
// 				next();
// 			else
// 			{
// 				Campgrounds.findById(req.params.id,function(err,camp_data){
// 					if(err)
// 						res.redirect("back");
// 					else if(req.user._id.equals(camp_data.author.id))
// 						next();
// 					else
// 					{
// 						req.flash("error","You are not authorized to perform this task");
// 						res.redirect("back");
// 					}
// 				});

// 			}
// 		});
// 	}
// 	else
// 	{
// 		req.flash("error","Please Login first !");
// 		res.redirect("back");
// 	}
// }
module.exports=middlewareObj;