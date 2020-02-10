const mysql = require('mysql2/promise');
require('dotenv-safe').config();

const pool = mysql.createPool({
    host: process.env.MYSQL_URL,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

module.exports = pool;


