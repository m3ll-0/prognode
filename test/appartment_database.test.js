const assert = require('chai').assert;
const database = require('../src/datalayer/mssql.dao')
const jwt = require('jsonwebtoken');

/**
 * Test all database functionality
 */
describe('AppartmentDatabase', () => {
  
  
  // Testcase insert apartment
  it('Update apartment test', done => {
    
    const id = 1;
    
    const appartment = {
        Description: 'test_apartment_updatet',
        UserId: '1',
        StreetAddress: "test_address",
        PostalCode: "ABCD12",
        City : "test_city"
    }

    const query = `UPDATE Apartment SET Apartment.Description = '${appartment.Description}', Apartment.StreetAddress = '${appartment.StreetAddress}', Apartment.PostalCode = '${appartment.PostalCode}', Apartment.City = '${appartment.City}' WHERE Apartment.ApartmentId = ${id};`;
    database.dbQuery(query, (err, result) => {

      assert.isNotNull(result, 'result test');
      console.log(assert);

      if (err) {
        done(err.message)
      }else{
          done();
      }
    })
  }),

  // Testcase insert apartment
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

      if (rows) {

          const payload = {
            UserId: rows[0].UserId
    
          }
    
          jwt.sign({ data: payload }, 'secretkey', { expiresIn: 60 * 60 }, (err, token) => {
            if (err) {
              const errorObject = {
                message: 'Can not generate JWT token.',
                code: 500
              }
            }
            if (token) {
                done();
                assert.isNotNull(token, 'token test');
            }
          })
      }
    })
  })
})