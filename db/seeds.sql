-- Department
INSERT INTO departments (department_name) VALUES
('Engineering'),
('Marketing'),
('Sales'),
('Human Resources'),
('Finance'),
('I.C.T.'),

-- Role
INSERT INTO roles (role_title, role_salary, department_id) VALUES
('Software Engineer', 100000, (SELECT department_id FROM departments WHERE department_name = 'Engineering')),
('Senior Software Engineer', 130000, (SELECT department_id FROM departments WHERE department_name = 'Engineering')),
('Marketing Manager', 90000, (SELECT department_id FROM departments WHERE department_name = 'Marketing')),
('Sales Representative', 70000, (SELECT department_id FROM departments WHERE department_name = 'Sales')),
('Senior Sales Representative', 90000, (SELECT department_id FROM departments WHERE department_name = 'Sales')),
('HR Specialist', 68000, (SELECT department_id FROM departments WHERE department_name = 'HR')),
('Financial Analyst', 85000, (SELECT department_id FROM departments WHERE department_name = 'Finance'));

-- Employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('Alice', 'Smith', (SELECT role_id FROM roles WHERE role_title = 'Software Engineer'), NULL),
('Bob', 'Johnson', (SELECT role_id FROM roles WHERE role_title = 'Senior Software Engineer'), (SELECT employee_id FROM employees WHERE first_name = 'Alice' AND last_name = 'Smith')),
('Charlie', 'Brown', (SELECT role_id FROM roles WHERE role_title = 'Marketing Manager'), NULL),
('David', 'Williams', (SELECT role_id FROM roles WHERE role_title = 'Sales Representative'), NULL),
('Tom', 'Jones', (SELECT role_id FROM roles WHERE role_title = 'Senior Sales Representative'), NULL),
('Eva', 'Davis', (SELECT role_id FROM roles WHERE role_title = 'HR Specialist'), NULL),
('Frank', 'Miller', (SELECT role_id FROM roles WHERE role_title = 'Financial Analyst'), NULL),
('Grace', 'Lee', (SELECT role_id FROM roles WHERE role_title = 'Software Engineer'), (SELECT employee_id FROM employees WHERE first_name = 'Alice' AND last_name = 'Smith'));
