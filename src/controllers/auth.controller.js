const jwt = require('jsonwebtoken');
const database = require('../datalayer/mssql.dao');
const assert = require('assert');

const phoneValidator = new RegExp('^06(| |-)[0-9]{8}$');


module.exports = {

    registerUser: (req, res, next) => {
        console.log("registerUser");

        const user = req.body;
    
        // Verify correct fields
        try {
            assert.equal(typeof user.FirstName, 'string', 'FirstName is required.');
            assert.equal(typeof user.LastName, 'string', 'LastName is required.');
            assert.equal(typeof user.StreetAddress, 'string', 'StreetAddress is required.');
            assert.equal(typeof user.FirstName, 'string', 'PostalCode is required.');
            assert.equal(typeof user.City, 'string', 'City is required.');
            assert.equal(typeof user.DateOfBirth, 'string', 'DateOfBirth is required.');
            assert.equal(typeof user.PhoneNumber, 'string', 'PhoneNumber is required.');
            assert.equal(typeof user.EmailAddress, 'string', 'EmailAddress is required.');
            assert.equal(typeof user.Password, 'string', 'Password is required.');

            assert(phoneValidator.test(user.PhoneNumber), 'A valid phoneNumber is required.')
          } catch (ex) {
            const errorObject = {
              message: 'Validation fails: ' + ex.toString(),
              code: 500
            }
            return next(errorObject)
          }

        const query = `INSERT INTO DBUser VALUES ( '${user.FirstName}', '${user.LastName}', '${user.StreetAddress}', '${user.PostalCode}', '${user.City}', '${user.DateOfBirth}', '${user.PhoneNumber}', '${user.EmailAddress}', '${user.Password}' )`;

        database.executeQuery(query, (err, rows) => {
            // verwerk error of result
            if (err) {
              const errorObject = {
                message: 'Er ging iets mis in de database.',
                code: 500
              }
              next(errorObject)
            }
            if (rows) {
              res.status(200).json({ result: rows.recordset })
            }
          })
    },

    loginUser: (req, res, next) => {

        console.log("loginUser");
        
        const user = req.body;

        // TODO: Verify correct fields
    
        const query = `SELECT Password, UserId FROM [DBUser] WHERE EmailAddress='${user.EmailAddress}'`

        // console.log(query);

        database.executeQuery(query, (err, rows) => {
          // verwerk error of result
          if (err) {
            const errorObject = {
              message: 'Er ging iets mis in de database.',
              code: 500
            }
            next(errorObject)
          }
          if (rows) {

            // console.log("PAASSS!!!!! : " + rows[0].Password);
            // console.log("WUUUU!!!!! : " + req.body.Password);


            // Als we hier zijn:
            if (rows.length === 0 || req.body.Password !== rows[0].Password) {
              const errorObject = {
                message: 'Geen toegang: email bestaat niet of password is niet correct!',
                code: 401
              }
              next(errorObject)
            } else {
    
            console.log('Password match, user logged id');
            console.log(rows.recordset)

              // Maak de payload, die we in het token stoppen.
              // De payload kunnen we er bij het verifiëren van het token later weer uithalen.
              const payload = {
                UserId: rows[0].UserId
              }
              jwt.sign({ data: payload }, 'secretkey', { expiresIn: 60 * 60 }, (err, token) => {
                if (err) {
                  const errorObject = {
                    message: 'Kon geen JWT genereren.',
                    code: 500
                  }
                  next(errorObject)
                }
                if (token) {
                  res.status(200).json({
                    result: {
                      token: token
                    }
                  })
                }
              })
            }
          }
        })
      },

      validateToken: (req, res, next) => {
        console.log('validateToken aangeroepen')
        // logger.debug(req.headers)
        const authHeader = req.headers.authorization
        if (!authHeader) {
          errorObject = {
            message: 'Authorization header missing!',
            code: 401
          }
          console.log('Validate token failed: ', errorObject.message)
          return next(errorObject)
        }
        //const token = authHeader.substring(7, authHeader.length)
        const token = authHeader;
        console.log("TOKEN: " + token);

        jwt.verify(token, 'secretkey', (err, payload) => {
          if (err) {
            errorObject = {
              message: 'not authorized',
              code: 401
            }
            console.log('Validate token failed: '+ errorObject.message)
            next(errorObject)
          }
          console.log('payload' + payload)


          if (payload.data && payload.data.UserId) {
            console.log('token is valid' + payload)
            // User heeft toegang. Voeg UserId uit payload toe aan
            // request, voor ieder volgend endpoint.
            req.userId = payload.data.UserId
            next()
          } else {
            errorObject = {
              message: 'UserId is missing!',
              code: 401
            }
            logger.warn('Validate token failed: ', errorObject.message)
            next(errorObject)
          }
        })
      },

}