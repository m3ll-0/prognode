const mssql = require('mssql')
const config = require('../config/appconfig')

const dbconfig = config.dbconfig

module.exports = {

  //
  // Do database query
  //
  dbQuery: (query, callback) => {

    mssql.connect(dbconfig, error => {
      // Error check
      if (error) {
        console.log(error.toString());
        callback(error, null);

        // close connection 
        mssql.close();
      }
      if (!error) {
        // Query
        new mssql.Request().query(query, (error, result) => {
          if (error) {
            console.log('error', err.toString())
            callback(error, null)
            mssql.close()
          }

          // Result is correct
          if (result) {
            console.log(result);

            callback(null, result.recordset)
            mssql.close()
          }
        })
      }
    })
  }
};