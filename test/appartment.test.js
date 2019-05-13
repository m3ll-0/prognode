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
    database.executeQuery(query, (err, result) => {
      if (err) {
        done(err.message)
      }else{
          done();
      }
    })
  })
})
