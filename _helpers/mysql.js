const mysql = require('mysql2/promise');
const config = require('config.json');

const pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

module.exports = pool;


