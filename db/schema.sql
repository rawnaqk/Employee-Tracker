-- Deletes the existing database if it exists
DROP DATABASE IF EXISTS employee_db;
-- Creates a new database named 'employee_db'
CREATE DATABASE employee_db;

-- Connects to the newly created database
\c employee_db;

-- Creates a table to store department information
CREATE TABLE departments (
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);

-- Creates a table to store role information
CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_title VARCHAR(30) NOT NULL,
  role_salary DECIMAL NOT NULL,
  department_id INT REFERENCES departments(department_id)
);

-- Creates a table to store employee information
CREATE TABLE employees (
  employee_id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT REFERENCES roles(role_id),
  manager_id INT REFERENCES employees(employee_id)
);
