
const sql = require('mssql')

module.exports = {
    config : {
        user: process.env.MSSQL_DB_LOGIN_USERNAME,
        password: process.env.MSSQL_DB_LOGIN_PASSWORD,
        server: process.env.MSSQL_SERVER_HOST, 
        database: process.env.MSSQL_DB_NAME,
	    pool:{max : process.env.MSSQL_CONNECTION_MAX_POOL},
	    connectionTimeout : process.env.MSSQL_CONNECTION_TIMEOUT,
	    requestTimeout : +process.env.MSSQL_REQUEST_TIMEOUT
    },
    sql : sql
}