DROP DATABASE IF EXISTS etracker_DB;
CREATE DATABASE etracker_DB;
USE etracker_DB;

CREATE TABLE Employee
(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id),
	FOREIGN KEY (role_id) REFERENCES Role(id),
    FOREIGN KEY (manager_id) REFERENCES Employee(id)
);

CREATE TABLE Role 
(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) default 0,
    department_id INT,
	PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES Department(id)
);

CREATE TABLE Department
(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);