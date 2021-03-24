var inquirer = require("inquirer");
var db = require("./db/index.js");

var menu = [{
    type: "list",
    name: "menuChoice",
    message: "What would you like to do?",
    choices: [
        "View All Employees",
        "View All Employees by Department",
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
        "View Department Budget",
        "Exit"
    ]
}, {
    type: "input",
    message: "Enter department name: ",
    name: "deptName",
    when: ({ menuChoice }) => menuChoice === "Add Department"
}]

console.log("WELCOME TO EMPLOYEE TRACKER!");
mainMenu();

//start application prompt
function mainMenu() {
    inquirer.prompt(menu).then(function (res) {
        switch (res.menuChoice) {
            case "View All Employees":
                displayEmployees();
                break;
            case "View All Employees by Department":
                viewEmployeesDept();
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
                addDepartment(res.deptName);
                break;
            case "Remove Department":
                removeDepartment();
                break;
            case "View Department Budget":
                viewDepartmentBudget();
                break;
            case "Exit":
                console.log("Closing connection... Goodbye!");
                db.endConnection();
                break;
        }
    });
}

//Calls to get employees and roles. calls to prompt for new employee's info
function addEmployee() {
    db.Employee.getEmployees(managers => {
        db.Role.getRoles(roles => {
            promptSelectRole(roles).then(function (roleid) {
                promptForEmployeeinfo(roleid, managers);
            });
        })
    });
}

//Gets all the employees and asks user to select the employee and their manager
function updateEmployeeManager() {

    db.Employee.getEmployees(employees => {
        console.log("Select an employee");
        promptSelectEmployee(employees).then(function (employeeid) {
            console.log("Select employee's manager");
            promptSelectEmployee(employees).then(function (managerid) {
                db.Employee.updateEmployeeManager(employeeid, managerid, employee => {
                    mainMenu();
                })
            });
        });
    })
}

//Calls to get employees and roles. Calls to prompt user to select an employee.
//Calls to prompt user to select a  role to update the selected employee's role
//Calls to update employee with employee id and new role id
function updateEmployeeRole() {
    db.Employee.getEmployees(employees => {
        db.Role.getRoles(roles => {
            console.log("Select an employee");
            promptSelectEmployee(employees).then(function (employeeid) {
                promptSelectRole(roles).then(function (roleid) {
                    db.Employee.updateEmployeeRole(employeeid, roleid, employee => {
                        mainMenu();
                    });
                });
            });
        })
    })
}

//Calls to get all employees and to prompt user to select an employee. 
//Calls to remove employee based on the user's employee choice
function removeEmployee() {
    db.Employee.getEmployees(employees => {
        promptSelectEmployee(employees).then(function (employeeid) {
            db.Employee.removeEmployee(employeeid, employee => {
                mainMenu();
            });
        });
    });
}

//Calls to get roles and to prompt user to select a role. Calls to remove role based on the returned role id
function removeRole() {
    db.Role.getRoles(roles => {
        promptSelectRole(roles).then(function (roleid) {
            db.Role.removeRole(roleid, role => {
                mainMenu();
            });
        });
    })
}

//Calls to get department and to prompt user to select a department
//Calls to remove department based on returned department id
function removeDepartment() {
    db.Department.getDepartments(departments => {
        promptSelectDepartment(departments).then(function (departmentid) {
            db.Department.removeDepartment(departmentid, department => {
                mainMenu();
            });
        });
    })
}

//Calls to get roles and prompt user to select a department
//Calls to ask the user for the rest of the new role information
function addRole() {
    db.Department.getDepartments(departments => {
        promptSelectDepartment(departments).then(function (departmentid) {
            promptRoleInfo(departmentid);
        });
    })
}

//==================================== QUERIES ===================================

//Calls to get and ask user to select a department. 
//Queries to select employee info and role info where the role is part of chosen department
function viewEmployeesDept() {
    db.Department.getDepartments(departments => {
        promptSelectDepartment(departments).then(function (departmentid) {
            db.Employee.getEmployeesByDepartment(departmentid, employees => {
                employees = employees.reduce((acc, { id, ...x }) => { acc[id] = x; return acc }, {});
                console.table(employees);
                mainMenu();
            })
        });
    });
}

//Calls to get and ask user for department. Sums all salieries from all employees working at that department
function viewDepartmentBudget() {
    db.Department.getDepartments(departments => {
        promptSelectDepartment(departments).then(function (departmentid) {
            db.Department.getDepartmentBudget(departmentid, departments => {
                console.log("Department Budget: ");
                console.table(departments[0]);
                mainMenu();
            })

        });
    })
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

        db.Employee.addEmployee([
            res.firstName,
            res.lastName,
            roleid,
            managerid
        ], employee => {
            mainMenu()
        })
    });

}

//Ask user for information of the new department to add and calls to query add department
function addDepartment(deptName) {
    db.Department.addDepartment([
        deptName
    ], department => {
        mainMenu();
    })
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
        db.Role.addRole([
            res.title,
            res.salary,
            departmentid
        ], role => {
            mainMenu();
        });
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
    db.Employee.getEmployees((res) => {
        console.log("======================== Employees =========================");
        // Uses the value of ID as index
        res = res.reduce((acc, { id, ...x }) => { acc[id] = x; return acc }, {});
        console.table(res);
        mainMenu();
    });
}

//displays roles
function displayRoles() {
    db.Role.getRoles(res => {
        console.log("=========================== Roles ===========================");
        res = res.reduce((acc, { id, ...x }) => { acc[id] = x; return acc }, {});
        console.table(res);
        mainMenu();
    })
}

//displays department
function displayDepartments(dept) {
    db.Department.getDepartments(departments => {
        console.log("======= Departments ========");
        departments = departments.reduce((acc, { id, ...x }) => { acc[id] = x; return acc }, {});
        console.table(departments);
        mainMenu();
    });
}



