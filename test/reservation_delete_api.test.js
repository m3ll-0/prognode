const chai = require('chai');
const chaiHttp = require('chai-http');
const util = require("util");
const server = require('../app');

chai.should();
chai.use(chaiHttp)

describe('Testing /api/appartment/x/reservations', () => {
    
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
        .post('/api/appartments/370/reservations')
        .send({
        	"StartDate" : "2019-06-09",
            "EndDate" : "2019-06-12",
            "Status" : "INITIAL"
        })
        .set('Authorization', token)
        .end(function(err, res) {
            reservationID = res.body.ReservationId;
            done();
        });
      });

  /**
   * Valid DELETE /api/appartments/x/reservations/x
   */
  it('Should succeed and give status 200.', done => {
    chai
      .request(server)
      .delete('/api/appartments/370/reservations/'+reservationID)
      .send()
      .set('Authorization', token)
      .end((err, res) => {
          
        console.log(util.inspect(res));
        result = res.body;
  
        res.should.have.status(200);
        res.body.should.be.a('object');

        done();
      })
  })


})


