var mongoose=require('mongoose');

//Campgrounds models
var Employees=require("./models/Employee_Schema.js");
var User=require("./models/user.js");
function seedDB(){
	//Removes CampGrounds
	async function removeDB() {
		 await removeEmployees () ;
		 await removeUsers () ;
		 console.log('EMPTIED DB');
	}
	removeDB();
}

function removeEmployees() {
	return new Promise(function(resolve, reject) {
		Employees.remove({},function(err){
			if(err)
				console.log(err);
			else		
				console.log("All Employees Removed from DB");
		});
	})
}
function removeUsers() {
	return new Promise(function(resolve, reject) {
		User.remove({},function(err){
			if(err)
				console.log(err);
			else		
				console.log("All User Removed from DB");
		});
	})
}

module.exports=seedDB;