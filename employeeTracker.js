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
        "Remove Role",
        "View All Departments",
        "Add Department",
        "Remove Department",
        // "View Department Budget",
        "Exit"
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
    console.log("WELCOME TO EMPLOYEE TRACKER!");
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
                addEmployee();
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
                addRole();
                break;
            case "Remove Role":
                removeRole();
                break;
            case "View All Departments":
                displayDepartments();
                break;
            case "Add Department":
                promptDepartmentInfo();
                break;
            case "Remove Department":
                removeDepartment();
                break;
            case "View Department Budget":
                break;
            case "Exit":
                console.log("Closing connection... Goodbye!");
                connection.end();
                break;
        }
    });
}

//Calls to get employees and roles. calls to prompt for new employee's info
function addEmployee() {
    qGetEmployees().then(function (managers) {
        qGetRoles().then(function (roles) {
            promptSelectRole(roles).then(function (roleid) {
                promptForEmployeeinfo(roleid, managers);
            });
        });
    });
}

//Gets all the employees and asks user to select the employee and their manager
function updateEmployeeManager() {
    qGetEmployees().then(function (employees) {
        console.log("Select an employee");
        promptSelectEmployee(employees).then(function (employeeid) {
            console.log("Select employee's manager");
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
            console.log("Select an employee");
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

function removeRole() {
    qGetRoles().then(function (roles) {
        promptSelectRole(roles).then(function (roleid) {
            qRemoveRole(roleid);
        });
    });
}

function removeDepartment() {
    qGetDepartments().then(function (departments) {
        promptSelectDepartment(departments).then(function (departmentid) {
            qRemoveDepartment(departmentid);
        });
    });
}

function addRole() {
    qGetDepartments().then(function (departments) {
        promptSelectDepartment(departments).then(function (departmentid) {
            promptRoleInfo(departmentid);
        });
    });
}

//==================================== QUERIES ===================================

//queries all employees
function qGetEmployees() {
    console.log("Getting all employees...");
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
    console.log("Adding employee...");
    connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", employee, function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}

//queries to remove employee 
//@param employeeid - employee's id to remove
function qRemoveEmployee(employeeid) {
    console.log("Removing employee...");
    connection.query("DELETE FROM employee WHERE id=?", employeeid, function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}

//queries to remove role 
//@param roleid - roleid to remove
function qRemoveRole(roleid) {
    console.log("Removing role...");
    connection.query("DELETE FROM role WHERE id=?", roleid, function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}

//queries to remove department 
//@param departmentid - departmentid to remove
function qRemoveDepartment(departmentid) {
    console.log("Removing department...");
    connection.query("DELETE FROM department WHERE id=?", departmentid, function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}

//queries to update employee role
//@param employeedid - id of employee to update role to
//@param roleid - id of the employee's new role
function qUpdateEmployeeRole(employeeid, roleid) {
    console.log("Updating employee role...");
    connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleid, employeeid], function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}

//queries to update employee manager
//@param employeedid - id of employee to update role to
//@param manager - id of the employee's new manager
function qUpdateEmployeeManager(employeeid, managerid) {
    console.log("Updating employee manager...");
    connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [managerid, employeeid], function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}

//queries and returns roles
function qGetRoles() {
    console.log("Getting all roles...");
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
    console.log("Adding new role...");
    connection.query("INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)", role, function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}

//queries and returns all departments
function qGetDepartments() {
    console.log("Getting all departments...");
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
    console.log("Adding department...");
    connection.query("INSERT INTO department(name) VALUES (?)", department, function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}


//======================================== PROMPTS =================================================

//Ask user for information of the new employee to add
//Gets all roles titles to let the user choose new employee's role
//calls to query add employee
function promptForEmployeeinfo(roleid, managers) {
    console.log("Enter new employee's information");
    let managerNames = managers.map(m => {
        return (m.first_name + " " + m.last_name);
    });
    managerNames.push("No Manager");
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
            message: "Select manager: ",
            name: "manager",
            choices: managerNames
        }
    ]).then(function (res) {
        var managerid;
        managers.forEach(m => {
            if ((m.first_name + " " + m.last_name) === res.manager) {
                managerid = m.id;
            }
        });
        qAddEmployee([
            res.firstName,
            res.lastName,
            roleid,
            managerid
        ]);
    });

}

//Ask user for information of the new department to add and calls to query add department
function promptDepartmentInfo() {
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
function promptRoleInfo(departmentid) {
    console.log("Enter new role's information");
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
        }
    ]).then(function (res) {
        qAddRole([
            res.title,
            res.salary,
            departmentid
        ]);
    });
}

//Asks user to select an employee by getting list of employee names
//This resolves once the user selects an employee name and this name is mapped to the employee id.
//@param employees - list of objects with employee information
function promptSelectEmployee(employees) {
    return new Promise(function (resolve, reject) {
        if (!employees) return reject(Error("No employees found!"));
        let names = employees.map(e => {
            return (e.first_name + " " + e.last_name);
        });
        inquirer.prompt({
            type: "list",
            name: "employeeName",
            message: "Select an employee",
            choices: names
        }).then(function (res) {
            employees.forEach(e => {
                if ((e.first_name + " " + e.last_name) === res.employeeName) {
                    resolve(e.id);
                }
            });
        });
    });
}

//Asks user to choose a new role and returns it
//@param roles - array of role objects
function promptSelectRole(roles) {
    console.log("Select employee role...");
    return new Promise(function (resolve, reject) {
        if (!roles) return reject(Error("No roles found!"));
        let roleTitles = roles.map(r => {
            return (r.title);
        });
        inquirer.prompt({
            type: "list",
            name: "role",
            message: "Choose a role",
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

//Asks user to choose a department and returns it
//@param departments - array of department objects
function promptSelectDepartment(departments) {
    console.log("Select department...");
    return new Promise(function (resolve, reject) {
        if (!departments) return reject(Error("No departments found!"));
        let deptNames = departments.map(d => {
            return (d.name);
        });
        inquirer.prompt({
            type: "list",
            name: "department",
            message: "Choose a department",
            choices: deptNames
        }).then(function (res) {
            departments.forEach(d => {
                if (d.name === res.department) {
                    resolve(d.id);
                }
            });
        });
    });
}

//DISPLAY ==========================================

//displays employees
function displayEmployees() {
    qGetEmployees().then(function (res) {
        console.log("======================== Employees =========================");
        res = res.reduce((acc, { id, ...x }) => { acc[id] = x; return acc }, {})
        console.table(res);
        mainMenu();
    });
}

//displays roles
function displayRoles() {
    qGetRoles().then(function (res) {
        console.log("=========================== Roles ===========================");
        res = res.reduce((acc, { id, ...x }) => { acc[id] = x; return acc }, {})
        console.table(res);
        mainMenu();
    });
}

//displays department
function displayDepartments(dept) {
    qGetDepartments().then(function (res) {
        console.log("======= Departments ========");
        res = res.reduce((acc, { id, ...x }) => { acc[id] = x; return acc }, {})
        console.table(res);
        mainMenu();
    });
}



