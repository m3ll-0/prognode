const assert = require('assert')
const database = require('../src/datalayer/mssql.dao')

describe('AppartmentDatabase', () => {
  // Testcase
  it('Should insert apartment', done => {
    // wat verwachten we dat waar is?
    const Apartment = {
        Description: 'test_apartment',
        UserId: '1',
        StreetAddress: "test_address",
        PostalCode: "test 12",
        City : "test_city"
    }

    //
    // Hier moet natuurlijk een insert statement staan, maar dat
    // betekent data bij elke test een nieuwe Movie in de database
    // wordt toegevoegd. Eigenlijk hebben we een aparte test-
    // database nodig hiervoor.
    //
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
