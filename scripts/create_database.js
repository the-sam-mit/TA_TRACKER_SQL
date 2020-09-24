/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

// connection.query('CREATE DATABASE ' + dbconfig.database);
// console.log('Success: Database Created!')

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
)');
console.log('Success: user table Created!')
// ----------------------------------------
// professor
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table1 + '` ( \
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

// --------------------------------------------
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table2 + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
    `name` VARCHAR(20) , \
    `type` VARCHAR(60)  , \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
)');
console.log('Success: ta table Created!')

// --------------------------------------
var user3Type = "Student";
// student
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table3 + '` ( \
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

console.log('Success: student table Created!')
// ----------------------------------------

// -----------------------------------------------------------------------------FIX----
// sahi krdo yahaan se
// ----------------------------------------
// connection.query('\
// CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.courses + '` ( \
//     `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
//     `name` VARCHAR(20) NOT NULL, \
//     `semester` INT , \
//     `year` INT  , \
//     `stream` VARCHAR(60) , \
//         PRIMARY KEY (`id`), \
//     UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
// )');

// console.log('Success: course table Created!')



// ----------------------------------------
// connection.query('\
// CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.rel1 + '` ( \
//     `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
//     `username` VARCHAR(20) NOT NULL, \
//     `password` CHAR(60) NOT NULL, \
//         PRIMARY KEY (`id`), \
//     UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
//     UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
// )');

// console.log('Success: course table Created!')


// connection.query('\
// CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.rel2 + '` ( \
//     `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
//     `username` VARCHAR(20) NOT NULL, \
//     `password` CHAR(60) NOT NULL, \
//         PRIMARY KEY (`id`), \
//     UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
//     UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
// )');

// console.log('Success: course table Created!')
// // ----------------------------------------
// connection.query('\
// CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.rel3 + '` ( \
//     `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
//     `username` VARCHAR(20) NOT NULL, \
//     `password` CHAR(60) NOT NULL, \
//         PRIMARY KEY (`id`), \
//     UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
//     UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
// )');

// console.log('Success: course table Created!')

// // ----------------------------------------
// connection.query('\
// CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.rel4 + '` ( \
//     `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
//     `username` VARCHAR(20) NOT NULL, \
//     `password` CHAR(60) NOT NULL, \
//         PRIMARY KEY (`id`), \
//     UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
//     UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
// )');

// console.log('Success: course table Created!')

// // ----------------------------------------
// connection.query('\
// CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.rel5 + '` ( \
//     `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
//     `username` VARCHAR(20) NOT NULL, \
//     `password` CHAR(60) NOT NULL, \
//         PRIMARY KEY (`id`), \
//     UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
//     UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
// )');

// console.log('Success: course table Created!')





connection.end();
