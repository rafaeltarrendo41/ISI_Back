const mysql = require('mysql');
module.exports = mysql.createPool({
    host: process.env.CLEARDB_HOSTNAME,
    user: process.env.CLEARDB_USERNAME,
    password: process.env.CLEARDB_PASS,
    database: process.env.CLEARDB_DATABASE_NAME
});