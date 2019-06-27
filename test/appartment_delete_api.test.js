const chai = require('chai');
const chaiHttp = require('chai-http');
const util = require("util");
const server = require('../app');

chai.should();
chai.use(chaiHttp)

describe('Testing /api/appartment', () => {
    
    var token = null;
    var appartmentID = null;

    before(function(done) { chai
        .request(server)
          .post('/api/login')
          .send({ "EmailAddress" : 'bob@marley.com', "Password" : 'secret' })
          .end(function(err, res) {

            token = res.body.result.token;
            done();

          });
      });

      before(function(done) { chai
        .request(server)
        .post('/api/appartments')
        .send({
            Description: 'test_apartment',
            StreetAddress: "test_address",
            PostalCode: "4703kb",
            City : "test_city"
        })
        .set('Authorization', token)
        .end(function(err, res) {
            appartmentID = res.body.ApartmentId;
            done();
        });
      });

  /**
   * Valid DELETE /api/appartments/x
   */
  it('Should succeed and give status 200.', done => {
    chai
      .request(server)
      .delete('/api/appartments/'+appartmentID)
      .send()
      .set('Authorization', token)
      .end((err, res) => {
          
        console.log(util.inspect(res));
        result = res.body;
  
        res.should.have.status(200);
        res.body.should.be.a('array');

        done();
      })
  })


})


