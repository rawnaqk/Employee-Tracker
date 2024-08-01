// Imports required modules
const inquirer = require('inquirer');
const client = require('./config/connection');
const cTable = require('console.table');

// Function Definitions
// Starts the application by displaying the main menu
const startApp = () => {
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ]
  })
  .then(({ action }) => {
    switch (action) {
      case 'View all departments':
        viewDepartments();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all employees':
        viewEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        client.end();
        process.exit();
    }
  });
};

// View all departments
const viewDepartments = () => {
  client.query('SELECT * FROM departments')
    .then(result => {
      console.table(result.rows);
      startApp();
    });
};

// View all roles
const viewRoles = () => {
  client.query(`
    SELECT roles.role_id, roles.role_title, roles.role_salary, departments.department_name AS department
    FROM roles
    JOIN departments ON roles.department_id = departments.department_id
  `)
    .then(result => {
      console.table(result.rows);
      startApp();
    });
};

// View all employees
const viewEmployees = () => {
  client.query(`
    SELECT employees.employee_id, employees.first_name, employees.last_name, roles.role_title AS role,
           departments.department_name AS department, roles.role_salary, managers.first_name AS manager
    FROM employees
    JOIN roles ON employees.role_id = roles.role_id
    JOIN departments ON roles.department_id = departments.department_id
    LEFT JOIN employees managers ON employees.manager_id = managers.employee_id
  `)
    .then(result => {
      console.table(result.rows);
      startApp();
    });
};

// Add a new department
const addDepartment = () => {
  inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Enter the name of the new department:'
  })
  .then(({ name }) => {
    client.query('INSERT INTO departments (department_name) VALUES ($1)', [name])
      .then(() => {
        console.log(`Department ${name} added successfully.`);
        startApp();
      });
  });
};

// Add a new role
const addRole = () => {
  Promise.all([
    client.query('SELECT * FROM departments')
  ])
  .then(results => {
    const departments = results[0].rows;

    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the new role:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the new role:'
      },
      {
        type: 'list',
        name: 'department',
        message: 'Select the department for the new role:',
        choices: departments.map(department => ({
          name: department.department_name,
          value: department.department_id
        }))
      }
    ])
    .then(({ title, salary, department }) => {
      client.query('INSERT INTO roles (role_title, role_salary, department_id) VALUES ($1, $2, $3)', [title, salary, department])
        .then(() => {
          console.log(`Role ${title} added successfully.`);
          startApp();
        });
    });
  });
};

// Add a new employee
const addEmployee = () => {
  Promise.all([
    client.query('SELECT * FROM roles'),
    client.query('SELECT * FROM employees')
  ])
  .then(results => {
    const roles = results[0].rows;
    const managers = results[1].rows;

    inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the employee:'
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the employee:'
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the role for the employee:',
        choices: roles.map(role => ({
          name: role.role_title,
          value: role.role_id
        }))
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the manager for the employee:',
        choices: [...managers.map(manager => ({
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.employee_id
        })), { name: 'None', value: null }]
      }
    ])
    .then(({ first_name, last_name, role_id, manager_id }) => {
      client.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id])
        .then(() => {
          console.log(`Employee ${first_name} ${last_name} added successfully.`);
          startApp();
        });
    });
  });
};

//Update an employee's role
const updateEmployeeRole = () => {
  Promise.all([
    client.query('SELECT * FROM employees'),
    client.query('SELECT * FROM roles')
  ])
  .then(results => {
    const employees = results[0].rows;
    const roles = results[1].rows;

    inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to update:',
        choices: employees.map(employee => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.employee_id
        }))
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the new role for the employee:',
        choices: roles.map(role => ({
          name: role.role_title,
          value: role.role_id
        }))
      }
    ])
    .then(({ employee_id, role_id }) => {
      client.query('UPDATE employees SET role_id = $1 WHERE employee_id = $2', [role_id, employee_id])
        .then(() => {
          console.log(`Employee role updated successfully.`);
          startApp();
        });
    });
  });
};

// Start the application
startApp();

