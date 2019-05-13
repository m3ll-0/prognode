// Imports
const jwt = require('jsonwebtoken');
const database = require('../datalayer/mssql.dao');
const assert = require('assert');
const validatePhoneNumber = require('validate-phone-number-node-js');
var postcode = require('postcode-validator');
var validator = require("email-validator");

module.exports = {

    registerUser: (req, res, next) => {

        console.log("registerUser");

        const user = req.body;
    
        // Verify correct fields
        try {
            // Check if email is correct
            if(!validator.validate(user.EmailAddress))
            {
              errorObject = {
                message : 'Email is not valid!',
                code : 500
              } 

              next(errorObject);
              return;
            }

            // Check if phone number is correct
            if(!validatePhoneNumber.validate(user.PhoneNumber))
            {
              errorObject = {
                message : 'Phone number is not valid!',
                code : 500
              } 

              next(errorObject);
              return;
            }
            // Check if postalcode is valid
            if(!postcode.validate(user.PostalCode, 'NL')) // returns true
            {
                errorObject = {
                    message : 'Postal code is not valid!',
                    code : 500
                }

                next(errorObject);
                return;
            }

            // Assert to test data types
            assert.equal(typeof user.FirstName, 'string', 'FirstName is required.');
            assert.equal(typeof user.LastName, 'string', 'LastName is required.');
            assert.equal(typeof user.StreetAddress, 'string', 'StreetAddress is required.');
            assert.equal(typeof user.PostalCode, 'string', 'PostalCode is required.');
            assert.equal(typeof user.City, 'string', 'City is required.');
            assert.equal(typeof user.DateOfBirth, 'string', 'DateOfBirth is required.');
            assert.equal(typeof user.PhoneNumber, 'string', 'PhoneNumber is required.');
            assert.equal(typeof user.EmailAddress, 'string', 'EmailAddress is required.');
            assert.equal(typeof user.Password, 'string', 'Password is required.');
          } catch (ex) {
            const errorObject = {
              message: 'Validation fails: ' + ex.toString(),
              code: 500
            }
            return next(errorObject)
          }

        const query = `INSERT INTO DBUser VALUES ( '${user.FirstName}', '${user.LastName}', '${user.StreetAddress}', '${user.PostalCode}', '${user.City}', '${user.DateOfBirth}', '${user.PhoneNumber}', '${user.EmailAddress}', '${user.Password}' )`;

        database.dbQuery(query, (err, rows) => {
            // verwerk error of result
            if (err) {
              const errorObject = {
                message: 'Database error.',
                code: 500
              }
              next(errorObject)
            }
            else {
              res.status(200).json({})
            }
          })
    },

    loginUser: (req, res, next) => {

        console.log("loginUser");
        
        const user = req.body;    
        const query = `SELECT Password, UserId FROM [DBUser] WHERE EmailAddress='${user.EmailAddress}'`

        database.dbQuery(query, (err, rows) => {

          if (err) {
            const errorObject = {
              message: 'Database error.',
              code: 500
            }
            next(errorObject)
          }
          if (rows) {

            if (rows.length === 0 || req.body.Password !== rows[0].Password) {
              const errorObject = {
                message: 'No authorization.',
                code: 401
              }
              next(errorObject)
            } else 
            {
              // Put userId in payload
              const payload = {
                UserId: rows[0].UserId
              }
              jwt.sign({ data: payload }, 'secretkey', { expiresIn: 60 * 60 }, (err, token) => {
                if (err) {
                  const errorObject = {
                    message: 'Can not generate JWT token.',
                    code: 500
                  }
                  next(errorObject)
                }
                if (token) {
                  res.status(200).json({
                    result: {
                      token: token
                    }})
                }
              })
            }
          }
        })
      },

      validateToken: (req, res, next) => {
        
        console.log('validateToken')

        const token = req.headers.authorization

        if (!token) {
          errorObject = {
            message: 'No Authorization header!',
            code: 401
          }

          return next(errorObject)
        }

        // Verify token
        jwt.verify(token, 'secretkey', (err, payload) => {
          if (err) {
            errorObject = {
              message: 'not authorized',
              code: 401
            }
            next(errorObject)
          }

          // Token is valid
          if (payload.data && payload.data.UserId) {
            req.userId = payload.data.UserId
            next()

          } 
          else {
            errorObject = {
              message: 'UserId is missing!',
              code: 401
            }

            next(errorObject)
          }
        })
      },
}