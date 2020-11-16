# TA_TRACKER_SQL

## Prerequisites

+ install [guide](https://dev.mysql.com/doc/mysql-apt-repo-quick-guide/en/) mysql USE METHOD-2 :
+ mysql [configuration](https://hackernoon.com/mysql-note-create-admin-user-5e77b43ecc8e) LINUX --Create New User and Grant All PRIVILEGES

## launch  (run without proxy in terminal)
+ command: npm install
+ edit config/database.js (SQL USERNAME & PASSWORD)
+ create database 'my_schema2' manually in mysql
+ command(One Time Only): node scripts/create_database.js  
+ command Increases Watch Limit: sudo sysctl fs.inotify.max_user_watches=582222 && sudo sysctl -p
+ command STARTS SERVER: nodemon app.js

## RESOURCE
+ How to write nodejs SQL queries [template](https://github.com/mysqljs/mysql#escaping-query-values)
