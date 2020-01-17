# Employee Tracker

## Getting Started

Steps to run application:
1. Clone git repository
2. Install dependencies
3. Create schema with given schema.sql, seed.sql, and employees.csv
4. run app

```
git clone git@github.com:kqarlos/employee-tracker.git
npm install
node server.js

```

## Site Pictures

1. 

![Site](assets/images/.png)

2. 

![Site](assets/images/.png)


3. 

![Site](assets/images/.png)

## Code Snippets


1. Workflow to add employee

```javascript

function addEmployee() {
    qGetEmployees().then(function (managers) {
        qGetRoles().then(function (roles) {
            promptForEmployeeinfo(roles, managers);
        })
    });
}
    
```
* This function is called when a user selects to add a user. It handles the workflow and gathering of data necesary to ask the user for the new employee's information and eventually perform the mySQL query to add a new employee. It relies on promises that return a list of employees and a list of roles respectively. This is then sent to _promptForEmployeeinfo(roles, manager)_ This will make sure the user has the necessary information to populate the new user's properties.

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

3. Prompts user to enter employee information

```javascript

function promptForEmployeeinfo(roles, managers) {
    console.log("Enter new employee's information");
    let roleNames = roles.map(r => {
        return (r.title);
    });
    let managerNames = managers.map(m => {
        return (m.first_name);
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
            message: "Select role: ",
            name: "role",
            choices: roleNames
        },
        {
            type: "list",
            message: "Select manager: ",
            name: "manager",
            choices: managerNames
        }
    ]).then(function (res) {
        var roleid;
        roles.forEach(r => {
            if (r.title === res.role) {
                roleid = r.id;
            }
        });
        var managerid;
        managers.forEach(m => {
            if (m.name === res.name) {
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
* This function is prompts the user to enter or select informatin of the new employee. It uses the array of roles and managers and gets their title and name respectively. This allows the user to select the new employee's role and manager based on easier to understand properties. Then their selection is mapped back to the original arrays to get their id. The user's input information and chosen role and manager is then sent to _qAddEmployee()_ to be queried.

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

## Built With

* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [Bootstrap](https://getbootstrap.com/)
* [Javascript](https://www.javascript.com/)
* [Node.js](https://nodejs.org/en/)

## Deployed Link

* [See Live Site](https://kqarlos.github.io/employee-tracker)

## Author

 * **Carlos Toledo** 

## Links

- [Link to site repository](https://github.com/kqarlos/employee-tracker)
- [Link to Github](https://www.github.com/kqarlos)
- [Link to LinkedIn](https://www.linkedin.com/in/carlos-toledo415/)


## Acknowledgments

* [W3 Schools](https://www.w3schools.com/)
* [Bootstrap components](https://getbootstrap.com/docs/4.4/components/navbar/)
* [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)