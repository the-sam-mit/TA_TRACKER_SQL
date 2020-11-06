

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);
connection.connect(function(err){
	if(err)- console.log("ERROR CONNECTION\n"+ err);
	else console.log("Connected");
});
// connection.query('CREATE DATABASE ' + dbconfig.database);
// console.log('Success: Database Created!')

// professor
connection.query('\
CREATE TABLE IF NOT EXISTS `' + dbconfig.users_table1 + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
    `name` VARCHAR(20) , \
    `type` VARCHAR(60)  , \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
)');
console.log('Success: professor table Created!')

// --------------------------------------------f
// student
connection.query('\
CREATE TABLE IF NOT EXISTS `' + dbconfig.users_table2 + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
    `name` VARCHAR(20) , \
    `type` VARCHAR(60)  , \
    `semester` INT , \
    `year` INT  , \
    `stream` VARCHAR(60) , \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
)');
console.log('Success: ta table Created!')

// --------------------------------------

// asisstant
connection.query('\
CREATE TABLE IF NOT EXISTS `' + dbconfig.users_table3 + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
    `name` VARCHAR(20) , \
    `type` VARCHAR(60) NOT NULL  , \
    `semester` INT , \
    `year` INT  , \
    `stream` VARCHAR(60) , \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
)');

console.log('Success: student table Created!');
// ----------------------------------------

// -----------------------------------------------------------------------------FIX----
// sahi krdo yahaan se
// ----------------------------------------
connection.query('\
CREATE TABLE IF NOT EXISTS `' + dbconfig.courses + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `name` VARCHAR(20) , \
    `code` VARCHAR(20) , \
    `semester` INT , \
    `year` INT  , \
    `stream` VARCHAR(60) , \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)');
console.log('Success: course table Created!');

// UPDATED FROM HERE
// ----------------------------------------MarksFreezed = 1:finalFreeze, 0:FreezeBased on TA freeze, -1:Unfreeze
// assignment
var sql = "CREATE TABLE IF NOT EXISTS "+dbconfig.users_table4+"(\
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,\
             name VARCHAR(255),\
             course VARCHAR(255),\
             type VARCHAR(255),\
             created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\
             deadline_rubriks DATETIME ,\
             deadline_eval DATETIME, \
             marksFreezed INT DEFAULT 0 \
              )";
connection.query(sql);
console.log('Success: assignment table Created!');

// marksFreezed Column
var sql = "alter table assignment ADD COLUMN marksFreezed INT DEFAULT 0";
connection.query(sql);
console.log('Success: assignment table col -marksFreezed added!');


// ----------------------------------------
// takes table(S_id - C_id)
var sql = "CREATE TABLE IF NOT EXISTS "+dbconfig.rel1+"(\
            Sid INT UNSIGNED,\
            Cid INT UNSIGNED,\
            FOREIGN KEY(Cid) REFERENCES "+dbconfig.courses+"(id),\
            FOREIGN KEY(Sid) REFERENCES "+dbconfig.users_table2+"(id)\
             )";
connection.query(sql);

console.log('Success: takes table Created!');


// ----------------------------------------
// teaches table(P_id - C_id)
var sql = "CREATE TABLE IF NOT EXISTS "+dbconfig.rel2+"(\
            Pid INT UNSIGNED,\
            Cid INT UNSIGNED,\
            FOREIGN KEY(Cid) REFERENCES "+dbconfig.courses+"(id),\
            FOREIGN KEY(Pid) REFERENCES "+dbconfig.users_table1+"(id)\
             )";
connection.query(sql);

console.log('Success: teaches table Created!');


// ----------------------------------------
// under table(T_id - P_id)
var sql = "CREATE TABLE IF NOT EXISTS "+dbconfig.rel3+"(\
            Pid INT UNSIGNED,\
            Tid INT UNSIGNED,\
            FOREIGN KEY(Tid) REFERENCES "+dbconfig.users_table3+"(id),\
            FOREIGN KEY(Pid) REFERENCES "+dbconfig.users_table1+"(id)\
             )";
connection.query(sql);

console.log('Success: under table Created!');

