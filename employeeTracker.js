var mysql = require("mysql");
var inquirer = require("inquirer");

var menu = {
    type: "list",
    name: "menuChoice",
    message: "What would you like to do?",
    choices: [
        "View All Employees",
        // "View All Employees by Department",
        // "View All Employees by Manager",
        "Add Employee",
        // "Remove Employee",
        "Update Employee Role",
        // "Update Employee Manager",
        "View All Roles",
        "Add Role",
        // "Remove Role",
        "View All Departments",
        "Add Department",
        "Exit"
        // "Remove Department",
        // "View Department Budget"
    ]
}
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
    mainMenu();
});

//start application prompt
function mainMenu() {
    inquirer.prompt(menu).then(function (res) {
        switch (res.menuChoice) {
            case "View All Employees":
                qGetEmployees(displayEmployees);
                break;
            case "View All Employees by Department":
                break;
            case "View All Employees by Manager":
                break;
            case "Add Employee":
                promptForEmployeeinfo();
                break;
            case "Remove Employee":
                break;
            case "Update Employee Role":
                qGetEmployees(promptSelectEmployees);
                break;
            case "Update Employee Manager":
                break;
            case "View All Roles":
                qGetRoles(displayRoles);
                break;
            case "Add Role":
                promptRoleInfo();
                break;
            case "Remove Role":
                break;
            case "View All Departments":
                qGetDepartments();
                break;
            case "Add Department":
                promptDepartmentInfo();
                break;
            case "Remove Department":
                break;
            case "View Department Budget":
                break;
            case "Exit":
                console.log("Closing connection...");
                connection.end();
                break;
        }
    });
}

//QUERIES ===================================

//queries all employees
function qGetEmployees(cb) {
    console.log("Querying all employees...");
    connection.query("SELECT * FROM Employee", function (err, res) {
        if (err) throw err;
        cb(res);

    });
}

//queries to add employee
function qAddEmployee() {
    console.log("Querying: add employee...");
    mainMenu();
}

//queries to update employee role
function qUpdateEmployeeRole() {
    console.log("Querying: Updating employee role");
    mainMenu();
}

//queries to view roles
function qGetRoles(cb) {
    console.log("Querying all roles");
    connection.query("SELECT * FROM Role", function (err, res) {
        if (err) throw err;
        cb(res);
    });
}

//queries to add new role
function qAddRole() {
    console.log("Querying: add new role");
    mainMenu();
}

//queries all departments
function qGetDepartments() {
    console.log("Querying all departments");
    connection.query("SELECT * FROM Department", function (err, res) {
        if (err) throw err;
        displayDepartments(res);
    });
}

//Queries to add a new department
function qAddDepartment() {
    console.log("Querying: add department");
    mainMenu();
}


//PROMPTS ====================================

//Ask user for information of the new employee to add
function promptForEmployeeinfo() {
    console.log("Prompting employee info to add");
    qAddEmployee();

}

//Ask user for informatino of the new department to add
function promptDepartmentInfo() {
    console.log("Prompting employee info to add");
    qAddDepartment();

}

//Ask user for information of the new role to add
function promptRoleInfo() {
    console.log("Prompting for new role informatin to add");
    qAddRole()
}

//Asks user to select an employee
function promptSelectEmployees(employees) {
    console.log("prompting to select an employee...");
    qGetRoles(promptUpdateRole);
}
//Asks user to choose a new role to update the employee role
function promptUpdateRole(roles) {
    console.log("Prompting to select a new employee role...");
    qUpdateEmployeeRole();

}

//DISPLAY ==========================================

//displays employees
function displayEmployees(employees) {
    console.log("=========================== Employees ===========================");
    console.table(employees);
    mainMenu();
}

//displays roles
function displayRoles(roles) {
    console.log("============================= Roles =============================");
    console.table(roles);
    mainMenu();
}

//displays department
function displayDepartments(dept) {
    console.log("========= Departments ==========");
    console.table(dept);
    mainMenu();
}



