const mysql = require('mysql');
const config = source("config");

/* Generates and maintains 20 connections in a pool for use whenever necessary. */
let connection = mysql.createPool({
  connectionLimit : 20,
  host            : config.db_host,
  user            : config.db_user,
  password        : config.db_pass,
  database        : config.db_schema
});

module.exports = connection;

/*Had 10 connections initially.*/