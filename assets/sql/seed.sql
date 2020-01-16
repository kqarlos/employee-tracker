-- INSERT INTO Employee (first_name, last_name, role_id, manager_id)
-- VALUES();

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

INSERT INTO Department (name)
VALUES("Sales");
INSERT INTO Department (name)
VALUES("Finance");
INSERT INTO Department (name)
VALUES("Engineering");
INSERT INTO Department (name)
VALUES("Legal");

