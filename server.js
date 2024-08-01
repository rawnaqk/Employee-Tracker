const inquirer = require('inquirer');
const client = require('./config/connection');
const cTable = require('console.table');

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

const viewDepartments = () => {
  client.query('SELECT * FROM departments')
    .then(result => {
      console.table(result.rows);
      startApp();
    });
};

const viewRoles = () => {
  client.query(`
    SELECT roles.id, roles.title, roles.salary, departments.name AS department
    FROM roles
    JOIN departments ON roles.department_id = departments.id
  `)
    .then(result => {
      console.table(result.rows);
      startApp();
    });
};

const viewEmployees = () => {
  client.query(`
    SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role,
           departments.name AS department, roles.salary, managers.first_name AS manager
    FROM employees
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees managers ON employees.manager_id = managers.id
  `)
    .then(result => {
      console.table(result.rows);
      startApp();
    });
};

const addDepartment = () => {
  inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Enter the name of the new department:'
  })
  .then(({ name }) => {
    client.query('INSERT INTO departments (name) VALUES ($1)', [name])
      .then(() => {
        console.log(`Department ${name} added successfully.`);
        startApp();
      });
  });
};

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
          name: department.name,
          value: department.id
        }))
      }
    ])
    .then(({ title, salary, department }) => {
      client.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department])
        .then(() => {
          console.log(`Role ${title} added successfully.`);
          startApp();
        });
    });
  });
};

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
        name: 'role',
        message: 'Select the role for the employee:',
        choices: roles.map(role => ({
          name: role.title,
          value: role.id
        }))
      },
      {
        type: 'list',
        name: 'manager',
        message: 'Select the manager for the employee:',
        choices: [...managers.map(manager => ({
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.id
        })), { name: 'None', value: null }]
      }
    ])
    .then(({ first_name, last_name, role, manager }) => {
      client.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role, manager])
        .then(() => {
          console.log(`Employee ${first_name} ${last_name} added successfully.`);
          startApp();
        });
    });
  });
};

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
        name: 'employee',
        message: 'Select the employee to update:',
        choices: employees.map(employee => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id
        }))
      },
      {
        type: 'list',
        name: 'role',
        message: 'Select the new role for the employee:',
        choices: roles.map(role => ({
          name: role.title,
          value: role.id
        }))
      }
    ])
    .then(({ employee, role }) => {
      client.query('UPDATE employees SET role_id = $1 WHERE id = $2', [role, employee])
        .then(() => {
          console.log(`Employee role updated successfully.`);
          startApp();
        });
    });
  });
};

startApp();
