# Employee Tracker
  
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  
  ## Description
  A command-line application for managing a company's employee database. Allowing a user to display all departments, roles, and employees. While also giving the ability to add new departments, roles, and employees or update the information of an existing employee. The application is a simple and interactive way to view and manage departments, roles, and employees.
  
  ## Table of Contents
  - [Installation](#installation)
  - [Usage](#usage)
  - [License](#license)
  - [Contributing](#contributing)
  - [Tests](#tests)
  - [Questions](#questions)
  
  ## Installation
  1. Clone the repository: git clone "link of github repository"
  2. Navigate to the applications directory: cd employee tracker
  3. Install the required dependencies: npm install
  4. Set up PostgreSQL: Make sure PostgreSQL is installed and running. Update 'config/connection.js' file with your database credentials
  
  ## Usage
  1. Set up the database employee_db in a bash terminal run: psql -U your-username
  2. Enter your psql password
  3. Run \i db/schema.sql
  4. Once the database has been created run in the bash terminal run: \q 
  5. In the same bash terminal, start the application by running: node server.js
  6. Follow the prompts in the command-line interface to view and manage departments, roles, and employees
  
  ## License
  This project is licensed under the MIT license.
  
  ## Contributing
  N/A
  
  ## Tests
  [Watch the Video Instructions](https://drive.google.com/file/d/103VvBo-w18lFAJMO84q6Z7vL3ktUhtwl/view?usp=sharing)
  
  ## Questions
  For questions about the project, please contact me via GitHub: [rawnaqk](https://github.com/rawnaqk)  
  or email me at: rawnaq.kabairzad@gmail.com
