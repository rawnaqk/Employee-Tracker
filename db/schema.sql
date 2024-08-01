DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

\c employee_db;

CREATE TABLE departments (
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_title VARCHAR(30) NOT NULL,
  role_salary DECIMAL NOT NULL,
  department_id INT REFERENCES departments(department_id)
);

CREATE TABLE employees (
  employee_id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT REFERENCES roles(role_id),
  manager_id INT REFERENCES employees(employee_id)
);
