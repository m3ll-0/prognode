const chai = require('chai')
const chaiHttp = require('chai-http')
const util = require("util");
const server = require('../app')

chai.should()
chai.use(chaiHttp)

describe('Appartment POST', () => {
    
    var token = null;


    before(function(done) { chai
        .request(server)
          .post('/api/login')
          .send({ "EmailAddress" : 'bob@marley.com', "Password" : 'secret' })
          .end(function(err, res) {
            token = res.token;
            done();

            token = res.body.result.token;

          });
      });    

  /**
   * Good POST /api/appartments
   */
  it('Should give status 200 and return empty JSON.', done => {
    chai
      .request(server)
      .post('/api/appartments')
      .send({
        Description: 'test_apartment',
        StreetAddress: "test_address",
        PostalCode: "4703kb",
        City : "test_city"
      })
      .set('Authorization', token)
      .end((err, res) => {

        console.log(util.inspect(res));

        res.should.have.status(200)
        res.body.should.be.a('object')

        done()
      })
  })


  /**
   * Bad POST /api/appartments
   */
  it('Should give status 500.', done => {
    chai
      .request(server)
      .post('/api/appartments')
      .send({
        Description: 'test_apartment',
        StreetAddress: "test_address",
        PostalCode: "470akb",
        City : "test_city"
      })
      .set('Authorization', token)
      .end((err, res) => {

        console.log(util.inspect(res));

        res.should.have.status(500)
        res.body.should.be.a('object')
        done()
      })
  })
})