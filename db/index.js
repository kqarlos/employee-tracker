const connection = require("../config/connection.js")
const Employee = require("./Employee")
const Role = require("./Role")
const Department = require("./Department")


class DB {

    constructor(connection) {
        this.connection = connection;
        this.Employee = new Employee(connection);
        this.Role = new Role(connection);
        this.Department = new Department(connection);

    }

    endConnection() {
        this.connection.end();
    }
}

module.exports = new DB(connection);
