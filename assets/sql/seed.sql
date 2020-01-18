DROP DATABASE IF EXISTS etracker_DB;
CREATE DATABASE etracker_DB;
USE etracker_DB;


CREATE TABLE Department
(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
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



INSERT INTO Department (name)
VALUES("Sales");
INSERT INTO Department (name)
VALUES("Finance");
INSERT INTO Department (name)
VALUES("Engineering");
INSERT INTO Department (name)
VALUES("Legal");

INSERT INTO Role (title, salary, department_id)
VALUES("Salesperson", 80000, 1);
INSERT INTO Role (title, salary, department_id)
VALUES("Sales Lead", 10000, 1);
INSERT INTO Role (title, salary, department_id)
VALUES("Lead Engineering", 150000, 3);
INSERT INTO Role (title, salary, department_id)
VALUES("Software Engineering", 120000, 3);
INSERT INTO Role (title, salary, department_id)
VALUES("Accountant", 125000, 2);
INSERT INTO Role (title, salary, department_id)
VALUES("Lawyer", 190000, 4);
INSERT INTO Role (title, salary, department_id)
VALUES("Legal Team Lead", 250000, 4);

INSERT INTO Employee (first_name, last_name, role_id)
VALUES("Joyce","Thomas",7);
INSERT INTO Employee (first_name, last_name, role_id)
VALUES("Wanda","Long",3);
INSERT INTO Employee (first_name, last_name, role_id)
VALUES("Paula","Martin",3);
INSERT INTO Employee (first_name, last_name, role_id)
VALUES("Brenda","Nelson",2);
INSERT INTO Employee (first_name, last_name, role_id)
VALUES("Elizabeth","Walker",5);
INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES("Roger","Baker",1,2);
INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES("Joan","James",1,2);
INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES("Aaron","Russel",4,7);
INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES("Louise","Flores",1,2);
INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES("Robert","Wilson",4,7);
INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES("Lawrence","Ward",6,7);
INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES("Teresa","Bennet",6,7);
INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES("David","Ross",4,11);
INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES("Walter","Perry",4,11);
INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES("Evelyn","Diaz",4,11);