// ----------------------------------------
// manage table(T_id - C_id)
var sql = "CREATE TABLE IF NOT EXISTS "+dbconfig.rel5+"(\
    Tid INT UNSIGNED,\
    Cid INT UNSIGNED,\
    FOREIGN KEY(Tid) REFERENCES "+dbconfig.users_table3+"(id),\
    FOREIGN KEY(Cid) REFERENCES "+dbconfig.courses+"(id)\
     )";
connection.query(sql);

console.log('Success: manage table Created!');

// ----------------------------------------
// includes table(A_id - C_id)  assignment--course reln   AID,CID
var sql = "CREATE TABLE IF NOT EXISTS "+dbconfig.rel6+"(\
            Aid INT UNSIGNED,\
            Cid INT UNSIGNED,\
            FOREIGN KEY(Aid) REFERENCES "+dbconfig.users_table4+"(id),\
            FOREIGN KEY(Cid) REFERENCES "+dbconfig.courses+"(id)\
             )";
connection.query(sql);

console.log('Success: includes table Created!');


// assigned table(A_id - T_id )       AID, TID ------aka performance table------------------updated NOV 4
var sql = "CREATE TABLE IF NOT EXISTS "+dbconfig.rel4+"(\
            Aid INT UNSIGNED,\
            Tid INT UNSIGNED,\
            RubUploaded INT DEFAULT 0,\
            RubAccepted INT DEFAULT 0,\
            RubDeadlineUpdated INT DEFAULT 0,\
            MarkUploaded INT DEFAULT 0,\
            MarkQuery1 INT DEFAULT 0,\
            MarkResolve1 INT DEFAULT 0,\
            MarkQuery2 INT DEFAULT 0,\
            MarkDeadlineUpdated INT DEFAULT 0,\
            professorRating INT DEFAULT 0,\
            studentRating INT DEFAULT 0,\
            FOREIGN KEY(Aid) REFERENCES "+dbconfig.users_table4+"(id),\
            FOREIGN KEY(Tid) REFERENCES "+dbconfig.users_table3+"(id)\
             )";
connection.query(sql);

console.log('Success: assigned table Created!');

// submissions------------------
//submission table - Aid,Cid,a_name,a_path
var sql= "CREATE TABLE IF NOT EXISTS `submission` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `Aid` INT UNSIGNED, \
    `Cid` INT UNSIGNED, \
    `a_name` VARCHAR(60) NOT NULL, \
    `a_path` VARCHAR(255) , \
    `marks` FLOAT, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    FOREIGN KEY(Aid) REFERENCES "+dbconfig.users_table4+"(id),\
    FOREIGN KEY(Cid) REFERENCES "+dbconfig.courses+"(id)\
)";

connection.query(sql);
console.log('Success: submission table Created!');

// rubrics------------------
//rubrics table - Aid,Cid,image,           ---------------updated oct 31
var sql= "CREATE TABLE IF NOT EXISTS `rubrics_image` ( `c_id`  int unsigned NOT NULL, \
`a_id` int unsigned NOT NULL, `t_id` int unsigned NOT NULL,  `image` varchar(255) NOT NULL,\
`date_time` DATETIME DEFAULT CURRENT_TIMESTAMP,\
`approved` BOOLEAN DEFAULT false, \
primary key(`t_id`,`a_id`,`c_id`),\
FOREIGN KEY(a_id) REFERENCES "+dbconfig.users_table4+"(id),\
FOREIGN KEY(c_id) REFERENCES "+dbconfig.courses+"(id),\
FOREIGN KEY(t_id) REFERENCES "+dbconfig.users_table3+"(id)\
)DEFAULT CHARSET=latin1";

connection.query(sql);
console.log('Success: rubrics table Created!');

// checks      submission ID , TID, SID
var sql= "CREATE TABLE IF NOT EXISTS `checks` ( \
    `Subid` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `Sid` INT UNSIGNED, \
    `Tid` INT UNSIGNED, \
        PRIMARY KEY (`Subid`), \
    UNIQUE INDEX `id_UNIQUE` (`Subid` ASC) \
)";

// //FOREIGN KEY(Aid) REFERENCES `submission`(Aid),\
connection.query(sql);
console.log('Success: checks table Created!');


connection.end();
