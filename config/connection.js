const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'employee_db',
  password: 'Hamzmr6!',
  port: 5432,
});

client.connect();

module.exports = client;
