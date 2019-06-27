const config = require('../config/appconfig');
const { poolPromise } = require('../config/pooling')
const { sql } = require('../config/pooling')
const logger = require('../config/appconfig').logger

module.exports = {

  dbQuery: async (query, callback) => {
      logger.info('dbQuery called')

      try {
          //We have to wait until we have fetched a connection from the pool.
          const pool = await poolPromise
          const ps = new sql.PreparedStatement(pool)

          ps.prepare(query,
              err => {
                  if (err) {
                      logger.error('An error occurred while preparing the statement: ', err)
                      callback(err, null)
                  }
                  ps.execute({}, (err, result) => {
                      if (err) {
                          logger.error('An error occurred while executing the statement: ', err)
                          callback(err, null)
                          //We have to unprepare the statement so the connection will be placed back in the pool.
                          ps.unprepare(err => {
                              if (err) {
                                  logger.error('An error occurred while unpreparing the statement: ', err)
                              }
                          })
                      }
                      if (result) {
                          logger.info('Got a result!')
                          console.log("###################################");
                          console.log(result);

                          callback(null, result.recordset)
                          //We have to unprepare the statement so the connection will be placed back in the pool.
                          ps.unprepare(err => {
                              if (err) {
                                  logger.error('An error occurred while unpreparing the statement: ', err)
                              }
                          })
                      }
                  })
              }
          )
      } catch (err) {
          logger.error('An error occured while dbQuery was called: ' + err)
      }
  }
}