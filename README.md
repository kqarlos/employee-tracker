# Employee Tracker 👨‍💼👩‍💼 

</br>
<p align="center">
    <img src="https://img.shields.io/github/languages/count/kqarlos/employee-tracker?style=for-the-badge" alt="Languages" />
    <img src="https://img.shields.io/github/languages/top/kqarlos/employee-tracker?style=for-the-badge" alt="Top Language" />
    <img src="https://img.shields.io/github/languages/code-size/kqarlos/employee-tracker?style=for-the-badge" alt="Code Size" />
    <img src="https://img.shields.io/github/repo-size/kqarlos/employee-tracker?style=for-the-badge" alt="Repo Size" />   
    <img src="https://img.shields.io/tokei/lines/github/kqarlos/employee-tracker?style=for-the-badge" alt="Total Lines" />
    <img src="https://img.shields.io/github/package-json/dependency-version/kqarlos/employee-tracker/mysql?style=for-the-badge" alt="MySQL Version" />
    <img src="https://img.shields.io/github/package-json/dependency-version/kqarlos/employee-tracker/inquirer?style=for-the-badge" alt="Inquirer Version" />
    <img src="https://img.shields.io/github/last-commit/kqarlos/employee-tracker?style=for-the-badge" alt="Last Commit" />  
    <img src="https://img.shields.io/github/issues/kqarlos/employee-tracker?style=for-the-badge" alt="Issues" />  
    <img src="https://img.shields.io/github/followers/kqarlos?style=social" alt="Followers" />  
</p>

## Description

Keep track of your company's employees, roles, and departments. This console application will manage your data with a simple I/O interface.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
    * [Screenshots](#screenshots)
    * [Snippets](#snippets)
* [Credits](#credits)
* [License](#license)


## Installation

Steps to run application:
1. Clone git repository
2. Install dependencies
3. Create schema with given schema.sql, seed.sql
4. run app

```
git clone git@github.com:kqarlos/employee-tracker.git
npm install
node employeeTracker.js

```
## Usage

### Screenshots

1. Displaying tables

![Site](assets/images/tables.png)

2. Updating employee manager example

![Site](assets/images/updatemanager.png)

3. Removing employee example

![Site](assets/images/removee.png)

4. Working app

![Site](assets/images/live.gif)

### Snippets


1. Workflow to add employee

```javascript

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
    
```
* This function is called when a user selects to add a user. It handles the workflow and gathering of data necesary to ask the user for the new employee's information and eventually perform the mySQL query to add a new employee. It relies on promises that return a list of employees and a list of roles respectively. The list of roles is then used to ask the user for the new employee's role. This is then sent to _promptForEmployeeinfo(roleid, manager)_ This will make sure the user has the necessary information to populate the new user's properties.

2. Gets all employees from database

```javascript

function qGetEmployees() {
    console.log("Getting all employees...");
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM Employee", function (err, res) {
            if (err) return reject(Error(err));;
            resolve(res);
        });
    });
}

```
* This siply returns a promise. This promise resolves with an array of employees as soon as the query is done. 

3. Asks user to select a role for the new employee

```javascript

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

```
* This function takes care of getting a role from the user. This encapsulates the process of getting a _roleid_ from the user which is used on other functions.

4. Prompts user to enter employee information

```javascript

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

```
* This function prompts the user to enter or select information of the new employee. It uses the array of managers and maps only their  name. This allows the user to select the new employee's manager based on easier to understand properties. Then, the user's selection is mapped back to the original arrays to get the _managerid_. The user's input information, roleid and managerid is then sent to _qAddEmployee()_ to be queried.

4. Adds an employee to the database

```javascript

//queries to add employee
//@param {array} employee - array of new employees first name, last name and roleid
function qAddEmployee(employee) {
    console.log("Adding employee...");
    connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", employee, function (err, res) {
        if (err) throw err;
        mainMenu();
    });
}

```
* This function reciees an array of employee information. This arraay is used to insert a new employee into the +employees_ table. After the query is performed, a call to get back to the main menu is performed.

## Credits

### Author

- 💼 Carlos Toledo: [portfolio](https://professional-portfolio2020.herokuapp.com/)
- :octocat: Github: [kqarlos](https://www.github.com/kqarlos)
- LinkedIn: [carlos-toledo415](https://www.linkedin.com/in/carlos-toledo415/)

### Built With

</br>
<p align="center">
    <a href="https://developer.mozilla.org/en-US/docs/Web/HTML"><img src="https://img.shields.io/badge/-HTML-orange?style=for-the-badge"  alt="HMTL" /></a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/CSS"><img src="https://img.shields.io/badge/-CSS-blue?style=for-the-badge" alt="CSS" /></a>
    <a href="https://www.javascript.com/"><img src="https://img.shields.io/badge/-Javascript-yellow?style=for-the-badge" alt="Javascript" /></a>
    <a href="https://getbootstrap.com/"><img src="https://img.shields.io/badge/-Bootstrap-blue?style=for-the-badge" alt="Bootstrap" /></a>
    <a href="https://nodejs.org/en/"><img src="https://img.shields.io/badge/-Node-orange?style=for-the-badge" alt="Node" /></a>
    <a href="https://www.npmjs.com/package/express"><img src="https://img.shields.io/badge/-Express-green?style=for-the-badge" alt="Express" /></a>
    <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/-MySQL-blue?style=for-the-badge" alt="MySQL" /></a>
</p>

## License

</br>
<p align="center">
    <img align="center" src="https://img.shields.io/github/license/kqarlos/employee-tracker?style=for-the-badge" alt="MIT license" />
</p>
