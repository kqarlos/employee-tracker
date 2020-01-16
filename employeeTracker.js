var mysql = require("mysql");
var inquirer = require("inquirer");

//create connection information to sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "etracker_DB"
});

//Connect to the database
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id: " + connection.threadId + "\n");
    start();
});

//start application
function start() {
    console.log("Closing conneciton...\n");
    connection.end();
}