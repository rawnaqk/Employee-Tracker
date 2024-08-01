const { Client } = require('pg');

const client = new Client({
  user: '',
  host: 'localhost',
  database: 'employee_db',
  password: '',
  port: 5432,
});

client.connect();

module.exports = client;
