const connection = require("../config/connection")

class DB {

    constructor(connection) {
        this.connection = connection;
    }

    


}

module.exports = new DB(connection);
