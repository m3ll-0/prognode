const assert = require('assert')
const database = require('../src/datalayer/mssql.dao')

describe('AppartmentDatabase', () => {
  // Testcase
  it('Insert apartment test', done => {
    const Apartment = {
        Description: 'test_apartment',
        UserId: '1',
        StreetAddress: "test_address",
        PostalCode: "ABCD12",
        City : "test_city"
    }

    const query = `INSERT INTO Apartment VALUES('${Apartment.Description}', '${Apartment.StreetAddress}', '${Apartment.PostalCode}', '${Apartment.City}', ${Apartment.UserId})`;
    database.dbQuery(query, (err, result) => {
      if (err) {
        done(err.message)
      }else{
          done();
      }
    })
  }),

  // Testcase login user
  it('Login user', done => {
    const user = {
        EmailAddress: 'bob@marley.com',
        Password: 'secret'
    }

    const query = `SELECT Password, UserId FROM [DBUser] WHERE EmailAddress='${user.EmailAddress}'`;

    database.dbQuery(query, (err, rows) => {

      if (err) {
        const errorObject = {
          message: 'Database error.',
          code: 500
        }
        done(errorObject)
      }
      if (rows) {

        if (rows.length === 0 || req.body.Password !== rows[0].Password) {
          const errorObject = {
            message: 'No authorization.',
            code: 401
          }
          done(errorObject)
        } else 
        {
          const payload = {
            UserId: rows[0].UserId
          }
          jwt.sign({ data: payload }, 'secretkey', { expiresIn: 60 * 60 }, (err, token) => {
            if (err) {
              const errorObject = {
                message: 'Can not generate JWT token.',
                code: 500
              }
              done(errorObject)
            }
            if (token) {
                done();
            }
          })
        }
      }
    })
  })
})