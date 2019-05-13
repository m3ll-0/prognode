const sql = require('mssql')
const config = require('../config/appconfig')

const logger = config.logger
const dbconfig = config.dbconfig

module.exports = {
  executeQuery: (query, callback) => {
    sql.connect(dbconfig, err => {
      // ... error checks
      if (err) {
        console.log('Error connecting: ' + err.toString())
        callback(err, null)
        sql.close()
      }
      if (!err) {
        // Query
        new sql.Request().query(query, (err, result) => {
          // ... error checks
          if (err) {
            console.log('error', err.toString())
            callback(err, null)
            sql.close()
          }
          if (result) {
            console.log(result);
            // result.recordset.forEach(item => console.log(item.number))
            callback(null, result.recordset)
            sql.close()
          }
        })
      }
    })
  }
};