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
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
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
                displayEmployees();
                break;
            case "View All Employees by Department":
                break;
            case "View All Employees by Manager":
                break;
            case "Add Employee":
                promptForEmployeeinfo();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
            case "View All Roles":
                displayRoles();
                break;
            case "Add Role":
                promptRoleInfo();
                break;
            case "Remove Role":
                break;
            case "View All Departments":
                displayDepartments();
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


function updateEmployeeManager() {
    qGetEmployees().then(function (employees) {
        promptSelectEmployee(employees).then(function (employeeid) {
            promptSelectEmployee(employees).then(function (managerid) {
                qUpdateEmployeeManager(employeeid, managerid);
            })
        })
    })
}

//Calls to get employees and roles. Calls to prompt user to select an employee.
//Calls to prompt user to select a  role to update the selected employee's role
//Calls to update employee with employee id and new role id
function updateEmployeeRole() {
    qGetEmployees().then(function (employees) {
        qGetRoles().then(function (roles) {
            promptSelectEmployee(employees).then(function (employeeid) {
                promptSelectRole(roles).then(function (roleid) {
                    qUpdateEmployeeRole(employeeid, roleid);
                });
            });
        });
    });
}

//Calls to get all employees and to prompt user to select an employee. 
//Calls to remove employee based on the user's employee choice
function removeEmployee() {
    qGetEmployees().then(function (employees) {
        promptSelectEmployee(employees).then(function (employeeid) {
            qRemoveEmployee(employeeid);
        });
    })
}

//==================================== QUERIES ===================================

//queries all employees
function qGetEmployees(cb) {
    console.log("Querying all employees...");
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM Employee", function (err, res) {
            if (err) return reject(Error(err));;
            resolve(res);
        });
    });
}

//queries to add employee
//@param {array} employee - array of new employees first name, last name and roleid
function qAddEmployee(employee) {
    console.log("Querying: add employee...");
    connection.query("INSERT INTO employee(first_name, last_name, role_id) VALUES (?, ?, ?)", employee, function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}

//queries to remove employee 
//@param employeeid - employee's id to remove
function qRemoveEmployee(employeeid) {
    console.log("Querying: removing employee...");
    connection.query("DELETE FROM employee WHERE id=?", employeeid, function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}

//queries to update employee role
//@param employeedid - id of employee to update role to
//@param roleid - id of the employee's new role
function qUpdateEmployeeRole(employeeid, roleid) {
    console.log("Querying: Updating employee role");
    connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleid, employeeid], function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}

//queries to update employee manager
//@param employeedid - id of employee to update role to
//@param manager - id of the employee's new manager
function qUpdateEmployeeManager(employeeid, managerid) {
    console.log("Querying: Updating employee manager");
    connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [managerid, employeeid], function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}

//queries and returns roles
function qGetRoles() {
    console.log("Querying all roles");
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM Role", function (err, res) {
            if (err) return reject(Error(err));;
            resolve(res);
        });
    });
}

//queries to add new role
//@param role - array of the new role's title, salary and department id
function qAddRole(role) {
    console.log("Querying: add new role");
    connection.query("INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)", role, function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}

//queries and returns all departments
function qGetDepartments() {
    console.log("Querying all departments");
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM Department", function (err, res) {
            if (err) return reject(Error(err));;
            resolve(res);
        });
    });
}

//Queries to add a new department
//@param department - new department's name
function qAddDepartment(department) {
    console.log("Querying: add department");
    connection.query("INSERT INTO department(name) VALUES (?)", department, function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}


//======================================== PROMPTS =================================================

//Ask user for information of the new employee to add
//Gets all roles titles to let the user choose new employee's role
//calls to query add employee
function promptForEmployeeinfo() {
    console.log("Prompting employee info to add");
    qGetRoles().then(function (roles) {
        let roleNames = roles.map(r => {
            return (r.title);
        });
        inquirer.prompt([
            {
                type: "input",
                message: "Enter first name: ",
                name: "firstName"
            },
            {
                type: "input",
                message: "Enter last name: ",
                name: "lastName"
            },
            {
                type: "list",
                message: "Enter role: ",
                name: "role",
                choices: roleNames
            }
        ]).then(function (res) {
            var roleid;
            roles.forEach(r => {
                if (r.title === res.role) {
                    roleid = r.id;
                }
            });

            qAddEmployee([
                res.firstName,
                res.lastName,
                roleid
            ]);
        });

    });
}

//Ask user for information of the new department to add and calls to query add department
function promptDepartmentInfo() {
    console.log("Prompting department info to add");

    inquirer.prompt(
        {
            type: "input",
            message: "Enter department name: ",
            name: "name"
        }
    ).then(function (res) {
        qAddDepartment([
            res.name
        ]);
    });
}

//Ask user for information of the new role to add
//Gets department names to let the user choose the role department
//Calls to query add role
function promptRoleInfo() {
    console.log("Prompting for new role informatin to add");
    qGetDepartments().then(function (departments) {
        let departmentNames = departments.map(d => {
            return (d.name);
        });
        inquirer.prompt([
            {
                type: "input",
                message: "Enter role title: ",
                name: "title"
            },
            {
                type: "input",
                message: "Enter role salary: ",
                name: "salary"
            },
            {
                type: "list",
                message: "Select: ",
                name: "department",
                choices: departmentNames
            }
        ]).then(function (res) {
            let departmentid;
            departments.forEach(d => {
                if (d.name === res.department) {
                    departmentid = d.id;
                }
            });
            qAddRole([
                res.title,
                res.salary,
                departmentid
            ]);
        });
    });
}

//Asks user to select an employee by getting list of employee names
//This resolves once the user selects an employee name and this name is mapped to the employee id.
//@param employees - list of objects with employee information
function promptSelectEmployee(employees) {
    console.log("prompting to select an employee...");
    return new Promise(function (resolve, reject) {
        if (!employees) return reject(Error("No employees found!"));
        let names = employees.map(e => {
            return (e.first_name);
        });
        inquirer.prompt({
            type: "list",
            name: "employeeName",
            message: "Select an employee",
            choices: names
        }).then(function (res) {
            employees.forEach(e => {
                if (e.first_name === res.employeeName) {
                    resolve(e.id);
                }
            });
        });
    });
}

//Asks user to choose a new role and returns it
//@param roles - arry of role objects
function promptSelectRole(roles) {
    console.log("Prompting to select a new employee role...");
    return new Promise(function (resolve, reject) {
        if (!roles) return reject(Error("No roles found!"));
        let roleTitles = roles.map(r => {
            return (r.title);
        });
        inquirer.prompt({
            type: "list",
            name: "role",
            message: "Choose a new role",
            choices: roleTitles
        }).then(function (res) {
            roles.forEach(r => {
                if (r.title === res.role) {
                    resolve(r.id);
                }
            });
        });
    });
}

//DISPLAY ==========================================

//displays employees
function displayEmployees() {
    console.log("=========================== Employees ===========================");
    qGetEmployees().then(function (res) {
        console.table(res);
        mainMenu();
    });
}

//displays roles
function displayRoles() {
    console.log("============================= Roles =============================");
    qGetRoles().then(function (res) {
        console.table(res);
        mainMenu();
    });
}

//displays department
function displayDepartments(dept) {
    console.log("========= Departments ==========");
    qGetDepartments().then(function (res) {
        console.table(res);
        mainMenu();
    });
}



