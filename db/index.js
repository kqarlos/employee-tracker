const connection = require("../config/connection.js")

class DB {

    constructor(connection) {
        this.connection = connection;
    }

    getEmployees(cb) {
        console.log("Getting all employees");
        this.connection.query("SELECT * FROM Employee", (err, res) => {
            if (err) throw err;
            cb(res);
        });
    }

    getEmployeesByDepartment(departmentId, cb) {
        connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary FROM employee INNER JOIN role on employee.role_id = role.id AND department_id=?", departmentId, function (err, res) {
            res = res.reduce((acc, { id, ...x }) => { acc[id] = x; return acc }, {});
            console.table(res);
            mainMenu();
        })
    }

    addEmployee(employee, cb) {
        console.log("Adding employee...");
        connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", employee, (err, res) => {
            if (err) throw err;
            cb(res);
        });
    }

    updateEmployeeRole(employeeId, roleId, cb) {
        console.log("Updating employee role...");
        connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId], (err, res) => {
            if (err) throw err;
            cb(res);
        });
    }

    updateEmployeeManager(employeeId, managerId, cb) {
        console.log("Updating employee manager...");
        connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [managerId, employeeId], (err, res) => {
            if (err) throw err;
            cb(res);
        });
    }

    removeEmployee(id, cb) {
        console.log("Removing employee...");
        connection.query("DELETE FROM employee WHERE id=?", id, (err, res) => {
            if (err) throw err;
            cb(res);
        });
    }

    getRoles(cb) {
        console.log("Getting all roles")
        this.connection.query("SELECT * FROM Role", (err, res) => {
            if (err) throw err;
            cb(res);
        })
    }

    addRole(role, cb) {
        console.log("Adding new role...");
        connection.query("INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)", role, (err, res) => {
            if (err) throw err;
            cb(res);
        });
    }

    removeRole(id, cb) {
        console.log("Removing role...");
        connection.query("DELETE FROM role WHERE id=?", id, (err, res) => {
            if (err) throw err;
            cb(res);
        });
    }

    getDepartments(cb) {
        console.log("Getting all departments...");
        connection.query("SELECT * FROM Department", (err, res) => {
            if (err) throw err;
            cb(res);
        });
    }

    getDepartmentBudget(id, cb) {
        connection.query("SELECT SUM(role.salary) FROM employee INNER JOIN role on employee.role_id = role.id AND department_id=?", id, (err, res) => {
            if (err) throw (err);
            cb(res);
        });
    }

    addDepartment(department, cb) {
        console.log("Adding department...");
        connection.query("INSERT INTO department(name) VALUES (?)", department, (err, res) => {
            if (err) throw err;
            cb(res);
        });
    }

    removeDepartment(id, cb) {
        console.log("Removing department...");
        connection.query("DELETE FROM department WHERE id=?", id, (err, res) => {
            if (err) throw err;
            cb(res);
        });
    }

    endConnection() {
        this.connection.end();
    }
}

module.exports = new DB(connection);
