const sql = require('mssql')
const logger = require('../config/appconfig').logger
const dbconfig = require('../config/appconfig').dbconfig

//Creating a connection pool
const poolPromise = new sql.ConnectionPool(dbconfig)
    .connect()
    .then(pool => {
        logger.info('Connection to the database established!')
        return pool
    })
    .catch(err => {
        logger.error('An error occurred while connecting to the database: ', err)
    })

module.exports = {
    sql,
    poolPromise
}
